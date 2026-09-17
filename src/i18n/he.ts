// Hebrew

import { MbscLocale } from './locale';

const he: MbscLocale = {
  // Core
  rtl: true, // Right to left mode
  setText: 'שמירה',
  cancelText: 'ביטול',
  clearText: 'נקה',
  closeText: 'סגירה',
  selectedText: '{count} נבחר',
  selectedPluralText: '{count} נבחרו',
  // Datetime component
  dateFormat: 'DD/MM/YYYY',
  dateFormatFull: 'DDDD, D בMMMM YYYY',
  dateFormatLong: 'DDD, D בMMM YYYY',
  dateWheelFormat: '|DDD D MMM|',
  dayNames: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
  dayNamesShort: ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"],
  dayNamesMin: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
  dayText: 'יום',
  hourText: 'שעות',
  minuteText: 'דקות',
  fromText: 'התחלה',
  monthNames: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
  monthNamesShort: ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'],
  monthText: 'חודש',
  secondText: 'שניות',
  amText: 'am',
  pmText: 'pm',
  timeFormat: 'H:mm',
  timeWheels: 'mmH', // Need this for correct RTL display
  yearText: 'שנה',
  toText: 'סיום',
  nowText: 'עכשיו',
  // Calendar component
  firstDay: 0,
  dateText: 'תאריך',
  timeText: 'זמן',
  todayText: 'היום',
  allDayText: 'כל היום',
  noEventsText: 'אין אירועים',
  eventText: 'מִקרֶה',
  eventsText: 'מִקרֶה',
  moreEventsText: 'אירוע אחד נוסף',
  moreEventsPluralText: '{count} אירועים נוספים',
  weekText: '{count} שבוע',
  // Daterange component
  rangeStartLabel: 'התחלה',
  rangeEndLabel: 'סיום',
  rangeStartHelp: 'בחר',
  rangeEndHelp: 'בחר',
  // Select component
  filterEmptyText: 'אין תוצאוה',
  filterPlaceholderText: 'לחפש',
};

export default he;
