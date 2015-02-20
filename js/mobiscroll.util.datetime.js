(function ($, undefined) {
    var ms = $.mobiscroll;

    ms.datetime = {
        defaults: {
            shortYearCutoff: '+10',
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            amText: 'am',
            pmText: 'pm',
            getYear: function (d) { return d.getFullYear(); },
            getMonth: function (d) { return d.getMonth(); },
            getDay: function (d) { return d.getDate(); },
            getDate: function (y, m, d, h, i, s, u) { return new Date(y, m, d, h || 0, i || 0, s || 0, u || 0); },
            getMaxDayOfMonth: function (y, m) { return 32 - new Date(y, m, 32).getDate(); },
            getWeekNumber: function (d) {
                // Copy date so don't modify original
                d = new Date(d);
                d.setHours(0, 0, 0);
                // Set to nearest Thursday: current date + 4 - current day number
                // Make Sunday's day number 7
                d.setDate(d.getDate() + 4 - (d.getDay() || 7));
                // Get first day of year
                var yearStart = new Date(d.getFullYear(), 0, 1);
                // Calculate full weeks to nearest Thursday
                return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
            }
        },
        /**
        * Format a date into a string value with a specified format.
        * @param {String} format Output format.
        * @param {Date} date Date to format.
        * @param {Object} [settings={}] Settings.
        * @return {String} Returns the formatted date string.
        */
        formatDate: function (format, date, settings) {
            if (!date) {
                return null;
            }
            var s = $.extend({}, ms.datetime.defaults, settings),
                look = function (m) { // Check whether a format character is doubled
                    var n = 0;
                    while (i + 1 < format.length && format.charAt(i + 1) == m) {
                        n++;
                        i++;
                    }
                    return n;
                },
                f1 = function (m, val, len) { // Format a number, with leading zero if necessary
                    var n = '' + val;
                    if (look(m)) {
                        while (n.length < len) {
                            n = '0' + n;
                        }
                    }
                    return n;
                },
                f2 = function (m, val, s, l) { // Format a name, short or long as requested
                    return (look(m) ? l[val] : s[val]);
                },
                i,
                year,
                output = '',
                literal = false;

            for (i = 0; i < format.length; i++) {
                if (literal) {
                    if (format.charAt(i) == "'" && !look("'")) {
                        literal = false;
                    } else {
                        output += format.charAt(i);
                    }
                } else {
                    switch (format.charAt(i)) {
                        case 'd':
                            output += f1('d', s.getDay(date), 2);
                            break;
                        case 'D':
                            output += f2('D', date.getDay(), s.dayNamesShort, s.dayNames);
                            break;
                        case 'o':
                            output += f1('o', (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000, 3);
                            break;
                        case 'm':
                            output += f1('m', s.getMonth(date) + 1, 2);
                            break;
                        case 'M':
                            output += f2('M', s.getMonth(date), s.monthNamesShort, s.monthNames);
                            break;
                        case 'y':
                            year = s.getYear(date);
                            output += (look('y') ? year : (year % 100 < 10 ? '0' : '') + year % 100);
                            //output += (look('y') ? date.getFullYear() : (date.getYear() % 100 < 10 ? '0' : '') + date.getYear() % 100);
                            break;
                        case 'h':
                            var h = date.getHours();
                            output += f1('h', (h > 12 ? (h - 12) : (h === 0 ? 12 : h)), 2);
                            break;
                        case 'H':
                            output += f1('H', date.getHours(), 2);
                            break;
                        case 'i':
                            output += f1('i', date.getMinutes(), 2);
                            break;
                        case 's':
                            output += f1('s', date.getSeconds(), 2);
                            break;
                        case 'a':
                            output += date.getHours() > 11 ? s.pmText : s.amText;
                            break;
                        case 'A':
                            output += date.getHours() > 11 ? s.pmText.toUpperCase() : s.amText.toUpperCase();
                            break;
                        case "'":
                            if (look("'")) {
                                output += "'";
                            } else {
                                literal = true;
                            }
                            break;
                        default:
                            output += format.charAt(i);
                    }
                }
            }
            return output;
        },
        /**
        * Extract a date from a string value with a specified format.
        * @param {String} format Input format.
        * @param {String} value String to parse.
        * @param {Object} [settings={}] Settings.
        * @return {Date} Returns the extracted date.
        */
        parseDate: function (format, value, settings) {
            var s = $.extend({}, ms.datetime.defaults, settings),
                def = s.defaultValue || new Date();

            if (!format || !value) {
                return def;
            }

            // If already a date object
            if (value.getTime) {
                return value;
            }

            value = (typeof value == 'object' ? value.toString() : value + '');

            var shortYearCutoff = s.shortYearCutoff,
                year = s.getYear(def),
                month = s.getMonth(def) + 1,
                day = s.getDay(def),
                doy = -1,
                hours = def.getHours(),
                minutes = def.getMinutes(),
                seconds = 0, //def.getSeconds(),
                ampm = -1,
                literal = false, // Check whether a format character is doubled
                lookAhead = function (match) {
                    var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
                    if (matches) {
                        iFormat++;
                    }
                    return matches;
                },
                getNumber = function (match) { // Extract a number from the string value
                    lookAhead(match);
                    var size = (match == '@' ? 14 : (match == '!' ? 20 : (match == 'y' ? 4 : (match == 'o' ? 3 : 2)))),
                        digits = new RegExp('^\\d{1,' + size + '}'),
                        num = value.substr(iValue).match(digits);

                    if (!num) {
                        return 0;
                    }
                    iValue += num[0].length;
                    return parseInt(num[0], 10);
                },
                getName = function (match, s, l) { // Extract a name from the string value and convert to an index
                    var names = (lookAhead(match) ? l : s),
                        i;

                    for (i = 0; i < names.length; i++) {
                        if (value.substr(iValue, names[i].length).toLowerCase() == names[i].toLowerCase()) {
                            iValue += names[i].length;
                            return i + 1;
                        }
                    }
                    return 0;
                },
                checkLiteral = function () {
                    iValue++;
                },
                iValue = 0,
                iFormat;

            for (iFormat = 0; iFormat < format.length; iFormat++) {
                if (literal) {
                    if (format.charAt(iFormat) == "'" && !lookAhead("'")) {
                        literal = false;
                    } else {
                        checkLiteral();
                    }
                } else {
                    switch (format.charAt(iFormat)) {
                        case 'd':
                            day = getNumber('d');
                            break;
                        case 'D':
                            getName('D', s.dayNamesShort, s.dayNames);
                            break;
                        case 'o':
                            doy = getNumber('o');
                            break;
                        case 'm':
                            month = getNumber('m');
                            break;
                        case 'M':
                            month = getName('M', s.monthNamesShort, s.monthNames);
                            break;
                        case 'y':
                            year = getNumber('y');
                            break;
                        case 'H':
                            hours = getNumber('H');
                            break;
                        case 'h':
                            hours = getNumber('h');
                            break;
                        case 'i':
                            minutes = getNumber('i');
                            break;
                        case 's':
                            seconds = getNumber('s');
                            break;
                        case 'a':
                            ampm = getName('a', [s.amText, s.pmText], [s.amText, s.pmText]) - 1;
                            break;
                        case 'A':
                            ampm = getName('A', [s.amText, s.pmText], [s.amText, s.pmText]) - 1;
                            break;
                        case "'":
                            if (lookAhead("'")) {
                                checkLiteral();
                            } else {
                                literal = true;
                            }
                            break;
                        default:
                            checkLiteral();
                    }
                }
            }
            if (year < 100) {
                year += new Date().getFullYear() - new Date().getFullYear() % 100 +
                    (year <= (typeof shortYearCutoff != 'string' ? shortYearCutoff : new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10)) ? 0 : -100);
            }
            if (doy > -1) {
                month = 1;
                day = doy;
                do {
                    var dim = 32 - new Date(year, month - 1, 32).getDate();
                    if (day <= dim) {
                        break;
                    }
                    month++;
                    day -= dim;
                } while (true);
            }
            hours = (ampm == -1) ? hours : ((ampm && hours < 12) ? (hours + 12) : (!ampm && hours == 12 ? 0 : hours));

            var date = s.getDate(year, month - 1, day, hours, minutes, seconds);

            if (s.getYear(date) != year || s.getMonth(date) + 1 != month || s.getDay(date) != day) {
                return def; // Invalid date
            }

            return date;
        }
    };

    // @deprecated since 2.11.0, backward compatibility code
    // ---
    ms.formatDate = ms.datetime.formatDate;
    ms.parseDate = ms.datetime.parseDate;
    // ---
    
})(jQuery);