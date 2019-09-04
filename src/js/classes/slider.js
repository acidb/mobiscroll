import { $, classes, autoInit } from '../core/core';
import { Progress } from './progress';
import { SliderBase } from './slider-base';
import { getPercent, getBoolAttr } from '../util/misc';

export const Slider = function (elm, settings, inherit) {
    var $elm,
        $parent,
        $progress,
        $tooltips,
        $track,
        hasProgress,
        hasTooltip,
        isRange,
        isRtl,
        max,
        min,
        step,
        s,
        that = this;

    // Call the parent constructor
    Progress.call(this, elm, settings, true);

    var progressInit = that.__init,
        progressDestroy = that.__destroy;

    SliderBase.call(this, elm, settings, true);

    var sliderInit = that.__init,
        sliderDestroy = that.__destroy;

    // ---

    that.__init = function () {
        progressInit();
        sliderInit();
    };

    that.__destroy = function () {
        progressDestroy();
        sliderDestroy();
    };

    that._update = function (v, value, index, percent, multiple, refresh, $handleCont) {
        if (isRange) {
            if (index === 0) {
                v = Math.min(v, value[1]);
                $progress.css({
                    width: getPercent(value[1], min, max) - getPercent(v, min, max) + '%',
                    left: isRtl ? 'auto' : getPercent(v, min, max) + '%',
                    right: isRtl ? getPercent(v, min, max) + '%' : 'auto'
                });
            } else {
                v = Math.max(v, value[0]);
                $progress.css({
                    width: getPercent(v, min, max) - getPercent(value[0], min, max) + '%'
                });
            }
        } else if (multiple || !hasProgress) {
            $handleCont.css({
                left: isRtl ? 'auto' : (percent || getPercent(v, min, max)) + '%',
                right: isRtl ? (percent || getPercent(v, min, max)) + '%' : 'auto'
            });
        } else {
            $progress.css('width', (percent || getPercent(v, min, max)) + '%');
        }

        if (hasTooltip) {
            $tooltips.eq(index).html(v);
        }

        // Display value in the specified container(s)
        if (!multiple && (value[index] != v || refresh)) {
            that._display(v);
        }

        // Return validated value
        return v;
    };

    that._readValue = function ($elm) {
        return +$elm.val();
    };

    that._fillValue = function (v, index, change) {
        $elm.eq(index).val(v);

        if (change) {
            $elm.eq(index).trigger('change');
        }
    };

    that._markupReady = function () {
        var i,
            stepNr;

        if (hasTooltip) {
            $parent.addClass('mbsc-slider-has-tooltip');
        }

        // Generate step marks
        if (step != 1) {
            stepNr = (max - min) / step;
            for (i = 0; i <= stepNr; ++i) {
                $track.append('<span class="mbsc-slider-step" style="' + (isRtl ? 'right' : 'left') + ':' + (100 / stepNr * i) + '%"></span>');
            }
        }

        // Generate slider handles
        $elm.each(function (i) {
            if (this.type == 'range') {
                // Set min / max / step properties for all inputs
                $(this)
                    .attr('min', min)
                    .attr('max', max)
                    .attr('step', step);
            }

            (hasProgress ? $progress : $track).append(
                '<span class="mbsc-slider-handle-cont' + (isRange && !i ? ' mbsc-slider-handle-left' : '') + '">' +
                '<span tabindex="0" class="mbsc-slider-handle" aria-valuemin="' + min + '" aria-valuemax="' + max + '" data-index="' + i + '"></span>' +
                (hasTooltip ? '<span class="mbsc-slider-tooltip"></span>' : '') +
                '</span>'
            );
        });

        $tooltips = $parent.find('.mbsc-slider-tooltip');
    };

    that.___init = function () {
        if ($parent) {
            $parent.removeClass('mbsc-slider-has-tooltip');
            if (step != 1) {
                $('.mbsc-slider-step', $track).remove();
            }
        }

        $parent = that._$parent;
        $track = that._$track;
        $progress = that._$progress;
        $elm = $parent.find('input');

        s = that.settings;
        min = that._min;
        max = that._max;
        that._step = step = settings.step === undefined ? +$elm.attr('step') || s.step : settings.step;
        that._live = getBoolAttr('data-live', s.live, $elm);
        hasTooltip = getBoolAttr('data-tooltip', s.tooltip, $elm);
        hasProgress = getBoolAttr('data-highlight', s.highlight, $elm) && $elm.length < 3;
        isRange = hasProgress && $elm.length == 2;
        isRtl = s.rtl;

        that._markupReady();
    };

    if (!inherit) {
        that.init();
    }

};

Slider.prototype = {
    _class: 'progress',
    _css: 'mbsc-progress mbsc-slider',
    _hasTheme: true,
    _hasLang: true,
    _hasDef: true,
    _defaults: {
        changeEvent: 'change',
        stopProp: true,
        min: 0,
        max: 100,
        step: 1,
        live: true,
        highlight: true,
        round: true,
        returnAffix: true
    }
};

classes.Slider = Slider;

// Init mbsc-slider elements on page load
autoInit('[mbsc-slider]', Slider);