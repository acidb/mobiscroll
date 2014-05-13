(function ($) {
    var theme = {
        dateOrder: 'Mddyy',
        mode: 'mixed',
        rows: 5,
        minWidth: 76,
        height: 36,
        showLabel: false,
        selectedLineHeight: true,
        selectedLineBorder: 2,
        useShortLabels: true,
        icon: { filled: 'star3', empty: 'star' },
        btnPlusClass: 'mbsc-ic mbsc-ic-arrow-down6',
        btnMinusClass: 'mbsc-ic mbsc-ic-arrow-up6',
        onThemeLoad: function (lang, s) {
            s.theme = s.theme.replace('android-ics', 'android-holo');
        }
    };

    $.mobiscroll.themes['android-ics'] = theme;
    $.mobiscroll.themes['android-ics light'] = theme;
    $.mobiscroll.themes['android-holo'] = theme;
    $.mobiscroll.themes['android-holo light'] = theme;

})(jQuery);

