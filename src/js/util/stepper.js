import { $ } from '../core/core';
import { noop } from './misc';
import { listen, testTouch, unlisten } from './dom';
import { getCoord } from './tap';

function createStepper($elm, action, delay, isReadOnly, stopProp, ripple) {
    var $btn,
        changed,
        index,
        running,
        source,
        startX,
        startY,
        step,
        timer,
        check = isReadOnly || noop;

    function onBtnStart(ev) {
        var proceed;

        $btn = $(ev.currentTarget);

        step = +$btn.attr('data-step');
        index = +$btn.attr('data-index');
        changed = true;

        if (stopProp) {
            ev.stopPropagation();
        }

        if (ev.type == 'touchstart') {
            $btn.closest('.mbsc-no-touch').removeClass('mbsc-no-touch');
        }

        if (ev.type == 'mousedown') {
            // Prevent focus
            ev.preventDefault();
        }

        if (ev.type != 'keydown') {
            //e.preventDefault();
            startX = getCoord(ev, 'X');
            startY = getCoord(ev, 'Y');
            proceed = testTouch(ev, this);
        } else {
            proceed = ev.keyCode === 32;
        }

        if (!running && proceed && !$btn.hasClass('mbsc-disabled')) {
            if (start(index, step, ev)) {
                $btn.addClass('mbsc-active');
                if (ripple) {
                    ripple.addRipple($btn.find('.mbsc-segmented-content'), ev);
                }
            }

            if (ev.type == 'mousedown') {
                $(document)
                    .on('mousemove', onBtnMove)
                    .on('mouseup', onBtnEnd);
            }
        }
    }

    function onBtnMove(ev) {
        if (Math.abs(startX - getCoord(ev, 'X')) > 7 || Math.abs(startY - getCoord(ev, 'Y')) > 7) {
            changed = true;
            stop();
        }
    }

    function onBtnEnd(ev) {
        if (ev.type == 'touchend') {
            // Prevents iOS scroll on double tap
            ev.preventDefault();
        }

        stop();

        if (ev.type == 'mouseup') {
            $(document)
                .off('mousemove', onBtnMove)
                .off('mouseup', onBtnEnd);
        }
    }

    function stop() {
        running = false;
        clearInterval(timer);
        if ($btn) {
            $btn.removeClass('mbsc-active');
            if (ripple) {
                setTimeout(function () {
                    ripple.removeRipple();
                }, 100);
            }
        }
    }

    function start(i, st, ev) {
        if (!running && !check(i)) {
            index = i;
            step = st;
            source = ev;
            running = true;
            changed = false;
            setTimeout(tick, 100);
        }
        return running;
    }

    function tick() {
        if ($btn && $btn.hasClass('mbsc-disabled')) {
            stop();
            return;
        }
        if (running || !changed) {
            changed = true;
            action(index, step, source, tick);
        }
        if (running && delay) {
            clearInterval(timer);
            timer = setInterval(function () {
                action(index, step, source);
            }, delay);
        }
    }

    function destroy() {
        $elm.each(function (i, el) {
            unlisten(el, 'touchstart', onBtnStart, { passive: true });
            unlisten(el, 'mousedown', onBtnStart);
            unlisten(el, 'keydown', onBtnStart);
            unlisten(el, 'touchmove', onBtnMove, { passive: true });
            unlisten(el, 'touchend', onBtnEnd);
            unlisten(el, 'touchcancel', onBtnEnd);
            unlisten(el, 'keyup', onBtnEnd);
        });
    }

    $elm.each(function (i, el) {
        listen(el, 'touchstart', onBtnStart, { passive: true });
        listen(el, 'mousedown', onBtnStart);
        listen(el, 'keydown', onBtnStart);
        listen(el, 'touchmove', onBtnMove, { passive: true });
        listen(el, 'touchend', onBtnEnd);
        listen(el, 'touchcancel', onBtnEnd);
        listen(el, 'keyup', onBtnEnd);
    });

    return {
        start: start,
        stop: stop,
        destroy: destroy
    };
}

export { createStepper };
