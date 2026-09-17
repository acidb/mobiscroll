import dragHandle from '../../icons/material/drag-handle.svg';
import angleDown from '../../icons/windows/angle-down.svg';
import angleLeft from '../../icons/windows/angle-left.svg';
import angleRight from '../../icons/windows/angle-right.svg';
import arrowDown from '../../icons/windows/arrow-down.svg';
import arrowUp from '../../icons/windows/arrow-up.svg';
import clearIcon from '../../icons/windows/close.svg';
import { createCustomTheme, themes } from '../commons';

const textFieldOpt = {
  clearIcon,
  inputStyle: 'box',
  labelStyle: 'stacked',
  ripple: true,
};

const themeName = 'windows';

themes[themeName] = {
  Calendar: {
    nextIconH: angleRight,
    nextIconV: arrowDown,
    prevIconH: angleLeft,
    prevIconV: arrowUp,
  },
  Checkbox: {
    position: 'start',
  },
  Datepicker: {
    buttonVariant: 'flat',
    clearIcon,
    display: 'center',
  },
  Dropdown: textFieldOpt,
  Eventcalendar: {
    chevronIconDown: angleDown,
    dragIcon: dragHandle,
    nextIconH: angleRight,
    nextIconV: arrowDown,
    prevIconH: angleLeft,
    prevIconV: arrowUp,
  },
  Input: textFieldOpt,
  Popup: {
    arrowOffset: 20,
    buttonVariant: 'standard',
  },
  Scroller: {
    itemHeight: 36,
    minWheelWidth: 88,
    rows: 7,
  },
  Select: {
    buttonVariant: 'flat',
    clearIcon,
    display: 'center',
    rows: 7,
  },
  Textarea: textFieldOpt,
};

createCustomTheme('windows-dark', themeName);
