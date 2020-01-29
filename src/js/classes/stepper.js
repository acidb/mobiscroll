import { $, Base, mobiscroll, classes, autoInit } from '../core/core';
import { createStepper } from '../util/stepper';

export const Stepper = function (control, settings) {
    var $btnPlus,
        $btnMinus,
        $controls,
        cssClass = '',
        displayValue,
        max,
        min,
        inputStyle,
        ripple,
        scale,
        step,
        stepper,
        s,
        theme,
        val,
        that = this,
        $control = $(control),
        ready,
        $parent,
        old = val;

    function onChange() {
        var v;

        if (!control.disabled) {
            v = parseFloat($(this).val());
            setValue(isNaN(v) ? val : v);
        }
    }

    function checkDisabled() {
        return control.disabled;
    }

    function stepValue(index, dir) {
        setValue(val + dir * step);
    }

    function setValue(v, fill, change) {

        old = val;

        if (fill === undefined) {
            fill = true;
        }

        if (change === undefined) {
            change = fill;
        }

        val = round(v);

        $controls.removeClass('mbsc-disabled');

        if (fill) {
            $control.val(val);
        }

        if (val == min) {
            $btnMinus.addClass('mbsc-disabled');
        } else if (val == max) {
            $btnPlus.addClass('mbsc-disabled');
        }

        if (val !== old && change) {
            $control.trigger('change');
        }
    }

    function getAttr(attr, def, str) {
        var v = $control.attr(attr);
        return v === undefined || v === '' ? def : (str ? v : +v);
    }

    function round(v) {
        return +Math.min(max, Math.max(Math.round(v / step) * step, min)).toFixed(scale);
    }

    // Call the parent constructor
    Base.call(this, control, settings, true);

    /* TRIALFUNC */

    that.getVal = function () {
        var v = parseFloat($control.val());
        v = isNaN(v) ? val : v;
        return round(v);
    };

    that.setVal = function (v, fill, change) {
        v = parseFloat(v);
        setValue(isNaN(v) ? val : v, fill, change);
    };

    that._init = function () {
        ready = $control.parent().hasClass('mbsc-stepper');
        $parent = ready ? $control.closest('.mbsc-stepper-cont') : $control.parent();

        s = that.settings;

        min = settings.min === undefined ? getAttr('min', s.min) : settings.min;
        max = settings.max === undefined ? getAttr('max', s.max) : settings.max;
        step = settings.step === undefined ? getAttr('step', s.step) : settings.step;
        scale = Math.abs(step) < 1 ? (step + '').split('.')[1].length : 0;
        inputStyle = settings.inputStyle === undefined ? getAttr('data-input-style', s.inputStyle, true) : settings.inputStyle;
        displayValue = $control.attr('data-val') || s.val;
        val = round(+control.value || 0);

        theme = mobiscroll.themes.form[s.theme];
        ripple = theme && theme.addRipple ? theme : null;

        if (!ready) {
            $parent
                .addClass('mbsc-stepper-cont mbsc-no-touch mbsc-control-w')
                .addClass(inputStyle == 'box' ? 'mbsc-input-box' : '')
                .addClass(inputStyle == 'outline' ? 'mbsc-input-outline' : '')
                .append('<span class="mbsc-segmented mbsc-stepper' + '"></span>')
                .find('.mbsc-stepper')
                .append('<span class="mbsc-segmented-item mbsc-stepper-control mbsc-stepper-minus ' + (val == min ? 'mbsc-disabled' : '') + '" data-step="-1" tabindex="0"><span class="mbsc-segmented-content"><span class="mbsc-ic mbsc-ic-minus"></span></span></span>')
                .append('<span class="mbsc-segmented-item mbsc-stepper-control mbsc-stepper-plus ' + (val == max ? 'mbsc-disabled' : '') + '"  data-step="1" tabindex="0"><span class="mbsc-segmented-content"> <span class="mbsc-ic mbsc-ic-plus"></span></span></span>')
                .prepend($control);
        }

        if (cssClass) {
            $parent
                .removeClass(cssClass)
                .find('.mbsc-segmented').removeClass(cssClass);
        }

        cssClass = 'mbsc-' + s.theme + (theme.baseTheme ? ' mbsc-' + theme.baseTheme : '') + (s.rtl ? ' mbsc-rtl' : ' mbsc-ltr');

        $parent
            .addClass(cssClass)
            .find('.mbsc-segmented').addClass(cssClass);

        $btnMinus = $('.mbsc-stepper-minus', $parent);
        $btnPlus = $('.mbsc-stepper-plus', $parent);
        $controls = $('.mbsc-stepper-control', $parent);

        if (!ready) {
            if (displayValue == 'left') {
                $parent.addClass('mbsc-stepper-val-left');
                $control.after('<span class="mbsc-segmented-item"><span class="mbsc-segmented-content"></span></span>');
            } else if (displayValue == 'right') {
                $parent.addClass('mbsc-stepper-val-right');
                $btnPlus.after('<span class="mbsc-segmented-item"><span class="mbsc-segmented-content"></span></span>');
            } else {
                $btnMinus.after('<span class="mbsc-segmented-item"><span class="mbsc-segmented-content mbsc-stepper-val"></span></span>');
            }
        }

        if (!stepper) {
            $control.on('change', onChange);
            stepper = createStepper($controls, stepValue, 150, checkDisabled, false, ripple);
        }

        $control
            .val(val)
            .attr('data-role', 'stepper')
            .attr('min', min)
            .attr('max', max)
            .attr('step', step)
            .addClass('mbsc-control');

        control.mbscInst = that;
    };

    that._destroy = function () {
        $control.removeClass('mbsc-control').off('change', onChange);
        stepper.destroy();
        delete control.mbscInst;
    };

    that.init();

};

Stepper.prototype = {
    _class: 'stepper',
    _hasDef: true,
    _hasTheme: true,
    _hasLang: true,
    _defaults: {
        min: 0,
        max: 100,
        step: 1
    }
};

classes.Stepper = Stepper;

// Init mbsc-stepper elements on page load
autoInit('[mbsc-stepper]', Stepper);
