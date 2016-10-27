(function () {

    var mbsc = mobiscroll,
        themes = mbsc.themes,
        $ = mbsc.$;

    themes.frame['android-holo-light'] = {
        baseTheme: 'android-holo'
    };

    themes.scroller['android-holo-light'] = $.extend({}, themes.frame['android-holo-light'], {
        dateDisplay: 'Mddyy', // datetime
        rows: 5, // scroller
        minWidth: 76, // scroller
        height: 36, // scroller
        showLabel: false, // scroller
        selectedLineBorder: 2, // scroller
        useShortLabels: true, // scroller
        icon: { // rating
            filled: 'star3',
            empty: 'star'
        },
        btnPlusClass: 'mbsc-ic mbsc-ic-arrow-down6', // scroller
        btnMinusClass: 'mbsc-ic mbsc-ic-arrow-up6' // scroller
    });

    mobiscroll.themes.listview['android-holo-light'] = {
        baseTheme: 'android-holo'
    };

    mobiscroll.themes.menustrip['android-holo-light'] = {
        baseTheme: 'android-holo'
    };

    mobiscroll.themes.form['android-holo-light'] = {
        baseTheme: 'android-holo'
    };

    mobiscroll.themes.progress['android-holo-light'] = {
        baseTheme: 'android-holo'
    };

})();
