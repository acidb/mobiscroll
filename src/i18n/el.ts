// Greek

import { MbscLocale } from './locale';

const el: MbscLocale = {
  // Core
  setText: 'Ορισμος',
  cancelText: 'Ακυρωση',
  clearText: 'Διαγραφη',
  closeText: 'Κλείσιμο',
  selectedText: '{count} επιλεγμένα',
  // Datetime component
  dateFormat: 'DD/MM/YYYY',
  dateFormatFull: 'DDDD, D MMMM YYYY',
  dateFormatLong: 'DDD, D MMM YYYY',
  dateWheelFormat: '|DDD D MMM|',
  dayNames: ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'],
  dayNamesShort: ['Κυρ', 'Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ'],
  dayNamesMin: ['Κυ', 'Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα'],
  dayText: 'ημέρα',
  hourText: 'ώρα',
  minuteText: 'λεπτό',
  fromText: 'Αρχή',
  monthNames: [
    'Ιανουάριος',
    'Φεβρουάριος',
    'Μάρτιος',
    'Απρίλιος',
    'Μάιος',
    'Ιούνιος',
    'Ιούλιος',
    'Αύγουστος',
    'Σεπτέμβριος',
    'Οκτώβριος',
    'Νοέμβριος',
    'Δεκέμβριος',
  ],
  monthNamesShort: ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαι', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ'],
  monthText: 'Μήνας',
  secondText: 'δευτερόλεπτα',
  timeFormat: 'H:mm',
  yearText: 'έτος',
  toText: 'Τέλος',
  nowText: 'τώρα',
  pmText: 'μμ',
  amText: 'πμ',
  // Calendar component
  firstDay: 1,
  dateText: 'Ημερομηνία',
  timeText: 'φορά',
  todayText: 'Σήμερα',
  eventText: 'Γεγονότα',
  eventsText: 'Γεγονότα',
  allDayText: 'Ολοήμερο',
  noEventsText: 'Δεν υπάρχουν γεγονότα',
  moreEventsText: '{count} ακόμη',
  weekText: 'Εβδομάδα {count}',
  // Daterange component
  rangeStartLabel: 'Αρχή',
  rangeEndLabel: 'Τέλος',
  rangeStartHelp: 'Επιλογή',
  rangeEndHelp: 'Επιλογή',
  // Select component
  filterEmptyText: 'Κανένα αποτέλεσμα',
  filterPlaceholderText: 'Αναζήτηση',
};

export default el;
