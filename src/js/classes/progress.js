import mobiscroll, {
    $
} from '../core/core';
import ProgressBase from './progress-base';
import {
    addIcon,
    wrapLabel
} from '../util/forms';

const Progress = function (elm, settings, inherit) {
    var $display,
        $elm,
        $parent,
        $progress,
        $target,
        $track,
        min,
        max,
        s,
        template,
        value,
        valueText,
        that = this;

    function onChange() {
        var v = getAttr('value', min);
        if (v !== value) {
            updateValue(v);
        }
    }

    function getAttr(attr, def) {
        var v = $elm.attr(attr);
        return v === undefined || v === '' ? def : +v;
    }

    function updateValue(v, refresh, fill, change) {
        v = /* TRIALCONDREV */ Math.min(max, Math.max(v, min));

        $progress.css('width', (v - min) * 100 / (max - min) + '%');

        if (fill === undefined) {
            fill = true;
        }

        if (change === undefined) {
            change = fill;
        }


        if (v !== value || refresh) {
            // Display value
            that._display(v);
        }

        if (v !== value) {
            // Set new value
            value = v;

            // Put new value in the progress element
            if (fill) {
                $elm.attr('value', value);
            }

            // Trigger change on the element
            if (change) {
                $elm.trigger('change');
            }
        }
    }

    // Call the parent constructor
    ProgressBase.call(this, elm, settings, true);

    that._display = function (v) {
        valueText = template && s.returnAffix ? template.replace(/\{value\}/, v).replace(/\{max\}/, max) : v;

        if ($target) {
            $target.html(valueText);
        }

        if ($display) {
            $display.html(valueText);
        }
    };

    that._attachChange = function () {
        $elm.on('change', onChange);
    };

    that.__init = function (ss) {

        var displayValue,
            i,
            stepLabels,
            wasInit;

        s = that.settings;

        $elm = $(elm);

        // Check if the element was already initialized
        wasInit = !!$parent;

        $parent = that._$parent;

        // Read settings from data attributes or settings object
        min = that._min = ss.min === undefined ? getAttr('min', s.min) : ss.min;
        max = that._max = ss.max === undefined ? getAttr('max', s.max) : ss.max;
        value = getAttr('value', min);
        displayValue = $elm.attr('data-val') || s.val;
        stepLabels = $elm.attr('data-step-labels');
        stepLabels = stepLabels ? JSON.parse(stepLabels) : s.stepLabels;
        template = $elm.attr('data-template') || (max == 100 && !s.template ? '{value}%' : s.template);

        if (!wasInit) {
            wrapLabel($parent);

            addIcon($elm);

            // Generate track and progress
            $parent
                .find('.mbsc-input-wrap')
                .append('<span class="mbsc-progress-cont"><span class="mbsc-progress-track mbsc-progress-anim"><span class="mbsc-progress-bar"></span></span></span>');

            $progress = that._$progress = $parent.find('.mbsc-progress-bar');
            $track = that._$track = $parent.find('.mbsc-progress-track');
        } else {
            if (displayValue) {
                $display.remove();
                $parent.removeClass('mbsc-progress-value-' + (displayValue == 'right' ? 'right' : 'left'));
            }

            if (stepLabels) {
                $('.mbsc-progress-step-label', $track).remove();
            }
        }

        // Set attributes
        $elm
            .attr('min', min)
            .attr('max', max);

        // Generate value container on left or right side
        if (displayValue) {
            $display = $('<span class="mbsc-progress-value"></span>');
            $parent
                .addClass('mbsc-progress-value-' + (displayValue == 'right' ? 'right' : 'left'))
                .find('.mbsc-input-wrap')
                .append($display);
        }

        // Generate step labels
        if (stepLabels) {
            for (i = 0; i < stepLabels.length; ++i) {
                $track.append('<span class="mbsc-progress-step-label" style="' + (s.rtl ? 'right' : 'left') + ': ' + (((stepLabels[i] - min) * 100) / (max - min)) + '%" >' + stepLabels[i] + '</span>');
            }
        }

        $target = $($elm.attr('data-target') || s.target);
    };

    that.__destroy = function () {

        $parent
            .removeClass('mbsc-ic-left mbsc-ic-right')
            .find('.mbsc-progress-cont')
            .remove();

        $parent
            .find('.mbsc-input-ic')
            .remove();

        $elm
            .off('change', onChange);
    };

    that.refresh = function () {
        updateValue(getAttr('value', min), true, false);
    };

    that.getVal = function () {
        return value;
    };

    that.setVal = function (v, fill, change) {
        updateValue(v, true, fill, change);
    };

    if (!inherit) {
        that.init(settings);
    }
};

Progress.prototype = {
    _class: 'progress',
    _css: 'mbsc-progress',
    _hasTheme: true,
    _hasLang: true,
    _hasDef: true,
    _defaults: {
        min: 0,
        max: 100,
        returnAffix: true
    }
};

mobiscroll.classes.Progress = Progress;

mobiscroll.presetShort('progress', 'Progress');

export default Progress;
