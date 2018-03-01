import { $ } from '../core/core';
import { getCoord, preventClick } from '../util/tap';
import { testTouch } from '../util/dom';
import { noop, getPercent } from '../util/misc';
import { ProgressBase } from './progress-base';

export const SliderBase = function (elm, settings, inherit) {
    var $elm,
        $handle,
        $handleCont,
        $handles,
        $listener,
        $parent,
        $track,
        action,
        base,
        changed,
        diffX,
        diffY,
        diff,
        endX,
        endY,
        handleIndex,
        isHover,
        isPressed,
        isRtl,
        live,
        max,
        min,
        moved,
        multiple,
        oldValue,
        step,
        s,
        scale,
        startX,
        startY,
        stepDecimal,
        timer,
        totalWidth,
        value,
        that = this,
        lastUpdate = new Date();

    function onStart(ev) {
        if (ev.type === 'mousedown') {
            ev.preventDefault();
        }

        if (testTouch(ev, this) && (!action || isHover) && !elm.disabled && !elm.readOnly /* TRIALCOND */ ) {
            if (s.stopProp) {
                ev.stopPropagation();
            }

            action = true;
            moved = false;
            changed = false;
            startX = getCoord(ev, 'X');
            startY = getCoord(ev, 'Y');
            endX = startX;

            $track.removeClass('mbsc-progress-anim');
            $handle = multiple ? $('.mbsc-slider-handle', this) : $handles;

            if ($handleCont) {
                $handleCont.removeClass('mbsc-handle-curr');
            }

            $handleCont = $handle.parent().addClass('mbsc-active mbsc-handle-curr');
            $elm.addClass('mbsc-active');

            handleIndex = +$handle.attr('data-index');
            totalWidth = $track[0].offsetWidth;
            diff = $track[0].getBoundingClientRect().left;

            if (ev.type === 'mousedown') {
                isPressed = true;
                $(document).on('mousemove', onMove).on('mouseup', onEnd);
            }

            if (ev.type === 'mouseenter') {
                isHover = true;
                $(document).on('mousemove', onMove);
            }
        }
    }

    function onMove(ev) {
        if (action) {
            endX = getCoord(ev, 'X');
            endY = getCoord(ev, 'Y');
            diffX = endX - startX;
            diffY = endY - startY;

            if (Math.abs(diffX) > 5) {
                moved = true;
            }

            if (moved || isPressed || isHover) {
                if (Math.abs(lastUpdate - new Date()) > 50) {
                    lastUpdate = new Date();
                    updateSlider(endX, s.round, live && (!isHover || isPressed));
                }
            }

            if (moved) {
                ev.preventDefault();
            } else if (Math.abs(diffY) > 7 && ev.type == 'touchmove') {
                cleanUp(ev);
            }
        }
    }

    function onEnd(ev) {
        if (action) {
            ev.preventDefault();

            if (!multiple) {
                $track.addClass('mbsc-progress-anim');
            }

            if (isHover && !isPressed) {
                updateValue(value[handleIndex], handleIndex, false, false, true);
            } else {
                updateSlider(endX, true, true);
            }

            if (!moved && !changed) {

                if (ev.type == 'touchend') {
                    // Prevent ghost click
                    preventClick();
                }

                that._onTap(value[handleIndex]);
            }

            if (ev.type == 'mouseup') {
                isPressed = false;
            }

            if (ev.type == 'mouseleave') {
                isHover = false;
            }

            if (!isHover) {
                cleanUp();
            }
        }
    }

    function onCancel() {
        if (action) {
            cleanUp();
        }
    }

    function onChange() {
        var v = that._readValue($(this)),
            i = +$(this).attr('data-index');

        if (v !== value[i]) {
            value[i] = v;
            oldValue[i] = v;
            updateValue(v, i);
        }
    }

    function onClick(ev) {
        // Prevent propagating click to label
        ev.stopPropagation();
    }

    function onLabelClick(ev) {
        // Prevent change on label click for swithes
        ev.preventDefault();
    }

    function onKeyDown(ev) {
        var dir;

        if (!elm.disabled) {

            switch (ev.keyCode) {
                case 38:
                case 39:
                    dir = 1;
                    break;
                case 40:
                case 37:
                    dir = -1;
                    break;
            }

            if (dir) {
                ev.preventDefault();

                if (!timer) {

                    handleIndex = +$(this).attr('data-index');

                    updateValue(value[handleIndex] + step * dir, handleIndex, true);

                    timer = setInterval(function () {
                        updateValue(value[handleIndex] + step * dir, handleIndex, true);
                    }, 200);
                }
            }
        }
    }

    function onKeyUp(ev) {
        ev.preventDefault();
        clearInterval(timer);
        timer = null;
    }

    function cleanUp() {
        action = false;
        $handleCont.removeClass('mbsc-active');
        $elm.removeClass('mbsc-active');

        // Detach document events
        $(document).off('mousemove', onMove).off('mouseup', onEnd);
    }

    function updateSlider(pos, round, fill) {
        var percent = round ?
            Math.min((Math[that._rounding || 'round']((Math.max((pos - diff) * 100 / totalWidth, 0) / scale) / step) * step) * 100 / (max - min + base), 100) :
            Math.max(0, Math.min((pos - diff) * 100 / totalWidth, 100));

        if (isRtl) {
            percent = 100 - percent;
        }

        updateValue(Math.round((min - base + percent / scale) * stepDecimal) / stepDecimal, handleIndex, fill, percent);
    }

    function updateValue(v, index, fill, percent, refresh, change) {
        var $handle = $handles.eq(index),
            $handleCont = $handle.parent();

        v = Math.min(max, Math.max(v, min));

        if (change === undefined) {
            change = fill;
        }

        if (that._update) {
            v = that._update(v, value, index, percent, multiple, refresh, $handleCont);
        } else {
            $handleCont.css({
                left: isRtl ? 'auto' : (percent || getPercent(v, min, max)) + '%',
                right: isRtl ? (percent || getPercent(v, min, max)) + '%' : 'auto'
            });
        }

        if (v > min) {
            $handleCont.removeClass('mbsc-slider-start');
        } else if (value[index] > min || refresh) {
            $handleCont.addClass('mbsc-slider-start');
        }

        // Check if value changed
        if (fill && oldValue[index] != v) {
            changed = true;

            oldValue[index] = v;

            // Store new value
            value[index] = v;

            // Set new value to the input
            that._fillValue(v, index, change);
        }

        $handle.attr('aria-valuenow', v);
    }

    // Call the parent constructor
    ProgressBase.call(this, elm, settings, true);

    that._onTap = noop;

    that.___init = noop;

    that.___destroy = noop;

    that._attachChange = function () {
        $elm.on(s.changeEvent, onChange);
    };

    that.__init = function (ss) {
        var wasInit;

        if ($handles) {
            wasInit = true;
            $handles.parent().remove();
        }

        that.___init(ss);

        $parent = that._$parent;
        $track = that._$track;
        $elm = $parent.find('input');

        s = that.settings;
        min = that._min;
        max = that._max;
        base = that._base || 0;
        step = that._step;
        live = that._live;
        stepDecimal = step % 1 !== 0 ? (100 / (+(step % 1).toFixed(2) * 100)) : 1;
        scale = 100 / (max - min + base) || 100;
        multiple = $elm.length > 1;
        isRtl = s.rtl;
        value = [];
        oldValue = [];

        // Read values
        $elm.each(function (i) {
            value[i] = that._readValue($(this));
            $(this).attr('data-index', i);
        });

        $handles = $parent.find('.mbsc-slider-handle');
        $listener = $parent.find(multiple ? '.mbsc-slider-handle-cont' : '.mbsc-progress-cont');

        // Attach events
        $handles
            .on('keydown', onKeyDown)
            .on('keyup', onKeyUp)
            .on('blur', onKeyUp);

        $listener
            .on('touchstart mousedown' + (s.hover ? ' mouseenter' : ''), onStart)
            .on('touchmove', onMove)
            .on('touchend touchcancel' + (s.hover ? ' mouseleave' : ''), onEnd)
            .on('pointercancel', onCancel);

        if (!wasInit) {
            $elm
                .on('click', onClick);

            $parent
                .on('click', onLabelClick);
        }

    };

    that.__destroy = function () {
        $parent
            .off('click', onLabelClick);

        $elm
            .off(s.changeEvent, onChange)
            .off('click', onClick);

        $handles
            .off('keydown', onKeyDown)
            .off('keyup', onKeyUp)
            .off('blur', onKeyUp);

        $listener
            .off('touchstart mousedown mouseenter', onStart)
            .off('touchmove', onMove)
            .off('touchend touchcancel mouseleave', onEnd)
            .off('pointercancel', onCancel);

        that.___destroy();
    };

    that.refresh = function () {
        $elm.each(function (i) {
            updateValue(that._readValue($(this)), i, true, false, true, false);
        });
    };

    that.getVal = function () {
        return multiple ? value.slice(0) : value[0];
    };

    that.setVal = that._setVal = function (val, fill, change) {
        if (!$.isArray(val)) {
            val = [val];
        }

        $.each(val, function (i, v) {
            value[i] = v;
        });

        $.each(val, function (i, v) {
            updateValue(v, i, true, false, true, change);
        });
    };

    if (!inherit) {
        that.init(settings);
    }

};
