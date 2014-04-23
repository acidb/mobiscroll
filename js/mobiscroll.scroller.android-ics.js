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
        iconEmpty: 'star',
        calPrevIcon: 'mbsc-ic mbsc-ic-arrow-left4',
        calNextIcon: 'mbsc-ic mbsc-ic-arrow-right4'
    };

    $.mobiscroll.themes['android-ics'] = theme;
    $.mobiscroll.themes['android-ics light'] = theme;

})(jQuery);

