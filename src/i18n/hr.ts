// Croatian

import { MbscLocale } from './locale';

const hr: MbscLocale = {
  // Core
  setText: 'Postavi',
  cancelText: 'Izlaz',
  clearText: 'Izbriši',
  closeText: 'Zatvori',
  selectedText: '{count} odabran',
  // Datetime component
  dateFormat: 'DD.MM.YYYY',
  dateFormatFull: 'DDDD, D. MMMM YYYY.',
  dateFormatLong: 'DDD, D. MMM. YYYY.',
  dateWheelFormat: '|DDD D MMM|',
  dayNames: ['Nedjelja', 'Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota'],
  dayNamesShort: ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub'],
  dayNamesMin: ['Ne', 'Po', 'Ut', 'Sr', 'Če', 'Pe', 'Su'],
  dayText: 'Dan',
  hourText: 'Sat',
  minuteText: 'Minuta',
  fromText: 'Počinje',
  monthNames: [
    'Siječanj',
    'Veljača',
    'Ožujak',
    'Travanj',
    'Svibanj',
    'Lipanj',
    'Srpanj',
    'Kolovoz',
    'Rujan',
    'Listopad',
    'Studeni',
    'Prosinac',
  ],
  monthNamesShort: ['Sij', 'Velj', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro'],
  monthText: 'Mjesec',
  secondText: 'Sekunda',
  timeFormat: 'H:mm',
  yearText: 'Godina',
  toText: 'Završava',
  nowText: 'Sada',
  pmText: 'pm',
  amText: 'am',
  // Calendar component
  firstDay: 1,
  dateText: 'Datum',
  timeText: 'Vrijeme',
  todayText: 'Danas',
  eventText: 'Događaj',
  eventsText: 'događaja',
  allDayText: 'Cijeli dan',
  noEventsText: 'Bez događaja',
  moreEventsText: 'Još {count}',
  weekText: '{count}. tjedan',
  // Daterange component
  rangeStartLabel: 'Počinje',
  rangeEndLabel: 'Završava',
  rangeStartHelp: 'Odaberite',
  rangeEndHelp: 'Odaberite',
  // Select component
  filterEmptyText: 'Bez rezultata',
  filterPlaceholderText: 'Traži',
};

export default hr;
