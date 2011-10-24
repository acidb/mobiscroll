/*!
 * jQuery MobiScroll v1.5.2
 * http://mobiscroll.com
 *
 * Copyright 2010-2011, Acid Media
 * Licensed under the MIT license.
 *
 */
(function ($) {

    function Scroller(elm, dw, settings) {
        var that = this,
            s = settings,
            yOrd,
            mOrd,
            dOrd,
            iv = {},
            visible = false;

        this.settings = s;
        this.values = null;
        this.val = null;
        // Temporary values
        this.temp = null;

        /**
        * Set settings for all instances.
        * @param {Object} o - New default settings.
        */
        this.setDefaults = function(o) {
            $.extend(defaults, o);
        }

        /**
        * Enables the scroller and the associated input.
        */
        this.enable = function() {
            s.disabled = false;
            if ($(elm).is(':input'))
                $(elm).prop('disabled', false);
        }

        /**
        * Scrolls target to the specified position
        * @param {Object} t - Target wheel jQuery object.
        * @param {Number} val - Value.
        * @param {Number} [time] - Duration of the animation, optional.
        */
        this.scroll = function(t, val, time, orig, index) {
            //t.data('pos', val)
            t.attr('style', (time ? (prefix + '-transition:all ' + time.toFixed(1) + 's ease-out;') : '') + (has3d ? (prefix + '-transform:translate3d(0,' + (val * h) + 'px,0);') : ('top:' + (val * h) + 'px;')));

            function getVal(t, b, c, d) {
                return c * Math.sin(t/d * (Math.PI/2)) + b;
            }

            if (time) {
                var i = 0;
                clearInterval(iv[index]);
                iv[index] = setInterval(function() {
                    i += 0.1;
                    t.data('pos', Math.round(getVal(i, orig, val - orig, time)));
                    if (i >= time) {
                        clearInterval(iv[index]);
                        t.data('pos', val);
                    }
                }, 100);
            }
            else {
                t.data('pos', val)
            }
        }

        /**
        * Disables the scroller and the associated input.
        */
        this.disable = function() {
            s.disabled = true;
            if ($(elm).is(':input'))
                $(elm).prop('disabled', true);
        }

        /**
        * Format a date into a string value with a specified format.
        * @param {String} format - Output format.
        * @param {Date} date - Date to format.
        * @param {Object} settings - Settings.
        * @return {String} - Returns the formatted date string.
        */
        this.formatDate = function (format, date, settings) {
            if (!date) return null;
            var s = $.extend({}, this.settings, settings),
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
        this.parseDate = function (format, value, settings) {
            var def = new Date();
            if (!format || !value) return def;
            value = (typeof value == 'object' ? value.toString() : value + '');
            var s = $.extend({}, this.settings, settings),
                year = def.getFullYear(),
                month = def.getMonth(),
                day = def.getDate(),
                doy = -1,
                hours = def.getHours(),
                minutes = def.getMinutes(),
                seconds = def.getSeconds(),
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
            //if (ampm && hours < 12) hours += 12;
            var date = new Date(year, month - 1, day, hours, minutes, seconds);
            if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day)
                throw 'Invalid date'; // E.g. 31/02/*
            return date;
        }

        /**
        * Gets the selected wheel values, formats it, and set the value of the scroller instance.
        * If input parameter is true, populates the associated input element.
        * @param {Boolean} [input] - Also set the value of the associated input element. Default is true.
        */
        this.setValue = function (input) {
            if (input == undefined) input = true;
            var v = this.formatResult();
            this.val = v;
            this.values = this.temp.slice(0);
            if (input && $(elm).is(':input')) $(elm).val(v).change();
        }

        /**
        * Returns the currently selected date.
        * @return {Date}
        */
        this.getDate = function () {
            var d = this.values;
            if (s.preset == 'date')
                return new Date(d[yOrd], d[mOrd], d[dOrd]);
            if (s.preset == 'time') {
                var hour = (s.ampm) ? ((d[s.seconds ? 3 : 2] == 'PM' && (d[0] - 0) < 12) ? (d[0] - 0 + 12) : (d[s.seconds ? 3 : 2] == 'AM' && (d[0] == 12) ? 0 : d[0])) : d[0];
                return new Date(1970, 0, 1, hour, d[1], s.seconds ? d[2] : null);
            }
            if (s.preset == 'datetime') {
                var hour = (s.ampm) ? ((d[s.seconds ? 6 : 5] == 'PM' && (d[3] - 0) < 12) ? (d[3] - 0 + 12) : (d[s.seconds ? 6 : 5] == 'AM' && (d[3] == 12) ? 0 : d[3])) : d[3];
                return new Date(d[yOrd], d[mOrd], d[dOrd], hour, d[4], s.seconds ? d[5] : null);
            }
        }

        /**
        * Sets the selected date
        * @param {Date} d - Date to select.
        * @param {Boolean} [input] - Also set the value of the associated input element. Default is true.
        */
        this.setDate = function (d, input) {
            if (s.preset.match(/date/i)) {
                this.temp[yOrd] = d.getFullYear();
                this.temp[mOrd] = d.getMonth();
                this.temp[dOrd] = d.getDate();
            }
            if (s.preset == 'time') {
                var hour = d.getHours();
                this.temp[0] = (s.ampm) ? (hour > 12 ? (hour - 12) : (hour == 0 ? 12 : hour)) : hour;
                this.temp[1] = d.getMinutes();
                if (s.seconds) this.temp[2] = d.getSeconds();
                if (s.ampm) this.temp[s.seconds ? 3 : 2] = hour > 11 ? 'PM' : 'AM';
            }
            if (s.preset == 'datetime') {
                var hour = d.getHours();
                this.temp[3] = (s.ampm) ? (hour > 12 ? (hour - 12) : (hour == 0 ? 12 : hour)) : hour;
                this.temp[4] = d.getMinutes();
                if (s.seconds) this.temp[5] = d.getSeconds();
                if (s.ampm) this.temp[s.seconds ? 6 : 5] = hour > 11 ? 'PM' : 'AM';
            }
            this.setValue(input);
        }

        /**
        * Extracts the selected wheel values form the string value.
        * @param {String} val - String to parse.
        * @return {Array} Array with the selected wheel values.
        */
        this.parseValue = function (val) {
            if (this.preset) {
                var result = [];
                if (s.preset == 'date') {
                    try { var d = this.parseDate(s.dateFormat, val, s); } catch (e) { var d = new Date(); };
                    result[yOrd] = d.getFullYear();
                    result[mOrd] = d.getMonth();
                    result[dOrd] = d.getDate();
                }
                else if (s.preset == 'time') {
                    try { var d = this.parseDate(s.timeFormat, val, s); } catch (e) { var d = new Date(); };
                    var hour = d.getHours();
                    result[0] = (s.ampm) ? (hour > 12 ? (hour - 12) : (hour == 0 ? 12 : hour)) : hour;
                    result[1] = d.getMinutes();
                    if (s.seconds) result[2] = d.getSeconds();
                    if (s.ampm) result[s.seconds ? 3 : 2] = hour > 11 ? 'PM' : 'AM';
                }
                else if (s.preset == 'datetime') {
                    try { var d = this.parseDate(s.dateFormat + ' ' + s.timeFormat, val, s); } catch (e) { var d = new Date(); };
                    var hour = d.getHours();
                    result[yOrd] = d.getFullYear();
                    result[mOrd] = d.getMonth();
                    result[dOrd] = d.getDate();
                    result[3] = (s.ampm) ? (hour > 12 ? (hour - 12) : (hour == 0 ? 12 : hour)) : hour;
                    result[4] = d.getMinutes();
                    if (s.seconds) result[5] = d.getSeconds();
                    if (s.ampm) result[s.seconds ? 6 : 5] = hour > 11 ? 'PM' : 'AM';
                }
                return result;
            }
            return s.parseValue(val, this);
        }

        /**
        * Formats the selected wheel values form the required format.
        * @return {String} Formatted string.
        */
        this.formatResult = function () {
            var d = this.temp;
            if (this.preset) {
                if (s.preset == 'date') {
                    return this.formatDate(s.dateFormat, new Date(d[yOrd], d[mOrd], d[dOrd]), s);
                }
                else if (s.preset == 'datetime') {
                    var hour = (s.ampm) ? ((d[s.seconds ? 6 : 5] == 'PM' && (d[3] - 0) < 12) ? (d[3] - 0 + 12) : (d[s.seconds ? 6 : 5] == 'AM' && (d[3] == 12) ? 0 : d[3])) : d[3];
                    return this.formatDate(s.dateFormat + ' ' + s.timeFormat, new Date(d[yOrd], d[mOrd], d[dOrd], hour, d[4], s.seconds ? d[5] : null), s);
                }
                else if (s.preset == 'time') {
                    var hour = (s.ampm) ? ((d[s.seconds ? 3 : 2] == 'PM' && (d[0] - 0) < 12) ? (d[0] - 0 + 12) : (d[s.seconds ? 3 : 2] == 'AM' && (d[0] == 12) ? 0 : d[0])) : d[0];
                    return this.formatDate(s.timeFormat, new Date(1970, 0, 1, hour, d[1], s.seconds ? d[2] : null), s);
                }
            }
            return s.formatResult(d);
        }

        /**
        * Checks if the current selected values are valid together.
        * In case of date presets it checks the number of days in a month.
        * @param {Integer} i - Currently changed wheel index, -1 if initial validation.
        */
        this.validate = function(i) {
            // If target is month, show/hide days
            if (this.preset && s.preset.match(/date/i) && ((i == yOrd) || (i == mOrd) || (i == -1))) {
                var days = 32 - new Date(this.temp[yOrd], this.temp[mOrd], 32).getDate() - 1;
                var day = $('ul:eq(' + dOrd + ')', dw);
                $('li', day).show();
                $('li:gt(' + days + ')', day).hide();
                if (this.temp[dOrd] > days) {
                    this.scroll(day, m - days - 1);
                    this.temp[dOrd] = $('li:eq(' + days + ')', day).data('val');
                }
            }
            else {
                s.validate(i);
            }
        }

        /**
        * Hides the scroller instance.
        */
        this.hide = function () {
            // If onClose handler returns false, prevent hide
            if (s.onClose(this.val, this) === false) return false;
            // Re-enable temporary disabled fields
            $('.dwtd').prop('disabled', false).removeClass('dwtd');
            $(elm).blur();
            // Hide wheels and overlay
            dw.hide();
            dwo.hide();
            visible = false;
            if (this.preset)
                s.wheels = null;
            // Stop positioning on window resize
            $(window).unbind('resize.dw');
        }

        /**
        * Shows the scroller instance.
        */
        this.show = function () {
            if (s.disabled || visible) return false;

            s.beforeShow(elm, this);
            // Set global wheel element height
            h = s.height;
            m = Math.round(s.rows / 2);

            inst = this;

            this.init();

            if (this.preset) {
                // Create preset wheels
                s.wheels = new Array();
                if (s.preset.match(/date/i)) {
                    var w = {};
                    for (var k = 0; k < 3; k++) {
                        if (k == yOrd) {
                            w[s.yearText] = {};
                            for (var i = s.startYear; i <= s.endYear; i++)
                                w[s.yearText][i] = s.dateOrder.search(/yy/i) < 0 ? i.toString().substr(2, 2) : i.toString();
                        }
                        else if (k == mOrd) {
                            w[s.monthText] = {};
                            for (var i = 0; i < 12; i++)
                                w[s.monthText][i] =
                                    (s.dateOrder.search(/MM/) < 0 ?
                                    (s.dateOrder.search(/M/) < 0 ?
                                    (s.dateOrder.search(/mm/) < 0 ? (i + 1) : (i < 9) ? ('0' + (i + 1)) : (i + 1)) : s.monthNamesShort[i]) : s.monthNames[i]);
                        }
                        else if (k == dOrd) {
                            w[s.dayText] = {};
                            for (var i = 1; i < 32; i++)
                                w[s.dayText][i] = s.dateOrder.search(/dd/i) < 0 ? i : (i < 10) ? ('0' + i) : i;
                        }
                    }
                    s.wheels.push(w);
                }
                if (s.preset.match(/time/i)) {
                    s.stepHour = (s.stepHour < 1) ? 1 : parseInt(s.stepHour);
                    s.stepMinute = (s.stepMinute < 1) ? 1 : parseInt(s.stepMinute);
                    s.stepSecond = (s.stepSecond < 1) ? 1 : parseInt(s.stepSecond);
                    var w = {};
                    w[s.hourText] = {};
                    for (var i = (s.ampm ? 1 : 0); i < (s.ampm ? 13 : 24); i += s.stepHour)
                        w[s.hourText][i] = (i < 10) ? ('0' + i) : i;
                    w[s.minuteText] = {};
                    for (var i = 0; i < 60; i += s.stepMinute)
                        w[s.minuteText][i] = (i < 10) ? ('0' + i) : i;
                    if (s.seconds) {
                        w[s.secText] = {};
                        for (var i = 0; i < 60; i += s.stepSecond)
                            w[s.secText][i] = (i < 10) ? ('0' + i) : i;
                    }
                    if (s.ampm) {
                        w[s.ampmText] = {};
                        w[s.ampmText]['AM'] = 'AM';
                        w[s.ampmText]['PM'] = 'PM';
                    }
                    s.wheels.push(w);
                }
            }

            // Create wheels containers
            $('.dwc', dw).remove();
            for (var i = 0; i < s.wheels.length; i++) {
                var dwc = $('<div class="dwc' + (s.mode == 'clickpick' ? ' dwpm' : '') + '"><div class="dwwc dwrc"><div class="clear" style="clear:both;"></div></div>').insertBefore($('.dwbc', dw));
                // Create wheels
                for (var label in s.wheels[i]) {
                    var to1 = $('.dwwc .clear', dwc);
                    var w = $('<div class="dwwl dwrc">' + (s.mode == 'clickpick' ? '<div class="dwwb dwwbp">+</div><div class="dwwb dwwbm">&ndash;</div>' : '') + '<div class="dwl">' + label + '</div><div class="dww dwrc"><ul></ul><div class="dwwo"></div></div><div class="dwwol"></div></div>').insertBefore(to1);
                    // Create wheel values
                    for (var j in s.wheels[i][label]) {
                        $('<li class="val_' + j + '">' + s.wheels[i][label][j] + '</li>').data('val', j).appendTo($('ul', w));
                    }
                }
            }

            // Set scrollers to position
            $('.dww ul', dw).each(function(i) {
                var x = $('li', this).index($('li.val_' + that.temp[i], this));
                while ((x < 0) && (--that.temp[i] >= 0)) {
                  x = $('li', this).index($('li.val_' + that.temp[i], this));
                }
                that.scroll($(this), m - (x < 0 ? 0 : x) - 1);
            });
            // Set value text
            $('.dwv', dw).html(this.formatResult());
            // Initial validate
            that.validate(-1);

            // Init buttons
            $('#dw_set', dw).text(s.setText).unbind().bind('click', function (e) {
                that.setValue();
                s.onSelect(that.val, inst);
                that.hide();
                return false;
            });

            $('#dw_cancel', dw).text(s.cancelText).unbind().bind('click', function (e) {
                s.onCancel(that.val, inst);
                that.hide();
                return false;
            });

            // Disable inputs to prevent bleed through (Android bug)
            $(':input:not(:disabled)').addClass('dwtd');
            $(':input').prop('disabled', true);
            // Show
            dwo.show();
            dw.attr('class', 'dw ' + s.theme).show();
            visible = true;
            // Set sizes
            $('.dww, .dwwl', dw).height(s.rows * h);
            $('.dww', dw).each(function() { $(this).width($(this).parent().width() < s.width ? s.width : $(this).parent().width()); });
            $('.dwbc a', dw).attr('class', s.btnClass);
            $('.dww li, .dwwb', dw).css({
                height: h,
                lineHeight: h + 'px'
            });
            $('.dwwc', dw).each(function() {
                var w = 0;
                $('.dwwl', this).each(function() { w += $(this).outerWidth(true); });
                $(this).width(w);
            });
            $('.dwc', dw).each(function() {
                $(this).width($('.dwwc', this).outerWidth(true));
            });
            // Set position
            this.pos();
            $(window).bind('resize.dw', function() { that.pos(); });
        }

        /**
        * Positions the scroller instance to the center of the viewport.
        */
        this.pos = function() {
            var totalw = 0,
                minw = 0,
                ww = $(window).width(),
                wh = $(window).height(),
                st = $(window).scrollTop(),
                w,
                h;
            $('.dwc', dw).each(function() {
                w = $(this).outerWidth(true);
                totalw += w;
                minw = (w > minw) ? w : minw;
            });
            w = totalw > ww ? minw : totalw;
            dw.width(w);
            w = dw.outerWidth();
            h = dw.outerHeight();
            dw.css({ left: (ww - w) / 2, top: st + (wh - h) / 2 });
            dwo.height(0);
            dwo.height($(document).height());
        }

        /**
        * Scroller initialization.
        */
        this.init = function() {
            // Set year-month-day order
            var ty = s.dateOrder.search(/y/i),
                tm = s.dateOrder.search(/m/i),
                td = s.dateOrder.search(/d/i);
            yOrd = (ty < tm) ? (ty < td ? 0 : 1) : (ty < td ? 1 : 2);
            mOrd = (tm < ty) ? (tm < td ? 0 : 1) : (tm < td ? 1 : 2);
            dOrd = (td < ty) ? (td < tm ? 0 : 1) : (td < tm ? 1 : 2);
            this.preset = (s.wheels === null);
            this.temp = ($(elm).is('input') || this.values === null) ? this.parseValue($(elm).val() ? $(elm).val() : '') : this.values.slice(0);
            this.setValue(false);
        }

        this.init();

        // Set element readonly, save original state
        if ($(elm).is(':input') && s.showOnFocus)
            $(elm).data('dwro', $(elm).prop('readonly')).prop('readonly', true);

        // Init show datewheel
        $(elm).addClass('scroller').unbind('focus.dw').bind('focus.dw', function (e) {
            if (s.showOnFocus)
                that.show();
        });
    }

    function testProps(props) {
        for (var i in props) {
            if (mod[props[i]] !== undefined ) {
                return true;
            }
        }
        return false;
    }

    function testPrefix() {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'];
        for (var p in prefixes) {
            if (testProps([prefixes[p] + 'Transform']))
                return '-' + prefixes[p].toLowerCase();
        }
        return '';
    }

    var dw,
        dwo,
        h,
        m,
        l,
        inst, // Current instance
        scrollers = {}, // Scroller instances
        date = new Date(),
        uuid = date.getTime(),
        move = false,
        target = null,
        start,
        stop,
        startTime,
        endTime,
        pos,
        mod = document.createElement(mod).style,
        has3d = testProps(['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective']) && 'webkitPerspective' in document.documentElement.style,
        prefix = testPrefix(),
        touch = ('ontouchstart' in window),
        START_EVENT = touch ? 'touchstart' : 'mousedown',
        MOVE_EVENT = touch ? 'touchmove' : 'mousemove',
        END_EVENT = touch ? 'touchend' : 'mouseup',
        defaults = {
            // Options
            width: 80,
            height: 40,
            rows: 3,
            disabled: false,
            showOnFocus: true,
            wheels: null,
            theme: '',
            mode: 'scroller',
            preset: 'date',
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
            setText: 'Set',
            cancelText: 'Cancel',
            btnClass: 'dwb',
            stepHour: 1,
            stepMinute: 1,
            stepSecond: 1,
            // Events
            beforeShow: function() {},
            onClose: function() {},
            onSelect: function() {},
            onCancel: function() {},
            formatResult: function(d) {
                var out = '';
                for (var i = 0; i < d.length; i++) {
                    out += (i > 0 ? ' ' : '') + d[i];
                }
                return out;
            },
            parseValue: function(val, inst) {
                var w = inst.settings.wheels,
                    ret = val.split(' '),
                    def = [],
                    total = 0;
                for (var i = 0; i < w.length; i++) {
                    for (var l in w[i]) {
                        total++;
                        for (var v in w[i][l]) {
                            def.push(v);
                            break;
                        }
                    }
                }
                return ret.length == total ? ret : def;
            },
            validate: function() {
                return true;
            }
        },

        methods = {
            init: function (options) {
                if (options === undefined) options = {};
                var defs = {};
                // Skin dependent defaults
                if (options.theme == 'ios') {
                    defs.dateOrder = 'MMdyy';
                    defs.rows = 5;
                    defs.height = 30;
                    defs.width = 55;
                }
                // Mode dependent defaults
                if (options.mode == 'clickpick') {
                    defs.height = 50;
                    defs.rows = 3;
                }

                var settings = $.extend({}, defaults, defs, options),
                    plustap = false,
                    minustap = false;

                if ($('.dw').length) {
                    dwo = $('.dwo');
                    dw = $('.dw');
                }
                else {
                    // Create html
                    dwo = $('<div class="dwo"></div>').hide().appendTo('body');
                    dw = $('<div class="dw">' +
                        '<div class="dwv">&nbsp;</div>' +
                        '<div class="dwbc" style="clear:both;">' +
                            '<span class="dwbw dwb-s"><a id="dw_set" href="#"></a></span>' +
                            '<span class="dwbw dwb-c"><a id="dw_cancel" href="#"></a></span>' +
                        '</div>' +
                    '</div>');

                    dw.hide().appendTo('body');

                    function getY(e) {
                        return touch ? e.originalEvent.changedTouches[0].pageY : e.pageY;
                    }

                    function calc(t, val, anim, orig) {
                        var i = $('ul', dw).index(t);
                        val = val > (m - 1) ? (m - 1) : val;
                        val = val < (m - l) ? (m - l) : val;
                        // Call scroll with animation (calc animation time)
                        inst.scroll(t, val, anim ? (val == orig ? 0.1 : Math.abs((val - orig) * 0.1)) : 0, orig, i);
                        // Set selected scroller value
                        inst.temp[i] = $('li:eq(' + (m - 1 - val) + ')', t).data('val');
                        // Validate
                        inst.validate(i);
                        // Set value text
                        $('.dwv', dw).html(inst.formatResult());
                    }

                    function plus(t) {
                        if (plustap) {
                            var p = t.data('pos'),
                                val = p - 1;
                            val = val < (m - l) ? (m - 1) : val;
                            calc(t, val);
                        }
                        else {
                            clearInterval(plustap);
                        }
                    }

                    function minus(t) {
                        if (minustap) {
                            var p = t.data('pos'),
                                val = p + 1;
                            val = val > (m - 1) ? (m - l) : val;
                            calc(t, val);
                        }
                        else {
                            clearInterval(minustap);
                        }
                    }

                    $(document).bind(MOVE_EVENT, function (e) {
                        if (move) {
                            e.preventDefault();
                            stop = getY(e);

                            // Circular wheels
                            /*var diff = Math.round((stop - start) / h);
                            if (diff > 0) {
                                start += h;
                                $('li:last', target).prependTo(target);
                            }
                            else if (diff < 0) {
                                start -= h;
                                $('li:first', target).appendTo(target);
                            }*/
                            var val = pos + (stop - start) / h;
                            val = val > (m - 1 + 1) ? (m - 1 + 1) : val;
                            val = val < (m - l - 1) ? (m - l - 1) : val;
                            inst.scroll(target, val);
                        }
                    });

                    $(document).bind(END_EVENT, function (e) {
                        if (move) {
                            e.preventDefault();
                            var time = new Date() - startTime;

                            var val = pos + (stop - start) / h;
                            val = val > (m - 1 + 1) ? (m - 1 + 1) : val;
                            val = val < (m - l - 1) ? (m - l - 1) : val;

                            /*if (time < 300) {
                                var speed = (stop - start) / time;
                                var dist = (speed * speed) / (2 * 0.0006);
                                if (stop - start < 0) dist = -dist;
                            }
                            else {
                                var dist = stop - start;
                            }*/
                            var dist = stop - start;
                            calc(target, Math.round(pos + dist / h), true, Math.round(val));
                            move = false;
                            target = null;
                        }
                        clearInterval(plustap);
                        clearInterval(minustap);
                        plustap = false;
                        minustap = false;
                        $('.dwb-a').removeClass('dwb-a');
                    });

                    dw.delegate('.dwwl', 'DOMMouseScroll mousewheel', function (e) {
                        e.preventDefault();
                        var delta = e.wheelDelta ? (e.wheelDelta / 120) : (e.detail ? (-e.detail / 3) : 0),
                            t = $('ul', this),
                            p = t.data('pos'),
                            val = Math.round(p + delta);
                        l = $('li:visible', t).length;

                        // Circular wheels
                        /*if (p > val) {
                            val += 40;
                            $('li:first', t).appendTo(t);
                        }
                        else if (p < val) {
                            val -= 40;
                            $('li:last', t).prependTo(t);
                        }*/
                        calc(t, val);
                    }).delegate('.dwb, .dwwb', START_EVENT, function (e) {
                        // Active button
                        $(this).addClass('dwb-a');
                    }).delegate('.dwwbp', START_EVENT, function (e) {
                        // + Button
                        e.preventDefault();
                        var t = $(this).closest('.dwwl').find('ul');
                        l = $('li:visible', t).length;
                        clearInterval(plustap);
                        plustap = setInterval(function() { plus(t); }, 200);
                        plus(t);
                    }).delegate('.dwwbm', START_EVENT, function (e) {
                        // - Button
                        e.preventDefault();
                        var t = $(this).closest('.dwwl').find('ul');
                        l = $('li:visible', t).length;
                        clearInterval(minustap);
                        minustap = setInterval(function() { minus(t); }, 200);
                        minus(t);
                    }).delegate('.dwwl', START_EVENT, function (e) {
                        // Scroll start
                        if (!move && inst.settings.mode == 'scroller') {
                            e.preventDefault();
                            move = true;
                            target = $('ul', this);
                            pos = target.data('pos');
                            l = $('li:visible', target).length;
                            start = getY(e);
                            startTime = new Date();
                            stop = start;
                            inst.scroll(target, pos);
                        }
                    });
                }

                return this.each(function () {
                    if (!this.id) {
                        uuid += 1;
                        this.id = 'scoller' + uuid;
                    }
                    scrollers[this.id] = new Scroller(this, dw, settings);
                });
            },
            enable: function() {
                return this.each(function () {
                    if (scrollers[this.id]) scrollers[this.id].enable();
                });
            },
            disable: function() {
                return this.each(function () {
                    if (scrollers[this.id]) scrollers[this.id].disable();
                });
            },
            isDisabled: function() {
                if (scrollers[this[0].id])
                    return scrollers[this[0].id].settings.disabled;
            },
            option: function(option, value) {
                return this.each(function () {
                    if (scrollers[this.id]) {
                        if (typeof option === 'object')
                            $.extend(scrollers[this.id].settings, option);
                        else
                            scrollers[this.id].settings[option] = value;
                        scrollers[this.id].init();
                    }
                });
            },
            setValue: function(d, input) {
                if (input == undefined) input = false;
                return this.each(function () {
                    if (scrollers[this.id]) {
                        scrollers[this.id].temp = d;
                        scrollers[this.id].setValue(d, input);
                    }
                });
            },
            getValue: function() {
                if (scrollers[this[0].id])
                    return scrollers[this[0].id].values;
            },
            setDate: function(d, input) {
                if (input == undefined) input = false;
                return this.each(function () {
                    if (scrollers[this.id]) {
                        scrollers[this.id].setDate(d, input);
                    }
                });
            },
            getDate: function() {
                if (scrollers[this[0].id])
                    return scrollers[this[0].id].getDate();
            },
            show: function() {
                if (scrollers[this[0].id])
                    return scrollers[this[0].id].show();
            },
            hide: function() {
                return this.each(function () {
                    if (scrollers[this.id])
                        scrollers[this.id].hide();
                });
            },
            destroy: function() {
                return this.each(function () {
                    if (scrollers[this.id]) {
                        $(this).unbind('focus.dw').removeClass('scroller');
                        if ($(this).is(':input'))
                            $(this).prop('readonly', $(this).data('dwro'));
                        delete scrollers[this.id];
                    }
                });
            }
        };

    $.fn.scroller = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Unknown method');
        }
    }

    $.scroller = new Scroller(null, null, defaults);

})(jQuery);
