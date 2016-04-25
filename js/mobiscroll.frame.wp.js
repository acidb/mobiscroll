(function () {

    var ms = mobiscroll,
        $ = ms.$,
        themes = ms.themes.frame,
        theme = {
            minWidth: 76,
            height: 76,
            dateDisplay: 'mmMMddDDyy',
            headerText: false,
            showLabel: false,
            deleteIcon: 'backspace4',
            icon: {
                filled: 'star3',
                empty: 'star'
            },
            btnWidth: false,
            btnCalPrevClass: 'mbsc-ic mbsc-ic-arrow-left2',
            btnCalNextClass: 'mbsc-ic mbsc-ic-arrow-right2',
            btnPlusClass: 'mbsc-ic mbsc-ic-plus',
            btnMinusClass: 'mbsc-ic mbsc-ic-minus',
            onMarkupInserted: function (ev, inst) {
                var click,
                    touch,
                    active,
                    elm = $(ev.target),
                    s = inst.settings;

                function isReadOnly(i) {
                    return $.isArray(s.readonly) ? s.readonly[i] : s.readonly;
                }

                $('.mbsc-sc-whl', elm).on('touchstart mousedown wheel mousewheel', function (e) {
                    if ((e.type === 'mousedown' && touch) || isReadOnly($(this).attr('data-index'))) {
                        return;
                    }
                    touch = e.type === 'touchstart';
                    click = true;
                    active = $(this).hasClass('mbsc-sc-whl-wpa');
                    $('.mbsc-sc-whl', elm).removeClass('mbsc-sc-whl-wpa');
                    $(this).addClass('mbsc-sc-whl-wpa');
                }).on('touchmove mousemove', function () {
                    click = false;
                }).on('touchend mouseup', function (e) {
                    if (click && active && $(e.target).closest('.mbsc-sc-itm').hasClass('mbsc-sc-itm-sel')) {
                        $(this).removeClass('mbsc-sc-whl-wpa');
                    }
                    if (e.type === 'mouseup') {
                        touch = false;
                    }
                    click = false;
                });
            },
            onInit: function (ev, inst) {
                var buttons = inst.buttons;

                buttons.set.icon = 'checkmark';
                buttons.cancel.icon = 'close';
                buttons.clear.icon = 'close';

                // Widget
                if (buttons.ok) {
                    buttons.ok.icon = 'checkmark';
                }

                if (buttons.close) {
                    buttons.close.icon = 'close';
                }

                // Date & Time
                if (buttons.now) {
                    buttons.now.icon = 'loop2';
                }

                // Timer
                if (buttons.toggle) {
                    buttons.toggle.icon = 'play3';
                }

                if (buttons.start) {
                    buttons.start.icon = 'play3';
                }

                if (buttons.stop) {
                    buttons.stop.icon = 'pause2';
                }

                if (buttons.reset) {
                    buttons.reset.icon = 'stop2';
                }

                if (buttons.lap) {
                    buttons.lap.icon = 'loop2';
                }

                if (buttons.hide) {
                    buttons.hide.icon = 'close';
                }
            }
        };

    themes.wp = theme;

})();
