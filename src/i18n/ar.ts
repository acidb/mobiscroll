// Arabic

import { MbscLocale } from './locale';

const ar: MbscLocale = {
  // Core
  rtl: true, // Right to left mode
  setText: 'تعيين',
  cancelText: 'إلغاء',
  clearText: 'مسح',
  closeText: 'إغلاق',
  selectedText: '{count} المحدد',
  // Datetime component
  dateFormat: 'DD/MM/YYYY',
  dateFormatFull: 'DDDD, D MMMM YYYY',
  dateFormatLong: 'DDD. D MMM YYYY',
  dateWheelFormat: '|DDD D MMM|',
  dayNames: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  dayNamesShort: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
  dayNamesMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  dayText: 'يوم',
  hourText: 'ساعات',
  minuteText: 'الدقائق',
  fromText: 'يبدا',
  monthNames: ['يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  monthNamesShort: ['يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  monthText: 'شهر',
  secondText: 'ثواني',
  amText: 'ص',
  pmText: 'م',
  timeFormat: 'hh:mm A',
  yearText: 'عام',
  timeWheels: 'Ammhh', // Need this for correct RTL display
  toText: 'ينتهي',
  nowText: 'الآن',
  // Calendar component
  firstDay: 0,
  dateText: 'تاريخ',
  timeText: 'وقت',
  todayText: 'اليوم',
  allDayText: 'اليوم كله',
  noEventsText: 'لا توجد احداث',
  // Event calendar
  eventText: 'الحدث',
  eventsText: 'أحداث',
  moreEventsText: 'واحد آخر',
  moreEventsPluralText: 'اثنان آخران {count}',
  weekText: 'أسبوع {count}',
  // Daterange component
  rangeEndHelp: 'أختر',
  rangeEndLabel: 'ينتهي',
  rangeStartHelp: 'أختر',
  rangeStartLabel: 'يبدا',
  // Select component
  filterEmptyText: 'لا نتيجة',
  filterPlaceholderText: 'بحث',
};

export default ar;
