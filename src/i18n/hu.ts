// Magyar

import { MbscLocale } from './locale';

const hu: MbscLocale = {
  // Core
  setText: 'OK',
  cancelText: 'Mégse',
  clearText: 'Törlés',
  closeText: 'Bezár',
  selectedText: '{count} kiválasztva',
  // Datetime component
  dateFormat: 'YYYY.MM.DD.',
  dateFormatFull: 'YYYY. MMMM D., DDDD',
  dateFormatLong: 'YYYY. MMM. D., DDD',
  dateWheelFormat: '|MMM. D. DDD|',
  dayNames: ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'],
  dayNamesShort: ['Va', 'Hé', 'Ke', 'Sze', 'Csü', 'Pé', 'Szo'],
  dayNamesMin: ['V', 'H', 'K', 'Sz', 'Cs', 'P', 'Sz'],
  dayText: 'Nap',
  hourText: 'Óra',
  minuteText: 'Perc',
  fromText: 'Eleje',
  monthNames: [
    'Január',
    'Február',
    'Március',
    'Április',
    'Május',
    'Június',
    'Július',
    'Augusztus',
    'Szeptember',
    'Október',
    'November',
    'December',
  ],
  monthNamesShort: ['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún', 'Júl', 'Aug', 'Szep', 'Okt', 'Nov', 'Dec'],
  monthText: 'Hónap',
  secondText: 'Másodperc',
  timeFormat: 'H:mm',
  yearText: 'Év',
  toText: 'Vége',
  nowText: 'Most',
  pmText: 'pm',
  amText: 'am',
  // Calendar component
  firstDay: 1,
  dateText: 'Dátum',
  timeText: 'Idő',
  todayText: 'Ma',
  eventText: 'esemény',
  eventsText: 'esemény',
  allDayText: 'Egész nap',
  noEventsText: 'Nincs esemény',
  moreEventsText: '{count} további',
  weekText: '{count}. hét',
  // Daterange component
  rangeStartLabel: 'Eleje',
  rangeEndLabel: 'Vége',
  rangeStartHelp: 'Válasszon',
  rangeEndHelp: 'Válasszon',
  // Select component
  filterEmptyText: 'Nincs találat',
  filterPlaceholderText: 'Keresés',
};

export default hu;
