import { $, extend, mobiscroll } from '../core/core';
import { getCoord } from '../util/tap';
import { closest, testTouch, listen, unlisten } from '../util/dom';

export default mobiscroll;

function addRipple($control, ev) {
    var x = getCoord(ev, 'X', true),
        y = getCoord(ev, 'Y', true),
        control = $control[0],
        rect = $control.offset(),
        left = x - rect.left,
        top = y - rect.top,
        width = Math.max(left, control.offsetWidth - left),
        height = Math.max(top, control.offsetHeight - top),
        size = 2 * Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

    removeRipple($ripple);

    $ripple = $('<span class="mbsc-ripple"></span>').css({
        backgroundColor: getComputedStyle(control).color,
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
        startY,
        markup = $markup[0];

    function onStart(ev) {
        var target = closest(markup, ev.target, selector);
        if (target && testTouch(ev, target)) {
            startX = getCoord(ev, 'X');
            startY = getCoord(ev, 'Y');

            $active = $(target);

            if (!$active.hasClass(disabled) && !$active.hasClass(nohl)) {
                addRipple($active, ev);
            } else {
                $active = null;
            }
        }
    }

    function onMove(ev) {
        if ($active && Math.abs(getCoord(ev, 'X') - startX) > 9 || Math.abs(getCoord(ev, 'Y') - startY) > 9) {
            removeRipple($ripple);
            $active = null;
        }
    }

    function onEnd() {
        if ($active) {
            setTimeout(function () {
                removeRipple($ripple);
            }, 100);
            $active = null;
        }
    }

    if (markup) {
        if (markup.__mbscRippleOff) {
            markup.__mbscRippleOff();
        }
        listen(markup, 'touchstart', onStart, { passive: true });
        listen(markup, 'mousedown', onStart);
        listen(markup, 'touchmove', onMove, { passive: true });
        listen(markup, 'mousemove', onMove);
        listen(markup, 'touchend', onEnd);
        listen(markup, 'touchcancel', onEnd);
        listen(markup, 'mouseleave', onEnd);
        listen(markup, 'mouseup', onEnd);

        markup.__mbscRippleOff = function () {
            unlisten(markup, 'touchstart', onStart, { passive: true });
            unlisten(markup, 'mousedown', onStart);
            unlisten(markup, 'touchmove', onMove, { passive: true });
            unlisten(markup, 'mousemove', onMove);
            unlisten(markup, 'touchend', onEnd);
            unlisten(markup, 'touchcancel', onEnd);
            unlisten(markup, 'mouseleave', onEnd);
            unlisten(markup, 'mouseup', onEnd);
            delete markup.__mbscRippleOff;
        };
    }
}

var $active,
    $ripple,
    themes = mobiscroll.themes;

themes.frame.material = {
    headerText: false,
    btnWidth: false,
    deleteIcon: 'material-backspace',
    onMarkupReady: function (ev) {
        initRipple($(ev.target), '.mbsc-fr-btn-e', 'mbsc-disabled', 'mbsc-fr-btn-nhl');
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
    btnCalNextClass: 'mbsc-ic mbsc-ic-material-keyboard-arrow-right'
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

themes.navigation.material = {
    onInit: function () {
        initRipple($(this), '.mbsc-ms-item.mbsc-btn-e', 'mbsc-disabled', 'mbsc-btn-nhl');
    },
    onMarkupInit: function () {
        $('.mbsc-ripple', this).remove();
    },
    onDestroy: function () {
        if (this.__mbscRippleOff) {
            this.__mbscRippleOff();
        }
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
