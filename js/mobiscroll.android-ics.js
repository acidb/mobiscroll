(function ($) {
    var theme = {
        defaults: {
            dateOrder: 'Mddyy',
            mode: 'mixed',
            rows: 5,
            width: 70,
            height: 36,
            showLabel: false
        }
    }

    $.scroller.themes['android-ics'] = theme;
    $.scroller.themes['android-ics light'] = theme;

})(jQuery);

