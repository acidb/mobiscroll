(function ($) {
    var themes = $.mobiscroll.themes,
        theme = {
            dateOrder: 'Mddyy',
            //mode: 'mixed',
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
            onMarkupReady: function (markup, inst) {
                markup.addClass('mbsc-android-holo');
            }
        };

    themes['mbsc-android-holo-light'] = theme;
})(jQuery);

(function ($) {
    var themes = $.mobiscroll.themes.listview,
        theme = {
        onInit: function () {
            $(this).closest('.mbsc-lv-cont').addClass('mbsc-lv-android-holo');
        }
    };
    
    themes['mbsc-android-holo-light'] = theme;
})(jQuery);
