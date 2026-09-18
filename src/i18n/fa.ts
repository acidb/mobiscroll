// فارسی

import { jalaliCalendar } from './jalali';
import { MbscLocale } from './locale';

const fa: MbscLocale = {
  // Core
  setText: 'تاييد',
  cancelText: 'انصراف',
  clearText: 'واضح ',
  closeText: 'نزدیک',
  selectedText: '{count} منتخب',
  rtl: true,
  // Datetime component
  calendarSystem: jalaliCalendar,
  dateFormat: 'YYYY/MM/DD',
  dateFormatFull: 'DDDD D MMMM YYYY',
  dateFormatLong: 'DDD D MMM YYYY',
  dateWheelFormat: '|DDDD MMM D|',
  dayNames: ['يکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'],
  dayNamesShort: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
  dayNamesMin: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
  dayText: 'روز',
  hourText: 'ساعت',
  minuteText: 'دقيقه',
  fromText: 'شروع ',
  monthNames: ['فروردين', 'ارديبهشت', 'خرداد', 'تير', 'مرداد', 'شهريور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
  monthNamesShort: ['فروردين', 'ارديبهشت', 'خرداد', 'تير', 'مرداد', 'شهريور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
  monthText: 'ماه',
  secondText: 'ثانيه',
  timeFormat: 'HH:mm',
  timeWheels: 'mmHH', // Need this for correct RTL display
  yearText: 'سال',
  toText: 'پایان',
  nowText: 'اکنون',
  amText: 'ب',
  pmText: 'ص',
  todayText: 'امروز',
  // Calendar component
  firstDay: 6,
  dateText: 'تاریخ ',
  timeText: 'زمان ',
  allDayText: 'تمام روز',
  noEventsText: 'هیچ رویداد',
  eventText: 'رویداد',
  eventsText: 'رویدادها',
  moreEventsText: '{count} مورد دیگر',
  weekText: '{count} هفته',
  // Daterange component
  rangeStartLabel: 'شروع ',
  rangeEndLabel: 'پایان',
  rangeStartHelp: 'انتخاب کنید',
  rangeEndHelp: 'انتخاب کنید',
  // Select component
  filterEmptyText: 'نتیجه ای ندارد',
  filterPlaceholderText: 'جستجو کردن',
};

export default fa;
