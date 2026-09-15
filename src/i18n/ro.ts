// Română

import { MbscLocale } from './locale';

const ro: MbscLocale = {
  // Core
  setText: 'Setare',
  cancelText: 'Anulare',
  clearText: 'Ştergere',
  closeText: 'Închidere',
  selectedText: '{count} selectat',
  selectedPluralText: '{count} selectate',
  // Datetime component
  dateFormat: 'DD.MM.YYYY',
  dateFormatFull: 'DDDD, D MMMM YYYY',
  dateFormatLong: 'DDD., D MMM YYYY',
  dateWheelFormat: '|DDD. D MMM|',
  dayNames: ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'],
  dayNamesShort: ['Du', 'Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ'],
  dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  dayText: ' Ziua',
  hourText: ' Ore ',
  minuteText: 'Minute',
  fromText: 'Start',
  monthNames: [
    'Ianuarie',
    'Februarie',
    'Martie',
    'Aprilie',
    'Mai',
    'Iunie',
    'Iulie',
    'August',
    'Septembrie',
    'Octombrie',
    'Noiembrie',
    'Decembrie',
  ],
  monthNamesShort: ['Ian.', 'Feb.', 'Mar.', 'Apr.', 'Mai', 'Iun.', 'Iul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
  monthText: 'Luna',
  secondText: 'Secunde',
  timeFormat: 'HH:mm',
  yearText: 'Anul',
  toText: 'Final',
  nowText: 'Acum',
  amText: 'am',
  pmText: 'pm',
  todayText: 'Astăzi',
  // Calendar component
  eventText: 'Eveniment',
  eventsText: 'Evenimente',
  allDayText: 'Toată ziua',
  noEventsText: 'Niciun eveniment',
  moreEventsText: 'Încă unul',
  moreEventsPluralText: 'Încă {count}',
  firstDay: 1,
  dateText: 'Data',
  timeText: 'Ora',
  weekText: 'Săptămâna {count}',
  // Daterange component
  rangeStartLabel: 'Start',
  rangeEndLabel: 'Final',
  rangeStartHelp: 'Selectare',
  rangeEndHelp: 'Selectare',
  // Select component
  filterEmptyText: 'Niciun rezultat',
  filterPlaceholderText: 'Căutare',
};

export default ro;
