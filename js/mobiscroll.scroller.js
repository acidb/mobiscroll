(function ($, window, document, undefined) {
    var //move,
        ms = $.mobiscroll,
        classes = ms.classes,
        util = ms.util,
        //pref = util.prefix,
        //pr = util.jsPrefix,
        //has3d = util.has3d,
        hasFlex = util.hasFlex;
    //getCoord = util.getCoord,
    //constrain = util.constrain;
    //testTouch = util.testTouch;

    ms.presetShort('scroller', 'Scroller', false);

    classes.Scroller = function (el, settings, inherit) {
        var $markup,
            //btn,
            //isScrollable,
            batchSize = 20,
            itemHeight,
            //multiple,
            s,
            //scrollDebounce,
            trigger,

            //click,
            //moved,
            //start,
            //startTime,
            //stop,
            //p,
            //min,
            //max,
            //target,
            //index,
            lines,
            //timer,
            that = this,
            $elm = $(el),
            //iv = {},
            //pos = {},
            //pixels = {},
            wheels = [];

        // Event handlers

        //function onStart(ev) {
        //    // Scroll start
        //    if (testTouch(ev, this) && !move && !click && !btn && !isReadOnly(this)) {
        //        // Prevent touch highlight
        //        ev.preventDefault();
        //        // Better performance if there are tap events on document
        //        ev.stopPropagation();

        //        move = true;
        //        isScrollable = s.mode != 'clickpick';
        //        target = $('.dw-ul', this);
        //        setGlobals(target);
        //        moved = iv[index] !== undefined; // Don't allow tap, if still moving
        //        p = moved ? getCurrentPosition(target) : pos[index];
        //        start = getCoord(ev, 'Y');
        //        startTime = new Date();
        //        stop = start;
        //        scroll(target, index, p, 0.001);

        //        if (isScrollable) {
        //            target.closest('.dwwl').addClass('dwa');
        //        }

        //        if (ev.type === 'mousedown') {
        //            $(document).on('mousemove', onMove).on('mouseup', onEnd);
        //        }
        //    }
        //}

        //function onMove(ev) {
        //    if (move) {
        //        if (isScrollable) {
        //            // Prevent scroll
        //            ev.preventDefault();
        //            ev.stopPropagation();
        //            stop = getCoord(ev, 'Y');
        //            if (Math.abs(stop - start) > 3 || moved) {
        //                scroll(target, index, constrain(p + (start - stop) / itemHeight, min - 1, max + 1));
        //                moved = true;
        //            }
        //        }
        //    }
        //}

        //function onEnd(ev) {
        //    if (move) {
        //        var time = new Date() - startTime,
        //            curr = constrain(Math.round(p + (start - stop) / itemHeight), min - 1, max + 1),
        //            val = curr,
        //            speed,
        //            dist,
        //            ttop = target.offset().top;

        //        // Better performance if there are tap events on document
        //        ev.stopPropagation();

        //        move = false;

        //        if (ev.type === 'mouseup') {
        //            $(document).off('mousemove', onMove).off('mouseup', onEnd);
        //        }

        //        if (has3d && time < 300) {
        //            speed = (stop - start) / time;
        //            dist = (speed * speed) / s.speedUnit;
        //            if (stop - start < 0) {
        //                dist = -dist;
        //            }
        //        } else {
        //            dist = stop - start;
        //        }

        //        if (!moved) { // this is a "tap"
        //            var idx = Math.floor((stop - ttop) / itemHeight),
        //                li = $($('.dw-li', target)[idx]),
        //                valid = li.hasClass('dw-v'),
        //                hl = isScrollable;

        //            time = 0.1;

        //            if (trigger('onValueTap', [li]) !== false && valid) {
        //                val = idx;
        //            } else {
        //                hl = true;
        //            }

        //            if (hl && valid) {
        //                li.addClass('dw-hl'); // Highlight
        //                setTimeout(function () {
        //                    li.removeClass('dw-hl');
        //                }, 100);
        //            }

        //            if (!multiple && (s.confirmOnTap === true || s.confirmOnTap[index]) && li.hasClass('dw-sel')) {
        //                that.select();
        //                return;
        //            }
        //        } else {
        //            val = constrain(Math.round(p - dist / itemHeight), min, max);
        //            time = speed ? Math.max(0.1, Math.abs((val - curr) / speed) * s.timeUnit) : 0.1;
        //        }

        //        if (isScrollable) {
        //            calc(target, index, val, 0, time, true);
        //        }
        //    }
        //}

        //function onBtnStart(ev) {
        //    btn = $(this);
        //    // +/- buttons
        //    if (testTouch(ev, this)) {
        //        step(ev, btn.closest('.dwwl'), btn.hasClass('dwwbp') ? plus : minus);
        //    }
        //    if (ev.type === 'mousedown') {
        //        $(document).on('mouseup', onBtnEnd);
        //    }
        //}

        //function onBtnEnd(ev) {
        //    btn = null;
        //    if (click) {
        //        clearInterval(timer);
        //        click = false;
        //    }
        //    if (ev.type === 'mouseup') {
        //        $(document).off('mouseup', onBtnEnd);
        //    }
        //}

        //function onKeyDown(ev) {
        //    if (ev.keyCode == 38) { // up
        //        step(ev, $(this), minus);
        //    } else if (ev.keyCode == 40) { // down
        //        step(ev, $(this), plus);
        //    }
        //}

        //function onKeyUp() {
        //    if (click) {
        //        clearInterval(timer);
        //        click = false;
        //    }
        //}

        //function onScroll(ev) {
        //    if (!isReadOnly(this)) {
        //        ev.preventDefault();
        //        ev = ev.originalEvent || ev;

        //        var delta = ev.deltaY || ev.wheelDelta || ev.detail,
        //            t = $('.dw-ul', this);

        //        setGlobals(t);

        //        scroll(t, index, constrain(((delta < 0 ? -20 : 20) - pixels[index]) / itemHeight, min - 1, max + 1));

        //        clearTimeout(scrollDebounce);
        //        scrollDebounce = setTimeout(function () {
        //            calc(t, index, Math.round(pos[index]), delta > 0 ? 1 : 2, 0.1);
        //        }, 200);
        //    }
        //}

        // Private functions

        //function step(ev, w, func) {
        //    ev.stopPropagation();
        //    ev.preventDefault();
        //    if (!click && !isReadOnly(w) && !w.hasClass('dwa')) {
        //        click = true;
        //        // + Button
        //        var t = w.find('.dw-ul');

        //        setGlobals(t);
        //        clearInterval(timer);
        //        timer = setInterval(function () { func(t); }, s.delay);
        //        func(t);
        //    }
        //}

        //function isReadOnly(wh) {
        //    if ($.isArray(s.readonly)) {
        //        var i = $('.dwwl', $markup).index(wh);
        //        return s.readonly[i];
        //    }
        //    return s.readonly;
        //}

        function initWheel(w, l) {
            w.values = w.values || [];
            w.keys = w.keys || w.values;
            w.label = w.label !== undefined ? w.label : l;

            w._map = {};
            w._array = $.isArray(w.values);

            // Map keys to index
            if (w._array) {
                w._length = w.values.length;
                $.each(w.keys, function (i, v) {
                    w._map[v] = i;
                });
            }

            w.circular = w.circular || (w._array && w._length > s.rows);
            w.min = w.min === undefined ? (w._array && !w.circular ? 0 : -Infinity) : w.min;
            w.max = w.max === undefined ? (w._array && !w.circular ? w._length - 1 : Infinity) : w.max;

            w._index = getIndex(w, l);
            w._batch = 0;
            w._offset = w._index;
            w._first = w._index - batchSize,//Math.max(w.min, w._index - batchSize);
            w._last = w._index + batchSize,//Math.min(w.max, w._first + 2 * batchSize);
            w._margin = w._first * itemHeight;

            return w;
        }

        function getIndex(wheel, i) {
            return wheel._array ? wheel._map[that._tempWheelArray[i]] : wheel.getIndex(that._tempWheelArray[i]);
        }

        function getItem(wheel, values, i) {
            if (i < wheel.min || i > wheel.max) {
                return '';
            }
            return wheel._array ? (wheel.circular ? $(values).get(i % wheel._length) : values[i]) : values(i);
        }

        function generateItems(wheel, start, end) {
            //var html = '<div class="dw-bf">',
            //    w = wheels[i],
            //    l = 1,
            //    labels = w.labels || [],
            //    values = w.values || [],
            //    keys = w.keys || values;

            //$.each(values, function (j, v) {
            //    if (l % 20 === 0) {
            //        html += '</div><div class="dw-bf">';
            //    }
            //    html += '<div role="option" aria-selected="false" class="dw-li dw-v" data-val="' + keys[j] + '"' + (labels[j] ? ' aria-label="' + labels[j] + '"' : '') + ' style="height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;">' +
            //        '<div class="dw-i"' + (lines > 1 ? ' style="line-height:' + Math.round(itemHeight / lines) + 'px;font-size:' + Math.round(itemHeight / lines * 0.8) + 'px;"' : '') + '>' + v + '</div></div>';
            //    l++;
            //});

            //html += '</div>';
            //return html;

            var i,
                key,
                value,
                html = '',
                labels = wheel.labels || [],
                values = wheel.values,
                keys = wheel.keys;

            for (i = start; i <= end; i++) {
                value = getItem(wheel, values, i);
                key = getItem(wheel, keys, i);

                //if (key !== undefined) {
                html += '<div role="option" aria-selected="false" class="mbsc-btn mbsc-sc-itm" data-val="' + key + '"' + (labels[i] ? ' aria-label="' + labels[i] + '"' : '') + ' style="height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;">' + value + '</div>';
                //}
            }

            return html;
        }

        //function generate3dItems(wheel, start, end) {
        //    var i,
        //        value,
        //        html = '',
        //        values = wheel.values;

        //    for (i = start; i <= end; i++) {
        //        value = getItem(wheel, values, i);
        //        wheel._$3d.find('.mbsc-sc-itm-3d').eq((i + 7 - wheel._offset) % 16).html(value);
        //    }

        //    return html;
        //}

        //function setGlobals(t) {
        //    multiple = t.closest('.dwwl').hasClass('dwwms');
        //    min = $('.dw-li', t).index($(multiple ? '.dw-li' : '.dw-v', t).eq(0));
        //    max = Math.max(min, $('.dw-li', t).index($(multiple ? '.dw-li' : '.dw-v', t).eq(-1)) - (multiple ? s.rows - (s.mode == 'scroller' ? 1 : 3) : 0));
        //    index = $('.dw-ul', $markup).index(t);
        //}

        function formatHeader(v) {
            var t = s.headerText;
            return t ? (typeof t === 'function' ? t.call(el, v) : t.replace(/\{value\}/i, v)) : '';
        }

        //function getCurrentPosition(t) {
        //    return Math.round(-util.getPosition(t, true) / itemHeight);
        //}

        //function ready(t, i) {
        //    clearTimeout(iv[i]);
        //    delete iv[i];
        //    t.closest('.dwwl').removeClass('dwa');
        //}

        //function scroll(t, index, val, time, active) {
        //    var px = -val * itemHeight,
        //        style = t[0].style;

        //    if (px == pixels[index] && iv[index]) {
        //        return;
        //    }

        //    //if (time && px != pixels[index]) {
        //    // Trigger animation start event
        //    //trigger('onAnimStart', [$markup, index, time]);
        //    //}

        //    pixels[index] = px;

        //    if (has3d) {
        //        style[pr + 'Transition'] = util.prefix + 'transform ' + (time ? time.toFixed(3) : 0) + 's ease-out';
        //        style[pr + 'Transform'] = 'translate3d(0,' + px + 'px,0)';
        //    } else {
        //        style.top = px + 'px';
        //    }

        //    if (iv[index]) {
        //        ready(t, index);
        //    }

        //    if (time && active) {
        //        t.closest('.dwwl').addClass('dwa');
        //        iv[index] = setTimeout(function () {
        //            ready(t, index);
        //        }, time * 1000);
        //    }

        //    pos[index] = val;
        //}

        //function getValid(val, t, dir, multiple, select) {
        //    var selected,
        //        cell = $('.dw-li[data-val="' + val + '"]', t),
        //        cells = $('.dw-li', t),
        //        v = cells.index(cell),
        //        l = cells.length;

        //    if (multiple) {
        //        setGlobals(t);
        //    } else if (!cell.hasClass('dw-v')) { // Scroll to a valid cell
        //        var cell1 = cell,
        //            cell2 = cell,
        //            dist1 = 0,
        //            dist2 = 0;

        //        while (v - dist1 >= 0 && !cell1.hasClass('dw-v')) {
        //            dist1++;
        //            cell1 = cells.eq(v - dist1);
        //        }

        //        while (v + dist2 < l && !cell2.hasClass('dw-v')) {
        //            dist2++;
        //            cell2 = cells.eq(v + dist2);
        //        }

        //        // If we have direction (+/- or mouse wheel), the distance does not count
        //        if (((dist2 < dist1 && dist2 && dir !== 2) || !dist1 || (v - dist1 < 0) || dir == 1) && cell2.hasClass('dw-v')) {
        //            cell = cell2;
        //            v = v + dist2;
        //        } else {
        //            cell = cell1;
        //            v = v - dist1;
        //        }
        //    }

        //    selected = cell.hasClass('dw-sel');

        //    if (select) {
        //        if (!multiple) {
        //            $('.dw-sel', t).removeAttr('aria-selected');
        //            cell.attr('aria-selected', 'true');
        //        }

        //        // Add selected class to cell
        //        $('.dw-sel', t).removeClass('dw-sel');
        //        cell.addClass('dw-sel');
        //    }

        //    return {
        //        selected: selected,
        //        v: multiple ? constrain(v, min, max) : v,
        //        val: cell.hasClass('dw-v') ? cell.attr('data-val') : null
        //    };
        //}

        //function scrollToPos(time, index, manual, dir, active) {
        //    // Call validation event
        //    if (trigger('validate', [$markup, index, time, dir]) !== false) {
        //        // Set scrollers to position
        //        $('.dw-ul', $markup).each(function (i) {
        //            var t = $(this),
        //                multiple = t.closest('.dwwl').hasClass('dwwms'),
        //                sc = i == index || index === undefined,
        //                res = getValid(that._tempWheelArray[i], t, dir, multiple, true),
        //                selected = res.selected;

        //            if (!selected || sc) {
        //                // Set valid value
        //                that._tempWheelArray[i] = res.val;

        //                // Scroll to position
        //                scroll(t, i, res.v, sc ? time : 0.1, sc ? active : false);
        //            }
        //        });

        //        trigger('onValidated', []);

        //        // Reformat value if validation changed something
        //        that._tempValue = s.formatValue(that._tempWheelArray, that);

        //        if (that.live) {
        //            that._hasValue = manual || that._hasValue;
        //            setValue(manual, manual, 0, true);
        //        }

        //        that._header.html(formatHeader(that._tempValue));

        //        if (manual) {
        //            trigger('onChange', [that._tempValue]);
        //        }
        //    }

        //}

        //function calc(t, idx, val, dir, time, active) {
        //    val = constrain(val, min, max);

        //    // Set selected scroller value
        //    that._tempWheelArray[idx] = $('.dw-li', t).eq(val).attr('data-val');

        //    scroll(t, idx, val, time, active);

        //    setTimeout(function () {
        //        // Validate
        //        scrollToPos(time, idx, true, dir, active);
        //    }, 10);
        //}

        //function plus(t) {
        //    var val = pos[index] + 1;
        //    calc(t, index, val > max ? min : val, 1, 0.1);
        //}

        //function minus(t) {
        //    var val = pos[index] - 1;
        //    calc(t, index, val < min ? max : val, 2, 0.1);
        //}

        function infinite(wheel, pos) {
            var index = Math.round(-pos / itemHeight),
                diff = index - wheel._index,
                first = wheel._first,
                last = wheel._last;

            if (diff) {
                wheel._first += diff;
                wheel._last += diff;

                wheel._index = index;

                // Generate items
                setTimeout(function () {
                    if (diff > 0) {
                        wheel._$markup.append(generateItems(wheel, last + 1, last + diff));
                        $('.mbsc-sc-itm', wheel._$markup).slice(0, diff).remove();

                        // 3D
                        //if (s.scroll3d) {
                        //    generate3dItems(wheel, last - batchSize + 8 + 1, last - batchSize + 8 + diff);
                        //}
                    } else if (diff < 0) {
                        wheel._$markup.prepend(generateItems(wheel, first + diff, first - 1));
                        $('.mbsc-sc-itm', wheel._$markup).slice(diff).remove();

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

        function scrollToPos(time, index, dir) {
            var idx,
                ret = s.validate.call(el, that._tempWheelArray.slice(0), index, dir, that) || {};

            if (ret.valid) {
                that._tempWheelArray = ret.valid.slice(0);
            }

            trigger('onValidated', []);

            that._tempValue = s.formatValue(that._tempWheelArray, that);

            if (that._isVisible) {
                //if (that.live) {
                //    that._hasValue = manual || that._hasValue;
                //    setValue(manual, manual, 0, true);
                //}

                that._header.html(formatHeader(that._tempValue));

                //if (manual) {
                //    trigger('onChange', [that._tempValue]);
                //}

                $.each(wheels, function (i, wheel) {
                    idx = getIndex(wheel, i);

                    wheel._scroller.scroll(-idx * itemHeight - wheel._batch, time);

                    // Enable all items
                    wheel._$markup.find('.mbsc-sc-itm').removeClass('mbsc-sc-inv');

                    // Disable invalid items
                    if (ret.disabled && ret.disabled[i]) {
                        // TODO: disable dynamically generated elements as well
                        $.each(ret.disabled[i], function (j, v) {
                            wheel._$markup.find('.mbsc-sc-itm[data-val="' + v + '"]').addClass('mbsc-sc-inv');
                        });
                    }
                });
            }
        }

        function setValue(fill, change, time, noscroll, temp) {
            if (!noscroll) {
                scrollToPos(time);
            }

            //that._tempValue = s.formatValue(that._tempWheelArray, that);

            if (!temp) {
                that._wheelArray = that._tempWheelArray.slice(0);
                that._value = that._hasValue ? that._tempValue : null;
            }

            if (fill) {
                trigger('onValueFill', [that._hasValue ? that._tempValue : '', change]);

                if (that._isInput) {
                    $elm.val(that._hasValue ? that._tempValue : '');
                }

                if (change) {
                    that._preventChange = true;
                    $elm.change();
                }
            }
        }

        // Call the parent constructor
        classes.Frame.call(this, el, settings, true);

        // Public functions

        /**
        * Gets the selected wheel values, formats it, and set the value of the scroller instance.
        * If input parameter is true, populates the associated input element.
        * @param {Array} values Wheel values.
        * @param {Boolean} [fill=false] Also set the value of the associated input element.
        * @param {Number} [time=0] Animation time
        * @param {Boolean} [temp=false] If true, then only set the temporary value.(only scroll there but not set the value)
        * @param {Boolean} [change=false] Trigger change on the input element
        */
        that.setVal = that._setVal = function (val, fill, change, temp, time) {
            that._hasValue = val !== null && val !== undefined;
            that._tempWheelArray = $.isArray(val) ? val.slice(0) : s.parseValue.call(el, val, that) || [];
            setValue(fill, change === undefined ? fill : change, time, false, temp);
        };

        /**
         * Returns the selected value
         */
        that.getVal = that._getVal = function (temp) {
            var val = that._hasValue || temp ? that[temp ? '_tempValue' : '_value'] : null;
            return util.isNumeric(val) ? +val : val;
        };

        /*
         * Sets the wheel values (passed as an array)
         */
        that.setArrayVal = that.setVal;

        /*
         * Returns the selected wheel values as an array
         */
        that.getArrayVal = function (temp) {
            return temp ? that._tempWheelArray : that._wheelArray;
        };

        // @deprecated since 2.14.0, backward compatibility code
        // ---

        that.setValue = function (val, fill, time, temp, change) {
            that.setVal(val, fill, change, temp, time);
        };

        /**
        * Return the selected wheel values.
        */
        that.getValue = that.getArrayVal;

        // ---

        /**
        * Changes the values of a wheel, and scrolls to the correct position
        * @param {Array} idx Indexes of the wheels to change.
        * @param {Number} [time=0] Animation time when scrolling to the selected value on the new wheel.
        * @param {Boolean} [manual=false] Indicates that the change was triggered by the user or from code.
        */
        //that.changeWheel = function (idx, time, manual) {
        //    if ($markup) {
        //        var i = 0,
        //            nr = idx.length;

        //        $.each(s.wheels, function (j, wg) {
        //            $.each(wg, function (k, w) {
        //                if ($.inArray(i, idx) > -1) {
        //                    wheels[i] = w;
        //                    $('.dw-ul', $markup).eq(i).html(generateItems(i));
        //                    nr--;
        //                    if (!nr) {
        //                        that.position();
        //                        scrollToPos(time, undefined, manual);
        //                        return false;
        //                    }
        //                }
        //                i++;
        //            });
        //            if (!nr) {
        //                return false;
        //            }
        //        });
        //    }
        //};

        /**
        * Returns the closest valid cell.
        */
        //that.getValidCell = getValid;

        that.scroll = scroll;

        // Protected overrides

        that._generateContent = function () {
            var html = '',
                l = 0;

            $.each(s.wheels, function (i, wg) { // Wheel groups
                //html += '<div class="mbsc-w-p dwc' + (s.mode != 'scroller' ? ' dwpm' : ' dwsc') + (s.showLabel ? '' : ' dwhl') + '">' +
                //            '<div class="dwwc"' + (s.maxWidth ? '' : ' style="max-width:600px;"') + '>' +
                //                (hasFlex ? '' : '<table class="dw-tbl" cellpadding="0" cellspacing="0"><tr>');

                //$.each(wg, function (j, w) { // Wheels
                //    wheels[l] = w;
                //    lbl = w.label !== undefined ? w.label : j;
                //    html += '<' + (hasFlex ? 'div' : 'td') + ' class="dwfl"' + ' style="' +
                //                    (s.fixedWidth ? ('width:' + (s.fixedWidth[l] || s.fixedWidth) + 'px;') :
                //                    (s.minWidth ? ('min-width:' + (s.minWidth[l] || s.minWidth) + 'px;') : 'min-width:' + s.width + 'px;') +
                //                    (s.maxWidth ? ('max-width:' + (s.maxWidth[l] || s.maxWidth) + 'px;') : '')) + '">' +
                //                '<div class="dwwl dwwl' + l + (w.multiple ? ' dwwms' : '') + '">' +
                //                (s.mode != 'scroller' ?
                //                    '<div class="dwb-e dwwb dwwbp ' + (s.btnPlusClass || '') + '" style="height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;"><span>+</span></div>' + // + button
                //                    '<div class="dwb-e dwwb dwwbm ' + (s.btnMinusClass || '') + '" style="height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;"><span>&ndash;</span></div>' : '') + // - button
                //                '<div class="dwl">' + lbl + '</div>' + // Wheel label
                //                '<div tabindex="0" aria-live="off" aria-label="' + lbl + '" role="listbox" class="dwww">' +
                //                    '<div class="dww" style="height:' + (s.rows * itemHeight) + 'px;">' +
                //                        '<div class="dw-ul" style="margin-top:' + (w.multiple ? (s.mode == 'scroller' ? 0 : itemHeight) : s.rows / 2 * itemHeight - itemHeight / 2) + 'px;">';

                //    // Create wheel values
                //    html += generateItems(l) +
                //        '</div></div><div class="dwwo"></div></div><div class="dwwol"' +
                //        (s.selectedLineHeight ? ' style="height:' + itemHeight + 'px;margin-top:-' + (itemHeight / 2 + (s.selectedLineBorder || 0)) + 'px;"' : '') + '></div></div>' +
                //        (hasFlex ? '</div>' : '</td>');

                //    l++;
                //});

                //html += (hasFlex ? '' : '</tr></table>') + '</div></div>';
                html += '<div class="mbsc-w-p mbsc-sc-whl-gr' +
                    //(s.scroll3d ? ' mbsc-sc-whl-gr-3d' : '') +
                    (s.mode != 'scroller' ? ' mbsc-sc-cp' : '') +
                    (s.showLabel ? ' mbsc-sc-lbl-v' : '') + '">' +
                            //'<div class="dwwc"' + (s.maxWidth ? '' : ' style="max-width:600px;"') + '>' +
                                (hasFlex ? '' : '<table class="dw-tbl" cellpadding="0" cellspacing="0"><tr>');

                $.each(wg, function (j, w) { // Wheels
                    wheels[l] = initWheel(w, l);

                    html += '<' + (hasFlex ? 'div' : 'td') + ' class="mbsc-sc-whl"' + ' style="' +
                                    'height:' + (s.rows * itemHeight) + 'px;' +
                                    (s.fixedWidth ? ('width:' + (s.fixedWidth[l] || s.fixedWidth) + 'px;') :
                                    (s.minWidth ? ('min-width:' + (s.minWidth[l] || s.minWidth) + 'px;') : 'min-width:' + s.width + 'px;') +
                                    (s.maxWidth ? ('max-width:' + (s.maxWidth[l] || s.maxWidth) + 'px;') : '')) + '">' +
                                //'<div class="dwwl dwwl' + l + (w.multiple ? ' dwwms' : '') + '">' +
                                //(s.mode != 'scroller' ?
                                //    '<div class="dwb-e dwwb dwwbp ' + (s.btnPlusClass || '') + '" style="height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;"><span>+</span></div>' + // + button
                                //    '<div class="dwb-e dwwb dwwbm ' + (s.btnMinusClass || '') + '" style="height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;"><span>&ndash;</span></div>' : '') + // - button
                                //'<div class="mbsc-sc-lbl">' + lbl + '</div>' + // Wheel label
                                //'<div tabindex="0" aria-live="off" aria-label="' + lbl + '" role="listbox" class="dwww">' +
                                    //'<div class="dww" style="height:' + (s.rows * itemHeight) + 'px;">' +
                                        //'<div class="dw-ul" style="margin-top:' + (w.multiple ? (s.mode == 'scroller' ? 0 : itemHeight) : s.rows / 2 * itemHeight - itemHeight / 2) + 'px;">';
                                        '<div class="mbsc-sc-whl-c" style="height:' + itemHeight + 'px;margin-top:-' +
                                            (itemHeight / 2 + (s.selectedLineBorder || 0)) + 'px;' +
                                            //(s.scroll3d ? pref + 'transform: translateZ(' + (itemHeight * s.rows / 2) + 'px);' : '') +
                                        '">' +
                                            '<div class="mbsc-sc-whl-sc" style="margin-top:' + w._margin + 'px;">';

                    // Create wheel values
                    html += generateItems(w, w._first, w._last) +
                        '</div></div>';

                    //if (s.scroll3d) {
                    //    html += '<div class="mbsc-sc-whl-3d" style="height:' + itemHeight + 'px;margin-top:-' + (itemHeight / 2) + 'px;">';
                    //    for (var k = 0; k < 16; k++) {
                    //        html += '<div class="mbsc-btn mbsc-sc-itm-3d" style="' + pref + 'transform:rotateX(' + ((7 - k - w._offset) * 22.5 % 360) + 'deg) translateZ(' + (itemHeight * s.rows / 2) + 'px);height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;">' + getItem(w, w.values, w._index + k - 7) + '</div>';
                    //    }
                    //    html += '</div>';
                    //}

                    html +=
                        //'</div></div><div class="dwwo"></div></div><div class="dwwol"' +
                        //(s.selectedLineHeight ? ' style="height:' + itemHeight + 'px;margin-top:-' + (itemHeight / 2 + (s.selectedLineBorder || 0)) + 'px;"' : '') + '></div></div>' +
                        (hasFlex ? '</div>' : '</td>');

                    l++;
                });

                html += (hasFlex ? '' : '</tr></table>') + '</div>';
            });

            return html;
        };

        //that._attachEvents = function ($markup) {
        //    $markup
        //        .on('keydown', '.dwwl', onKeyDown)
        //        .on('keyup', '.dwwl', onKeyUp)
        //        .on('touchstart mousedown', '.dwwl', onStart)
        //        .on('touchmove', '.dwwl', onMove)
        //        .on('touchend', '.dwwl', onEnd)
        //        .on('touchstart mousedown', '.dwwb', onBtnStart)
        //        .on('touchend', '.dwwb', onBtnEnd);

        //    if (s.mousewheel) {
        //        $markup.on('wheel mousewheel', '.dwwl', onScroll);
        //    }
        //};

        that._detachEvents = function ($m) {
            $('.mbsc-sc-whl', $m).mobiscroll('destroy');
        };

        that._markupReady = function ($m) {
            $markup = $m;

            $('.mbsc-sc-whl', $markup).each(function (i) {
                var idx,
                    wheel = wheels[i],
                    len = wheel.values.length;

                wheel._$markup = $('.mbsc-sc-whl-sc', this);
                wheel._$3d = $('.mbsc-sc-whl-3d', this);

                wheel._scroller = new ms.classes.ScrollView(this, {
                    mousewheel: s.mousewheel,
                    moveElement: wheel._$markup,
                    initialPos: -wheel._index * itemHeight,
                    contSize: 0,
                    snap: itemHeight,
                    minScroll: -wheel.max * itemHeight,
                    maxScroll: -wheel.min * itemHeight,
                    maxSnapScroll: batchSize,
                    prevDef: true,
                    stopProp: true,
                    onScroll: function (pos, time/*, easing*/) {
                        //if (s.scroll3d && easing !== false) {
                        //    wheel._$3d[0].style[pr + 'Transition'] = time ? pref + 'transform ' + Math.round(time) + 'ms ' + easing : '';
                        //    wheel._$3d[0].style[pr + 'Transform'] = 'rotateX(' + (-pos * 22.5 / itemHeight) + 'deg)';
                        //}

                        if (time === false) {
                            infinite(wheel, pos);
                        } else {
                            idx = Math.round(-pos / itemHeight);
                            // Get the value of the new position
                            that._tempWheelArray[i] = getItem(wheel, wheel.keys, Math.round(-pos / itemHeight));
                            // In case of circular wheels calculate the offset of the current batch
                            wheel._batch = wheel._array ? Math.floor(idx / len) * len * itemHeight : 0;
                            // Validate
                            // TODO: pass direction
                            scrollToPos(time, i);
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

        that._readValue = function () {
            var v = $elm.val() || '';

            if (v !== '') {
                that._hasValue = true;
            }

            that._tempWheelArray = that._hasValue && that._wheelArray ? that._wheelArray.slice(0) : s.parseValue.call(el, v, that) || [];

            setValue();
        };

        that._processSettings = function () {
            s = that.settings;
            trigger = that.trigger;
            itemHeight = s.height;
            lines = s.multiline;

            that._isLiquid = (s.layout || (/top|bottom/.test(s.display) && s.wheels.length == 1 ? 'liquid' : '')) === 'liquid';

            // @deprecated since 2.15.0, backward compatibility code
            // ---
            if (s.formatResult) {
                s.formatValue = s.formatResult;
            }
            // ---

            if (lines > 1) {
                s.cssClass = (s.cssClass || '') + ' dw-ml';
            }

            // Ensure a minimum number of 3 items if clickpick buttons present
            if (s.mode != 'scroller') {
                s.rows = Math.max(3, s.rows);
            }
        };

        // Properties

        that._selectedValues = {};

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
        _defaults: $.extend({}, classes.Frame.prototype._defaults, {
            // Options
            minWidth: 80,
            height: 40,
            rows: 3,
            multiline: 1,
            delay: 300,
            readonly: false,
            showLabel: true,
            //scroll3d: false,
            confirmOnTap: true,
            wheels: [],
            mode: 'scroller',
            preset: '',
            speedUnit: 0.0012,
            timeUnit: 0.08,
            formatValue: function (d) {
                return d.join(' ');
            },
            parseValue: function (value, inst) {
                var val = [],
                    ret = [],
                    i = 0,
                    found,
                    keys;

                if (value !== null && value !== undefined) {
                    val = (value + '').split(' ');
                }

                $.each(inst.settings.wheels, function (j, wg) {
                    $.each(wg, function (k, w) {
                        keys = w.keys || w.values;
                        found = keys[0]; // Default to first wheel value if not found
                        $.each(keys, function (l, key) {
                            if (val[i] == key) { // Don't do strict comparison
                                found = key;
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
})(jQuery, window, document);