/*jslint eqeq: true, plusplus: true, undef: true, sloppy: true, vars: true, forin: true, nomen: true */
(function ($) {

    $.mobiscroll.classes.Scroller = function (elem, settings) {
        var m,
            v,
            dw,
            persp,
            overlay,
            ww, // Window width
            wh, // Window height
            mw, // Modal width
            mh, // Modal height
            lock,
            anim,
            theme,
            lang,
            click,
            hasButtons,
            scrollable,
            moved,
            start,
            startTime,
            stop,
            p,
            min,
            max,
            target,
            index,
            isLiquid,
            isModal,
            itemHeight,
            lines,
            timer,
            readOnly,
            preventChange,
            preventPos,
            wndw,
            doc,
            buttons,
            btn,
            that = this,
            e = elem,
            elm = $(e),
            s = extend({}, defaults, userdef),
            pres = {},
            iv = {},
            pos = {},
            pixels = {},
            wheels = [],
            elmList = [],
            input = elm.is('input'),
            visible = false;

        // Event handlers

        function onStart(e) {
            // Scroll start
            if (testTouch(e) && !move && !click && !btn && !isReadOnly(this)) {
                // Prevent touch highlight
                e.preventDefault();

                move = true;
                scrollable = s.mode != 'clickpick';
                target = $('.dw-ul', this);
                setGlobals(target);
                moved = iv[index] !== undefined; // Don't allow tap, if still moving
                p = moved ? getCurrentPosition(target) : pos[index];
                start = getCoord(e, 'Y');
                startTime = new Date();
                stop = start;
                scroll(target, index, p, 0.001);

                if (scrollable) {
                    target.closest('.dwwl').addClass('dwa');
                }

                if (e.type === 'mousedown') {
                    $(document).on('mousemove', onMove).on('mouseup', onEnd);
                }
            }
        }

        function onMove(e) {
            if (scrollable) {
                // Prevent scroll
                e.preventDefault();
                e.stopPropagation();
                stop = getCoord(e, 'Y');
                scroll(target, index, constrain(p + (start - stop) / itemHeight, min - 1, max + 1));
            }
            if (start !== stop) {
                moved = true;
            }
        }

        function onEnd(e) {
            var time = new Date() - startTime,
                val = constrain(p + (start - stop) / itemHeight, min - 1, max + 1),
                speed,
                dist,
                tindex,
                ttop = target.offset().top;

            if (has3d && time < 300) {
                speed = (stop - start) / time;
                dist = (speed * speed) / s.speedUnit;
                if (stop - start < 0) {
                    dist = -dist;
                }
            } else {
                dist = stop - start;
            }

            tindex = Math.round(p - dist / itemHeight);

            if (!dist && !moved) { // this is a "tap"
                var idx = Math.floor((stop - ttop) / itemHeight),
                    li = $($('.dw-li', target)[idx]),
                    hl = scrollable;
                if (event('onValueTap', [li]) !== false) {
                    tindex = idx;
                } else {
                    hl = true;
                }

                if (hl) {
                    li.addClass('dw-hl'); // Highlight
                    setTimeout(function () {
                        li.removeClass('dw-hl');
                    }, 200);
                }
            }

            if (scrollable) {
                calc(target, tindex, 0, true, Math.round(val));
            }

            if (e.type === 'mouseup') {
                $(document).off('mousemove', onMove).off('mouseup', onEnd);
            }

            move = false;
            target = null;
        }

        function onBtnStart(e) {
            // Can't call preventDefault here, it kills page scroll
            if (btn) {
                btn.removeClass('dwb-a');
            }
            btn = $(this);
            // Active button
            if (!btn.hasClass('dwb-d') && !btn.hasClass('dwb-nhl')) {
                btn.addClass('dwb-a');
            }
            // +/- buttons
            if (btn.hasClass('dwwb')) {
                if (testTouch(e)) {
                    step(e, btn.closest('.dwwl'), btn.hasClass('dwwbp') ? plus : minus);
                }
            }
            if (e.type === 'mousedown') {
                $(document).on('mouseup', onBtnEnd);
            }
        }

        function onBtnEnd(e) {
            if (click) {
                clearInterval(timer);
                click = false;
            }
            if (btn) {
                btn.removeClass('dwb-a');
                btn = null;
            }
            if (e.type === 'mouseup') {
                $(document).off('mousedown', onBtnEnd);
            }
        }

        function onKeyDown(e) {
            if (e.keyCode == 38) { // up
                step(e, $(this), minus);
            } else if (e.keyCode == 40) { // down
                step(e, $(this), plus);
            }
        }

        function onKeyUp(e) {
            if (click) {
                clearInterval(timer);
                click = false;
            }
        }

        function onScroll(e) {
            if (!isReadOnly(this)) {
                e.preventDefault();
                e = e.originalEvent || e;
                var delta = e.wheelDelta ? (e.wheelDelta / 120) : (e.detail ? (-e.detail / 3) : 0),
                    t = $('.dw-ul', this);

                setGlobals(t);
                calc(t, Math.round(pos[index] - delta), delta < 0 ? 1 : 2);
            }
        }

        // Private functions

        function step(e, w, func) {
            e.stopPropagation();
            e.preventDefault();
            if (!click && !isReadOnly(w) && !w.hasClass('dwa')) {
                click = true;
                // + Button
                var t = w.find('.dw-ul');

                setGlobals(t);
                clearInterval(timer);
                timer = setInterval(function () { func(t); }, s.delay);
                func(t);
            }
        }

        function isReadOnly(wh) {
            if ($.isArray(s.readonly)) {
                var i = $('.dwwl', dw).index(wh);
                return s.readonly[i];
            }
            return s.readonly;
        }

        function generateWheelItems(i) {
            var html = '<div class="dw-bf">',
                ww = wheels[i],
                w = ww.values ? ww : convert(ww),
                l = 1,
                labels = w.labels || [],
                values = w.values,
                keys = w.keys || values;

            $.each(values, function (j, v) {
                if (l % 20 == 0) {
                    html += '</div><div class="dw-bf">';
                }
                html += '<div role="option" aria-selected="false" class="dw-li dw-v" data-val="' + keys[j] + '"' + (labels[j] ? ' aria-label="' + labels[j] + '"' : '') + ' style="height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;">' +
                    '<div class="dw-i"' + (lines > 1 ? ' style="line-height:' + Math.round(itemHeight / lines) + 'px;font-size:' + Math.round(itemHeight / lines * 0.8) + 'px;"' : '') + '>' + v + '</div></div>';
                l++;
            });

            html += '</div>';
            return html;
        }

        function setGlobals(t) {
            min = $('.dw-li', t).index($('.dw-v', t).eq(0));
            max = $('.dw-li', t).index($('.dw-v', t).eq(-1));
            index = $('.dw-ul', dw).index(t);
        }

        function formatHeader(v) {
            var t = s.headerText;
            return t ? (typeof t === 'function' ? t.call(e, v) : t.replace(/\{value\}/i, v)) : '';
        }

        function read() {
            that.temp = that.values ? that.values.slice(0) : s.parseValue(elm.val() || '', that);
            setVal();
        }

        function getCurrentPosition(t) {
            var style = window.getComputedStyle ? getComputedStyle(t[0]) : t[0].style,
                matrix,
                px;

            if (has3d) {
                $.each(['t', 'webkitT', 'MozT', 'OT', 'msT'], function (i, v) {
                    if (style[v + 'ransform'] !== undefined) {
                        matrix = style[v + 'ransform'];
                        return false;
                    }
                });
                matrix = matrix.split(')')[0].split(', ');
                px = matrix[13] || matrix[5];
            } else {
                px = style.top.replace('px', '');
            }

            return Math.round(m - (px / itemHeight));
        }

        function ready(t, i) {
            clearTimeout(iv[i]);
            delete iv[i];
            t.closest('.dwwl').removeClass('dwa');
        }

        function scroll(t, index, val, time, active) {
            var px = (m - val) * itemHeight,
                style = t[0].style,
                i;

            if (px == pixels[index] && iv[index]) {
                return;
            }

            if (time && px != pixels[index]) {
                // Trigger animation start event
                event('onAnimStart', [dw, index, time]);
            }

            pixels[index] = px;

            style[pr + 'Transition'] = 'all ' + (time ? time.toFixed(3) : 0) + 's ease-out';

            if (has3d) {
                style[pr + 'Transform'] = 'translate3d(0,' + px + 'px,0)';
            } else {
                style.top = px + 'px';
            }

            if (iv[index]) {
                ready(t, index);
            }

            if (time && active) {
                t.closest('.dwwl').addClass('dwa');
                iv[index] = setTimeout(function () {
                    ready(t, index);
                }, time * 1000);
            }

            pos[index] = val;
        }

        function getValid(val, t, dir) {
            var cell = $('.dw-li[data-val="' + val + '"]', t),
                cells = $('.dw-li', t),
                v = cells.index(cell),
                l = cells.length;

            // Scroll to a valid cell
            if (!cell.hasClass('dw-v')) {
                var cell1 = cell,
                    cell2 = cell,
                    dist1 = 0,
                    dist2 = 0;

                while (v - dist1 >= 0 && !cell1.hasClass('dw-v')) {
                    dist1++;
                    cell1 = cells.eq(v - dist1);
                }

                while (v + dist2 < l && !cell2.hasClass('dw-v')) {
                    dist2++;
                    cell2 = cells.eq(v + dist2);
                }

                // If we have direction (+/- or mouse wheel), the distance does not count
                if (((dist2 < dist1 && dist2 && dir !== 2) || !dist1 || (v - dist1 < 0) || dir == 1) && cell2.hasClass('dw-v')) {
                    cell = cell2;
                    v = v + dist2;
                } else {
                    cell = cell1;
                    v = v - dist1;
                }
            }

            return {
                cell: cell,
                v: v,
                val: cell.hasClass('dw-v') ? cell.attr('data-val') : null
            };
        }

        function scrollToPos(time, index, manual, dir, active) {
            // Call validation event
            if (event('validate', [dw, index, time, dir]) !== false) {
                // Set scrollers to position
                $('.dw-ul', dw).each(function (i) {
                    var t = $(this),
                        sc = i == index || index === undefined,
                        res = getValid(that.temp[i], t, dir),
                        cell = res.cell;

                    if (!(cell.hasClass('dw-sel')) || sc) {
                        // Set valid value
                        that.temp[i] = res.val;

                        if (!s.multiple) {
                            $('.dw-sel', t).removeAttr('aria-selected');
                            cell.attr('aria-selected', 'true');
                        }

                        // Add selected class to cell
                        $('.dw-sel', t).removeClass('dw-sel');
                        cell.addClass('dw-sel');

                        // Scroll to position
                        scroll(t, i, res.v, sc ? time : 0.1, sc ? active : false);
                    }
                });

                // Reformat value if validation changed something
                v = s.formatResult(that.temp);
                if (that.live) {
                    setVal(manual, manual, 0, true);
                }

                $('.dwv', dw).html(formatHeader(v));

                if (manual) {
                    event('onChange', [v]);
                }
            }

        }

        function event(name, args) {
            var ret;
            args.push(that);
            $.each([userdef, theme, pres, settings], function (i, v) {
                if (v && v[name]) { // Call preset event
                    ret = v[name].apply(e, args);
                }
            });
            return ret;
        }

        function calc(t, val, dir, anim, orig) {
            val = constrain(val, min, max);

            var cell = $('.dw-li', t).eq(val),
                o = orig === undefined ? val : orig,
                active = orig !== undefined,
                idx = index,
                time = anim ? (val == o ? 0.1 : Math.abs((val - o) * s.timeUnit)) : 0;

            // Set selected scroller value
            that.temp[idx] = cell.attr('data-val');

            scroll(t, idx, val, time, active);

            setTimeout(function () {
                // Validate
                scrollToPos(time, idx, true, dir, active);
            }, 10);
        }

        function plus(t) {
            var val = pos[index] + 1;
            calc(t, val > max ? min : val, 1, true);
        }

        function minus(t) {
            var val = pos[index] - 1;
            calc(t, val < min ? max : val, 2, true);
        }

        function setVal(fill, change, time, noscroll, temp) {
            if (visible && !noscroll) {
                scrollToPos(time);
            }

            v = s.formatResult(that.temp);

            if (!temp) {
                that.values = that.temp.slice(0);
                that.val = v;
            }

            if (fill) {

                event('onValueFill', [v, change]);

                if (input) {
                    elm.val(v);
                    if (change) {
                        preventChange = true;
                        elm.change();
                    }
                }
            }
        }

        function hide(prevAnim) {
            dw.remove();
            if (activeElm && !prevAnim) {
                setTimeout(function () {
                    preventShow = true;
                    activeElm.focus();
                }, 200);
            }
            visible = false;
        }

        function attachPosition(ev, checkLock) {
            var debounce;
            wndw.on(ev, function (e) {
                clearTimeout(debounce);
                debounce = setTimeout(function () {
                    if ((lock && checkLock) || !checkLock) {
                        that.position(!checkLock);
                    }
                }, 200);
            });
        }

        // Public functions

        /**
        * Positions the scroller on the screen.
        */
        that.position = function (check) {

            var nw = persp.width(), // To get the width without scrollbar
                nh = wndw[0].innerHeight || wndw.innerHeight();

            if (!(ww === nw && wh === nh && check) && !preventPos && (event('onPosition', [dw, nw, nh]) !== false) && isModal) {
                var w,
                    l,
                    t,
                    aw, // anchor width
                    ah, // anchor height
                    ap, // anchor position
                    at, // anchor top
                    al, // anchor left
                    arr, // arrow
                    arrw, // arrow width
                    arrl, // arrow left
                    dh,
                    scroll,
                    totalw = 0,
                    minw = 0,
                    sl = wndw.scrollLeft(),
                    st = wndw.scrollTop(),
                    wr = $('.dwwr', dw),
                    d = $('.dw', dw),
                    css = {},
                    anchor = s.anchor === undefined ? elm : s.anchor;

                if (/modal|bubble/.test(s.display)) {
                    wr.width('');
                    $('.dwc', dw).each(function () {
                        w = $(this).outerWidth(true);
                        totalw += w;
                        minw = (w > minw) ? w : minw;
                    });
                    w = totalw > nw ? minw : totalw;
                    wr.width(w).css('white-space', totalw > nw ? '' : 'nowrap');
                }

                mw = d.outerWidth();
                mh = d.outerHeight(true);
                lock = mh <= nh && mw <= nw;

                that.scrollLock = lock;

                if (s.display == 'modal') {
                    l = Math.max(0, (nw - mw) / 2);
                    t = st + (nh - mh) / 2;
                } else if (s.display == 'bubble') {
                    scroll = true;
                    arr = $('.dw-arrw-i', dw);
                    ap = anchor.offset();
                    at = Math.abs($(s.context).offset().top - ap.top);
                    al = Math.abs($(s.context).offset().left - ap.left);

                    // horizontal positioning
                    aw = anchor.outerWidth();
                    ah = anchor.outerHeight();
                    l = constrain(al - (d.outerWidth(true) - aw) / 2 - sl, 3, nw - mw - 3);

                    // vertical positioning
                    t = at - mh; // above the input
                    if ((t < st) || (at > st + nh)) { // if doesn't fit above or the input is out of the screen
                        d.removeClass('dw-bubble-top').addClass('dw-bubble-bottom');
                        t = at + ah; // below the input
                    } else {
                        d.removeClass('dw-bubble-bottom').addClass('dw-bubble-top');
                    }

                    // Calculate Arrow position
                    arrw = arr.outerWidth();
                    arrl = constrain(al + aw / 2 - (l + (mw - arrw) / 2) - sl, 0, arrw);

                    // Limit Arrow position
                    $('.dw-arr', dw).css({ left: arrl });
                } else {
                    if (s.display == 'top') {
                        t = st;
                    } else if (s.display == 'bottom') {
                        t = st + nh - mh;
                    }
                }

                css.top = t < 0 ? 0 : t;
                css.left = l;
                d.css(css);

                // If top + modal height > doc height, increase doc height
                persp.height(0);
                dh = Math.max(t + mh, s.context == 'body' ? $(document).height() : doc.scrollHeight);
                persp.css({ height: dh, left: sl });

                // Scroll needed
                if (scroll && ((t + mh > st + nh) || (at > st + nh))) {
                    preventPos = true;
                    setTimeout(function () { preventPos = false; }, 300);
                    wndw.scrollTop(Math.min(t + mh - nh, dh - nh));
                }
            }

            ww = nw;
            wh = nh;
        };

        /**
        * Enables the scroller and the associated input.
        */
        that.enable = function () {
            s.disabled = false;
            if (input) {
                elm.prop('disabled', false);
            }
        };

        /**
        * Disables the scroller and the associated input.
        */
        that.disable = function () {
            s.disabled = true;
            if (input) {
                elm.prop('disabled', true);
            }
        };

        /**
        * Gets the selected wheel values, formats it, and set the value of the scroller instance.
        * If input parameter is true, populates the associated input element.
        * @param {Array} values Wheel values.
        * @param {Boolean} [fill=false] Also set the value of the associated input element.
        * @param {Number} [time=0] Animation time
        * @param {Boolean} [temp=false] If true, then only set the temporary value.(only scroll there but not set the value)
        */
        that.setValue = function (values, fill, time, temp, change) {
            that.temp = $.isArray(values) ? values.slice(0) : s.parseValue.call(e, values + '', that);
            setVal(fill, change === undefined ? fill : change, time, false, temp);
        };

        /**
        * Return the selected wheel values.
        */
        that.getValue = function () {
            return that.values;
        };

        /**
        * Return selected values, if in multiselect mode.
        */
        that.getValues = function () {
            var ret = [],
                i;

            for (i in that._selectedValues) {
                ret.push(that._selectedValues[i]);
            }
            return ret;
        };

        /**
        * Changes the values of a wheel, and scrolls to the correct position
        * @param {Array} idx Indexes of the wheels to change.
        * @param {Number} [time=0] Animation time when scrolling to the selected value on the new wheel.
        * @param {Boolean} [manual=false] Indicates that the change was triggered by the user or from code.
        */
        that.changeWheel = function (idx, time, manual) {
            if (dw) {
                var i = 0,
                    nr = idx.length;

                $.each(s.wheels, function (j, wg) {
                    $.each(wg, function (k, w) {
                        if ($.inArray(i, idx) > -1) {
                            wheels[i] = w;
                            $('.dw-ul', dw).eq(i).html(generateWheelItems(i));
                            nr--;
                            if (!nr) {
                                that.position();
                                scrollToPos(time, undefined, manual);
                                return false;
                            }
                        }
                        i++;
                    });
                    if (!nr) {
                        return false;
                    }
                });
            }
        };

        /**
        * Return true if the scroller is currently visible.
        */
        that.isVisible = function () {
            return visible;
        };

        /**
        * Attach tap event to the given element.
        */
        that.tap = function (el, handler, prevent) {
            var startX,
                startY;

            if (s.tap) {
                el.on('touchstart.dw', function (e) {
                    // Can't always call preventDefault here, it kills page scroll
                    if (prevent) {
                        e.preventDefault();
                    }
                    startX = getCoord(e, 'X');
                    startY = getCoord(e, 'Y');
                }).on('touchend.dw', function (e) {
                    // If movement is less than 20px, fire the click event handler
                    if (Math.abs(getCoord(e, 'X') - startX) < 20 && Math.abs(getCoord(e, 'Y') - startY) < 20) {
                        // preventDefault and setTimeout are needed by iOS
                        e.preventDefault();
                        setTimeout(function () {
                            handler.call(this, e);
                        }, isOldAndroid ? 400 : 10);
                    }
                    setTap();
                });
            }

            el.on('click.dw', function (e) {
                if (!tap) {
                    // If handler was not called on touchend, call it on click;
                    handler.call(this, e);
                }
                e.preventDefault();
            });

        };

        /**
        * Shows the scroller instance.
        * @param {Boolean} prevAnim - Prevent animation if true
        */
        that.show = function (prevAnim) {
            // Create wheels
            var lbl,
                html,
                l = 0,
                mAnim = '';

            if (s.disabled || visible) {
                return;
            }

            if (anim !== false) {
                if (s.display == 'top') {
                    anim = 'slidedown';
                }
                if (s.display == 'bottom') {
                    anim = 'slideup';
                }
            }

            // Parse value from input
            read();

            event('onBeforeShow', []);

            if (isModal && anim && !prevAnim) {
                mAnim = 'dw-' + anim + ' dw-in';
            }

            // Create wheels containers
            html = '<div' + (isModal ? ' tabindex="0"' : '') + ' role="dialog" class="dw-w ' + s.theme + ' dw-' + s.display +
                (isLiquid ? ' dw-liq' : '') +
                (lines > 1 ? ' dw-ml' : '') +
                (hasButtons ? '' : ' dw-nobtn') + '">' +
                    '<div class="dw-persp">' +
                        (isModal ? '<div class="dwo"></div>' : '') + // Overlay
                        '<div class="dw dwbg ' + mAnim + '">' + // Popup
                            (s.display === 'bubble' ? '<div class="dw-arrw"><div class="dw-arrw-i"><div class="dw-arr"></div></div></div>' : '') + // Bubble arrow
                            '<div class="dwwr">' + // Popup content
                                '<div aria-live="assertive" class="dwv' + (s.headerText ? '' : ' dw-hidden') + '"></div>' + // Header
                                '<div class="dwcc">'; // Wheel group container

            $.each(s.wheels, function (i, wg) { // Wheel groups
                html += '<div class="dwc' + (s.mode != 'scroller' ? ' dwpm' : ' dwsc') + (s.showLabel ? '' : ' dwhl') + '">' +
                            '<div class="dwwc"' + (s.maxWidth ? '' : ' style="max-width:600px;"') + '>' +
                                (hasFlex ? '' : '<table class="dw-tbl" cellpadding="0" cellspacing="0"><tr>');

                $.each(wg, function (j, w) { // Wheels
                    wheels[l] = w;
                    lbl = w.label !== undefined ? w.label : j;
                    html += '<' + (hasFlex ? 'div' : 'td') + ' class="dwfl"' + ' style="' + 
                                    (s.fixedWidth ? ('width:' + (s.fixedWidth[l] || s.fixedWidth) + 'px;') :
                                    (s.minWidth ? ('min-width:' + (s.minWidth[l] || s.minWidth) + 'px;') : 'min-width:' + s.width + 'px;') +
                                    (s.maxWidth ? ('max-width:' + (s.maxWidth[l] || s.maxWidth) + 'px;') : '')) + '">' +
                                '<div class="dwwl dwwl' + l + '">' +
                                (s.mode != 'scroller' ?
                                    '<a href="#" tabindex="-1" class="dwb-e dwwb dwwbp" style="height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;"><span>+</span></a>' + // + button
                                    '<a href="#" tabindex="-1" class="dwb-e dwwb dwwbm" style="height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;"><span>&ndash;</span></a>' : '') + // - button
                                '<div class="dwl">' + lbl + '</div>' + // Wheel label
                                '<div tabindex="0" aria-live="off" aria-label="' + lbl + '" role="listbox" class="dwww">' +
                                    '<div class="dww" style="height:' + (s.rows * itemHeight) + 'px;">' +
                                        '<div class="dw-ul">';

                    // Create wheel values
                    html += generateWheelItems(l) +
                        '</div></div><div class="dwwo"></div></div><div class="dwwol"' + 
                        (s.selectedLineHeight ? ' style="height:' + itemHeight + 'px;margin-top:-' + (itemHeight / 2 + (s.selectedLineBorder || 0)) + 'px;"' : '') + '></div></div>' +
                        (hasFlex ? '</div>' : '</td>');

                    l++;
                });

                html += (hasFlex ? '' : '</tr></table>') + '</div></div>';
            });

            html += '</div>';

            if (isModal && hasButtons) {
                html += '<div class="dwbc">';
                $.each(buttons, function (i, b) {
                    b = (typeof b === 'string') ? that.buttons[b] : b;
                    html += '<span' + (s.btnWidth ? ' style="width:' + (100 / buttons.length) + '%"' : '') + ' class="dwbw ' + b.css + '"><a href="#" class="dwb dwb' + i + ' dwb-e" role="button">' + b.text + '</a></span>';
                });
                html += '</div>';
            }
            html += '</div></div></div></div>';

            dw = $(html);
            persp = $('.dw-persp', dw);
            overlay = $('.dwo', dw);

            visible = true;

            scrollToPos();

            event('onMarkupReady', [dw]);

            // Show
            if (isModal) {
                ms.activeInstance = that;
                dw.appendTo(s.context);
                if (has3d && anim && !prevAnim) {
                    dw.addClass('dw-trans').on(animEnd, function () {
                        dw.removeClass('dw-trans').find('.dw').removeClass(mAnim);
                    });
                }
            } else if (elm.is('div')) {
                elm.html(dw);
            } else {
                dw.insertAfter(elm);
            }

            event('onMarkupInserted', [dw]);

            if (isModal) {
                // Enter / ESC
                $(window).on('keydown.dw', function (e) {
                    if (e.keyCode == 13) {
                        that.select();
                    } else if (e.keyCode == 27) {
                        that.cancel();
                    }
                });

                // Prevent scroll if not specified otherwise
                if (s.scrollLock) {
                    dw.on('touchmove', function (e) {
                        if (lock) {
                            e.preventDefault();
                        }
                    });
                }

                // Disable inputs to prevent bleed through (Android bug)
                if (isOldAndroid) {
                    $('input,select,button', doc).each(function () {
                        if (!this.disabled) {
                            $(this).addClass('dwtd').prop('disabled', true);
                        }
                    });
                }

                attachPosition('scroll.dw', true);
            }

            // Set position
            that.position();
            attachPosition('orientationchange.dw resize.dw', false);

            // Events
            dw.on('DOMMouseScroll mousewheel', '.dwwl', onScroll)
                .on('keydown', '.dwwl', onKeyDown)
                .on('keyup', '.dwwl', onKeyUp)
                .on('selectstart mousedown', prevdef) // Prevents blue highlight on Android and text selection in IE
                .on('click', '.dwb-e', prevdef)
                .on('keydown', '.dwb-e', function (e) {
                    if (e.keyCode == 32) { // Space
                        e.preventDefault();
                        e.stopPropagation();
                        $(this).click();
                    }
                });

            setTimeout(function () {
                // Init buttons
                $.each(buttons, function (i, b) {
                    that.tap($('.dwb' + i, dw), function (e) {
                        b = (typeof b === 'string') ? that.buttons[b] : b;
                        b.handler.call(this, e, that);
                    }, true);
                });

                if (s.closeOnOverlay) {
                    that.tap(overlay, function () {
                        that.cancel();
                    });
                }

                dw.focus()
                    .on('touchstart mousedown', '.dwwl', onStart)
                    .on('touchmove', '.dwwl', onMove)
                    .on('touchend', '.dwwl', onEnd)
                    .on('touchstart mousedown', '.dwb-e', onBtnStart)
                    .on('touchend', '.dwb-e', onBtnEnd);

            }, 300);

            event('onShow', [dw, v]);
        };

        /**
        * Hides the scroller instance.
        */
        that.hide = function (prevAnim, btn, force) {

            // If onClose handler returns false, prevent hide
            if (!visible || (!force && event('onClose', [v, btn]) === false)) {
                return false;
            }

            // Re-enable temporary disabled fields
            if (isOldAndroid) {
                $('.dwtd', doc).each(function () {
                    $(this).prop('disabled', false).removeClass('dwtd');
                });
            }

            // Hide wheels and overlay
            if (dw) {
                if (has3d && isModal && anim && !prevAnim && !dw.hasClass('dw-trans')) { // If dw-trans class was not removed, means that there was no animation
                    dw.addClass('dw-trans').find('.dw').addClass('dw-' + anim + ' dw-out').on(animEnd, function () {
                        hide(prevAnim);
                    });
                } else {
                    hide(prevAnim);
                }

                // Stop positioning on window resize
                wndw.off('.dw');
            }

            delete ms.activeInstance;
            pixels = {};
        };

        /**
        * Set button handler.
        */
        that.select = function () {
            if (that.hide(false, 'set') !== false) {
                setVal(true, true, 0, true);
                event('onSelect', [that.val]);
            }
        };

        /**
        * Show mobiscroll on focus and click event of the parameter.
        * @param {jQuery} elm - Events will be attached to this element.
        * @param {Function} [beforeShow=undefined] - Optional function to execute before showing mobiscroll.
        */
        that.attachShow = function (elm, beforeShow) {
            elmList.push(elm);
            if (s.display !== 'inline') {
                elm.on((s.showOnFocus ? 'focus.dw' : '') + (s.showOnTap ? ' click.dw' : ''), function (ev) {
                    ev.preventDefault();
                    if ((ev.type !== 'focus' || (ev.type === 'focus' && !preventShow)) && !tap) {
                        if (beforeShow) {
                            beforeShow();
                        }
                        activeElm = elm;
                        that.show();
                    }
                    setTimeout(function () {
                        preventShow = false;
                    }, 300); // With jQuery < 1.9 focus is fired twice in IE
                });
            }
        };

        /**
        * Cancel and hide the scroller instance.
        */
        that.cancel = function () {
            if (that.hide(false, 'cancel') !== false) {
                event('onCancel', [that.val]);
            }
        };

        /**
        * Scroller initialization.
        */
        that.init = function (ss) {
            // Get theme defaults
            theme = ms.themes[ss.theme || s.theme];

            // Get language defaults
            lang = ms.i18n[ss.lang || s.lang] || ms.i18n.en;

            extend(settings, ss); // Update original user settings

            event('onThemeLoad', [lang, settings]);

            extend(s, lang, theme, userdef, settings);

            // Add default buttons
            s.buttons = s.buttons || ['set', 'cancel'];

            // Hide header text in inline mode by default
            s.headerText = s.headerText === undefined ? (s.display !== 'inline' ? '{value}' : false) : s.headerText;

            that.settings = s;

            // Unbind all events (if re-init)
            elm.off('.dw');

            var preset = ms.presets[s.preset];

            if (preset) {
                pres = preset.call(e, that);
                extend(s, pres, settings); // Load preset settings
            }

            // Set private members
            m = Math.floor(s.rows / 2);
            itemHeight = s.height;
            anim = isOldAndroid ? false : s.animate;
            lines = s.multiline;
            isLiquid = (s.layout || (/top|bottom/.test(s.display) && s.wheels.length == 1 ? 'liquid' : '')) === 'liquid';
            isModal = s.display !== 'inline';
            buttons = s.buttons;
            wndw = $(s.context == 'body' ? window : s.context);
            doc = $(s.context)[0];

            if (!s.setText) {
                buttons.splice($.inArray('set', buttons), 1);
            }
            if (!s.cancelText) {
                buttons.splice($.inArray('cancel', buttons), 1);
            }
            if (s.button3) {
                buttons.splice($.inArray('set', buttons) + 1, 0, { text: s.button3Text, handler: s.button3 });
            }

            that.context = wndw;
            that.live = !isModal || ($.inArray('set', buttons) == -1);
            that.buttons.set = { text: s.setText, css: 'dwb-s', handler: that.select };
            that.buttons.cancel = { text: (that.live) ? s.closeText : s.cancelText, css: 'dwb-c', handler: that.cancel };
            that.buttons.clear = { text: s.clearText, css: 'dwb-cl', handler: function () {
                that.trigger('onClear', [dw]);
                elm.val('');
                if (!that.live) {
                    that.hide(false, 'clear');
                }
            }};

            hasButtons = buttons.length > 0;

            if (visible) {
                that.hide(true, false, true);
            }

            if (isModal) {
                read();
                if (input) {
                    // Set element readonly, save original state
                    if (readOnly === undefined) {
                        readOnly = e.readOnly;
                    }
                    e.readOnly = true;
                }
                that.attachShow(elm);
            } else {
                that.show();
            }

            if (input) {
                elm.on('change.dw', function () {
                    if (!preventChange) {
                        that.setValue(elm.val(), false, 0.2);
                    }
                    preventChange = false;
                });
            }
        };

        /**
        * Sets one ore more options.
        */
        that.option = function (opt, value) {
            var obj = {};
            if (typeof opt === 'object') {
                obj = opt;
            } else {
                obj[opt] = value;
            }
            that.init(obj);
        };

        /**
        * Destroys the mobiscroll instance.
        */
        that.destroy = function () {
            that.hide(true, false, true);
            // Remove all events from elements
            $.each(elmList, function (i, v) {
                v.off('.dw');
            });
            // Remove events from window
            $(window).off('.dwa');
            // Reset original readonly state
            if (input) {
                e.readOnly = readOnly;
            }
            // Delete scroller instance
            delete instances[e.id];
            event('onDestroy', []);
        };

        /**
        * Returns the mobiscroll instance.
        */
        that.getInst = function () {
            return that;
        };

        /**
        * Returns the closest valid cell.
        */
        that.getValidCell = getValid;

        /**
        * Triggers a mobiscroll event.
        */
        that.trigger = event;

        instances[e.id] = that;

        that.values = null;
        that.val = null;
        that.temp = null;
        that.buttons = {};
        that._selectedValues = {};

        that.init(settings);
    }

    function setTap() {
        tap = true;
        setTimeout(function () {
            tap = false;
        }, 300);
    }

    function constrain(val, min, max) {
        return Math.max(min, Math.min(val, max));
    }

    function convert(w) {
        var ret = {
            values: [],
            keys: []
        };
        $.each(w, function (k, v) {
            ret.keys.push(k);
            ret.values.push(v);
        });
        return ret;
    }

    var activeElm,
        move,
        tap,
        preventShow,
        ms = $.mobiscroll,
        instances = ms.instances,
        util = ms.util,
        prefix = util.prefix,
        pr = util.jsPrefix,
        has3d = util.has3d,
        hasFlex = util.hasFlex;
        getCoord = util.getCoord,
        testTouch = util.testTouch,
        empty = function () {},
        prevdef = function (e) { e.preventDefault(); },
        extend = $.extend,
        animEnd = 'webkitAnimationEnd animationend',
        userdef = ms.userdef,
        isOldAndroid = /android [1-3]/i.test(navigator.userAgent),
        defaults = extend(ms.defaults, {
            // Options
            minWidth: 80,
            height: 40,
            rows: 3,
            multiline: 1,
            delay: 300,
            disabled: false,
            readonly: false,
            closeOnOverlay: true,
            showOnFocus: true,
            showOnTap: true,
            showLabel: true,
            wheels: [],
            theme: '',
            display: 'modal',
            mode: 'scroller',
            preset: '',
            lang: 'en-US',
            context: 'body',
            scrollLock: true,
            tap: true,
            btnWidth: true,
            speedUnit: 0.0012,
            timeUnit: 0.1,
            formatResult: function (d) {
                return d.join(' ');
            },
            parseValue: function (value, inst) {
                var val = value.split(' '),
                    ret = [],
                    i = 0,
                    keys;

                $.each(inst.settings.wheels, function (j, wg) {
                    $.each(wg, function (k, w) {
                        w = w.values ? w : convert(w);
                        keys = w.keys || w.values;
                        if ($.inArray(val[i], keys) !== -1) {
                            ret.push(val[i]);
                        } else {
                            ret.push(keys[0]);
                        }
                        i++;
                    });
                });
                return ret;
            }
        });

    // English language module
    ms.i18n.en = ms.i18n['en-US'] = {
        setText: 'Set',
        selectedText: 'Selected',
        closeText: 'Close',
        cancelText: 'Cancel',
        clearText: 'Clear'
    };

    // Prevent re-show on window focus
    $(window).on('focus', function () {
        if (activeElm) {
            preventShow = true;
        }
    });

    $(document).on('mouseover mouseup mousedown click', function (e) { // Prevent standard behaviour on body click
        if (tap) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    });

})(jQuery);
