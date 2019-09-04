import { $, classes, autoInit } from '../core/core';
import { getPercent } from '../util/misc';
import { Slider } from './slider';

export const Rating = function (elm, settings, inherit) {
    var $progress,
        $track,
        max,
        min,
        empty,
        filled,
        s,
        that = this,
        $elm = $(elm);

    // Call the parent constructor
    Slider.call(this, elm, settings, true);

    that._update = function (v, value, index, percent, multiple, refresh) {
        $progress.css('width', getPercent(v, 0, max) + '%');

        // Display value in the specified container(s)
        if (!multiple && (value[index] != v || refresh)) {
            that._display(v);
        }

        // Return validated value
        return v;
    };

    that._markupReady = function () {
        var i,
            emptyString = '',
            filledString = '';

        $track = that._$track;
        $progress = that._$progress;

        s = that.settings;
        min = that._min;
        max = that._max;
        that._base = min;
        that._rounding = s.rtl ? 'floor' : 'ceil';
        empty = $elm.attr('data-empty') || s.empty;
        filled = $elm.attr('data-filled') || s.filled;

        for (i = 0; i < max; ++i) {
            emptyString += '<span class="mbsc-ic mbsc-ic-' + empty + '"></span>';
            filledString += '<span class="mbsc-ic mbsc-ic-' + filled + '"></span>';
        }

        $track.html(emptyString);
        $track.append($progress);
        $progress.html(filledString);

        $track.append(
            '<span class="mbsc-rating-handle-cont' + '">' +
            '<span tabindex="0" class="mbsc-slider-handle" aria-valuemin="' + min + '" aria-valuemax="' + max + '" data-index="0"></span>' +
            '</span>'
        );
    };

    if (!inherit) {
        that.init();
    }

};

Rating.prototype = {
    _class: 'progress',
    _css: 'mbsc-progress mbsc-rating',
    _hasTheme: true,
    _hasLang: true,
    _hasDef: true,
    _defaults: {
        changeEvent: 'change',
        stopProp: true,
        min: 1,
        max: 5,
        step: 1,
        live: true,
        round: true,
        hover: true,
        highlight: true,
        returnAffix: true,
        empty: 'star',
        filled: 'star3'
    }
};

classes.Rating = Rating;

// Init mbsc-rating elements on page load
autoInit('[mbsc-rating]', Rating);