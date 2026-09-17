// Lietuvių

import { MbscLocale } from './locale';

const lt: MbscLocale = {
  // Core
  setText: 'OK',
  cancelText: 'Atšaukti',
  clearText: 'Išvalyti',
  closeText: 'Uždaryti',
  selectedText: 'Pasirinktas {count}',
  selectedPluralText: 'Pasirinkti {count}',
  // Datetime component
  dateFormat: 'YYYY-MM-DD',
  dateFormatFull: 'YYYY MMMM D DDDD',
  dateFormatLong: 'YYYY-MM-DD',
  dateWheelFormat: '|MM-DD DDD|',
  dayNames: ['Sekmadienis', 'Pirmadienis', 'Antradienis', 'Trečiadienis', 'Ketvirtadienis', 'Penktadienis', 'Šeštadienis'],
  dayNamesShort: ['S', 'Pr', 'A', 'T', 'K', 'Pn', 'Š'],
  dayNamesMin: ['S', 'Pr', 'A', 'T', 'K', 'Pn', 'Š'],
  dayText: 'Diena',
  hourText: 'Valanda',
  minuteText: 'Minutes',
  fromText: 'Nuo',
  monthNames: [
    'Sausis',
    'Vasaris',
    'Kovas',
    'Balandis',
    'Gegužė',
    'Birželis',
    'Liepa',
    'Rugpjūtis',
    'Rugsėjis',
    'Spalis',
    'Lapkritis',
    'Gruodis',
  ],
  monthNamesShort: ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir', 'Lie', 'Rugp', 'Rugs', 'Spa', 'Lap', 'Gruo'],
  monthText: 'Mėnuo',
  secondText: 'Sekundes',
  amText: 'am',
  pmText: 'pm',
  timeFormat: 'HH:mm',
  yearText: 'Metai',
  toText: 'Iki',
  nowText: 'Dabar',
  todayText: 'Šiandien',
  // Calendar component
  firstDay: 1,
  dateText: 'Data',
  timeText: 'Laikas',
  allDayText: 'Visą dieną',
  noEventsText: 'Nėra įvykių',
  eventText: 'Įvykių',
  eventsText: 'Įvykiai',
  moreEventsText: 'Dar {count}',
  weekText: '{count} savaitė',
  // Daterange component
  rangeStartLabel: 'Nuo',
  rangeEndLabel: 'Iki',
  rangeStartHelp: 'Pasirinkti',
  rangeEndHelp: 'Pasirinkti',
  // Select component
  filterEmptyText: 'Nėra rezultatų',
  filterPlaceholderText: 'Paieška',
};

export default lt;
