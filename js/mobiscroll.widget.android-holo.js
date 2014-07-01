(function ($) {
    var themes = $.mobiscroll.themes,
        theme = {
            dateOrder: 'Mddyy',
            //mode: 'mixed',
            rows: 5,
            minWidth: 76,
            height: 36,
            btnWidth: true,
            showLabel: false,
            selectedLineHeight: true,
            selectedLineBorder: 2,
            useShortLabels: true,
            icon: { filled: 'star3', empty: 'star' },
            btnPlusClass: 'mbsc-ic mbsc-ic-arrow-down6',
            btnMinusClass: 'mbsc-ic mbsc-ic-arrow-up6',
            onThemeLoad: function (lang, s) {
                if (s.theme) {
                    s.theme = s.theme.replace('android-ics', 'android-holo').replace(' light', '-light');
                }
            },
            onMarkupReady: function (markup) {
                markup.addClass('mbsc-android-holo');
            }
        };

    themes['android-ics'] = theme;
    themes['android-ics light'] = theme;
    themes['android-holo'] = theme;
    themes['android-holo light'] = theme;
    themes['android-holo-light'] = theme;

})(jQuery);

