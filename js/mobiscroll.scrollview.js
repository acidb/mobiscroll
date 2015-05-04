(function ($, undefined) {
    var ms = $.mobiscroll,
        classes = ms.classes,
        util = ms.util,
        constrain = util.constrain,
        pr = util.jsPrefix,
        pref = util.prefix,
        has3d = util.has3d,
        getCoord = util.getCoord,
        getCurrentPosition = util.getPosition,
        testTouch = util.testTouch,
        isNumeric = util.isNumeric,
        isString = util.isString,
        empty = function () { },
        transEnd = 'webkitTransitionEnd transitionend',
        raf = window.requestAnimationFrame || function (x) { x(); },
        rafc = window.cancelAnimationFrame || empty;

    classes.ScrollView = function (el, settings, inherit) {
        var $btn,
            btnTimer,
            contSize,
            currPos,
            currSnap,
            diffX,
            diffY,
            diff,
            dir,
            elastic,
            endX,
            endY,
            isBtn,
            lastX,
            maxScroll,
            maxSnapScroll,
            minScroll,
            nativeScroll,
            move,
            moving,
            rafID,
            rafRunning,
            scrollDebounce,
            scrollTimer,
            snap,
            snapPoints,
            startPos,
            startTime,
            startX,
            startY,
            style,
            target,
            trigger,
            vertical,
            that = this,
            currSnapDir = 1,
            s = settings,
            $elm = $(el);

        function onStart(ev) {
            /* TRIALCOND */

            if (s.lock && moving) {
                return;
            }

            if (testTouch(ev, this) && !move) {
                // Better performance if there are tap events on document
                if (s.stopProp) {
                    ev.stopPropagation();
                }

                if (s.prevDef || ev.type == 'mousedown') {
                    // Prevent touch highlight and focus
                    ev.preventDefault();
                }

                if ($btn) {
                    $btn.removeClass('mbsc-btn-a');
                }

                // Highlight button
                isBtn = false;

                if (!moving) {
                    $btn = $(ev.target).closest('.mbsc-btn', this);

                    if ($btn.length && !$btn.hasClass('mbsc-btn-d')) {
                        isBtn = true;
                        btnTimer = setTimeout(function () {
                            $btn.addClass('mbsc-btn-a');
                        }, 100);
                    }
                }

                move = true;

                nativeScroll = false;

                that.scrolled = moving;

                startX = getCoord(ev, 'X');
                startY = getCoord(ev, 'Y');
                endX = lastX = startX;
                diffX = 0;
                diffY = 0;
                diff = 0;

                startTime = new Date();

                startPos = +getCurrentPosition(target, vertical) || 0;

                // Stop scrolling animation, 1ms is needed for Android 4.0
                scroll(startPos, 1);

                if (ev.type === 'mousedown') {
                    $(document).on('mousemove', onMove).on('mouseup', onEnd);
                }

                trigger('onScrollStart', [currPos]);
            }
        }

        function onMove(ev) {
            if (move) {
                if (s.stopProp) {
                    ev.stopPropagation();
                }

                endX = getCoord(ev, 'X');
                endY = getCoord(ev, 'Y');
                diffX = endX - startX;
                diffY = endY - startY;
                diff = vertical ? diffY : diffX;

                if (isBtn && (Math.abs(diffY) > 5 || Math.abs(diffX) > 5)) {
                    clearTimeout(btnTimer);
                    $btn.removeClass('mbsc-btn-a');
                    isBtn = false;
                }

                if (that.scrolled || (!nativeScroll && Math.abs(diff) > 5)) {
                    that.scrolled = true;

                    if (s.liveSwipe && !rafRunning) {
                        rafRunning = true;
                        rafID = raf(onMoving);
                    }
                }

                if (vertical || s.scrollLock) {
                    // Always prevent native scroll, if vertical
                    ev.preventDefault();
                } else {
                    if (that.scrolled) {
                        // Prevent native scroll
                        ev.preventDefault();
                    } else if (Math.abs(diffY) > 7) {
                        nativeScroll = true;
                        that.scrolled = true;
                        $elm.trigger('touchend');
                    }
                }
            }
        }

        function onMoving() {
            //var time = new Date();

            if (maxSnapScroll) {
                diff = constrain(diff, -snap * maxSnapScroll, snap * maxSnapScroll);
            }

            scroll(constrain(startPos + diff, minScroll - elastic, maxScroll + elastic));

            //if (s.momentum && has3d) {
            //    startTime = time;
            //    lastX = endX;
            //}

            trigger('onMove', [currPos]);

            rafRunning = false;
        }

        function onEnd(ev) {
            if (move) {
                var speed,
                    time = new Date() - startTime;

                // Better performance if there are tap events on document
                if (s.stopProp) {
                    ev.stopPropagation();
                }

                rafc(rafID);
                rafRunning = false;

                if (!nativeScroll && that.scrolled) {
                    // Calculate momentum distance
                    if (s.momentum && has3d && time < 300) {
                        speed = diff / time;
                        //speed = Math.abs(lastX - endX) / time;
                        diff = Math.max(Math.abs(diff), (speed * speed) / s.speedUnit) * (diff < 0 ? -1 : 1);
                    }

                    finalize(diff, speed);
                }

                if (isBtn) {
                    clearTimeout(btnTimer);
                    $btn.addClass('mbsc-btn-a');
                    setTimeout(function () {
                        $btn.removeClass('mbsc-btn-a');
                    }, 100);

                    if (!nativeScroll && !that.scrolled) {
                        trigger('onBtnTap', [$btn]);
                    }
                }

                // Detach document events
                if (ev.type == 'mouseup') {
                    $(document).off('mousemove', onMove).off('mouseup', onEnd);
                }

                move = false;
            }
        }

        function onScroll(ev) {
            ev = ev.originalEvent || ev;

            diff = vertical ? ev.deltaY || ev.wheelDelta || ev.detail : ev.deltaX;

            if (diff) {
                ev.preventDefault();

                diff = diff < 0 ? 20 : -20;

                startPos = currPos;

                if (!rafRunning) {
                    rafRunning = true;
                    rafID = raf(onMoving);
                }

                clearTimeout(scrollDebounce);
                scrollDebounce = setTimeout(function () {
                    rafc(rafID);
                    rafRunning = false;

                    finalize(diff);
                }, 200);
            }
        }

        function finalize(diff, speed) {
            var i,
                time,
                newPos;

            // Limit scroll to snap size
            if (maxSnapScroll) {
                diff = constrain(diff, -snap * maxSnapScroll, snap * maxSnapScroll);
            }

            // Calculate snap and limit between min and max
            currSnap = Math.round((startPos + diff) / snap);
            newPos = constrain(currSnap * snap, minScroll, maxScroll);

            // Snap to nearest element
            if (snapPoints) {
                if (diff < 0) {
                    for (i = snapPoints.length - 1; i >= 0; i--) {
                        if (Math.abs(newPos) + contSize >= snapPoints[i].breakpoint) {
                            currSnap = i;
                            currSnapDir = 2;
                            newPos = snapPoints[i].snap2;
                            break;
                        }
                    }
                } else if (diff >= 0) {
                    for (i = 0; i < snapPoints.length; i++) {
                        if (Math.abs(newPos) <= snapPoints[i].breakpoint) {
                            currSnap = i;
                            currSnapDir = 1;
                            newPos = snapPoints[i].snap1;
                            break;
                        }
                    }
                }
                newPos = constrain(newPos, minScroll, maxScroll);
            }

            time = s.time || (currPos < minScroll || currPos > maxScroll ? 200 : Math.max(200, Math.abs(newPos - currPos) * s.timeUnit));

            // Scroll to the calculated position
            scroll(newPos, time, function () {
                //scroll(newPos, s.time || (currPos < minScroll || currPos > maxScroll ? 200 : speed ? Math.max(200, Math.abs((newPos - currPos) / speed) * 3) : 100), function () {
                trigger('onScrollEnd', [currPos]);
            });
        }

        function scroll(pos, time, callback) {
            var done = function () {
                moving = false;
                clearInterval(scrollTimer);
                trigger('onScroll', [pos]);
                if (callback) {
                    callback();
                }
            };

            moving = true;

            if (has3d) {
                style[pr + 'Transition'] = time ? pref + 'transform ' + Math.round(time) + 'ms ' + s.easing : '';
                style[pr + 'Transform'] = 'translate3d(' + (vertical ? '0,' + pos + 'px,' : pos + 'px,' + '0,') + '0)';

                if (currPos == pos || !time || time <= 1) {
                    done();
                } else if (time > 1) {
                    clearInterval(scrollTimer);
                    scrollTimer = setInterval(function () {
                        trigger('onScroll', [+getCurrentPosition(target, vertical) || 0]);
                    }, 100);

                    target.off(transEnd).on(transEnd, function (e) {
                        if (e.target === target[0]) {
                            target.off(transEnd);
                            style[pr + 'Transition'] = '';
                            done();
                        }
                    });
                }
            } else {
                setTimeout(done, time || 0);
                style[dir] = pos + 'px';
            }

            //trigger('onScroll', [pos, time, s.easing]);

            currPos = pos;
        }

        // Call the parent constructor
        classes.Base.call(this, el, settings, true);

        that.scrolled = false;

        /**
         * Scroll to the given position or element
         */
        that.scroll = function (pos, time, callback) {
            // If position is not numeric, scroll to element
            if (!isNumeric(pos)) {
                pos = Math.ceil(($(pos, el).length ? Math.round(target.offset()[dir] - $(pos, el).offset()[dir]) : currPos) / snap) * snap;
            } else {
                pos = Math.round(pos / snap) * snap;
            }
            currSnap = Math.round(pos / snap);
            scroll(constrain(pos, minScroll, maxScroll), time, callback);
        };

        that.refresh = function () {
            var tempScroll;

            contSize = s.contSize === undefined ? vertical ? $elm.height() : $elm.width() : s.contSize;
            minScroll = s.minScroll === undefined ? (vertical ? contSize - target.height() : contSize - target.width()) : s.minScroll;
            maxScroll = s.maxScroll === undefined ? 0 : s.maxScroll;

            if (!vertical && s.rtl) {
                tempScroll = maxScroll;
                maxScroll = -minScroll;
                minScroll = -tempScroll;
            }

            if (isString(s.snap)) {
                snapPoints = [];
                target.find(s.snap).each(function () {
                    var offset = vertical ? this.offsetTop : this.offsetLeft,
                        size = vertical ? this.offsetHeight : this.offsetWidth;

                    snapPoints.push({
                        breakpoint: offset + size / 2,
                        snap1: -offset,
                        snap2: contSize - offset - size
                    });
                });
            }

            //snap = s.snap ?
            //    (util.isNumeric(s.snap) ? s.snap :
            //        ((vertical ?
            //            (s.snap === true ? $elm.height() : $(s.snap, el).eq(0).outerHeight()) :
            //            (s.snap === true ? $elm.width()  : $(s.snap, el).eq(0).outerWidth())) || 1))
            //    : 1;

            snap = isNumeric(s.snap) ? s.snap : 1;
            maxSnapScroll = s.snap ? s.maxSnapScroll : 0;
            elastic = s.elastic ? (isNumeric(s.snap) ? snap : (isNumeric(s.elastic) ? s.elastic : 0)) : 0;// && s.snap ? snap : 0;

            if (currPos === undefined) {
                currPos = s.initialPos;
                currSnap = Math.round(currPos / snap);
            }

            that.scroll(s.snap ? (snapPoints ? snapPoints[currSnap]['snap' + currSnapDir] : (currSnap * snap)) : currPos);
        };

        that.init = function (ss) {
            that._init(ss);

            vertical = s.axis == 'Y';
            dir = vertical ? 'top' : 'left';
            target = s.moveElement || $elm.children().eq(0);
            style = target[0].style;

            that.refresh();

            // Attach events with latency to prevent unwanted mouse events
            setTimeout(function () {
                if (s.swipe) {
                    $elm.on('touchstart mousedown', onStart)
                        .on('touchmove', onMove)
                        .on('touchend touchcancel', onEnd);
                }

                if (s.mousewheel) {
                    $elm.on('wheel mousewheel', onScroll);
                }

                if (el.addEventListener) {
                    el.addEventListener('click', function (ev) {
                        if (that.scrolled) {
                            ev.stopPropagation();
                            ev.preventDefault();
                        }
                    }, true);
                }

                //el.addEventListener('touchend', function (ev) {
                //    if (scrolled) {
                //        ev.stopPropagation();
                //    }
                //}, true);
            }, 300);
        };

        /**
         * Destroy
         */
        that.destroy = function () {
            clearInterval(scrollTimer);

            $elm.off('touchstart mousedown', onStart)
                .off('touchmove', onMove)
                .off('touchend touchcancel', onEnd)
                .off('wheel mousewheel', onScroll);

            that._destroy();
        };

        // Constructor

        s = that.settings;
        trigger = that.trigger;

        if (!inherit) {
            that.init(settings);
        }
    };

    classes.ScrollView.prototype = {
        _class: 'scrollview',
        _defaults: {
            speedUnit: 0.0022,
            timeUnit: 3,
            initialPos: 0,
            axis: 'Y',
            easing: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
            swipe: true,
            liveSwipe: true,
            momentum: true,
            elastic: true
        }
    };

    ms.presetShort('scrollview', 'ScrollView', false);
})(jQuery);