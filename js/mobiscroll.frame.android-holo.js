(function () {

    var mbsc = mobiscroll,
        themes = mbsc.themes,
        $ = mbsc.$;

    themes.frame['android-holo'] = {};

    themes.scroller['android-holo'] = $.extend({}, themes.frame['android-holo'], {
        dateDisplay: 'Mddyy', // datetime
        rows: 5, // scroller
        minWidth: 76, // scroller
        height: 36, // scroller
        showLabel: false, // scroller
        selectedLineHeight: true, // scroller
        selectedLineBorder: 2, // scroller
        useShortLabels: true, // scroller
        icon: { // rating
            filled: 'star3',
            empty: 'star'
        },
        btnPlusClass: 'mbsc-ic mbsc-ic-arrow-down6', // scroller
        btnMinusClass: 'mbsc-ic mbsc-ic-arrow-up6' // scroller
    });

})();