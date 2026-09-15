import arrowBack from '../../icons/ionicons/ios-arrow-back.svg';
import arrowDown from '../../icons/ionicons/ios-arrow-down.svg';
import arrowForward from '../../icons/ionicons/ios-arrow-forward.svg';
import arrowUp from '../../icons/ionicons/ios-arrow-up.svg';
import clearIcon from '../../icons/ionicons/ios-clear.svg';
import dragHandle from '../../icons/material/drag-handle.svg';
import { createCustomTheme, themes } from '../commons';

const textFieldOpt = {
  clearIcon,
  keepFocus: false,
  labelStyle: 'inline',
};

const themeName = 'ios';

themes[themeName] = {
  Calendar: {
    nextIconH: arrowForward,
    nextIconV: arrowDown,
    prevIconH: arrowBack,
    prevIconV: arrowUp,
    useShortDays: true,
  },
  Checkbox: {
    position: 'end',
  },
  Datepicker: {
    clearIcon,
    display: 'bottom',
  },
  Dropdown: textFieldOpt,
  Eventcalendar: {
    chevronIconDown: arrowDown,
    dragIcon: dragHandle,
    nextIconH: arrowForward,
    nextIconV: arrowDown,
    prevIconH: arrowBack,
    prevIconV: arrowUp,
  },
  Input: textFieldOpt,
  Popup: {
    arrowOffset: 46,
    buttonVariant: 'standard',
  },
  Radio: {
    position: 'end',
  },
  Scroller: {
    itemHeight: 34,
    minWheelWidth: 55,
    rows: 5,
    scroll3d: true,
  },
  SegmentedGroup: {
    drag: true,
  },
  Select: {
    clearIcon,
    display: 'bottom',
  },
  Textarea: textFieldOpt,
};

createCustomTheme('ios-dark', themeName);
