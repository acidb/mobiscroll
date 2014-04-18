(function ($) {

    $.mobiscroll.themes.wp = {
        minWidth: 76,
        height: 76,
        accent: 'none',
        dateOrder: 'mmMMddDDyy',
        headerText: false,
        showLabel: false,
        iconEmpty: 'star',
        btnWidth: false,
        btnStartClass: 'mbsc-ic mbsc-ic-play2',
        btnStopClass: 'mbsc-ic mbsc-ic-pause',
        btnResetClass: 'mbsc-ic mbsc-ic-stop',
        btnLapClass: 'mbsc-ic mbsc-ic-loop2',
        btnHideClass: 'mbsc-ic mbsc-ic-close',
        onMarkupInserted: function (elm, inst) {
            var click,
                touch,
                active;

            $('.dw', elm).addClass('wp-' + inst.settings.accent);

            $('.dwb-s .dwb', elm).addClass('mbsc-ic mbsc-ic-checkmark');
            $('.dwb-c .dwb', elm).addClass('mbsc-ic mbsc-ic-close');
            $('.dwb-cl .dwb', elm).addClass('mbsc-ic mbsc-ic-close');
            $('.dwb-n .dwb', elm).addClass('mbsc-ic mbsc-ic-loop2');
            $('.dwwbp', elm).addClass('mbsc-ic mbsc-ic-plus');
            $('.dwwbm', elm).addClass('mbsc-ic mbsc-ic-minus');

            $('.dw-cal-prev-m .dw-cal-btn-txt', elm).addClass('mbsc-ic mbsc-ic-arrow-left');
            $('.dw-cal-next-m .dw-cal-btn-txt', elm).addClass('mbsc-ic mbsc-ic-arrow-right');
            $('.dw-cal-prev-y .dw-cal-btn-txt', elm).addClass('mbsc-ic mbsc-ic-arrow-left');
            $('.dw-cal-next-y .dw-cal-btn-txt', elm).addClass('mbsc-ic mbsc-ic-arrow-right');     
            
            $('.dwwl', elm).on('touchstart mousedown DOMMouseScroll mousewheel', function (e) {
                if (e.type === 'mousedown' && touch) {
                    return;
                }
                touch = e.type === 'touchstart';
                click = true;
                active = $(this).hasClass('wpa');
                $('.dwwl', elm).removeClass('wpa');
                $(this).addClass('wpa');
            }).on('touchmove mousemove', function () {
                click = false;
            }).on('touchend mouseup', function (e) {
                if (click && active && $(e.target).closest('.dw-li').hasClass('dw-sel')) {
                    $(this).removeClass('wpa');
                }
                if (e.type === 'mouseup') {
                    touch = false;
                }
                click = false;
            });
        },
        onThemeLoad: function (lang, s) {
            if (lang && lang.dateOrder && !s.dateOrder) {
                var ord = lang.dateOrder;
                ord = ord.match(/mm/i) ? ord.replace(/mmMM|mm|MM/,  'mmMM') : ord.replace(/mM|m|M/,  'mM');
                ord = ord.match(/dd/i) ? ord.replace(/ddDD|dd|DD/,  'ddDD') : ord.replace(/dD|d|D/,  'dD');
                s.dateOrder = ord;
            }
        }
    };

    $.mobiscroll.themes['wp light'] = $.mobiscroll.themes.wp;

})(jQuery);


