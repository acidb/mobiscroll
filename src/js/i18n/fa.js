// فارسی

import { mobiscroll } from '../core/core';
import './jalali';

export default mobiscroll;

mobiscroll.i18n.fa = {
    // Core
    setText: 'تاييد',
    cancelText: 'انصراف',
    clearText: 'واضح ',
    selectedText: '{count} منتخب',
    // Datetime component
    calendarSystem: 'jalali',
    dateFormat: 'yy/mm/dd',
    dayNames: ['يکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'],
    dayNamesShort: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
    dayNamesMin: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
    dayText: 'روز',
    hourText: 'ساعت',
    minuteText: 'دقيقه',
    monthNames: ['فروردين', 'ارديبهشت', 'خرداد', 'تير', 'مرداد', 'شهريور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
    monthNamesShort: ['فروردين', 'ارديبهشت', 'خرداد', 'تير', 'مرداد', 'شهريور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
    monthText: 'ماه',
    secText: 'ثانيه',
    timeFormat: 'HH:ii',
    timeWheels: 'iiHH', // Need this for correct RTL display
    yearText: 'سال',
    nowText: 'اکنون',
    amText: 'ب',
    pmText: 'ص',
    todayText: 'امروز',
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
    closeText: 'نزدیک',
    allDayText: 'تمام روز',
    noEventsText: 'هیچ رویداد',
    eventText: 'رویداد',
    eventsText: 'رویدادها',
    moreEventsText: '{count} مورد دیگر',
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
};
