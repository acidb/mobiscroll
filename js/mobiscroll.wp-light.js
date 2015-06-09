(function ($) {

    $.mobiscroll.themes.frame['wp-light'] = {
        baseTheme: 'wp',
        minWidth: 76,
        height: 76,
        accent: 'none',
        dateOrder: 'mmMMddDDyy',
        headerText: false,
        showLabel: false,
        deleteIcon: 'backspace4',
        icon: {
            filled: 'star3',
            empty: 'star'
        },
        btnWidth: false,
        btnStartClass: 'mbsc-ic mbsc-ic-play3',
        btnStopClass: 'mbsc-ic mbsc-ic-pause2',
        btnResetClass: 'mbsc-ic mbsc-ic-stop2',
        btnLapClass: 'mbsc-ic mbsc-ic-loop2',
        btnHideClass: 'mbsc-ic mbsc-ic-close',
        btnCalPrevClass: 'mbsc-ic mbsc-ic-arrow-left2',
        btnCalNextClass: 'mbsc-ic mbsc-ic-arrow-right2',
        btnPlusClass: 'mbsc-ic mbsc-ic-plus',
        btnMinusClass: 'mbsc-ic mbsc-ic-minus',
        onMarkupInserted: function (elm, inst) {
            var click,
                touch,
                active;

            if (inst.settings.mode != 'clickpick') {
                $('.dwwl', elm).on('touchstart mousedown wheel mousewheel', function (e) {
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
            }
        },
        onThemeLoad: function (lang, s) {
            if (lang && lang.dateOrder && !s.dateOrder) {
                var ord = lang.dateOrder;
                ord = ord.match(/mm/i) ? ord.replace(/mmMM|mm|MM/, 'mmMM') : ord.replace(/mM|m|M/, 'mM');
                ord = ord.match(/dd/i) ? ord.replace(/ddDD|dd|DD/, 'ddDD') : ord.replace(/dD|d|D/, 'dD');
                s.dateOrder = ord;
            }
        },
        onInit: function (inst) {
            var buttons = inst.buttons;

            buttons.set.icon = 'checkmark';
            buttons.cancel.icon = 'close';
            buttons.clear.icon = 'close';

            if (buttons.ok) {
                buttons.ok.icon = 'checkmark';
            }

            if (buttons.close) {
                buttons.close.icon = 'close';
            }

            if (buttons.now) {
                buttons.now.icon = 'loop2';
            }
        }
    };

    $.mobiscroll.themes.listview['wp-light'] = {
        baseTheme: 'wp'
    };

    $.mobiscroll.themes.menustrip['wp-light'] = {
        baseTheme: 'wp'
    };

    $.mobiscroll.themes.form['wp-light'] = {
        baseTheme: 'wp'
    };

})(jQuery);