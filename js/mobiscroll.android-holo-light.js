(function ($) {

    $.mobiscroll.themes.frame['android-holo-light'] = {
        baseTheme: 'android-holo',
        dateOrder: 'Mddyy',
        //mode: 'mixed',
        rows: 5,
        minWidth: 76,
        height: 36,
        showLabel: false,
        selectedLineHeight: true,
        selectedLineBorder: 2,
        useShortLabels: true,
        icon: {
            filled: 'star3',
            empty: 'star'
        },
        btnPlusClass: 'mbsc-ic mbsc-ic-arrow-down6',
        btnMinusClass: 'mbsc-ic mbsc-ic-arrow-up6'
    };

    $.mobiscroll.themes.listview['android-holo-light'] = {
        baseTheme: 'android-holo'
    };

    $.mobiscroll.themes.menustrip['android-holo-light'] = {
        baseTheme: 'android-holo'
    };

    $.mobiscroll.themes.form['android-holo-light'] = {
        baseTheme: 'android-holo'
    };

})(jQuery);