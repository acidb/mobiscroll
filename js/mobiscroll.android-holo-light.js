(function ($) {
    
    $.mobiscroll.themes['android-holo-light'] = {
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
        onMarkupReady: function (markup) {
            markup.addClass('mbsc-android-holo');
        }
    };

    $.mobiscroll.themes.listview['android-holo-light'] = {
        onInit: function () {
            $(this).closest('.mbsc-lv-cont').addClass('mbsc-lv-android-holo');
        }
    };;

    $.mobiscroll.themes.menustrip['android-holo-light'] = {
        onMarkupReady: function (markup) {
            markup.addClass('mbsc-android-holo');
        }
    };
    
})(jQuery);
