import arrowDown from '../../icons/material/arrow-drop-down.svg';
import arrowUp from '../../icons/material/arrow-drop-up.svg';
import chevronLeft from '../../icons/material/chevron-left.svg';
import chevronRight from '../../icons/material/chevron-right.svg';
import clearIcon from '../../icons/material/clear.svg';
import dragHandle from '../../icons/material/drag-handle.svg';
import keyboardDown from '../../icons/material/keyboard-arrow-down.svg';
import keyboardUp from '../../icons/material/keyboard-arrow-up.svg';
import { createCustomTheme, themes } from '../commons';

const textFieldOpt = {
  clearIcon,
  dropdownIcon: arrowDown,
  inputStyle: 'box',
  labelStyle: 'floating',
  notch: true,
  ripple: true,
};

const themeName = 'material-legacy';

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
    colorEventList: true,
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
  Scroller: {
    rows: 3,
  },
  Select: {
    clearIcon,
    display: 'center',
    rows: 3,
  },
  Textarea: textFieldOpt,
};

createCustomTheme('material-legacy-dark', themeName);
