/*!
 * jQuery MobiScroll v1.5
 * http://mobiscroll.com
 *
 * Copyright 2010-2011, Acid Media
 * Licensed under the MIT license.
 *
 */
(function ($) {

    function Scroller(elm, dw, settings) {
        var that = this,
            yOrd,
            mOrd,
            dOrd,
            show = false;

        this.settings = settings;
        this.values = null;
        this.val = null;
        // Temporary values
        this.temp = null;

        this.setDefaults = function(o) {
            $.extend(defaults, o);
        }

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
                ampm = 0,
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
            if (ampm && hours < 12) hours += 12;
            var date = new Date(year, month - 1, day, hours, minutes, seconds);
            if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day)
                throw 'Invalid date'; // E.g. 31/02/*
            return date;
        }

        this.setValue = function (input) {
            if (input == undefined) input = true;
            var v = this.formatResult();
            this.val = v;
            this.values = this.temp.slice(0);
            if (input && $(elm).is('input')) $(elm).val(v).change();
        }

        this.getDate = function () {
            var d = this.values;
            var s = this.settings;
            if (s.preset == 'date')
                return new Date(d[yOrd], d[mOrd], d[dOrd]);
            if (s.preset == 'time') {
                var hour = (s.ampm && d[s.seconds ? 3 : 2] == 'PM' && (d[0] - 0) < 12) ? (d[0] - 0 + 12) : d[0];
                return new Date(1970, 0, 1, hour, d[1], s.seconds ? d[2] : null);
            }
            if (s.preset == 'datetime') {
                var hour = (s.ampm && d[s.seconds ? 6 : 5] == 'PM' && (d[3] - 0) < 12) ? (d[3] - 0 + 12) : d[3];
                return new Date(d[yOrd], d[mOrd], d[dOrd], hour, d[4], s.seconds ? d[5] : null);
            }
        }

        this.setDate = function (d, input) {
            var s = this.settings;
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

        this.parseValue = function (val) {
            var s = this.settings;
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
            return s.parseValue(val);
        }

        this.formatResult = function () {
            var s = this.settings;
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

        this.validate = function(i) {
            var s = this.settings;
            // If target is month, show/hide days
            if (this.preset && s.preset.match(/date/i) && ((i == yOrd) || (i == mOrd))) {
                var days = 32 - new Date(this.temp[yOrd], this.temp[mOrd], 32).getDate() - 1;
                var day = $('ul:eq(' + dOrd + ')', dw);
                $('li', day).show();
                $('li:gt(' + days + ')', day).hide();
                if (this.temp[dOrd] > days) {
                    day.addClass('dwa').css('top', (h * (m - days - 1)) + 'px');
                    this.temp[dOrd] = $('li:eq(' + days + ')', day).data('val');
                }
            }
            else {
                methods.validate(i);
            }
        }

        this.hide = function () {
            this.settings.onClose(this.val, this);
            $(':input:not(.dwtd)').attr('disabled', false).removeClass('dwtd');
            $(elm).blur();
            dw.hide();
            dwo.hide();
            show = false;
            if (this.preset) this.settings.wheels = null;
            $(window).unbind('resize.dw');
        }

        this.show = function () {
            var s = this.settings;
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
                    for (var i = 0; i < (s.ampm ? 13 : 24); i += s.stepHour)
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
                var val = h * (m - (x < 0 ? 0 : x) - 1);
                $(this).css('top', val);
            });
            // Set value text
            $('.dwv', dw).html(this.formatResult());

            // Init buttons
            $('#dw_set', dw).text(s.setText).unbind().bind('click', function (e) {
                that.setValue();
                s.onSelect(that.val, inst);
                that.hide();
                return false;
            });

            $('#dw_cancel', dw).text(s.cancelText).unbind().bind('click', function (e) {
                that.hide();
                return false;
            });

            // Disable inputs to prevent bleed through (Android bug)
            $(':input:disabled').addClass('dwtd');
            $(':input').attr('disabled', true);
            // Show
            dwo.show();
            dw.attr('class', 'dw ' + s.theme).show();
            show = true;
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

        // Set position
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

        this.init = function() {
            var s = this.settings,
                // Set year-month-day order
                ty = s.dateOrder.search(/y/i),
                tm = s.dateOrder.search(/m/i),
                td = s.dateOrder.search(/d/i);
            yOrd = (ty < tm) ? (ty < td ? 0 : 1) : (ty < td ? 1 : 2);
            mOrd = (tm < ty) ? (tm < td ? 0 : 1) : (tm < td ? 1 : 2);
            dOrd = (td < ty) ? (td < tm ? 0 : 1) : (td < tm ? 1 : 2);
            this.preset = (s.wheels === null);
            // Set values
            if (this.values !== null) {
                // Clone values array
                this.temp = this.values.slice(0);
            }
            else {
                this.temp = this.parseValue($(elm).val() ? $(elm).val() : '');
                this.setValue(false);
            }
        }

        this.init();

        // Set element readonly, save original state
        $(elm).is('input') ? $(elm).attr('readonly', 'readonly').data('readonly', $(elm).attr('readonly')) : false;

        // Init show datewheel
        $(elm).addClass('scroller').unbind('focus.dw').bind('focus.dw', function (e) {
            if (!that.settings.disabled && that.settings.showOnFocus && !show)
                that.show();
        });
    }

    var dw,
        dwo,
        h,
        m,
        inst, // Current instance
        scrollers = {}, // Scroller instances
        date = new Date(),
        uuid = date.getTime(),
        move = false,
        target = null,
        start,
        stop,
        pos,
        touch = ('ontouchstart' in window),
        START_EVENT = touch ? 'touchstart' : 'mousedown',
        MOVE_EVENT = touch ? 'touchmove' : 'mousemove',
        END_EVENT = touch ? 'touchend' : 'mouseup',
        defaults = {
            // Options
            width: 90,
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
            startYear: date.getFullYear() - 10,
            endYear: date.getFullYear() + 10,
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
            formatResult: function(d) {
                var out = '';
                for (var i = 0; i < d.length; i++) {
                    out += (i > 0 ? ' ' : '') + d[i];
                }
                return out;
            },
            parseValue: function(val) {
                return val.split(' ');
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

                    $(document).bind(MOVE_EVENT, function (e) {
                        if (move) {
                            stop = touch ? e.originalEvent.changedTouches[0].pageY : e.pageY;

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


                            target.removeClass('dwa').css('top', (pos + stop - start) + 'px');
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }
                    });

                    function calc(t, val) {
                        var i = $('ul', dw).index(t),
                            l = $('li:visible', t).length;
                        val = val > (m - 1) ? (m - 1) : val;
                        val = val < (m - l) ? (m - l) : val;
                        t.addClass('dwa').css('top', val * h);
                        // Set selected scroller value
                        inst.temp[i] = $('li:eq(' + (m - 1 - val) + ')', t).data('val');
                        // Validate
                        inst.validate(i);
                        // Set value text
                        $('.dwv', dw).html(inst.formatResult());
                    }

                    function plus(t) {
                        if (plustap) {
                            var p = t.css('top').replace(/px/i, '') - 0,
                                val = (p - h) / h;
                            val = val < (m - $('li:visible', t).length) ? (m - 1) : val;
                            calc(t, val);
                        }
                        else {
                            clearInterval(plustap);
                        }
                    }

                    function minus(t) {
                        if (minustap) {
                            var p = t.css('top').replace(/px/i, '') - 0,
                                val = (p + h) / h;
                            val = val > (m - 1) ? (m - $('li:visible', t).length) : val;
                            calc(t, val);
                        }
                        else {
                            clearInterval(minustap);
                        }
                    }

                    $(document).bind(END_EVENT, function (e) {
                        if (move) {
                            var val = Math.round((pos + stop - start) / h);
                            calc(target, val);
                            move = false;
                            target = null;
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        clearInterval(plustap);
                        clearInterval(minustap);
                        plustap = false;
                        minustap = false;
                        $('.dwb-a').removeClass('dwb-a');
                    });

                    dw.delegate('.dwwl', 'DOMMouseScroll mousewheel', function (e) {
                        var delta = e.wheelDelta ? (e.wheelDelta / 120) : (e.detail ? (-e.detail / 3) : 0),
                            t = $('ul', this),
                            p = t.css('top').replace(/px/i, '') - 0,
                            val = Math.round((p + delta * h) / h);

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
                        e.preventDefault();
                        e.stopPropagation();
                    }).delegate('.dwb, .dwwb', START_EVENT, function (e) {
                        // Active button
                        $(this).addClass('dwb-a');
                    }).delegate('.dwwbp', START_EVENT, function (e) {
                        // + Button
                        e.preventDefault();
                        var t = $(this).closest('.dwwl').find('ul');
                        clearInterval(plustap);
                        plustap = setInterval(function() { plus(t); }, 200);
                        plus(t);
                    }).delegate('.dwwbm', START_EVENT, function (e) {
                        // - Button
                        e.preventDefault();
                        var t = $(this).closest('.dwwl').find('ul');
                        clearInterval(minustap);
                        minustap = setInterval(function() { minus(t); }, 200);
                        minus(t);
                    }).delegate('.dwwl', START_EVENT, function (e) {
                        // Scroll start
                        if (!move && inst.settings.mode == 'scroller') {
                            var x1 = touch ? e.originalEvent.changedTouches[0].pageX : e.pageX,
                                x2 = $(this).offset().left;
                            move = true;
                            target = $('ul', this);
                            pos = target.css('top').replace(/px/i, '') - 0;
                            start = touch ? e.originalEvent.changedTouches[0].pageY : e.pageY;
                            stop = start;
                            e.preventDefault();
                            e.stopPropagation();
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
            validate: function() { },
            enable: function() {
                return this.each(function () {
                    if (scrollers[this.id]) scrollers[this.id].settings.disabled = false;
                });
            },
            disable: function() {
                return this.each(function () {
                    if (scrollers[this.id]) scrollers[this.id].settings.disabled = true;
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
                        $(this).is('input') ? $(this).attr('readonly', $(this).data('readonly')) : false;
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
