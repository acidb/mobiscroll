import { extend, mobiscroll } from '../core/core';

export default mobiscroll;

var themes = mobiscroll.themes;

themes.frame.windows = {
    headerText: false,
    deleteIcon: 'backspace4',
    //setIcon: 'material-check',
    //cancelIcon: 'material-close',
    //closeIcon: 'material-close',
    //clearIcon: 'material-close',
    //okIcon: 'material-check',
    //nowIcon: 'loop2',
    //startIcon: 'play3',
    //stopIcon: 'pause2',
    //resetIcon: 'stop2',
    //lapIcon: 'loop2',
    //btnWidth: false,
    btnReverse: true
};

themes.scroller.windows = extend({}, themes.frame.windows, {
    rows: 6, // scroller
    minWidth: 88,
    height: 44,
    btnPlusClass: 'mbsc-ic mbsc-ic-arrow-down5',
    btnMinusClass: 'mbsc-ic mbsc-ic-arrow-up5',
    checkIcon: 'material-check',
    dateDisplay: 'MMdyy', // date
    showLabel: false,
    showScrollArrows: true,
    btnCalPrevClass: 'mbsc-ic mbsc-ic-arrow-left5', // calendar
    btnCalNextClass: 'mbsc-ic mbsc-ic-arrow-right5', // calendar
    dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    useShortLabels: true, // timespan/timer
});

themes.form.windows = {};
