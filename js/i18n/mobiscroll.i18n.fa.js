(function ($) {

    var JalaliDate = {
        gDaysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        jDaysInMonth: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
    };

    JalaliDate.jalaliToGregorian = function (jY, jM, jD) {
        jY = parseInt(jY);
        jM = parseInt(jM);
        jD = parseInt(jD);

        var i;
        var jy = jY - 979;
        var jm = jM - 1;
        var jd = jD - 1;
        var jDayNo = 365 * jy + parseInt(jy / 33) * 8 + parseInt((jy % 33 + 3) / 4);

        for (i = 0; i < jm; ++i) {
            jDayNo += JalaliDate.jDaysInMonth[i];
        }

        jDayNo += jd;

        var gDayNo = jDayNo + 79;

        var gy = 1600 + 400 * parseInt(gDayNo / 146097);
        gDayNo = gDayNo % 146097;

        var leap = true;
        if (gDayNo >= 36525) {
            gDayNo--;
            gy += 100 * parseInt(gDayNo / 36524);
            gDayNo = gDayNo % 36524;

            if (gDayNo >= 365) {
                gDayNo++;
            } else {
                leap = false;
            }
        }

        gy += 4 * parseInt(gDayNo / 1461);
        gDayNo %= 1461;

        if (gDayNo >= 366) {
            leap = false;

            gDayNo--;
            gy += parseInt(gDayNo / 365);
            gDayNo = gDayNo % 365;
        }

        for (i = 0; gDayNo >= JalaliDate.gDaysInMonth[i] + (i == 1 && leap) ; i++) {
            gDayNo -= JalaliDate.gDaysInMonth[i] + (i == 1 && leap);
        }

        var gm = i + 1;
        var gd = gDayNo + 1;

        return [gy, gm, gd];
    };

    JalaliDate.checkDate = function (jY, jM, jD) {
        return !(jY < 0 || jY > 32767 || jM < 1 || jM > 12 || jD < 1 || jD >
            (JalaliDate.jDaysInMonth[jM - 1] + (jM == 12 && ((jY - 979) % 33 % 4) === 0)));
    };

    JalaliDate.gregorianToJalali = function (gY, gM, gD) {
        gY = parseInt(gY);
        gM = parseInt(gM);
        gD = parseInt(gD);

        var i;
        var gy = gY - 1600;
        var gm = gM - 1;
        var gd = gD - 1;

        var gDayNo = 365 * gy + parseInt((gy + 3) / 4) - parseInt((gy + 99) / 100) + parseInt((gy + 399) / 400);

        for (i = 0; i < gm; ++i) {
            gDayNo += JalaliDate.gDaysInMonth[i];
        }

        if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0))) {
            ++gDayNo;
        }

        gDayNo += gd;

        var jDayNo = gDayNo - 79;

        var jNp = parseInt(jDayNo / 12053);
        jDayNo %= 12053;

        var jy = 979 + 33 * jNp + 4 * parseInt(jDayNo / 1461);

        jDayNo %= 1461;

        if (jDayNo >= 366) {
            jy += parseInt((jDayNo - 1) / 365);
            jDayNo = (jDayNo - 1) % 365;
        }

        for (i = 0; i < 11 && jDayNo >= JalaliDate.jDaysInMonth[i]; ++i) {
            jDayNo -= JalaliDate.jDaysInMonth[i];
        }

        var jm = i + 1;
        var jd = jDayNo + 1;

        return [jy, jm, jd];
    };

    $.mobiscroll.i18n.fa = $.extend($.mobiscroll.i18n.fa, {
        // Core
        setText: 'تاييد',
        cancelText: 'انصراف',
        clearText: 'واضح ',
        selectedText: 'منتخب',
        // Datetime component
        dateFormat: 'yy/mm/dd',
        dateOrder: 'yymmdd',
        dayNames: ['يکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'],
        dayNamesShort: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
        dayNamesMin: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
        dayText: 'روز',
        hourText: 'ساعت',
        minuteText: 'دقيقه',
        monthNames: ['فروردين', 'ارديبهشت', 'خرداد', 'تير', 'مرداد', 'شهريور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
        monthNamesShort: ['فروردين', 'ارديبهشت', 'خرداد', 'تير', 'مرداد', 'شهريور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
        //monthNamesShort: ['Farvardin', 'Ordibehesht', 'Khordad', 'Tir', 'Mordad', 'Shahrivar', 'Mehr', 'Aban', 'Azar', 'Dey', 'Bahman', 'Esfand'],
        monthText: 'ماه',
        secText: 'ثانيه',
        timeFormat: 'HH:ii',
        timeWheels: 'HHii',
        yearText: 'سال',
        nowText: 'اکنون',
        amText: 'ب',
        pmText: 'ص',
        getYear: function (date) {
            return JalaliDate.gregorianToJalali(date.getFullYear(), (date.getMonth() + 1), date.getDate())[0];
        },
        getMonth: function (date) {
            return --JalaliDate.gregorianToJalali(date.getFullYear(), (date.getMonth() + 1), date.getDate())[1];
        },
        getDay: function (date) {
            return JalaliDate.gregorianToJalali(date.getFullYear(), (date.getMonth() + 1), date.getDate())[2];
        },
        getDate: function (y, m, d, h, i, s, u) {
            if (m < 0) {
                y += Math.floor(m / 12);
                m = 12 + m % 12;
            }
            if (m > 11) {
                y += Math.floor(m / 12);
                m = m % 12;
            }
            var gregorianDate = JalaliDate.jalaliToGregorian(y, +m + 1, d);

            return new Date(gregorianDate[0], gregorianDate[1] - 1, gregorianDate[2], h || 0, i || 0, s || 0, u || 0);
        },
        getMaxDayOfMonth: function (y, m) {
            var maxdays = 31;
            while (JalaliDate.checkDate(y, m + 1, maxdays) === false) {
                maxdays--;
            }
            return maxdays;
        },
        //getNumber: function (n) {
        //    var i,
        //        nums = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
        //        res = '';

        //    n = n + '';
        //    for (i = 0; i < n.length; i++) {
        //        res += nums[+n[i]];
        //    }
        //    return res;
        //},
        // Calendar component
        firstDay: 6,
        rtl: true,
        dateText: 'تاریخ ',
        timeText: 'زمان ',
        calendarText: 'تقویم',
        closeText: 'نزدیک',
        // Daterange component
        fromText: 'شروع ',
        toText: 'پایان',
        // Measurement components
        wholeText: 'تمام',
        fractionText: 'کسر',
        unitText: 'واحد',
        // Time / Timespan component
        labels: ['سال', 'ماه', 'روز', 'ساعت', 'دقیقه', 'ثانیه', ''],
        labelsShort: ['سال', 'ماه', 'روز', 'ساعت', 'دقیقه', 'ثانیه', ''],
        // Timer component
        startText: 'شروع',
        stopText: 'پايان',
        resetText: 'تنظیم مجدد',
        lapText: 'Lap',
        hideText: 'پنهان کردن',
        // Listview
        backText: 'پشت',
        undoText: 'واچیدن'
    });
})(jQuery);