(function ($) {

    var date = new Date(),
        defaults = {
            dateFormat: 'mm/dd/yy',
            dateOrder: 'mmddy',
            ampm: true,
            seconds: false,
            timeFormat: 'hh:ii A',
            startYear: date.getFullYear() - 100,
            endYear: date.getFullYear() + 1,
            monthNames: ['January','February','March','April','May','June', 'July','August','September','October','November','December'],
            monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            shortYearCutoff: '+10',
            monthText: 'Month',
            dayText: 'Day',
            yearText: 'Year',
            hourText: 'Hours',
            minuteText: 'Minutes',
            secText: 'Seconds',
            ampmText: '&nbsp;',
            stepHour: 1,
            stepMinute: 1,
            stepSecond: 1
        },
        preset = function(inst) {
            // Set year-month-day order
            var s = $.extend({}, defaults, inst.settings),
                offset = 0,
                wheels = [],
                ord = [],
                o = {},
                f = { y: 'getFullYear', m: 'getMonth', d: 'getDate', h: getHour, i: getMinute, s: getSecond, ap: getAmPm },
                p = s.preset,
                dord = s.dateOrder,
                format = '',
                defd = new Date(),
                stepH = s.stepHour,
                stepM = s.stepMinute,
                stepS = s.stepSecond,
                mind = s.minDate,
                maxd = s.maxDate;

            if (p == 'date')
                format = s.dateFormat;
            else if (p == 'time')
                format = s.timeFormat;
            else if (p == 'datetime')
                format = s.dateFormat + ' ' + s.timeFormat;

            if (p.match(/date/i)) {

                // Determine the order of year, month, day wheels
                $.each(['y', 'm', 'd'], function(i, v) {
                    var i = dord.search(new RegExp(v, 'i'));
                    if (i > -1)
                        ord.push({ o: i, v: v });
                });
                ord.sort(function(a, b) { return a.o > b.o ? 1 : -1; });
                $.each(ord, function(i, v) {
                    o[v.v] = i;
                });

                var w = {};
                for (var k = 0; k < 3; k++) {
                    if (k == o.y) {
                        offset++;
                        w[s.yearText] = {};
                        start = mind ? mind.getFullYear() : s.startYear;
                        end = maxd ? maxd.getFullYear() : s.endYear;
                        for (var i = start; i <= end; i++)
                            w[s.yearText][i] = dord.search(/yy/i) < 0 ? i.toString().substr(2, 2) : i.toString();
                    }
                    else if (k == o.m) {
                        offset++;
                        w[s.monthText] = {};
                        for (var i = 0; i < 12; i++)
                            w[s.monthText][i] =
                                (dord.search(/MM/) < 0 ?
                                (dord.search(/M/) < 0 ?
                                (dord.search(/mm/) < 0 ? (i + 1) : (i < 9) ? ('0' + (i + 1)) : (i + 1)) : s.monthNamesShort[i]) : s.monthNames[i]);
                    }
                    else if (k == o.d) {
                        offset++;
                        w[s.dayText] = {};
                        for (var i = 1; i < 32; i++)
                            w[s.dayText][i] = dord.search(/dd/i) < 0 ? i : (i < 10) ? ('0' + i) : i;
                    }
                }
                wheels.push(w);
            }
            if (p.match(/time/i)) {
                o.h = offset++; // Hours wheel order
                o.i = offset++; // Minutes wheel order
                var w = {};
                w[s.hourText] = {};
                for (var i = 0; i < (s.ampm ? 12 : 24); i += stepH)
                    w[s.hourText][i] = (s.ampm && i == 0) ? 12 : (i < 10) ? ('0' + i) : i;
                w[s.minuteText] = {};
                for (var i = 0; i < 60; i += stepM)
                    w[s.minuteText][i] = (i < 10) ? ('0' + i) : i;
                if (s.seconds) {
                    o.s = offset++; // Seconds wheel order
                    w[s.secText] = {};
                    for (var i = 0; i < 60; i += stepS)
                        w[s.secText][i] = (i < 10) ? ('0' + i) : i;
                }
                if (s.ampm) {
                    o.ap = offset++; // ampm wheel order
                    w[s.ampmText] = { 0: 'AM', 1: 'PM' };
                }
                wheels.push(w);
            }

            function get(d, i, def) {
                if (o[i] !== undefined)
                    return +d[o[i]];
                if (def !== undefined)
                    return def;
                return defd[f[i]] ? defd[f[i]]() : f[i](defd);
            }

            function step(v, step) {
                return Math.floor(v / step) * step;
            }

            function getHour(d) {
                var hour = d.getHours();
                hour = s.ampm ? (hour >= 12 ? (hour - 12) : hour) : hour;
                return step(hour, stepH);
            }

            function getMinute(d) {
                return step(d.getMinutes(), stepM);
            }

            function getSecond(d) {
                return step(d.getSeconds(), stepS);
            }

            function getAmPm(d) {
                return s.ampm && d.getHours() > 11 ? 1 : 0;
            }

            return {
                wheels: wheels,
                /**
                 * Builds a date object from the wheel selections and formats it to the given date/time format
                 * @param {Array} d - An array containing the selected wheel values
                 * @return {String} - The formatted date string
                 */
                formatResult: function(d) {
                    var hour = get(d, 'h', 0);
                    return $.scroller.formatDate(format, new Date(get(d, 'y'), get(d, 'm'), get(d, 'd'), get(d, 'ap') ? hour + 12 : hour, get(d, 'i', 0), get(d, 's', 0)), s);
                },
                /**
                 * Builds a date object from the input value and returns an array to set wheel values
                 * @return {Array} - An array containing the wheel values to set
                 */
                parseValue: function(val) {
                    var d = new Date(),
                        result = [];
                    try {
                        d = $.scroller.parseDate(format, val, s);
                    }
                    catch (e) {
                    }
                    // Set wheels
                    for (var i in o)
                        result[o[i]] = d[f[i]] ? d[f[i]]() : f[i](d);
                    return result;
                },
                /**
                 * Validates the selected date to be in the minDate / maxDate range and sets unselectable values to disabled
                 * @param {Object} dw - jQuery object containing the generated html
                 * @param {Integer} [i] - Index of the changed wheel, not set for initial validation
                 */
                validate: function(dw, i) {
                    var temp = inst.temp,
                        mins = { m: 0, d: 1, h: 0, i: 0, s: 0, ap: 0 },
                        maxs = { m: 11, d: 31, h: step(s.ampm ? 11 : 23, stepH), i: step(59, stepM), s: step(59, stepS), ap: 1 },
                        w = (mind || maxd) ? ['y', 'm', 'd', 'ap', 'h', 'i', 's'] : ((i == o.y || i == o.m) ? ['d'] : []), // Validate day only, if no min/max date set
                        minprop = true,
                        maxprop = true;
                    $.each(w, function(x, i) {
                        if (o[i] !== undefined) {
                            var min = mins[i],
                                max = maxs[i],
                                maxdays = 31,
                                val = get(temp, i);
                                t = $('ul', dw).eq(o[i])
                            if (i == 'd') {
                                maxdays = 32 - new Date(get(temp, 'y'), get(temp, 'm'), 32).getDate();
                                max = maxdays;
                            }
                            if (minprop && mind) {
                                min = mind[f[i]] ? mind[f[i]]() : f[i](mind);
                            }
                            if (maxprop && maxd) {
                                max = maxd[f[i]] ? maxd[f[i]]() : f[i](maxd);
                            }
                            if (i != 'y') {
                                var i1 = $('li[data-val="' + min + '"]', t).index(),
                                    i2 = $('li[data-val="' + max + '"]', t).index();
                                $('li', t).removeClass('dw-v').slice(i1, i2 + 1).addClass('dw-v');
                                if (i == 'd') { // Hide days not in month
                                    $('li', t).removeClass('dw-h').slice(maxdays).addClass('dw-h');
                                }
                                if (val < min) {
                                    inst.scroll(t, i1);
                                    temp[o[i]] = $('li', t).eq(i1).data('val');
                                    val = min;
                                }
                                if (val > max) {
                                    inst.scroll(t, i2);
                                    temp[o[i]] = $('li', t).eq(i2).data('val');
                                    val = max;
                                }
                            }
                            if (minprop)
                                minprop = val == min;
                            if (maxprop)
                                maxprop = val == max;
                        }
                    });
                },
                methods: {
                    /**
                    * Returns the currently selected date.
                    * @param {Boolean} temp - If true, return the currently shown date on the picker, otherwise the last selected one
                    * @return {Date}
                    */
                    getDate: function(temp) {
                        //var inst = $(this).data('scroller');
                        var inst = $(this).scroller('getInst');
                        if (inst) {
                            var d = temp ? inst.temp : inst.values
                                hour = get(d, 'h', 0);
                            return new Date(get(d, 'y'), get(d, 'm'), get(d, 'd'), get(d, 'ap') ? hour + 12 : hour, get(d, 'i', 0), get(d, 's', 0));
                        }
                    },
                    /**
                    * Sets the selected date
                    * @param {Date} d - Date to select.
                    * @param {Boolean} [fill] - Also set the value of the associated input element. Default is true.
                    * @return {Object} - jQuery object to maintain chainability
                    */
                    setDate: function(d, fill, time) {
                        if (fill == undefined) fill = false;
                        return this.each(function () {
                            //var inst = $(this).data('scroller');
                            var inst = $(this).scroller('getInst');
                            if (inst) {
                                // Set wheels
                                for (var i in o)
                                    inst.temp[o[i]] = d[f[i]] ? d[f[i]]() : f[i](d);
                                inst.setValue(fill, time);
                            }
                        });
                    }
                }
            }
        };

    $.scroller.presets.date = preset;
    $.scroller.presets.datetime = preset;
    $.scroller.presets.time = preset;

    /**
    * Format a date into a string value with a specified format.
    * @param {String} format - Output format.
    * @param {Date} date - Date to format.
    * @param {Object} settings - Settings.
    * @return {String} - Returns the formatted date string.
    */
    $.scroller.formatDate = function (format, date, settings) {
        if (!date) return null;
        var s = $.extend({}, defaults, settings),
            // Check whether a format character is doubled
            look = function(m) {
                var n = 0;
                while (i + 1 < format.length && format.charAt(i + 1) == m) { n++; i++; };
                return n;
            },
            // Format a number, with leading zero if necessary
            f1 = function(m, val, len) {
                var n = '' + val;
                if (look(m))
                    while (n.length < len)
                        n = '0' + n;
                return n;
            },
            // Format a name, short or long as requested
            f2 = function(m, val, s, l) {
                return (look(m) ? l[val] : s[val]);
            },
            output = '',
            literal = false;
        for (var i = 0; i < format.length; i++) {
            if (literal)
                if (format.charAt(i) == "'" && !look("'"))
                    literal = false;
                else
                    output += format.charAt(i);
            else
                switch (format.charAt(i)) {
                    case 'd':
                        output += f1('d', date.getDate(), 2);
                        break;
                    case 'D':
                        output += f2('D', date.getDay(), s.dayNamesShort, s.dayNames);
                        break;
                    case 'o':
                        output += f1('o', (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000, 3);
                        break;
                    case 'm':
                        output += f1('m', date.getMonth() + 1, 2);
                        break;
                    case 'M':
                        output += f2('M', date.getMonth(), s.monthNamesShort, s.monthNames);
                        break;
                    case 'y':
                        output += (look('y') ? date.getFullYear() : (date.getYear() % 100 < 10 ? '0' : '') + date.getYear() % 100);
                        break;
                    case 'h':
                        var h = date.getHours();
                        output += f1('h', (h > 12 ? (h - 12) : (h == 0 ? 12 : h)), 2);
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
                        output += date.getHours() > 11 ? 'pm' : 'am';
                        break;
                    case 'A':
                        output += date.getHours() > 11 ? 'PM' : 'AM';
                        break;
                    case "'":
                        if (look("'"))
                            output += "'";
                        else
                            literal = true;
                        break;
                    default:
                        output += format.charAt(i);
                }
        }
        return output;
    }

    /**
    * Extract a date from a string value with a specified format.
    * @param {String} format - Input format.
    * @param {String} value - String to parse.
    * @param {Object} settings - Settings.
    * @return {Date} - Returns the extracted date.
    */
    $.scroller.parseDate = function (format, value, settings) {
        var def = new Date();
        if (!format || !value) return def;
        value = (typeof value == 'object' ? value.toString() : value + '');
        var s = $.extend({}, defaults, settings),
            year = def.getFullYear(),
            month = def.getMonth() + 1,
            day = def.getDate(),
            doy = -1,
            hours = def.getHours(),
            minutes = def.getMinutes(),
            seconds = 0, //def.getSeconds(),
            ampm = -1,
            literal = false,
            // Check whether a format character is doubled
            lookAhead = function(match) {
                var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
                if (matches)
                    iFormat++;
                return matches;
            },
            // Extract a number from the string value
            getNumber = function(match) {
                lookAhead(match);
                var size = (match == '@' ? 14 : (match == '!' ? 20 :
                    (match == 'y' ? 4 : (match == 'o' ? 3 : 2))));
                var digits = new RegExp('^\\d{1,' + size + '}');
                var num = value.substr(iValue).match(digits);
                if (!num)
                    throw 'Missing number at position ' + iValue;
                iValue += num[0].length;
                return parseInt(num[0], 10);
            },
            // Extract a name from the string value and convert to an index
            getName = function(match, s, l) {
                var names = (lookAhead(match) ? l : s);
                for (var i = 0; i < names.length; i++) {
                    if (value.substr(iValue, names[i].length).toLowerCase() == names[i].toLowerCase()) {
                        iValue += names[i].length;
                        return i + 1;
                    }
                }
                throw 'Unknown name at position ' + iValue;
            },
            // Confirm that a literal character matches the string value
            checkLiteral = function() {
                if (value.charAt(iValue) != format.charAt(iFormat))
                    throw 'Unexpected literal at position ' + iValue;
                iValue++;
            },
            iValue = 0;

        for (var iFormat = 0; iFormat < format.length; iFormat++) {
            if (literal)
                if (format.charAt(iFormat) == "'" && !lookAhead("'"))
                    literal = false;
                else
                    checkLiteral();
            else
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
                        ampm = getName('a', ['am', 'pm'], ['am', 'pm']) - 1;
                        break;
                    case 'A':
                        ampm = getName('A', ['am', 'pm'], ['am', 'pm']) - 1;
                        break;
                    case "'":
                        if (lookAhead("'"))
                            checkLiteral();
                        else
                            literal = true;
                        break;
                    default:
                        checkLiteral();
                }
        }
        if (year < 100)
            year += new Date().getFullYear() - new Date().getFullYear() % 100 +
                (year <= s.shortYearCutoff ? 0 : -100);
        if (doy > -1) {
            month = 1;
            day = doy;
            do {
                var dim = 32 - new Date(year, month - 1, 32).getDate();
                if (day <= dim)
                    break;
                month++;
                day -= dim;
            } while (true);
        }
        hours = (ampm == -1) ? hours : ((ampm && hours < 12) ? (hours + 12) : (!ampm && hours == 12 ? 0 : hours));
        var date = new Date(year, month - 1, day, hours, minutes, seconds);
        if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day)
            throw 'Invalid date';
        return date;
    }

})(jQuery);
