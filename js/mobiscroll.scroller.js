(function (window, document, undefined) {

    var ms = mobiscroll,
        $ = ms.$,
        extend = $.extend,
        classes = ms.classes,
        platform = ms.platform,
        util = ms.util,
        pr = util.jsPrefix,
        pref = util.prefix,
        getCoord = util.getCoord,
        testTouch = util.testTouch,
        force2D = platform.name == 'wp' || platform.name == 'android' || (platform.name == 'ios' && platform.majorVersion < 8);

    ms.presetShort('scroller', 'Scroller', false);

    classes.Scroller = function (el, settings, inherit) {
        var $markup,
            $stepBtn,
            batchSize3d,
            batchSize = 40,
            animTime = 1000,
            scroll3dAngle,
            scroll3d,
            selectedClass,
            showScrollArrows,
            stepTimer,
            stepRunning,
            stepSkip,
            stepBtnX,
            stepBtnY,
            tempWheelArray,
            itemHeight,
            itemHeight3d,
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
            var i = +$(this).attr('data-index');

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

        function getIndex(wheel, val) {
            return (wheel._array ? wheel._map[val] : wheel.getIndex(val, that)) || 0;
        }

        function getItem(wheel, i) {
            var data = wheel.data;

            if (i >= wheel.min && i <= wheel.max) {
                return wheel._array ?
                    (wheel.circular ? $(data).get(i % wheel._length) : data[i]) :
                    ($.isFunction(data) ? data(i, that) : '');
            }
        }

        function getItemValue(item) {
            return $.isPlainObject(item) ? (item.value !== undefined ? item.value : item.display) : item;
        }

        function getItemText(item) {
            var text = $.isPlainObject(item) ? item.display : item;
            return text === undefined ? '' : text;
        }

        function getValue(wheel, i) {
            return getItemValue(getItem(wheel, i));
        }

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
            setWheelValue(wheel, index, wheel._current + direction, animTime, direction == 1 ? 1 : 2);
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
                var maxScroll = -(w.min - w._offset + (w.multiple && !scroll3d ? Math.floor(s.rows / 2) : 0)) * itemHeight,
                    minScroll = Math.min(maxScroll, -(w.max - w._offset - (w.multiple && !scroll3d ? Math.floor(s.rows / 2) : 0)) * itemHeight);

                extend(w._scroller.settings, {
                    minScroll: minScroll,
                    maxScroll: maxScroll
                });

                w._scroller.refresh(noScroll);
            };

            wheelsMap[w.key] = w;

            return w;
        }

        function generateItems(wheel, index, start, end, is3d) {
            var i,
                css,
                item,
                value,
                text,
                lbl,
                invalid,
                selected,
                html = '',
                checked = that._tempSelected[index],
                disabled = wheel._disabled || {};

            for (i = start; i <= end; i++) {
                item = getItem(wheel, i);
                text = getItemText(item);
                value = getItemValue(item);
                css = item && item.cssClass !== undefined ? item.cssClass : '';
                lbl = item && item.label !== undefined ? item.label : '';
                invalid = item && item.invalid;
                selected = value !== undefined && value == tempWheelArray[index] && !wheel.multiple;

                // TODO: don't generate items with no value (use margin or placeholder instead)
                html += '<div role="option" aria-selected="' + (checked[value] ? true : false) +
                    '" class="mbsc-sc-itm ' + (is3d ? 'mbsc-sc-itm-3d ' : '') + css + ' ' +
                    (selected ? 'mbsc-sc-itm-sel ' : '') +
                    (checked[value] ? selectedClass : '') +
                    (value === undefined ? ' mbsc-sc-itm-ph' : ' mbsc-btn-e') +
                    (invalid ? ' mbsc-sc-itm-inv-h mbsc-btn-d' : '') +
                    (disabled[value] ? ' mbsc-sc-itm-inv mbsc-btn-d' : '') +
                    '" data-index="' + i +
                    '" data-val="' + value + '"' +
                    (lbl ? ' aria-label="' + lbl + '"' : '') +
                    (selected ? ' aria-selected="true"' : '') +
                    ' style="height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;' +
                    (is3d ? pref + 'transform:rotateX(' + ((wheel._offset - i) * scroll3dAngle % 360) + 'deg) translateZ(' + (itemHeight * s.rows / 2) + 'px);' : '') +
                    '">' +
                    (lines > 1 ? '<div class="mbsc-sc-itm-ml" style="line-height:' + Math.round(itemHeight / lines) + 'px;font-size:' + Math.round(itemHeight / lines * 0.8) + 'px;">' : '') +
                    text +
                    (lines > 1 ? '</div>' : '') +
                    '</div>';
            }

            return html;
        }

        function formatHeader(v) {
            var t = s.headerText;
            return t ? (typeof t === 'function' ? t.call(el, v) : t.replace(/\{value\}/i, v)) : '';
        }

        function infinite(wheel, i, pos) {
            var index = Math.round(-pos / itemHeight) + wheel._offset,
                diff = index - wheel._current,
                first = wheel._first,
                last = wheel._last,
                first3d = first + batchSize - batchSize3d + 1,
                last3d = last - batchSize + batchSize3d;

            if (diff) {
                wheel._first += diff;
                wheel._last += diff;

                wheel._current = index;

                // Generate items
                //setTimeout(function () {
                if (diff > 0) {
                    wheel._$scroller.append(generateItems(wheel, i, Math.max(last + 1, first + diff), last + diff));
                    $('.mbsc-sc-itm', wheel._$scroller).slice(0, Math.min(diff, last - first + 1)).remove();

                    // 3D
                    if (scroll3d) {
                        wheel._$3d.append(generateItems(wheel, i, Math.max(last3d + 1, first3d + diff), last3d + diff, true));
                        $('.mbsc-sc-itm', wheel._$3d).slice(0, Math.min(diff, last3d - first3d + 1)).attr('class', 'mbsc-sc-itm-del');
                    }
                } else if (diff < 0) {
                    wheel._$scroller.prepend(generateItems(wheel, i, first + diff, Math.min(first - 1, last + diff)));
                    $('.mbsc-sc-itm', wheel._$scroller).slice(Math.max(diff, first - last - 1)).remove();

                    // 3D
                    if (scroll3d) {
                        wheel._$3d.prepend(generateItems(wheel, i, first3d + diff, Math.min(first3d - 1, last3d + diff), true));
                        $('.mbsc-sc-itm', wheel._$3d).slice(Math.max(diff, first3d - last3d - 1)).attr('class', 'mbsc-sc-itm-del');
                    }
                }

                wheel._margin += diff * itemHeight;
                wheel._$scroller.css('margin-top', wheel._margin + 'px');
                //}, 10);
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

        function scrollToPos(time, index, dir, manual, tap) {
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
                    wheel._$markup.find('.mbsc-sc-itm-inv').removeClass('mbsc-sc-itm-inv mbsc-btn-d');
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
                    wheel._scroller.scroll(-(idx - wheel._offset + wheel._batch) * itemHeight, (index === i || index === undefined) ? time : animTime, tap);
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

        function setWheelValue(wheel, i, idx, time, dir, tap) {
            // Get the value at the given index
            var value = getValue(wheel, idx);

            if (value !== undefined) {
                tempWheelArray[i] = value;

                // In case of circular wheels calculate the offset of the current batch
                wheel._batch = wheel._array ? Math.floor(idx / wheel._length) * wheel._length : 0;

                setTimeout(function () {
                    scrollToPos(time, i, dir, true, tap);
                }, 10);
            }
        }

        function setValue(fill, change, time, noscroll, temp) {
            if (!noscroll) {
                scrollToPos(time);
            } else {
                that._tempValue = s.formatValue(that._tempWheelArray, that);
            }

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
                        if (scroll3d) {
                            w._$3d.html(generateItems(w, i, w._first + batchSize - batchSize3d + 1, w._last - batchSize + batchSize3d, true));
                        }

                        w._$scroller
                            .html(generateItems(w, i, w._first, w._last))
                            .css('margin-top', w._margin + 'px');

                        w._refresh(isValidating);
                    }
                }
            });

            if (that._isVisible && !isValidating) {
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
                style = scroll3d ? pref + 'transform: translateZ(' + (itemHeight * s.rows / 2 + 3) + 'px);' : '',
                highlight = '<div class="mbsc-sc-whl-l" style="' + style + 'height:' + itemHeight + 'px;margin-top:-' + (itemHeight / 2 + (s.selectedLineBorder || 0)) + 'px;"></div>',
                l = 0;

            $.each(s.wheels, function (i, wg) {
                html += '<div class="mbsc-w-p mbsc-sc-whl-gr-c' + (s.showLabel ? ' mbsc-sc-lbl-v' : '') + '">' + highlight +
                    '<div class="mbsc-sc-whl-gr' +
                    (scroll3d ? ' mbsc-sc-whl-gr-3d' : '') +
                    (showScrollArrows ? ' mbsc-sc-cp' : '') + '">';

                $.each(wg, function (j, w) { // Wheels

                    that._tempSelected[l] = extend({}, that._selected[l]);

                    // TODO: this should be done on initialization, not on show
                    wheels[l] = initWheel(w, l);

                    lbl = w.label !== undefined ? w.label : j;

                    html += '<div class="mbsc-sc-whl-w ' + (w.cssClass || '') + (w.multiple ? ' mbsc-sc-whl-multi' : '') + '" style="' +
                        (s.width ? ('width:' + (s.width[l] || s.width) + 'px;') :
                            (s.minWidth ? ('min-width:' + (s.minWidth[l] || s.minWidth) + 'px;') : '') +
                            (s.maxWidth ? ('max-width:' + (s.maxWidth[l] || s.maxWidth) + 'px;') : '')) + '">' +
                        '<div class="mbsc-sc-whl-o" style="' + style + '"></div>' + highlight +
                        '<div tabindex="0" aria-live="off" aria-label="' + lbl + '"' + (w.multiple ? ' aria-multiselectable="true"' : '') + ' role="listbox" data-index="' + l + '" class="mbsc-sc-whl"' + ' style="' +
                        'height:' + (s.rows * itemHeight * (scroll3d ? 1.1 : 1)) + 'px;">' +
                        (showScrollArrows ?
                            '<div data-index="' + l + '" data-dir="inc" class="mbsc-sc-btn mbsc-sc-btn-plus ' + (s.btnPlusClass || '') + '" style="height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;"></div>' + // + button
                            '<div data-index="' + l + '" data-dir="dec" class="mbsc-sc-btn mbsc-sc-btn-minus ' + (s.btnMinusClass || '') + '" style="height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;"></div>' : '') + // - button
                        '<div class="mbsc-sc-lbl">' + lbl + '</div>' + // Wheel label
                        '<div class="mbsc-sc-whl-c"' +
                        ' style="height:' + itemHeight3d + 'px;margin-top:-' + (itemHeight3d / 2 + 1) + 'px;' + style + '">' +
                        '<div class="mbsc-sc-whl-sc" style="top:' + ((itemHeight3d - itemHeight) / 2) + 'px;">';

                    // Create wheel values
                    html += generateItems(w, l, w._first, w._last) +
                        '</div></div>';

                    if (scroll3d) {
                        html += '<div class="mbsc-sc-whl-3d" style="height:' + itemHeight + 'px;margin-top:-' + (itemHeight / 2) + 'px;">';
                        html += generateItems(w, l, w._first + batchSize - batchSize3d + 1, w._last - batchSize + batchSize3d, true);
                        html += '</div>';
                    }

                    html += '</div></div>';

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
            $markup = $m;

            $('.mbsc-sc-whl', $markup).each(function (i) {
                var idx,
                    $wh = $(this),
                    wheel = wheels[i],
                    maxScroll = -(wheel.min - wheel._offset + (wheel.multiple && !scroll3d ? Math.floor(s.rows / 2) : 0)) * itemHeight,
                    minScroll = Math.min(maxScroll, -(wheel.max - wheel._offset - (wheel.multiple && !scroll3d ? Math.floor(s.rows / 2) : 0)) * itemHeight);

                wheel._$markup = $wh;
                wheel._$scroller = $('.mbsc-sc-whl-sc', this);
                wheel._$3d = $('.mbsc-sc-whl-3d', this);

                wheel._scroller = new ms.classes.ScrollView(this, {
                    mousewheel: s.mousewheel,
                    moveElement: wheel._$scroller,
                    initialPos: (wheel._first - wheel._index) * itemHeight,
                    contSize: 0,
                    snap: itemHeight,
                    minScroll: minScroll,
                    maxScroll: maxScroll,
                    maxSnapScroll: batchSize,
                    prevDef: true,
                    stopProp: true,
                    timeUnit: 3,
                    easing: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
                    sync: function (pos, time, easing) {
                        if (scroll3d) {
                            wheel._$3d[0].style[pr + 'Transition'] = time ? pref + 'transform ' + Math.round(time) + 'ms ' + easing : '';
                            wheel._$3d[0].style[pr + 'Transform'] = 'rotateX(' + ((-pos / itemHeight) * scroll3dAngle) + 'deg)';
                        }
                    },
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

                        wheel._$3d.find('.mbsc-sc-itm-del').remove();
                    },
                    onMove: function (ev) {
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
                            setWheelValue(wheel, i, idx, animTime, true, true);

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

            setValue(false, false, 0, true);

            trigger('onRead');
        };

        that.__processSettings = function () {
            s = that.settings;
            s.cssClass = (s.cssClass || '') + ' mbsc-sc';
            trigger = that.trigger;
            lines = s.multiline;
            selectedClass = 'mbsc-sc-itm-sel mbsc-ic mbsc-ic-' + s.checkIcon;
            wheels = [];
            wheelsMap = {};

            if (lines > 1) {
                s.cssClass = (s.cssClass || '') + ' dw-ml';
            }
        };

        that.__init = function () {
            showScrollArrows = s.showScrollArrows;
            scroll3d = s.scroll3d && !force2D && !showScrollArrows;
            itemHeight = s.height;
            itemHeight3d = scroll3d ? Math.round((itemHeight - (itemHeight * s.rows / 2 + 3) * 0.03) / 2) * 2 : itemHeight;
            batchSize3d = Math.round(s.rows * 1.8);
            scroll3dAngle = 360 / (batchSize3d * 2);

            that._isLiquid = (s.layout || ((/top|bottom/.test(s.display) && s.wheels.length == 1) || s.display == 'inline' ? 'liquid' : '')) === 'liquid';

            // Ensure a minimum number of 3 items if clickpick buttons present
            if (showScrollArrows) {
                s.rows = Math.max(3, s.rows);
            }
        };

        that._getItemValue = getItemValue;

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
            wheels: [],
            preset: '',
            speedUnit: 0.0012,
            timeUnit: 0.08,
            checkIcon: 'checkmark',
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
                        found = inst._getItemValue(data[0]);
                        $.each(data, function (l, item) {
                            // Don't do strict comparison
                            if (val[i] == inst._getItemValue(item)) {
                                found = inst._getItemValue(item);
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

})(window, document);
