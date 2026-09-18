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
};

const themeName = 'windows-legacy';

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
  Scroller: {
    itemHeight: 44,
    minWheelWidth: 88,
    rows: 6,
  },
  Select: {
    clearIcon,
    display: 'center',
    rows: 6,
  },
  Textarea: textFieldOpt,
};

createCustomTheme('windows-legacy-dark', themeName);
