import ms from '../core/mobiscroll';
import { os, majorVersion, isBrowser } from './platform';

let tapped = 0;

function preventClick() {
    // Prevent ghost click
    tapped++;
    setTimeout(function () {
        tapped--;
    }, 500);
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
        $ = ms.$,
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
        ev.preventDefault();
        // If handler was not called on touchend, call it on click;
        handler.call(this, ev, that);
    });
}

// Prevent standard behaviour on body click
function bustClick(ev) {
    // Textarea needs the mousedown event
    if (tapped && !ev.tap && !(ev.target.nodeName == 'TEXTAREA' && ev.type == 'mousedown')) {
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
    tap
};
