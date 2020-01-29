// eslint-disable-next-line no-unused-vars
import { $, Base, mobiscroll } from '../core/core'; // mobiscroll needed for trial
import { os, raf, rafc } from '../util/platform';
import { getCoord } from '../util/tap';
import { cssPrefix, jsPrefix, getPosition, testTouch } from '../util/dom';
import { constrain, isNumeric, isString } from '../util/misc';

var isIOS = os == 'ios';

export const ScrollViewBase = function (el, settings, inherit) {
    var $btn,
        $scrollbar,
        $scrollbarTrack,
        btnTimer,
        contSize,
        diffX,
        diffY,
        diff,
        dir,
        easing,
        elastic,
        endX,
        endY,
        eventObj,
        isBtn,
        isInfinite,
        maxScroll,
        maxSnapScroll,
        minScroll,
        move,
        moving,
        nativeScroll,
        rafID,
        //rafMoveID,
        rafRunning,
        scrollbar,
        scrollbarHeight,
        scrollbarOffset,
        scrollbarTrack,
        scrolled,
        scrollDebounce,
        scrollSnap,
        scrollTimer,
        snap,
        snapPoints,
        startPos,
        startTime,
        startX,
        startY,
        style,
        target,
        transTimer,
        threshold,
        trigger,
        vertical,
        that = this,
        currPos,
        currSnap = 0,
        currSnapDir = 1,
        s = settings,
        $elm = $(el);

    function onStart(ev) {

        trigger('onStart', { domEvent: ev });

        // Better performance if there are tap events on document
        if (s.stopProp) {
            ev.stopPropagation();
        }

        //if (s.prevDef || ev.type == 'mousedown') {
        if (s.prevDef) {
            // Prevent touch highlight and focus
            ev.preventDefault();
        }

        if (s.readonly || (s.lock && moving)) {
            return;
        }

        if (testTouch(ev, this) && !move) {

            if ($btn) {
                $btn.removeClass('mbsc-active');
            }

            // Highlight button
            isBtn = false;

            if (!moving) {
                $btn = $(ev.target).closest('.mbsc-btn-e', this);

                if ($btn.length && !$btn.hasClass('mbsc-disabled')) {
                    isBtn = true;
                    btnTimer = setTimeout(function () {
                        $btn.addClass('mbsc-active');
                    }, 100);
                }
            }

            move = true;
            scrolled = false;
            nativeScroll = false;

            that.scrolled = moving;

            startX = getCoord(ev, 'X');
            startY = getCoord(ev, 'Y');
            endX = startX;
            diffX = 0;
            diffY = 0;
            diff = 0;

            startTime = new Date();

            startPos = +getPosition(target, vertical) || 0;

            // Stop scrolling animation, 1ms is needed for Android 4.0
            if (moving) {
                scroll(startPos, isIOS ? 0 : 1);
            }

            if (ev.type === 'mousedown') {
                $(document).on('mousemove', onMove).on('mouseup', onEnd);
            }
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

            if (isBtn && (Math.abs(diffY) > s.thresholdY || Math.abs(diffX) > s.thresholdX)) {
                clearTimeout(btnTimer);
                $btn.removeClass('mbsc-active');
                isBtn = false;
            }

            if (that.scrolled || (!nativeScroll && Math.abs(diff) > threshold)) {

                if (!scrolled) {
                    trigger('onGestureStart', eventObj);
                }

                that.scrolled = scrolled = true;

                if (!rafRunning) {
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
                    onEnd();
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

        //if (s.momentum) {
        //    startTime = time;
        //    lastX = endX;
        //}

        rafRunning = false;
    }

    function onEnd(ev) {
        if (move) {
            var speed,
                time = new Date() - startTime;

            // Better performance if there are tap events on document
            if (s.stopProp && ev) {
                ev.stopPropagation();
            }

            rafc(rafID);
            rafRunning = false;

            if (!nativeScroll && that.scrolled) {
                // Calculate momentum distance
                if (s.momentum && time < 300) {
                    speed = diff / time;
                    //speed = Math.abs(lastX - endX) / time;
                    diff = Math.max(Math.abs(diff), (speed * speed) / s.speedUnit) * (diff < 0 ? -1 : 1);
                }

                finalize(diff);
            }

            if (isBtn) {
                clearTimeout(btnTimer);
                $btn.addClass('mbsc-active');
                setTimeout(function () {
                    $btn.removeClass('mbsc-active');
                }, 100);

                if (!nativeScroll && !that.scrolled) {
                    trigger('onBtnTap', {
                        target: $btn[0],
                        domEvent: ev
                    });
                }
            }

            // Detach document events
            if (ev && ev.type == 'mouseup') {
                $(document).off('mousemove', onMove).off('mouseup', onEnd);
            }

            move = false;
        }
    }

    function onScroll(ev) {
        ev = ev.originalEvent || ev;

        diff = vertical ? (ev.deltaY == undefined ? ev.wheelDelta || ev.detail : ev.deltaY) : ev.deltaX;

        trigger('onStart', { domEvent: ev });

        if (s.stopProp) {
            ev.stopPropagation();
        }

        if (diff) {
            ev.preventDefault();

            //diff = diff < 0 ? 20 : -20;

            if (ev.deltaMode && ev.deltaMode == 1) {
                diff *= 15;
            }

            diff = constrain(-diff, -scrollSnap, scrollSnap);

            startPos = currPos;

            if (s.readonly) {
                return;
            }

            if (!scrolled) {
                gestureStart();
            }

            if (startPos + diff < minScroll) {
                startPos = minScroll;
                diff = 0;
            }

            if (startPos + diff > maxScroll) {
                startPos = maxScroll;
                diff = 0;
            }

            if (!rafRunning) {
                rafRunning = true;
                rafID = raf(onMoving);
            }

            if (!diff && scrolled) {
                return;
            }

            scrolled = true;

            clearTimeout(scrollDebounce);
            scrollDebounce = setTimeout(function () {
                rafc(rafID);
                rafRunning = false;
                scrolled = false;

                finalize(diff);
            }, 200);
        }
    }

    function onScrollBarStart(ev) {
        trigger('onStart', { domEvent: ev });

        if (s.readonly) {
            return;
        }

        ev.stopPropagation();

        startPos = currPos;
        scrolled = false;

        if (ev.target == scrollbar) {
            startY = getCoord(ev, 'Y', true);
            $(document)
                .on('mousemove', onScrollBarMove)
                .on('mouseup', onScrollBarEnd);
        } else {
            startY = $scrollbar.offset().top;
            onScrollBarMove(ev);
            onScrollBarEnd();
        }
    }

    function onScrollBarMove(ev) {
        var percent = (getCoord(ev, 'Y', true) - startY) / contSize;
        if (isInfinite) {
            diff = -(maxSnapScroll * snap * 2 + contSize) * percent;
            diff = constrain(diff, -snap * maxSnapScroll, snap * maxSnapScroll);
        } else {
            diff = (minScroll - maxScroll - contSize) * percent;
        }
        if (!scrolled) {
            gestureStart();
        }
        scrolled = true;
        scroll(constrain(startPos + diff, minScroll - elastic, maxScroll + elastic));
    }

    function onScrollBarEnd() {
        startPos = currPos;
        finalize(0);
        $(document)
            .off('mousemove', onScrollBarMove)
            .off('mouseup', onScrollBarEnd);
    }

    function onScrollBarClick(ev) {
        ev.stopPropagation();
    }

    function gestureStart() {
        eventObj = {
            posX: vertical ? 0 : currPos,
            posY: vertical ? currPos : 0,
            originX: vertical ? 0 : startPos,
            originY: vertical ? startPos : 0,
            direction: diff > 0 ? (vertical ? 270 : 360) : (vertical ? 90 : 180)
        };
        trigger('onGestureStart', eventObj);
    }

    function finalize(diff) {
        var i,
            time,
            newPos;

        // Limit scroll to snap size
        if (maxSnapScroll) {
            diff = constrain(diff, -snap * maxSnapScroll, snap * maxSnapScroll);
        }

        // Calculate snap and limit between min and max
        newPos = constrain(Math.round((startPos + diff) / snap) * snap, minScroll, maxScroll);

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

        time = s.time || (currPos < minScroll || currPos > maxScroll ? 1000 : Math.max(1000, Math.abs(newPos - currPos) * s.timeUnit));

        eventObj.destinationX = vertical ? 0 : newPos;
        eventObj.destinationY = vertical ? newPos : 0;
        eventObj.duration = time;
        eventObj.transitionTiming = easing;

        trigger('onGestureEnd', eventObj);

        // Scroll to the calculated position
        that.scroll(newPos, time);
    }

    function scroll(pos, time, tap, callback) {
        var percent,
            changed = pos != currPos,
            anim = time > 1,
            timing = time ? cssPrefix + 'transform ' + Math.round(time) + 'ms ' + easing : '',
            done = function () {
                clearInterval(scrollTimer);
                clearTimeout(transTimer);
                //rafc(rafMoveID);

                moving = false;
                currPos = pos;
                eventObj.posX = vertical ? 0 : pos;
                eventObj.posY = vertical ? pos : 0;

                if (changed) {
                    trigger('onMove', eventObj);
                }

                if (anim) {
                    //that.scrolled = false;
                    trigger('onAnimationEnd', eventObj);
                }

                if (callback) {
                    callback();
                }
            };

        eventObj = {
            posX: vertical ? 0 : currPos,
            posY: vertical ? currPos : 0,
            originX: vertical ? 0 : startPos,
            originY: vertical ? startPos : 0,
            direction: pos - currPos > 0 ? (vertical ? 270 : 360) : (vertical ? 90 : 180)
        };

        currPos = pos;

        if (anim) {
            eventObj.destinationX = vertical ? 0 : pos;
            eventObj.destinationY = vertical ? pos : 0;
            eventObj.duration = time;
            eventObj.transitionTiming = easing;

            trigger('onAnimationStart', eventObj);
        }

        style[jsPrefix + 'Transition'] = timing;
        style[jsPrefix + 'Transform'] = 'translate3d(' + (vertical ? '0,' + pos + 'px,' : pos + 'px,' + '0,') + '0)';

        if (scrollbar && scrollbarHeight) {
            percent = isInfinite ?
                (scrollbarOffset - pos) / (maxSnapScroll * snap * 2) :
                (pos - maxScroll) / (minScroll - maxScroll);
            scrollbar.style[jsPrefix + 'Transition'] = timing;
            scrollbar.style[jsPrefix + 'Transform'] = 'translate3d(0,' +
                Math.max(0, Math.min(((contSize - scrollbarHeight) * percent), contSize - scrollbarHeight)) +
                'px,0)';
        }

        if ((!changed && !moving) || !time || time <= 1) {
            done();
        } else if (time) {
            moving = !tap;

            clearInterval(scrollTimer);
            scrollTimer = setInterval(function () {
                //rafMoveID = raf(function () {
                var p = +getPosition(target, vertical) || 0;
                eventObj.posX = vertical ? 0 : p;
                eventObj.posY = vertical ? p : 0;
                trigger('onMove', eventObj);
                // Trigger done if close to the end
                if (Math.abs(p - pos) < 2) {
                    done();
                }
                //});
            }, 100);

            clearTimeout(transTimer);
            transTimer = setTimeout(function () {
                done();
                //style[pr + 'Transition'] = '';
            }, time);

            // target.off(transEnd).on(transEnd, function (e) {
            //     if (e.target === target[0]) {
            //         target.off(transEnd);
            //         style[pr + 'Transition'] = '';
            //         done();
            //     }
            // });
        }

        if (s.sync) {
            s.sync(pos, time, easing);
        }
    }

    // Call the parent constructor
    Base.call(this, el, settings, true);

    that.scrolled = false;

    /**
     * Scroll to the given position or element
     */
    that.scroll = function (pos, time, tap, callback) {
        // If position is not numeric, scroll to element
        if (!isNumeric(pos)) {
            pos = Math.ceil(($(pos, el).length ? Math.round(target.offset()[dir] - $(pos, el).offset()[dir]) : currPos) / snap) * snap;
        } else {
            pos = Math.round(pos / snap) * snap;
        }

        pos = constrain(pos, minScroll, maxScroll);

        currSnap = Math.round(pos / snap);

        startPos = currPos;

        scrollbarOffset = maxSnapScroll * snap + pos;

        scroll(pos, time, tap, callback);
    };

    that.refresh = function (noScroll) {
        var tempScroll;

        contSize = (s.contSize === undefined ? vertical ? $elm.height() : $elm.width() : s.contSize) || 0;
        maxScroll = (s.maxScroll === undefined ? 0 : s.maxScroll) || 0;
        minScroll = (Math.min(maxScroll, s.minScroll === undefined ? Math.min(0, vertical ? contSize - target.height() : contSize - target.width()) : s.minScroll)) || 0;
        snapPoints = null;

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

        snap = isNumeric(s.snap) ? s.snap : 1;
        maxSnapScroll = s.snap ? s.maxSnapScroll : 0;
        easing = s.easing;
        elastic = s.elastic ? (isNumeric(s.snap) ? snap : (isNumeric(s.elastic) ? s.elastic : 0)) : 0; // && s.snap ? snap : 0;
        scrollSnap = snap;

        while (scrollSnap > 44) {
            scrollSnap /= 2;
        }
        scrollSnap = Math.round(44 / scrollSnap) * scrollSnap;

        if (scrollbar) {
            isInfinite = minScroll == -Infinity || maxScroll == Infinity;
            scrollbarHeight = minScroll < maxScroll ? Math.max(20, contSize * contSize / (maxScroll - minScroll + contSize)) : 0;
            scrollbar.style.height = scrollbarHeight + 'px';
            scrollbarTrack.style.height = scrollbarHeight ? '' : 0;
        }

        if (currPos === undefined) {
            currPos = s.initialPos;
            currSnap = Math.round(currPos / snap);
        }

        if (!noScroll) {
            that.scroll(s.snap ? (snapPoints ? snapPoints[currSnap]['snap' + currSnapDir] : (currSnap * snap)) : currPos);
        }
    };

    that._processSettings = function () {
        vertical = s.axis == 'Y';
        dir = vertical ? 'top' : 'left';
        target = s.moveElement || $elm.children().eq(0);
        style = target[0].style;
        threshold = vertical ? s.thresholdY : s.thresholdX;
        if (s.scrollbar) {
            $scrollbarTrack = s.scrollbar;
            $scrollbar = $scrollbarTrack.find('.mbsc-sc-bar');
            scrollbar = $scrollbar[0];
            scrollbarTrack = $scrollbarTrack[0];
        }
    };

    that._init = function () {
        that.refresh();

        $elm.on('touchstart mousedown', onStart)
            .on('touchmove', onMove)
            .on('touchend touchcancel', onEnd);

        if (s.mousewheel) {
            $elm.on('wheel mousewheel', onScroll);
        }

        if (scrollbar) {
            $scrollbarTrack
                .on('mousedown', onScrollBarStart)
                .on('click', onScrollBarClick);
        }

        el.addEventListener('click', function (ev) {
            if (that.scrolled) {
                that.scrolled = false;
                ev.stopPropagation();
                ev.preventDefault();
            }
        }, true);

        //el.addEventListener('touchend', function (ev) {
        //    if (scrolled) {
        //        ev.stopPropagation();
        //    }
        //}, true);
    };

    /**
     * Destroy
     */
    that._destroy = function () {
        clearInterval(scrollTimer);

        $elm.off('touchstart mousedown', onStart)
            .off('touchmove', onMove)
            .off('touchend touchcancel', onEnd)
            .off('wheel mousewheel', onScroll);

        if (scrollbar) {
            $scrollbarTrack
                .off('mousedown', onScrollBarStart)
                .off('click', onScrollBarClick);
        }
    };

    // Constructor

    s = that.settings;
    trigger = that.trigger;

    if (!inherit) {
        that.init();
    }
};

ScrollViewBase.prototype = {
    _defaults: {
        speedUnit: 0.0022,
        //timeUnit: 0.8,
        timeUnit: 3,
        initialPos: 0,
        axis: 'Y',
        thresholdX: 10,
        thresholdY: 5,
        //easing: 'ease-out',
        easing: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
        stopProp: true,
        momentum: true,
        mousewheel: true,
        elastic: true
    }
};
