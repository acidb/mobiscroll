(function () {

    var mbsc = mobiscroll,
        themes = mbsc.themes,
        $ = mbsc.$;

    themes.frame.ios= {
        display: 'bottom', // frame
        headerText: false, // frame
        btnWidth: false, // frame
        deleteIcon: 'ios-backspace', // numpad
        scroll3d: true
    };

    themes.scroller.ios= $.extend({}, themes.frame.ios, {
        rows: 5, // scroller
        height: 34, // scroller
        minWidth: 55, // scroller
        selectedLineHeight: true, // scroller
        selectedLineBorder: 1, // scroller
        showLabel: false, // scroller
        useShortLabels: true, // timespan/timer
        btnPlusClass: 'mbsc-ic mbsc-ic-arrow-down5', // scroller
        btnMinusClass: 'mbsc-ic mbsc-ic-arrow-up5', // scroller
        checkIcon: 'ion-ios7-checkmark-empty', // select
        dateDisplay: 'MMdyy', // date
        btnCalPrevClass: 'mbsc-ic mbsc-ic-arrow-left5', // calendar
        btnCalNextClass: 'mbsc-ic mbsc-ic-arrow-right5' // calendar
    });

})();
