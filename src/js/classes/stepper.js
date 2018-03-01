import { $, Base, mobiscroll, classes } from '../core/core';
import { createStepper } from '../util/stepper';

export const Stepper = function (control, settings) {
    var $btnPlus,
        $btnMinus,
        $controls,
        displayValue,
        max,
        min,
        ripple,
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

        val = Math.min(max, Math.max(Math.round(v / step) * step, min));

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

    function getAttr(attr, def) {
        var v = $control.attr(attr);
        return v === undefined || v === '' ? def : +v;
    }

    // Call the parent constructor
    Base.call(this, control, settings, true);

    /* TRIALFUNC */

    that.getVal = function () {
        var v = parseFloat($control.val());
        v = isNaN(v) ? val : v;
        return Math.min(max, Math.max(Math.round(v / step) * step, min));
    };

    that.setVal = function (v, fill, change) {
        v = parseFloat(v);
        setValue(isNaN(v) ? val : v, fill, change);
    };

    that._init = function (ss) {
        ready = $control.parent().hasClass('mbsc-stepper');
        $parent = ready ? $control.closest('.mbsc-stepper-cont') : $control.parent();

        s = that.settings;

        min = ss.min === undefined ? getAttr('min', s.min) : ss.min;
        max = ss.max === undefined ? getAttr('max', s.max) : ss.max;
        step = ss.step === undefined ? getAttr('step', s.step) : ss.step;
        displayValue = $control.attr('data-val') || s.val;
        val = Math.min(max, Math.max(Math.round(+control.value / step) * step || 0, min));

        theme = mobiscroll.themes.form[s.theme];
        ripple = theme && theme.addRipple ? theme : null;

        if (!ready) {
            $parent
                .addClass('mbsc-stepper-cont mbsc-control-w')
                .append('<span class="mbsc-segmented mbsc-stepper"></span>')
                .find('.mbsc-stepper')
                .append('<span class="mbsc-segmented-item mbsc-stepper-control mbsc-stepper-minus ' + (val == min ? 'mbsc-disabled' : '') + '" data-step="-1" tabindex="0"><span class="mbsc-segmented-content"><span class="mbsc-ic mbsc-ic-minus"></span></span></span>')
                .append('<span class="mbsc-segmented-item mbsc-stepper-control mbsc-stepper-plus ' + (val == max ? 'mbsc-disabled' : '') + '"  data-step="1" tabindex="0"><span class="mbsc-segmented-content"> <span class="mbsc-ic mbsc-ic-plus"></span></span></span>')
                .prepend($control);
        }

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

    that.init(settings);

};

Stepper.prototype = {
    _class: 'stepper',
    _hasDef: true,
    _defaults: {
        min: 0,
        max: 100,
        step: 1
    }
};

classes.Stepper = Stepper;
