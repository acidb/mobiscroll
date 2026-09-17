import arrowDown from '../../icons/material/arrow-drop-down.svg';
import arrowUp from '../../icons/material/arrow-drop-up.svg';
import chevronLeft from '../../icons/material/chevron-left.svg';
import chevronRight from '../../icons/material/chevron-right.svg';
import clearIcon from '../../icons/material/clear.svg';
import dragHandle from '../../icons/material/drag-handle.svg';
import keyboardDown from '../../icons/material/keyboard-arrow-down.svg';
import keyboardUp from '../../icons/material/keyboard-arrow-up.svg';
import closeIcon from '../../icons/windows/close.svg';
import { createCustomTheme, themes } from '../commons';

const textFieldOpt = {
  clearIcon: closeIcon,
  dropdownIcon: arrowDown,
  inputStyle: 'box',
  labelStyle: 'floating',
  notch: true,
  ripple: true,
};

const themeName = 'material';

themes[themeName] = {
  Button: {
    ripple: true,
  },
  Calendar: {
    downIcon: arrowDown,
    nextIconH: chevronRight,
    nextIconV: keyboardDown,
    prevIconH: chevronLeft,
    prevIconV: keyboardUp,
    upIcon: arrowUp,
  },
  Datepicker: {
    clearIcon,
    display: 'center',
  },
  Dropdown: textFieldOpt,
  Eventcalendar: {
    chevronIconDown: keyboardDown,
    downIcon: arrowDown,
    dragIcon: dragHandle,
    nextIconH: chevronRight,
    nextIconV: keyboardDown,
    prevIconH: chevronLeft,
    prevIconV: keyboardUp,
    upIcon: arrowUp,
  },
  Input: textFieldOpt,
  ListItem: {
    ripple: true,
  },
  Popup: {
    arrowOffset: 42,
  },
  Scroller: {
    desktopRows: 5,
    itemHeight: 48,
    rows: 3,
  },
  Select: {
    clearIcon,
    desktopRows: 5,
    display: 'center',
    rows: 3,
  },
  Textarea: textFieldOpt,
};

createCustomTheme('material-dark', themeName);
