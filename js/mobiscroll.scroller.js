(function (window, document, undefined) {

    function getIndex(wheel, val) {
        return (wheel._array ? wheel._map[val] : wheel.getIndex(val)) || 0;
    }

    function getItem(wheel, i, def) {
        var data = wheel.data;

        if (i < wheel.min || i > wheel.max) {
            return def;
        }
        return wheel._array ?
            (wheel.circular ? $(data).get(i % wheel._length) : data[i]) :
            ($.isFunction(data) ? data(i) : '');
    }

    function getItemValue(item) {
        return $.isPlainObject(item) ? (item.value !== undefined ? item.value : item.display) : item;
    }

    function getValue(wheel, i, def) {
        return getItemValue(getItem(wheel, i, def));
    }

    var ms = mobiscroll,
        $ = ms.$,
        extend = $.extend,
        classes = ms.classes,
        util = ms.util,
        getCoord = util.getCoord,
        testTouch = util.testTouch;

    ms.presetShort('scroller', 'Scroller', false);

    classes.Scroller = function (el, settings, inherit) {
        var $markup,
            $stepBtn,
            batchSize = 20,
            selectedClass,
            showScrollArrows,
            stepTimer,
            stepRunning,
            stepSkip,
            stepBtnX,
            stepBtnY,
            tempWheelArray,
            itemHeight,
            isValidating,
            s,
            trigger,
            lines,
            wheels,
            wheelsMap,
            that = this,
            $elm = $(el);

        // Event handlers

        function onBtnStart(ev) {
            var i = $(this).attr('data-index');

            ev.stopPropagation();

            if (ev.type === 'mousedown') {
                // Prevent focus
                ev.preventDefault();
            }

            if (testTouch(ev, this) && !isReadOnly(i)) {

                $stepBtn = $(this).addClass('mbsc-sc-btn-a');

                stepBtnX = getCoord(ev, 'X');
                stepBtnY = getCoord(ev, 'Y');

                stepRunning = true;
                stepSkip = false;
                setTimeout(function () {
                    runStepper(i, $stepBtn.attr('data-dir') == 'inc' ? 1 : -1);
                }, 100);

                if (ev.type === 'mousedown') {
                    $(document)
                        .on('mousemove', onBtnMove)
                        .on('mouseup', onBtnEnd);
                }
            }
        }

        function onBtnMove(ev) {
            if (Math.abs(stepBtnX - getCoord(ev, 'X')) > 7 || Math.abs(stepBtnY - getCoord(ev, 'Y')) > 7) {
                stopStepper(true);
            }
        }

        function onBtnEnd(ev) {
            stopStepper();

            // Prevent scroll on double tap on iOS
            ev.preventDefault();

            if (ev.type === 'mouseup') {
                $(document)
                    .off('mousemove', onBtnMove)
                    .off('mouseup', onBtnEnd);
            }
        }

        function onKeyDown(ev) {
            var i = $(this).attr('data-index'),
                handle,
                direction;

            if (ev.keyCode == 38) { // Up
                handle = true;
                direction = -1;
            } else if (ev.keyCode == 40) { // Down
                handle = true;
                direction = 1;
            } else if (ev.keyCode == 32) { // Space
                handle = true;
                toggleItem(i);
            }

            if (handle) {
                ev.stopPropagation();
                ev.preventDefault();

                if (direction && !stepRunning) {
                    stepRunning = true;
                    stepSkip = false;
                    runStepper(i, direction);
                }
            }
        }

        function onKeyUp() {
            stopStepper();
        }

        // Private functions

        function toggleItem(i, $selected) {
            var wheel = wheels[i],
                $item = $selected || wheel._$markup.find('.mbsc-sc-itm[data-val="' + tempWheelArray[i] + '"]'),
                idx = +$item.attr('data-index'),
                val = getValue(wheel, idx),
                selected = that._tempSelected[i],
                maxSelect = util.isNumeric(wheel.multiple) ? wheel.multiple : Infinity;

            if (wheel.multiple && !wheel._disabled[val]) {
                if (selected[val] !== undefined) {
                    $item.removeClass(selectedClass).removeAttr('aria-selected');
                    delete selected[val];
                } else if (util.objectToArray(selected).length < maxSelect) {
                    $item.addClass(selectedClass).attr('aria-selected', 'true');
                    selected[val] = val;
                }
                return true;
            }
        }

        function runStepper(index, direction) {
            if (!stepSkip) {
                step(index, direction);
            }

            if (stepRunning) {
                clearInterval(stepTimer);
                stepTimer = setInterval(function () {
                    step(index, direction);
                }, s.delay);
            }
        }

        function stopStepper(skip) {
            clearInterval(stepTimer);
            stepSkip = skip;
            stepRunning = false;

            if ($stepBtn) {
                $stepBtn.removeClass('mbsc-sc-btn-a');
            }
        }

        function step(index, direction) {
            var wheel = wheels[index];
            setWheelValue(wheel, index, wheel._current + direction, 200, direction == 1 ? 1 : 2);
        }

        function isReadOnly(i) {
            return $.isArray(s.readonly) ? s.readonly[i] : s.readonly;
        }

        function initWheel(w, l, keep) {
            var index = w._index - w._batch;

            w.data = w.data || [];
            w.key = w.key !== undefined ? w.key : l;
            w.label = w.label !== undefined ? w.label : l;

            w._map = {};
            w._array = $.isArray(w.data);

            // Map keys to index
            if (w._array) {
                w._length = w.data.length;
                $.each(w.data, function (i, v) {
                    w._map[getItemValue(v)] = i;
                });
            }

            w.circular = s.circular === undefined ?
                (w.circular === undefined ? (w._array && w._length > s.rows) : w.circular) :
                ($.isArray(s.circular) ? s.circular[l] : s.circular);
            w.min = w._array ? (w.circular ? -Infinity : 0) : (w.min === undefined ? -Infinity : w.min);
            w.max = w._array ? (w.circular ? Infinity : w._length - 1) : (w.max === undefined ? Infinity : w.max);

            w._nr = l;
            w._index = getIndex(w, tempWheelArray[l]);
            w._disabled = {};
            w._batch = 0;
            w._current = w._index;
            w._first = w._index - batchSize; //Math.max(w.min, w._current - batchSize);
            w._last = w._index + batchSize; //Math.min(w.max, w._first + 2 * batchSize);
            w._offset = w._first;

            if (keep) {
                w._offset -= w._margin / itemHeight + (w._index - index);
                w._margin += (w._index - index) * itemHeight;
            } else {
                w._margin = 0; //w._first * itemHeight;
            }

            w._refresh = function (noScroll) {
                extend(w._scroller.settings, {
                    minScroll: -((w.multiple ? Math.max(0, w.max - s.rows + 1) : w.max) - w._offset) * itemHeight,
                    maxScroll: -(w.min - w._offset) * itemHeight
                });

                w._scroller.refresh(noScroll);
            };

            wheelsMap[w.key] = w;

            return w;
        }

        function generateItems(wheel, index, start, end) {
            var i,
                css,
                item,
                value,
                text,
                lbl,
                selected,
                html = '',
                checked = that._tempSelected[index],
                disabled = wheel._disabled || {};

            for (i = start; i <= end; i++) {
                item = getItem(wheel, i);
                text = $.isPlainObject(item) ? item.display : item;
                value = item && item.value !== undefined ? item.value : text;
                css = item && item.cssClass !== undefined ? item.cssClass : '';
                lbl = item && item.label !== undefined ? item.label : '';
                selected = value !== undefined && value == tempWheelArray[index] && !wheel.multiple;

                // TODO: don't generate items with no value (use margin or placeholder instead)
                html += '<div role="option" aria-selected="' + (checked[value] ? true : false) +
                    '" class="mbsc-sc-itm ' + css + ' ' +
                    (selected ? 'mbsc-sc-itm-sel ' : '') +
                    (checked[value] ? selectedClass : '') +
                    (value === undefined ? ' mbsc-sc-itm-ph' : ' mbsc-btn-e') +
                    (disabled[value] ? ' mbsc-sc-itm-inv mbsc-btn-d' : '') +
                    '" data-index="' + i +
                    '" data-val="' + value + '"' +
                    (lbl ? ' aria-label="' + lbl + '"' : '') +
                    (selected ? ' aria-selected="true"' : '') +
                    ' style="height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;">' +
                    (lines > 1 ? '<div class="mbsc-sc-itm-ml" style="line-height:' + Math.round(itemHeight / lines) + 'px;font-size:' + Math.round(itemHeight / lines * 0.8) + 'px;">' : '') +
                    (text === undefined ? '' : text) +
                    (lines > 1 ? '</div>' : '') +
                    '</div>';
            }

            return html;
        }

        //function generate3dItems(wheel, start, end) {
        //    var i,
        //        value,
        //        html = '',
        //        data = wheel.data;

        //    for (i = start; i <= end; i++) {
        //        value = getItem(wheel, data, i);
        //        wheel._$3d.find('.mbsc-sc-itm-3d').eq((i + 7 - wheel._offset) % 16).html(value);
        //    }

        //    return html;
        //}

        function formatHeader(v) {
            var t = s.headerText;
            return t ? (typeof t === 'function' ? t.call(el, v) : t.replace(/\{value\}/i, v)) : '';
        }

        function infinite(wheel, i, pos) {
            var index = Math.round(-pos / itemHeight) + wheel._offset,
                diff = index - wheel._current,
                first = wheel._first,
                last = wheel._last;

            if (diff) {
                wheel._first += diff;
                wheel._last += diff;

                wheel._current = index;

                // Generate items
                setTimeout(function () {
                    if (diff > 0) {
                        wheel._$markup.append(generateItems(wheel, i, Math.max(last + 1, first + diff), last + diff));
                        $('.mbsc-sc-itm', wheel._$markup).slice(0, Math.min(diff, last - first + 1)).remove();

                        // 3D
                        //if (s.scroll3d) {
                        //    generate3dItems(wheel, last - batchSize + 8 + 1, last - batchSize + 8 + diff);
                        //}
                    } else if (diff < 0) {
                        wheel._$markup.prepend(generateItems(wheel, i, first + diff, Math.min(first - 1, last + diff)));
                        $('.mbsc-sc-itm', wheel._$markup).slice(Math.max(diff, first - last - 1)).remove();

                        // 3D
                        //if (s.scroll3d) {
                        //    generate3dItems(wheel, first + batchSize - 8 + 1 + diff, first + batchSize - 8);
                        //}
                    }

                    wheel._margin += diff * itemHeight;
                    wheel._$markup.css('margin-top', wheel._margin + 'px');
                }, 10);
            }
        }

        function getValid(index, val, dir, dis) {
            var counter,
                wheel = wheels[index],
                disabled = dis || wheel._disabled,
                idx = getIndex(wheel, val),
                v1 = val,
                v2 = val,
                dist1 = 0,
                dist2 = 0;

            if (val === undefined) {
                val = getValue(wheel, idx);
            }

            // TODO: what if all items are invalid
            if (disabled[val]) {
                counter = 0;
                while (idx - dist1 >= wheel.min && disabled[v1] && counter < 100) {
                    counter++;
                    dist1++;
                    v1 = getValue(wheel, idx - dist1);
                }

                counter = 0;
                while (idx + dist2 < wheel.max && disabled[v2] && counter < 100) {
                    counter++;
                    dist2++;
                    v2 = getValue(wheel, idx + dist2);
                }

                // If we have direction (+/- or mouse wheel), the distance does not count
                if (((dist2 < dist1 && dist2 && dir !== 2) || !dist1 || (idx - dist1 < 0) || dir == 1) && !disabled[v2]) {
                    val = v2;
                } else {
                    val = v1;
                }
            }

            return val;
        }

        function scrollToPos(time, index, dir, manual) {
            var diff,
                idx,
                offset,
                ret,
                isVisible = that._isVisible;

            isValidating = true;
            ret = s.validate.call(el, {
                values: tempWheelArray.slice(0),
                index: index,
                direction: dir
            }, that) || {};
            isValidating = false;

            if (ret.valid) {
                that._tempWheelArray = tempWheelArray = ret.valid.slice(0);
            }

            trigger('onValidated');

            $.each(wheels, function (i, wheel) {
                if (isVisible) {
                    // Enable all items
                    wheel._$markup.find('.mbsc-sc-itm').removeClass('mbsc-sc-itm-inv mbsc-btn-d');
                }
                wheel._disabled = {};

                // Disable invalid items
                if (ret.disabled && ret.disabled[i]) {
                    $.each(ret.disabled[i], function (j, v) {
                        wheel._disabled[v] = true;
                        if (isVisible) {
                            wheel._$markup.find('.mbsc-sc-itm[data-val="' + v + '"]').addClass('mbsc-sc-itm-inv mbsc-btn-d');
                        }
                    });
                }

                // Get closest valid value
                tempWheelArray[i] = wheel.multiple ? tempWheelArray[i] : getValid(i, tempWheelArray[i], dir);

                if (isVisible) {
                    if (!wheel.multiple || index === undefined) {
                        wheel._$markup
                            .find('.mbsc-sc-itm-sel')
                            .removeClass(selectedClass)
                            .removeAttr('aria-selected');
                    }

                    if (wheel.multiple) {
                        // Add selected styling to selected elements in case of multiselect
                        if (index === undefined) {
                            for (var v in that._tempSelected[i]) {
                                wheel._$markup
                                    .find('.mbsc-sc-itm[data-val="' + v + '"]')
                                    .addClass(selectedClass)
                                    .attr('aria-selected', 'true');
                            }
                        }
                    } else {
                        // Mark element as aria selected
                        wheel._$markup
                            .find('.mbsc-sc-itm[data-val="' + tempWheelArray[i] + '"]')
                            .addClass('mbsc-sc-itm-sel')
                            .attr('aria-selected', 'true');
                    }

                    // Get index of valid value
                    idx = getIndex(wheel, tempWheelArray[i]);

                    diff = idx - wheel._index + wheel._batch;

                    if (Math.abs(diff) > 2 * batchSize + 1) {
                        offset = diff + (2 * batchSize + 1) * (diff > 0 ? -1 : 1);
                        wheel._offset += offset;
                        wheel._margin -= offset * itemHeight;
                        wheel._refresh();
                    }

                    wheel._index = idx + wheel._batch;

                    // Scroll to valid value
                    wheel._scroller.scroll(-(idx - wheel._offset + wheel._batch) * itemHeight, (index === i || index === undefined) ? time : 200);
                }
            });

            // Get formatted value
            that._tempValue = s.formatValue(tempWheelArray, that);

            if (isVisible) {
                // Update header text
                that._header.html(formatHeader(that._tempValue));
            }

            // If in live mode, set and fill value on every move
            if (that.live) {
                that._hasValue = manual || that._hasValue;
                setValue(manual, manual, 0, true);
                if (manual) {
                    trigger('onSet', {
                        valueText: that._value
                    });
                }
            }

            if (manual) {
                trigger('onChange', {
                    valueText: that._tempValue
                });
            }
        }

        function setWheelValue(wheel, i, idx, time, dir) {
            // Get the value at the given index
            var value = getValue(wheel, idx);

            if (value !== undefined) {
                tempWheelArray[i] = value;

                // In case of circular wheels calculate the offset of the current batch
                wheel._batch = wheel._array ? Math.floor(idx / wheel._length) * wheel._length : 0;

                setTimeout(function () {
                    scrollToPos(time, i, dir, true);
                }, 10);
            }
        }

        function setValue(fill, change, time, noscroll, temp) {
            if (!noscroll) {
                scrollToPos(time);
            }

            //that._tempValue = s.formatValue(that._tempWheelArray, that);

            if (!temp) {
                that._wheelArray = tempWheelArray.slice(0);
                that._value = that._hasValue ? that._tempValue : null;
                that._selected = extend(true, {}, that._tempSelected);
            }

            if (fill) {
                if (that._isInput) {
                    $elm.val(that._hasValue ? that._tempValue : '');
                }

                trigger('onFill', {
                    valueText: that._hasValue ? that._tempValue : '',
                    change: change
                });

                if (change) {
                    that._preventChange = true;
                    $elm.trigger('change');
                }
            }
        }

        // Call the parent constructor
        classes.Frame.call(this, el, settings, true);

        // Public functions

        /**
         * Sets the value of the scroller.
         * @param {Array} val - New value.
         * @param {Boolean} [fill=false] - Set the value of the associated input element.
         * @param {Boolean} [change=false] - Trigger change on the input element.
         * @param {Boolean} [temp=false] - If true, then only set the temporary value (only scroll there but not set the value).
         * @param {Number} [time=0] - Animation time in milliseconds.
         */
        that.setVal = that._setVal = function (val, fill, change, temp, time) {
            that._hasValue = val !== null && val !== undefined;
            that._tempWheelArray = tempWheelArray = $.isArray(val) ? val.slice(0) : s.parseValue.call(el, val, that) || [];
            setValue(fill, change === undefined ? fill : change, time, false, temp);
        };

        /**
         * Returns the selected value.
         */
        that.getVal = that._getVal = function (temp) {
            var val = that._hasValue || temp ? that[temp ? '_tempValue' : '_value'] : null;
            return util.isNumeric(val) ? +val : val;
        };

        /*
         * Sets the wheel values (passed as an array).
         */
        that.setArrayVal = that.setVal;

        /*
         * Returns the selected wheel values as an array.
         */
        that.getArrayVal = function (temp) {
            return temp ? that._tempWheelArray : that._wheelArray;
        };

        that.changeWheel = function (whls, time, manual) {
            var i,
                w;

            $.each(whls, function (key, wheel) {
                w = wheelsMap[key];
                i = w._nr;
                // Check if wheel exists
                if (w) {
                    extend(w, wheel);

                    initWheel(w, i, true);

                    if (that._isVisible) {
                        w._$markup
                            .html(generateItems(w, i, w._first, w._last))
                            .css('margin-top', w._margin + 'px');

                        w._refresh(isValidating);
                    }
                }
            });

            if (that._isVisible) {
                that.position();
            }

            if (!isValidating) {
                scrollToPos(time, undefined, undefined, manual);
            }
        };

        /**
         * Returns the closest valid value.
         */
        that.getValidValue = getValid;

        // Protected overrides

        that._generateContent = function () {
            var lbl,
                html = '',
                l = 0;

            $.each(s.wheels, function (i, wg) {
                html += '<div class="mbsc-w-p mbsc-sc-whl-gr-c"><div class="mbsc-sc-whl-gr' +
                    //(s.scroll3d ? ' mbsc-sc-whl-gr-3d' : '') +
                    (showScrollArrows ? ' mbsc-sc-cp' : '') +
                    (s.showLabel ? ' mbsc-sc-lbl-v' : '') + '">';
                //'<div class="dwwc"' + (s.maxWidth ? '' : ' style="max-width:600px;"') + '>' +

                $.each(wg, function (j, w) { // Wheels

                    that._tempSelected[l] = extend({}, that._selected[l]);

                    // TODO: this should be done on initialization, not on show
                    wheels[l] = initWheel(w, l);

                    lbl = w.label !== undefined ? w.label : j;

                    html += '<div class="mbsc-sc-whl-w ' + (w.cssClass || '') + (w.multiple ? ' mbsc-sc-whl-multi' : '') + '" style="' +
                        (s.width ? ('width:' + (s.width[l] || s.width) + 'px;') :
                            (s.minWidth ? ('min-width:' + (s.minWidth[l] || s.minWidth) + 'px;') : '') +
                            (s.maxWidth ? ('max-width:' + (s.maxWidth[l] || s.maxWidth) + 'px;') : '')) + '">' +
                        '<div class="mbsc-sc-whl-o"></div>' +
                        '<div class="mbsc-sc-whl-l" style="height:' + itemHeight + 'px;margin-top:-' + (itemHeight / 2 + (s.selectedLineBorder || 0)) + 'px;"></div>' +
                        '<div tabindex="0" aria-live="off" aria-label="' + lbl + '" role="listbox" data-index="' + l + '" class="mbsc-sc-whl"' + ' style="' +
                        'height:' + (s.rows * itemHeight) + 'px;">' +
                        //'<div class="dwwl dwwl' + l + (w.multiple ? ' dwwms' : '') + '">' +
                        (showScrollArrows ?
                            '<div data-index="' + l + '" data-dir="inc" class="mbsc-sc-btn mbsc-sc-btn-plus ' + (s.btnPlusClass || '') + '" style="height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;"></div>' + // + button
                            '<div data-index="' + l + '" data-dir="dec" class="mbsc-sc-btn mbsc-sc-btn-minus ' + (s.btnMinusClass || '') + '" style="height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;"></div>' : '') + // - button
                        '<div class="mbsc-sc-lbl">' + lbl + '</div>' + // Wheel label
                        '<div class="mbsc-sc-whl-c"' +
                        (w.multiple ?
                            ' aria-multiselectable="true"' :
                            ' style="height:' + itemHeight + 'px;margin-top:-' + (itemHeight / 2 + 1) + 'px;"') +
                        //(s.scroll3d ? pref + 'transform: translateZ(' + (itemHeight * s.rows / 2) + 'px);' : '') +
                        '>' +
                        '<div class="mbsc-sc-whl-sc">';

                    // Create wheel values
                    html += generateItems(w, l, w._first, w._last) +
                        '</div></div></div>';

                    //if (s.scroll3d) {
                    //    html += '<div class="mbsc-sc-whl-3d" style="height:' + itemHeight + 'px;margin-top:-' + (itemHeight / 2) + 'px;">';
                    //    for (var k = 0; k < 16; k++) {
                    //        html += '<div class="mbsc-btn mbsc-sc-itm-3d" style="' + pref + 'transform:rotateX(' + ((7 - k - w._offset) * 22.5 % 360) + 'deg) translateZ(' + (itemHeight * s.rows / 2) + 'px);height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;">' + getItem(w, w.data, w._current + k - 7) + '</div>';
                    //    }
                    //    html += '</div>';
                    //}

                    html += '</div>';

                    l++;
                });

                html += '</div></div>';
            });

            return html;
        };

        that._attachEvents = function ($markup) {
            $('.mbsc-sc-btn', $markup)
                .on('touchstart mousedown', onBtnStart)
                .on('touchmove', onBtnMove)
                .on('touchend touchcancel', onBtnEnd);

            $('.mbsc-sc-whl', $markup)
                .on('keydown', onKeyDown)
                .on('keyup', onKeyUp);
        };

        that._detachEvents = function ($m) {
            $('.mbsc-sc-whl', $m).mobiscroll('destroy');
        };

        that._markupReady = function ($m) {
            //var skip;

            $markup = $m;

            $('.mbsc-sc-whl', $markup).each(function (i) {
                var idx,
                    $wh = $(this),
                    wheel = wheels[i];

                wheel._$markup = $('.mbsc-sc-whl-sc', this);
                //wheel._$3d = $('.mbsc-sc-whl-3d', this);

                wheel._scroller = new ms.classes.ScrollView(this, {
                    mousewheel: s.mousewheel,
                    moveElement: wheel._$markup,
                    initialPos: -(wheel._index - wheel._offset) * itemHeight,
                    contSize: 0,
                    snap: itemHeight,
                    minScroll: -((wheel.multiple ? Math.max(0, wheel.max - s.rows + 1) : wheel.max) - wheel._offset) * itemHeight,
                    maxScroll: -(wheel.min - wheel._offset) * itemHeight,
                    maxSnapScroll: batchSize,
                    prevDef: true,
                    stopProp: true,
                    //timeUnit: 3,
                    //easing: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
                    onStart: function (ev, inst) {
                        inst.settings.readonly = isReadOnly(i);
                    },
                    onGestureStart: function () {
                        $wh.addClass('mbsc-sc-whl-a mbsc-sc-whl-anim');

                        trigger('onWheelGestureStart', {
                            index: i
                        });
                    },
                    onGestureEnd: function (ev) {
                        var dir = ev.direction == 90 ? 1 : 2,
                            time = ev.duration,
                            pos = ev.destinationY;

                        idx = Math.round(-pos / itemHeight) + wheel._offset;

                        setWheelValue(wheel, i, idx, time, dir);
                    },
                    onAnimationStart: function () {
                        $wh.addClass('mbsc-sc-whl-anim');
                    },
                    onAnimationEnd: function () {
                        $wh.removeClass('mbsc-sc-whl-a mbsc-sc-whl-anim');

                        trigger('onWheelAnimationEnd', {
                            index: i
                        });
                    },
                    onMove: function (ev) {
                        //if (s.scroll3d && easing !== false) {
                        //    wheel._$3d[0].style[pr + 'Transition'] = time ? pref + 'transform ' + Math.round(time) + 'ms ' + easing : '';
                        //    wheel._$3d[0].style[pr + 'Transform'] = 'rotateX(' + (-pos * 22.5 / itemHeight) + 'deg)';
                        //}
                        infinite(wheel, i, ev.posY);
                    },
                    onBtnTap: function (ev) {
                        var $item = $(ev.target),
                            idx = +$item.attr('data-index');

                        // Select item on tap
                        if (toggleItem(i, $item)) {
                            // Don't scroll, but trigger validation
                            idx = wheel._current;
                        }

                        if (trigger('onItemTap', {
                                target: $item[0],
                                selected: $item.hasClass('mbsc-itm-sel')
                            }) !== false) {
                            setWheelValue(wheel, i, idx, 200);

                            if (that.live && !wheel.multiple && (s.setOnTap === true || s.setOnTap[i])) {
                                setTimeout(function () {
                                    that.select();
                                }, 200);
                            }
                        }
                    }
                });
            });

            scrollToPos();
        };

        that._fillValue = function () {
            that._hasValue = true;
            setValue(true, true, 0, true);
        };

        that._clearValue = function () {
            $('.mbsc-sc-whl-multi .mbsc-sc-itm-sel', $markup)
                .removeClass(selectedClass)
                .removeAttr('aria-selected');
        };

        that._readValue = function () {
            var v = $elm.val() || '',
                l = 0;

            if (v !== '') {
                that._hasValue = true;
            }

            that._tempWheelArray = tempWheelArray = that._hasValue && that._wheelArray ?
                that._wheelArray.slice(0) :
                s.parseValue.call(el, v, that) || [];

            that._tempSelected = extend(true, {}, that._selected);

            $.each(s.wheels, function (i, wg) {
                $.each(wg, function (j, w) { // Wheels
                    wheels[l] = initWheel(w, l);
                    l++;
                });
            });

            setValue();

            trigger('onRead');
        };

        that._processSettings = function () {
            s = that.settings;
            trigger = that.trigger;
            itemHeight = s.height;
            lines = s.multiline;
            showScrollArrows = s.showScrollArrows;
            selectedClass = 'mbsc-sc-itm-sel mbsc-ic mbsc-ic-' + s.checkIcon;
            wheels = [];
            wheelsMap = {};

            that._isLiquid = (s.layout || (/top|bottom/.test(s.display) && s.wheels.length == 1 ? 'liquid' : '')) === 'liquid';

            if (lines > 1) {
                s.cssClass = (s.cssClass || '') + ' dw-ml';
            }

            // Ensure a minimum number of 3 items if clickpick buttons present
            if (showScrollArrows) {
                s.rows = Math.max(3, s.rows);
            }
        };

        // Properties
        that._tempSelected = {};
        that._selected = {};

        // Constructor
        if (!inherit) {
            that.init(settings);
        }
    };

    // Extend defaults
    classes.Scroller.prototype = {
        _hasDef: true,
        _hasTheme: true,
        _hasLang: true,
        _hasPreset: true,
        _class: 'scroller',
        _defaults: extend({}, classes.Frame.prototype._defaults, {
            // Options
            minWidth: 80,
            height: 40,
            rows: 3,
            multiline: 1,
            delay: 300,
            readonly: false,
            showLabel: true,
            setOnTap: false,
            //scroll3d: false,
            wheels: [],
            preset: '',
            speedUnit: 0.0012,
            timeUnit: 0.08,
            validate: function () {},
            formatValue: function (d) {
                return d.join(' ');
            },
            parseValue: function (value, inst) {
                var val = [],
                    ret = [],
                    i = 0,
                    found,
                    data;

                if (value !== null && value !== undefined) {
                    val = (value + '').split(' ');
                }

                $.each(inst.settings.wheels, function (j, wg) {
                    $.each(wg, function (k, w) {
                        data = w.data;
                        // Default to first wheel value if not found
                        found = getItemValue(data[0]);
                        $.each(data, function (l, item) {
                            // Don't do strict comparison
                            if (val[i] == getItemValue(item)) {
                                found = getItemValue(item);
                                return false;
                            }
                        });
                        ret.push(found);
                        i++;
                    });
                });
                return ret;
            }
        })
    };

    ms.themes.scroller = ms.themes.frame;

})(window, document);
