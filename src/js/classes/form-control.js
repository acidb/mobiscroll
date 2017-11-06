import mobiscroll, { $, extend } from '../core/core';
import { wrapLabel } from '../util/forms';
import { getCoord, preventClick } from '../util/tap';
import { testTouch } from '../util/dom';

const events = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'mousedown', 'mousemove', 'mouseup', 'mouseleave'];
const defaults = {
    tap: true
};

let $active;

function getControlType($elm) {
    const elm = $elm[0];
    const role = $elm.attr('data-role');

    let type = $elm.attr('type') || elm.nodeName.toLowerCase();

    if (/(switch|range|segmented|stepper)/.test(role)) {
        type = role;
    }

    return type;
}

function getRipple(theme) {
    const ripple = mobiscroll.themes.form[theme];
    return ripple && ripple.addRipple ? ripple : null;
}

class FormControl {
    constructor(elm, settings) {

        const s = extend({}, defaults, mobiscroll.settings, settings);
        const $elm = $(elm);
        const $p = $elm.parent();
        const $parent = $p.hasClass('mbsc-input-wrap') ? $p.parent() : $p;
        // Check for inline mobiscroll components
        const $frame = $elm.next().hasClass('mbsc-fr') ? $elm.next() : null;
        const type = getControlType($elm);

        if ($frame) {
            $frame.insertAfter($parent);
        }

        wrapLabel($parent, type);

        $elm.addClass('mbsc-control');

        // Attach events
        // Prevent 300ms click latency
        events.forEach(ev => {
            elm.addEventListener(ev, this);
        });

        this.settings = s;

        this._type = type;
        this._elm = elm;
        this._$elm = $elm;
        this._$parent = $parent;
        this._$frame = $frame;
        this._ripple = getRipple(s.theme);
    }

    destroy() {
        this._$elm.removeClass('mbsc-control');
        events.forEach(ev => {
            this._elm.removeEventListener(ev, this);
        });
    }

    option(s) {
        extend(this.settings, s);
        this._ripple = getRipple(this.settings.theme);
    }

    handleEvent(ev) {
        switch (ev.type) {
            case 'touchstart':
            case 'mousedown':
                this._onStart(ev);
                break;
            case 'touchmove':
            case 'mousemove':
                this._onMove(ev);
                break;
            case 'touchend':
            case 'touchcancel':
            case 'mouseup':
            case 'mouseleave':
                this._onEnd(ev);
        }
    }

    _addRipple(ev) {
        if (this._ripple && this._$rippleElm) {
            this._ripple.addRipple(this._$rippleElm, ev);
        }
    }

    _removeRipple() {
        if (this._ripple && this._$rippleElm) {
            this._ripple.removeRipple();
        }
    }

    _onStart(ev) {
        const elm = this._elm;

        if (testTouch(ev, elm)) {
            this._startX = getCoord(ev, 'X');
            this._startY = getCoord(ev, 'Y');

            if ($active) {
                $active.removeClass('mbsc-active');
            }

            if (!elm.disabled) {
                this._isActive = true;
                $active = this._$elm;
                $active.addClass('mbsc-active');
                this._addRipple(ev);
                // trigger('onControlActivate', {
                //     target: this,
                //     domEvent: ev
                // });
            }
        }
    }

    _onMove(ev) {
        // If movement is more than 9px, don't fire the click event handler
        if (this._isActive && Math.abs(getCoord(ev, 'X') - this._startX) > 9 || Math.abs(getCoord(ev, 'Y') - this._startY) > 9) {
            this._$elm.removeClass('mbsc-active');
            // trigger('onControlDeactivate', {
            //     target: $control[0],
            //     domEvent: ev
            // });
            this._removeRipple();
            this._isActive = false;
        }
    }

    _onEnd(ev) {
        const control = this._elm;
        const type = this._type;

        if (this._isActive && this.settings.tap && ev.type == 'touchend' && !control.readOnly) {
            control.focus();

            if (/(button|submit|checkbox|switch|radio)/.test(type)) {
                ev.preventDefault();
            }

            if (!/select/.test(type)) {
                var touch = (ev.originalEvent || ev).changedTouches[0],
                    evt = document.createEvent('MouseEvents');

                evt.initMouseEvent('click', true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
                evt.tap = true;

                control.mbscChange = true;

                control.dispatchEvent(evt);

                // Prevent ghost click
                preventClick();
            }
        }

        if (this._isActive) {
            setTimeout(() => {
                this._$elm.removeClass('mbsc-active');
                this._removeRipple();
                // trigger('onControlDeactivate', {
                //     target: $control[0],
                //     domEvent: ev
                // });
            }, 100);
        }

        this._isActive = false;

        $active = null;
    }
}

export default FormControl;

export {
    getControlType
};
