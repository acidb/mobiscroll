import mobiscroll, {
    $
} from '../core/core';
import Progress from './progress';
import SliderBase from './slider-base';

const Slider = function (elm, settings, inherit) {
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

    function getPercent(v) {
        return (v - min) * 100 / (max - min);
    }

    function getBoolAttr(attr, def) {
        var v = $elm.attr(attr);
        return v === undefined || v === '' ? def : v === 'true';
    }

    // Call the parent constructor
    Progress.call(this, elm, settings, true);

    var progressInit = that.__init,
        progressDestroy = that.__destroy;

    SliderBase.call(this, elm, settings, true);

    var sliderInit = that.__init,
        sliderDestroy = that.__destroy;

    // ---

    that.__init = function (ss) {
        progressInit(ss);
        sliderInit(ss);
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
                    width: getPercent(value[1]) - getPercent(v) + '%',
                    left: isRtl ? 'auto' : getPercent(v) + '%',
                    right: isRtl ? getPercent(v) + '%' : 'auto'
                });
            } else {
                v = Math.max(v, value[0]);
                $progress.css({
                    width: getPercent(v) - getPercent(value[0]) + '%'
                });
            }
        } else if (multiple || !hasProgress) {
            $handleCont.css({
                left: isRtl ? 'auto' : (percent || getPercent(v)) + '%',
                right: isRtl ? (percent || getPercent(v)) + '%' : 'auto'
            });
        } else {
            $progress.css('width', (percent || getPercent(v)) + '%');
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

    that.___init = function (ss) {
        var i,
            stepNr;

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
        that._step = step = ss.step === undefined ? +$elm.attr('step') || s.step : ss.step;
        that._live = getBoolAttr('data-live', s.live);
        hasTooltip = getBoolAttr('data-tooltip', s.tooltip);
        hasProgress = getBoolAttr('data-highlight', s.highlight) && $elm.length < 3;
        isRange = hasProgress && $elm.length == 2;
        isRtl = s.rtl;

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

    if (!inherit) {
        that.init(settings);
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

mobiscroll.classes.Slider = Slider;

mobiscroll.presetShort('slider', 'Slider');

export default Slider;
