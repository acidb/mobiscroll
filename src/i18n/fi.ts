// Suomi

import { MbscLocale } from './locale';

const fi: MbscLocale = {
  // Core
  setText: 'Aseta',
  cancelText: 'Peruuta',
  clearText: 'Tyhjennä',
  closeText: 'Sulje',
  selectedText: '{count} valita',
  // Datetime component
  dateFormat: 'D. MMMM YYYY',
  dateFormatFull: 'DDDD, D. MMMM YYYY',
  dateFormatLong: 'DDD, D. MMMM, YYYY',
  dateWheelFormat: '|DDD D. M.|',
  dayNames: ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviiko', 'Torstai', 'Perjantai', 'Lauantai'],
  dayNamesShort: ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'],
  dayNamesMin: ['S', 'M', 'T', 'K', 'T', 'P', 'L'],
  dayText: 'Päivä',
  hourText: 'Tuntia',
  minuteText: 'Minuutti',
  fromText: 'Alkaa',
  monthNames: [
    'Tammikuu',
    'Helmikuu',
    'Maaliskuu',
    'Huhtikuu',
    'Toukokuu',
    'Kesäkuu',
    'Heinäkuu',
    'Elokuu',
    'Syyskuu',
    'Lokakuu',
    'Marraskuu',
    'Joulukuu',
  ],
  monthNamesShort: ['Tam', 'Hel', 'Maa', 'Huh', 'Tou', 'Kes', 'Hei', 'Elo', 'Syy', 'Lok', 'Mar', 'Jou'],
  monthText: 'Kuukausi',
  secondText: 'Sekunda',
  timeFormat: 'H:mm',
  yearText: 'Vuosi',
  toText: 'Päättyy',
  nowText: 'Nyt',
  pmText: 'pm',
  amText: 'am',
  // Calendar component
  firstDay: 1,
  dateText: 'Päiväys',
  timeText: 'Aika',
  todayText: 'Tänään',
  eventText: 'Tapahtumia',
  eventsText: 'Tapahtumia',
  allDayText: 'Koko päivä',
  noEventsText: 'Ei tapahtumia',
  moreEventsText: '{count} muu',
  moreEventsPluralText: '{count} muuta',
  weekText: 'Viikko {count}',
  // Daterange component
  rangeStartLabel: 'Alkaa',
  rangeEndLabel: 'Päättyy',
  rangeStartHelp: 'Valitse',
  rangeEndHelp: 'Valitse',
  // Select component
  filterEmptyText: 'Ei tuloksia',
  filterPlaceholderText: 'Haku',
};

export default fi;
