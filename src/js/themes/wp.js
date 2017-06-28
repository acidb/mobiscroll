import mobiscroll, {
    $,
    extend
} from '../core/core';

export default mobiscroll;

var themes = mobiscroll.themes;

themes.frame.wp = {
    headerText: false,
    deleteIcon: 'backspace4',
    setIcon: 'checkmark',
    cancelIcon: 'close',
    closeIcon: 'close',
    clearIcon: 'close',
    okIcon: 'checkmark',
    nowIcon: 'loop2',
    startIcon: 'play3',
    stopIcon: 'pause2',
    resetIcon: 'stop2',
    lapIcon: 'loop2',
    btnWidth: false
};

themes.scroller.wp = extend({}, themes.frame.wp, {
    minWidth: 76,
    height: 76,
    dateDisplay: 'mmMMddDDyy',
    showLabel: false,
    icon: {
        filled: 'star3',
        empty: 'star'
    },
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
    }
});

//themes.listview.wp = {};

//themes.menustrip.wp = {};

themes.form.wp = {};
