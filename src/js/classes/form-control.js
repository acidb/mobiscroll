import { $, extend, getThemeName, mobiscroll } from '../core/core';
import { activateControl, getControlType, getCoord, tap } from '../util/tap';
import { testTouch, hasGhostClick } from '../util/dom';

const wrapClass = 'mbsc-input-wrap';
const events = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'mousedown', 'mousemove', 'mouseup', 'mouseleave'];
const defaults = {
    tap: hasGhostClick
};

let $active;

function addIcon($control, ic) {
    var icons = {},
        control = $control[0],
        $parent = $control.parent(),
        errorMsg = $parent.find('.mbsc-err-msg'),
        align = $control.attr('data-icon-align') || 'left',
        icon = $control.attr('data-icon');

    if ($parent.hasClass(wrapClass)) {
        $parent = $parent.parent();
    } else {
        // Wrap input
        $('<span class="' + wrapClass + '"></span>').insertAfter($control).append($control);
    }

    if (errorMsg) {
        $parent.find('.' + wrapClass).append(errorMsg);
    }

    if (icon) {
        if (icon.indexOf('{') !== -1) {
            icons = JSON.parse(icon);
        } else {
            icons[align] = icon;
        }
    }

    if (control.type == 'file') {
        // Set icon
        icons.right = $control.attr('data-icon-upload') || 'upload';
    }

    if (icon || ic) {
        extend(icons, ic);

        $parent
            .addClass((icons.right ? 'mbsc-ic-right ' : '') + (icons.left ? ' mbsc-ic-left' : ''))
            .find('.' + wrapClass)
            .append('<span class="mbsc-input-fill"></span>')
            .append(icons.left ? '<span class="mbsc-input-ic mbsc-left-ic mbsc-ic mbsc-ic-' + icons.left + '"></span>' : '')
            .append(icons.right ? '<span class="mbsc-input-ic mbsc-right-ic mbsc-ic mbsc-ic-' + icons.right + '"></span>' : '');
    }
}

function addIconToggle(that, $parent, $control) {
    var icons = {},
        control = $control[0],
        toggle = $control.attr('data-password-toggle'),
        iconShow = $control.attr('data-icon-show') || 'eye',
        iconHide = $control.attr('data-icon-hide') || 'eye-blocked';

    if (toggle) {
        icons.right = control.type == 'password' ? iconShow : iconHide;
    }

    addIcon($control, icons);

    if (toggle) {
        tap(that, $parent.find('.mbsc-right-ic').addClass('mbsc-input-toggle'), function () {
            if (control.type == "text") {
                control.type = "password";
                $(this).addClass('mbsc-ic-' + iconShow).removeClass('mbsc-ic-' + iconHide);
            } else {
                control.type = "text";
                $(this).removeClass('mbsc-ic-' + iconShow).addClass('mbsc-ic-' + iconHide);
            }
        });
    }
}

function wrapLabel($parent, type, inputStyle, labelStyle, elm) {
    // Wrap non-empty text nodes in span with mbsc-label class
    if (type == 'segmented') {
        $parent.closest('.mbsc-segmented')
            .addClass(inputStyle == 'box' ? 'mbsc-input-box' : '')
            .addClass(inputStyle == 'outline' ? 'mbsc-input-outline' : '');
    } else if (type != 'button' && type != 'submit') {
        $parent
            .addClass('mbsc-control-w')
            .addClass(inputStyle == 'box' ? 'mbsc-input-box' : '')
            .addClass(inputStyle == 'outline' ? 'mbsc-input-outline' : '')
            .addClass(labelStyle == 'inline' ? 'mbsc-label-inline' : '')
            .addClass(labelStyle == 'stacked' ? 'mbsc-label-stacked' : '')
            .addClass(labelStyle == 'floating' ? 'mbsc-label-floating' : '')
            .addClass(labelStyle == 'floating' && elm.value ? 'mbsc-label-floating-active' : '')
            .find('label')
            .addClass('mbsc-label')
            .each(function (i, v) {
                $(v).attr('title', $(v).text());
            });

        $parent.contents().filter(function () {
            return this.nodeType == 3 && this.nodeValue && /\S/.test(this.nodeValue);
        }).each(function () {
            $('<span class="mbsc-label" title="' + this.textContent.trim() + '"></span>').insertAfter(this).append(this);
        });
    }
}

function getRipple(theme) {
    const ripple = mobiscroll.themes.form[theme];
    return ripple && ripple.addRipple ? ripple : null;
}

function getAttr($elm, attr, def) {
    var v = $elm.attr(attr);
    return v === undefined || v === '' ? def : v;
}

function getCssClass(s) {
    const baseTheme = mobiscroll.themes.form[s.theme].baseTheme;
    return 'mbsc-' + s.theme + (baseTheme ? ' mbsc-' + baseTheme : '') + (s.rtl ? ' mbsc-rtl' : ' mbsc-ltr');
}

export class FormControl {
    constructor(elm, settings) {
        const s = extend({}, defaults, mobiscroll.settings, settings);
        const $elm = $(elm);
        const $p = $elm.parent();
        const $parent = $p.hasClass('mbsc-input-wrap') ? $p.parent() : $p;
        // Check for inline mobiscroll components
        const $frame = $elm.next().hasClass('mbsc-fr') ? $elm.next() : null;
        const type = getControlType($elm);
        const inputStyle = getAttr($elm, 'data-input-style', s.inputStyle);
        const labelStyle = getAttr($elm, 'data-label-style', s.labelStyle);

        if (elm.mbscInst) {
            elm.mbscInst.destroy();
        }

        if ($frame) {
            $frame.insertAfter($parent);
        }

        s.theme = getThemeName(s);

        if (s.rtl === undefined && s.lang && mobiscroll.i18n[s.lang]) {
            s.rtl = mobiscroll.i18n[s.lang].rtl;
        }

        wrapLabel($parent, type, inputStyle, labelStyle, elm);

        $elm.addClass('mbsc-control');

        // Attach events
        this._handle = this._handle.bind(this);
        // Prevent 300ms click latency
        events.forEach(ev => {
            $elm.on(ev, this._handle);
        });

        this.settings = s;

        this._type = type;
        this._elm = elm;
        this._$elm = $elm;
        this._$parent = $parent;
        this._$frame = $frame;
        this._ripple = getRipple(s.theme);
        this._isFloating = labelStyle == 'floating' || $parent.hasClass('mbsc-label-floating');

        this.cssClass = getCssClass(s);
        this.getClassElm().addClass(this.cssClass);

        elm.mbscInst = this;
    }

    getClassElm() {
        return this._$parent;
    }

    destroy() {
        this._$elm.removeClass('mbsc-control');
        this.getClassElm().removeClass(this.cssClass);
        events.forEach(ev => {
            this._$elm.off(ev, this._handle);
        });
        delete this._elm.mbscInst;
    }

    option(s) {
        extend(this.settings, s);

        const classElm = this.getClassElm();

        if (this.cssClass) {
            classElm.removeClass(this.cssClass);
        }

        this.cssClass = getCssClass(this.settings);
        classElm.addClass(this.cssClass);
        this._ripple = getRipple(this.settings.theme);
    }

    _handle(ev) {
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
                break;
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
            }
        }

        if (ev.type == 'touchstart') {
            this._$elm.closest('.mbsc-no-touch').removeClass('mbsc-no-touch');
        }
    }

    _onMove(ev) {
        // If movement is more than 9px, don't fire the click event handler
        if (this._isActive && Math.abs(getCoord(ev, 'X') - this._startX) > 9 || Math.abs(getCoord(ev, 'Y') - this._startY) > 9) {
            this._$elm.removeClass('mbsc-active');
            this._removeRipple();
            this._isActive = false;
        }
    }

    _onEnd(ev) {
        const control = this._elm;
        const type = this._type;

        if (this._isActive && this.settings.tap && ev.type == 'touchend' && !control.readOnly) {
            activateControl(control, type, ev);
        }

        if (this._isActive) {
            setTimeout(() => {
                this._$elm.removeClass('mbsc-active');
                this._removeRipple();
            }, 100);
        }

        this._isActive = false;

        $active = null;
    }
}

mobiscroll.themes.form.mobiscroll = {};

export {
    addIcon,
    addIconToggle,
    getCssClass,
    wrapLabel
};
