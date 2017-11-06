import mobiscroll, { $, Base } from '../core/core';
import { getCoord } from '../util/tap';
import { testTouch } from '../util/dom';

const Stepper = function (control, settings) {
    var $btn,
        $btnPlus,
        $btnMinus,
        $controls,
        action,
        changed,
        diffX,
        diffY,
        displayValue,
        eX,
        eY,
        interval,
        max,
        min,
        ripple,
        step,
        s,
        sX,
        sY,
        theme,
        val,
        that = this,
        $control = $(control),
        ready,
        $parent,
        old = val;

    function onKeyDown(ev) {
        if (ev.keyCode == 32) {
            ev.preventDefault();
            if (!action && !control.disabled) {
                $btn = $(this).addClass('mbsc-active');
                updateStepper(ev);
            }
        }
    }

    function onKeyUp(ev) {
        if (action) {
            ev.preventDefault();
            stopStepper(true);
        }
    }

    function onStart(ev) {
        if (testTouch(ev, this) && !control.disabled /* TRIALCOND */ ) {

            $btn = $(this).addClass('mbsc-active').trigger('focus');

            if (ripple && !$btn.hasClass('mbsc-step-disabled')) {
                ripple.addRipple($btn.find('.mbsc-segmented-content'), ev);
                // form.trigger('onControlActivate', {
                //     target: $btn[0],
                //     domEvent: ev
                // });
            }

            updateStepper(ev);

            if (ev.type === 'mousedown') {
                $(document)
                    .on('mousemove', onMove)
                    .on('mouseup', onEnd);
            }
        }
    }

    function onEnd(ev) {
        if (action) {

            ev.preventDefault();

            stopStepper(true, ev);

            if (ev.type === 'mouseup') {
                $(document)
                    .off('mousemove', onMove)
                    .off('mouseup', onEnd);
            }
        }
    }

    function onMove(ev) {
        if (action) {
            eX = getCoord(ev, 'X');
            eY = getCoord(ev, 'Y');
            diffX = eX - sX;
            diffY = eY - sY;

            if (Math.abs(diffX) > 7 || Math.abs(diffY) > 7) {
                stopStepper();
            }
        }
    }

    function onChange() {
        var v;

        if (!control.disabled) {
            v = parseFloat($(this).val());
            moveStepper(isNaN(v) ? val : v);
        }
    }

    function moveStepper(v, fill, change) {

        old = val;

        if (fill === undefined) {
            fill = true;
        }

        if (change === undefined) {
            change = fill;
        }

        if (v !== undefined) {
            val = Math.min(max, Math.max(Math.round(v / step) * step, min));
        } else {
            val = Math.min(max, Math.max(val + ($btn.hasClass('mbsc-stepper-minus') ? -step : step), min));
        }

        changed = true;

        $controls.removeClass('mbsc-step-disabled');

        if (fill) {
            $control.val(val);
        }

        if (val == min) {
            $btnMinus.addClass('mbsc-step-disabled');
        } else if (val == max) {
            $btnPlus.addClass('mbsc-step-disabled');
        }

        if (val !== old && change) {
            $control.trigger('change');
        }
    }

    function updateStepper(ev) {
        if (!action) {

            action = true;
            changed = false;

            sX = getCoord(ev, 'X');
            sY = getCoord(ev, 'Y');

            clearInterval(interval);
            clearTimeout(interval);

            interval = setTimeout(function () {
                moveStepper();
                interval = setInterval(function () {
                    moveStepper();
                }, 150);
            }, 300);

        }
    }

    function stopStepper(change) {
        clearInterval(interval);
        clearTimeout(interval);

        if (!changed && change) {
            moveStepper();
        }

        action = false;
        changed = false;

        $btn.removeClass('mbsc-active');

        if (ripple) {
            setTimeout(function () {
                ripple.removeRipple();
                // form.trigger('onControlDeactivate', {
                //     target: $btn[0],
                //     domEvent: ev
                // });
            }, 100);
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
        moveStepper(isNaN(v) ? val : v, fill, change);
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
                .append('<span class="mbsc-segmented-item mbsc-stepper-control mbsc-stepper-minus ' + (val == min ? 'mbsc-step-disabled' : '') + '"  tabindex="0"><span class="mbsc-segmented-content"><span class="mbsc-ic mbsc-ic-minus"></span></span></span>')
                .append('<span class="mbsc-segmented-item mbsc-stepper-control mbsc-stepper-plus ' + (val == max ? 'mbsc-step-disabled' : '') + '"  tabindex="0"><span class="mbsc-segmented-content"> <span class="mbsc-ic mbsc-ic-plus"></span> </span></span>')
                .prepend($control);
        }

        $btnMinus = $('.mbsc-stepper-minus', $parent);
        $btnPlus = $('.mbsc-stepper-plus', $parent);

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

        $control
            .val(val)
            .attr('data-role', 'stepper')
            .attr('min', min)
            .attr('max', max)
            .attr('step', step)
            .on('change', onChange);

        $controls = $('.mbsc-stepper-control', $parent)
            .on('keydown', onKeyDown)
            .on('keyup', onKeyUp)
            .on('mousedown touchstart', onStart)
            .on('touchmove', onMove)
            .on('touchend touchcancel', onEnd);

        $control.addClass('mbsc-stepper-ready mbsc-control');

        /* TRIAL */
    };

    that._destroy = function () {
        $control.removeClass('mbsc-control').off('change', onChange);

        $controls
            .off('keydown', onKeyDown)
            .off('keyup', onKeyUp)
            .off('mousedown touchstart', onStart)
            .off('touchmove', onMove)
            .off('touchend touchcancel', onEnd);
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

mobiscroll.classes.Stepper = Stepper;

mobiscroll.presetShort('stepper', 'Stepper');

export default Stepper;
