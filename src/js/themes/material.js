import mobiscroll, { $, extend } from '../core/core';
import { getCoord } from '../util/tap';
import { testTouch } from '../util/dom';

export default mobiscroll;

function addRipple($control, ev) {
    var x = getCoord(ev, 'X', true),
        y = getCoord(ev, 'Y', true),
        rect = $control.offset(),
        left = x - rect.left,
        top = y - rect.top,
        width = Math.max(left, $control[0].offsetWidth - left),
        height = Math.max(top, $control[0].offsetHeight - top),
        size = 2 * Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

    removeRipple($ripple);

    $ripple = $('<span class="mbsc-ripple"></span>').css({
        width: size,
        height: size,
        top: y - rect.top - size / 2,
        left: x - rect.left - size / 2
    }).appendTo($control);

    setTimeout(function () {
        $ripple.addClass('mbsc-ripple-scaled mbsc-ripple-visible');
    }, 10);
}

function removeRipple($r) {
    setTimeout(function () {
        if ($r) {
            $r.removeClass('mbsc-ripple-visible');
            setTimeout(function () {
                $r.remove();
            }, 2000);
        }
    }, 100);
}

function initRipple($markup, selector, disabled, nohl) {
    var startX,
        startY;

    $markup.off('.mbsc-ripple').on('touchstart.mbsc-ripple mousedown.mbsc-ripple', selector, function (ev) {
        if (testTouch(ev, this)) {
            startX = getCoord(ev, 'X');
            startY = getCoord(ev, 'Y');

            $active = $(this);

            if (!$active.hasClass(disabled) && !$active.hasClass(nohl)) {
                addRipple($active, ev);
            } else {
                $active = null;
            }
        }
    }).on('touchmove.mbsc-ripple mousemove.mbsc-ripple', selector, function (ev) {
        if ($active && Math.abs(getCoord(ev, 'X') - startX) > 9 || Math.abs(getCoord(ev, 'Y') - startY) > 9) {
            removeRipple($ripple);
            $active = null;
        }
    }).on('touchend.mbsc-ripple touchcancel.mbsc-ripple mouseleave.mbsc-ripple mouseup.mbsc-ripple', selector, function () {
        if ($active) {
            setTimeout(function () {
                removeRipple($ripple);
            }, 100);
            $active = null;
        }
    });
}

var $active,
    $ripple,
    themes = mobiscroll.themes;

themes.frame.material = {
    headerText: false,
    btnWidth: false,
    deleteIcon: 'material-backspace',
    onMarkupReady: function (ev) {
        initRipple($(ev.target), '.mbsc-fr-btn-e', 'mbsc-fr-btn-d', 'mbsc-fr-btn-nhl');
    }
};

themes.scroller.material = extend({}, themes.frame.material, {
    showLabel: false,
    selectedLineBorder: 2,
    weekDays: 'min',
    icon: {
        filled: 'material-star',
        empty: 'material-star-outline'
    },
    checkIcon: 'material-check',
    btnPlusClass: 'mbsc-ic mbsc-ic-material-keyboard-arrow-down',
    btnMinusClass: 'mbsc-ic mbsc-ic-material-keyboard-arrow-up',
    btnCalPrevClass: 'mbsc-ic mbsc-ic-material-keyboard-arrow-left',
    btnCalNextClass: 'mbsc-ic mbsc-ic-material-keyboard-arrow-right',
    onEventBubbleShow: function (ev) {
        var $events = $(ev.eventList),
            bottom = $(ev.target).closest('.mbsc-cal-row').index() < 2,
            color = $('.mbsc-cal-event-color', $events).eq(bottom ? 0 : -1).css('background-color');

        $('.mbsc-cal-events-arr', $events).css('border-color', bottom ? 'transparent transparent ' + color + ' transparent' : color + 'transparent transparent transparent');
    }
});

themes.listview.material = {
    leftArrowClass: 'mbsc-ic-material-keyboard-arrow-left',
    rightArrowClass: 'mbsc-ic-material-keyboard-arrow-right',
    onItemActivate: function (ev) {
        addRipple($(ev.target), ev.domEvent);
    },
    onItemDeactivate: function () {
        removeRipple($ripple);
    },
    onSlideStart: function (ev) {
        $('.mbsc-ripple', ev.target).remove();
    },
    onSortStart: function (ev) {
        $('.mbsc-ripple', ev.target).remove();
    }
};

themes.menustrip.material = {
    onInit: function () {
        initRipple($(this), '.mbsc-ms-item.mbsc-btn-e', 'mbsc-btn-d', 'mbsc-btn-nhl');
    },
    onMarkupInit: function () {
        $('.mbsc-ripple', this).remove();
    },
    onDestroy: function () {
        $(this).off('.mbsc-ripple');
    }
};

themes.form.material = {
    addRipple: function (elm, ev) {
        addRipple(elm, ev);
    },
    removeRipple: function () {
        removeRipple($ripple);
    }
};
