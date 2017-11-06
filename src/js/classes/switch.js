import mobiscroll, {
    $,
    extend
} from '../core/core';
import FormControl from './form-control';
import SliderBase from './slider-base';

const Switch = function (elm, settings) {
    var $elm,
        $parent,
        s,
        formControl,
        that = this;

    settings = settings || {};

    extend(settings, {
        changeEvent: 'click',
        round: false
    });

    // Call the parent constructor
    SliderBase.call(this, elm, settings, true);

    that._readValue = function () {
        return elm.checked ? 1 : 0;
    };

    that._fillValue = function (v, index, change) {
        $elm.prop('checked', !!v);

        if (change) {
            $elm.trigger('change');
        }
    };

    that._onTap = function (v) {
        that._setVal(v ? 0 : 1);
    };

    that.___init = function () {
        s = that.settings;
        $elm = $(elm);
        $parent = $elm.parent();

        $parent.find('.mbsc-switch-track').remove();
        $parent.prepend($elm);

        $elm.attr('data-role', 'switch').after(
            '<span class="mbsc-progress-cont mbsc-switch-track">' +
            '<span class="mbsc-progress-track mbsc-progress-anim">' +
            '<span class="mbsc-slider-handle-cont">' +
            '<span class="mbsc-slider-handle mbsc-switch-handle" data-index="0">' +
            '<span class="mbsc-switch-txt-off">' + s.offText + '</span>' +
            '<span class="mbsc-switch-txt-on">' + s.onText + '</span>' +
            '</span></span></span></span>'
        );

        if (formControl) {
            formControl.destroy();
        }

        formControl = new FormControl(elm, s);

        that._$track = $parent.find('.mbsc-progress-track');
        that._min = 0;
        that._max = 1;
        that._step = 1;
    };

    that.___destroy = function () {
        formControl.destroy();
    };

    that.getVal = function () {
        return elm.checked;
    };

    that.setVal = function (val, fill, change) {
        that._setVal(val ? 1 : 0, fill, change);
    };

    that.init(settings);
};

Switch.prototype = {
    _class: 'switch',
    _css: 'mbsc-switch',
    _hasTheme: true,
    _hasLang: true,
    _hasDef: true,
    _defaults: {
        stopProp: true,
        offText: 'Off',
        onText: 'On'
    }
};

mobiscroll.classes.Switch = Switch;

mobiscroll.presetShort('switch', 'Switch');

export default Switch;
