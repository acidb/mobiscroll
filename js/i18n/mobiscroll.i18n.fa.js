(function ($) {
    $.mobiscroll.i18n.fa = $.extend($.mobiscroll.i18n.fa, {
        // Core
        setText:"تاييد",
        cancelText:"انصراف",
        // Datetime component
        dateFormat:"yyyy/mm/dd",
        dateOrder:"yymmdd",
        dayNames: ['يکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'],
        dayNamesShort: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
        dayText:"روز",
        monthText:"ماه",
        monthNames: ['فروردين', 'ارديبهشت', 'خرداد', 'تير', 'مرداد', 'شهريور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
        monthNamesShort: ['Farvardin', 'Ordibehesht', 'Khordad', 'Tir', 'Mordad', 'Shahrivar', 'Mehr', 'Aban', 'Azar', 'Dey', 'Bahman', 'Esfand'],
        hourText:"ساعت",
        minuteText:"دقيقه",
        secText:"ثانيه",
        timeFormat:"HH:ii",
        timeWheels:"hhiiA",
		AMPMName: ['صبح', 'بعد از ظهر'],
		ampmName: ['ص', 'ب'],
        yearText:"سال",
		getYear: function(date) {
			jalaliDate = JalaliDate.gregorianToJalali(date.getFullYear(),(date.getMonth() + 1),date.getDate());
			return jalaliDate[0];
		},
		getMonth: function(date) {
			jalaliDate = JalaliDate.gregorianToJalali(date.getFullYear(),(date.getMonth() + 1),date.getDate());
			return --jalaliDate[1];
		},
		getDay: function(date) {
			jalaliDate = JalaliDate.gregorianToJalali(date.getFullYear(),(date.getMonth() + 1),date.getDate());
			return jalaliDate[2];
		},
		getDate: function(date) {
			var dt = date.slice(0);
			y = parseInt(date[0],10);
			m = parseInt(date[1],10)+1;
			d = parseInt(date[2],10);
			gregorianDate = JalaliDate.jalaliToGregorian(y,m,d);
			
			dt[0] = gregorianDate[0];
			dt[1] = gregorianDate[1]-1;
			dt[2] = gregorianDate[2];
			return dt;
		},
		getMaxDayOfMonth: function(date) {
			maxdays = 31;
			while (JalaliDate.checkDate(date[0],date[1]+1,maxdays) == false) {
				maxdays--;
			}
			return maxdays;
		},
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
        hideText: 'پنهان کردن'
    });
})(jQuery);
