// Ukrainian

import { MbscLocale } from './locale';

const ua: MbscLocale = {
  // Core
  setText: 'встановити',
  cancelText: 'відміна',
  clearText: 'очистити',
  closeText: 'Закрити',
  selectedText: '{count} вибрані',
  // Datetime component
  dateFormat: 'DD.MM.YYYY',
  dateFormatFull: 'DDDD, D MMMM YYYY',
  dateFormatLong: 'DDD, D MMM. YYYY',
  dateWheelFormat: '|DDD D MMM.|',
  dayNames: ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п’ятниця', 'субота'],
  dayNamesShort: ['нед', 'пнд', 'вів', 'срд', 'чтв', 'птн', 'сбт'],
  dayNamesMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  dayText: 'День',
  hourText: 'година',
  minuteText: 'хвилина',
  fromText: 'від',
  monthNames: [
    'Січень',
    'Лютий',
    'Березень',
    'Квітень',
    'Травень',
    'Червень',
    'Липень',
    'Серпень',
    'Вересень',
    'Жовтень',
    'Листопад',
    'Грудень',
  ],
  monthNamesShort: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'],
  monthText: 'Місяць',
  secondText: 'Секунд',
  timeFormat: 'H:mm',
  yearText: 'Рік',
  toText: 'кінець',
  nowText: 'Зараз',
  pmText: 'pm',
  amText: 'am',
  // Calendar component
  firstDay: 1,
  dateText: 'дата',
  timeText: 'Час',
  todayText: 'Сьогодні',
  eventText: 'подія',
  eventsText: 'події',
  allDayText: 'Увесь день',
  noEventsText: 'Жодної події',
  moreEventsText: 'та ще {count}',
  weekText: '{count} тиждень',
  // Daterange component
  rangeStartLabel: 'від',
  rangeEndLabel: 'кінець',
  rangeEndHelp: 'Обрати',
  rangeStartHelp: 'Обрати',
  // Select component
  filterEmptyText: 'Ніякого результату',
  filterPlaceholderText: 'Пошук',
};

export default ua;
