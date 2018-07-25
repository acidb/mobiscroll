import { mobiscroll } from '../core/mobiscroll';
import { os, majorVersion, isBrowser } from './platform';

let tapped = 0;
let allowQuick;

function preventClick() {
    // Prevent ghost click
    tapped++;
    setTimeout(function () {
        tapped--;
    }, 500);
}

function triggerClick(ev, control) {
    // Prevent duplicate triggers on the same element
    // e.g. a form checkbox inside a listview item
    if (control.mbscClick) {
        return;
    }

    var touch = (ev.originalEvent || ev).changedTouches[0],
        evt = document.createEvent('MouseEvents');

    evt.initMouseEvent('click', true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
    evt.isMbscTap = true;
    // Prevent ionic to bust our click
    // This works for Ionic 1 - 3, not sure about 4
    evt.isIonicTap = true;

    // This will allow a click fired together with this click
    // We need this, because clicking on a label will trigger a click
    // on the associated input as well, which should not be busted
    allowQuick = true;

    control.mbscChange = true;
    control.mbscClick = true;
    control.dispatchEvent(evt);

    allowQuick = false;

    // Prevent ghost click
    preventClick();

    setTimeout(function () {
        delete control.mbscClick;
    });
}

function getCoord(e, c, page) {
    var ev = e.originalEvent || e,
        prop = (page ? 'page' : 'client') + c;

    // Multi touch support
    if (ev.targetTouches && ev.targetTouches[0]) {
        return ev.targetTouches[0][prop];
    }

    if (ev.changedTouches && ev.changedTouches[0]) {
        return ev.changedTouches[0][prop];
    }

    return e[prop];
}

function tap(that, el, handler, prevent, tolerance, time) {
    var startX,
        startY,
        target,
        moved,
        startTime,
        $ = mobiscroll.$,
        $elm = $(el);

    tolerance = tolerance || 9;

    function onStart(ev) {
        if (!target) {
            // Can't always call preventDefault here, it kills page scroll
            if (prevent) {
                ev.preventDefault();
            }
            target = this;
            startX = getCoord(ev, 'X');
            startY = getCoord(ev, 'Y');
            moved = false;
            startTime = new Date();
        }
    }

    function onMove(ev) {
        // If movement is more than 20px, don't fire the click event handler
        if (target && !moved && (Math.abs(getCoord(ev, 'X') - startX) > tolerance || Math.abs(getCoord(ev, 'Y') - startY) > tolerance)) {
            moved = true;
        }
    }

    function onEnd(ev) {
        if (target) {
            if ((time && new Date() - startTime < 100) || !moved) {
                ev.preventDefault();
                handler.call(target, ev, that);
            }

            target = false;

            preventClick();
        }
    }

    function onCancel() {
        target = false;
    }

    if (that.settings.tap) {
        $elm
            .on('touchstart.mbsc', onStart)
            .on('touchcancel.mbsc', onCancel)
            .on('touchmove.mbsc', onMove)
            .on('touchend.mbsc', onEnd);
    }

    $elm.on('click.mbsc', function (ev) {
        if (prevent) {
            ev.preventDefault();
        }
        // If handler was not called on touchend, call it on click;
        handler.call(this, ev, that);
    });
}

// Prevent standard behaviour on body click
function bustClick(ev) {
    // Textarea needs the mousedown event
    if (tapped && !allowQuick && !ev.isMbscTap && !(ev.target.nodeName == 'TEXTAREA' && ev.type == 'mousedown')) {
        ev.stopPropagation();
        ev.preventDefault();
        return false;
    }
}

if (isBrowser) {
    ['mouseover', 'mousedown', 'mouseup', 'click'].forEach((ev) => {
        document.addEventListener(ev, bustClick, true);
    });

    if (os == 'android' && majorVersion < 5) {
        document.addEventListener('change', function (ev) {
            if (tapped && ev.target.type == 'checkbox' && !ev.target.mbscChange) {
                ev.stopPropagation();
                ev.preventDefault();
            }
            delete ev.target.mbscChange;
        }, true);
    }
}

export {
    getCoord,
    preventClick,
    triggerClick,
    tap
};
