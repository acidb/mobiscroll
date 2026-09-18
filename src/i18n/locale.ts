import { MbscCalendarSystem } from '../core/commons';

export interface MbscLocale {
  // Core
  setText?: string;
  cancelText?: string;
  closeText?: string;
  clearText?: string;
  rtl?: boolean;
  selectedText?: string;
  selectedPluralText?: string;
  // Datetime component
  calendarSystem?: MbscCalendarSystem;
  dateFormat?: string;
  dateFormatFull?: string;
  dateFormatLong?: string;
  dateWheelFormat?: string;
  dayNames?: string[];
  dayNamesShort?: string[];
  dayNamesMin?: string[];
  daySuffix?: string;
  dayText?: string;
  fromText?: string;
  hourText?: string;
  monthNames?: string[];
  monthNamesShort?: string[];
  monthSuffix?: string;
  monthText?: string;
  minuteText?: string;
  secondText?: string;
  timeFormat?: string;
  timeWheels?: string;
  toText?: string;
  yearSuffix?: string;
  yearText?: string;
  nowText?: string;
  pmText?: string;
  amText?: string;
  todayText?: string;
  // Calendar component
  firstDay?: number;
  dateText?: string;
  timeText?: string;
  allDayText?: string;
  noEventsText?: string;
  eventText?: string;
  eventsText?: string;
  moreEventsText?: string;
  moreEventsPluralText?: string;
  nextMonthText?: string;
  nextYearText?: string;
  prevMonthText?: string;
  prevYearText?: string;
  weekText?: string;
  // Daterange component
  rangeStartLabel?: string;
  rangeEndLabel?: string;
  rangeStartHelp?: string;
  rangeEndHelp?: string;
  // Select component
  filterEmptyText?: string;
  filterPlaceholderText?: string;
}
