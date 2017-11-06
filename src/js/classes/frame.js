import mobiscroll, { $, extend, Base } from '../core/core';
import { os, majorVersion, isBrowser, userAgent } from '../util/platform';
import { animEnd } from '../util/dom';
import { getCoord, preventClick } from '../util/tap';
import { constrain, isString, noop } from '../util/misc';

var $activeElm,
    preventShow,
    classes = mobiscroll.classes,
    themes = mobiscroll.themes,
    needsFixed = /(iphone|ipod)/i.test(userAgent) && majorVersion >= 7,
    isAndroid = os == 'android',
    isIOS = os == 'ios',
    isIOS8 = isIOS && majorVersion == 8,
    halfBorder = isIOS && majorVersion > 7,
    prevdef = function (ev) {
        ev.preventDefault();
    };

const Frame = function (el, settings, inherit) {
    var $ariaDiv,
        $ctx,
        $header,
        $lock,
        $markup,
        $overlay,
        $persp,
        $popup,
        $wnd,
        $wrapper,
        buttons,
        btn,
        ctx,
        doAnim,
        hasContext,
        isModal,
        isInserted,
        markup,
        modalWidth,
        modalHeight,
        needsDimensions,
        needsLock,
        overlay,
        popup,
        posEvents,
        preventPos,
        s,
        scrollLeft,
        scrollLock,
        scrollTop,
        touched,
        trigger,
        wndWidth,
        wndHeight,

        that = this,
        $elm = $(el),
        elmList = [],
        posDebounce = {};

    function onBtnStart(ev) {
        // Can't call preventDefault here, it kills page scroll
        if (btn) {
            btn.removeClass('mbsc-fr-btn-a');
        }

        btn = $(this);

        // Active button
        if (!btn.hasClass('mbsc-fr-btn-d') && !btn.hasClass('mbsc-fr-btn-nhl')) {
            btn.addClass('mbsc-fr-btn-a');
        }

        if (ev.type === 'mousedown') {
            $(document).on('mouseup', onBtnEnd);
        } else if (ev.type === 'pointerdown') {
            $(document).on('pointerup', onBtnEnd);
        }
    }

    function onBtnEnd(ev) {
        if (btn) {
            btn.removeClass('mbsc-fr-btn-a');
            btn = null;
        }

        if (ev.type === 'mouseup') {
            $(document).off('mouseup', onBtnEnd);
        } else if (ev.type === 'pointerup') {
            $(document).off('pointerup', onBtnEnd);
        }
    }

    function onWndKeyDown(ev) {
        if (ev.keyCode == 13) {
            that.select();
        } else if (ev.keyCode == 27) {
            that.cancel();
        }
    }

    function onShow(prevFocus) {
        if (!prevFocus && !isAndroid) {
            overlay.focus();
        }
        that.ariaMessage(s.ariaMessage);
    }

    function onHide(prevAnim) {
        var $activeEl = $activeElm,
            focus = s.focusOnClose;

        that._markupRemove();

        $markup.remove();

        if (isModal) {
            ctx.mbscModals--;

            if (s.scrollLock) {
                ctx.mbscLock--;
            }

            if (!ctx.mbscLock) {
                $lock.removeClass('mbsc-fr-lock');
            }

            // The follwing should be done only if no other
            // instance was opened during the hide animation
            if (!ctx.mbscModals) {
                $lock.removeClass('mbsc-fr-lock-ios mbsc-fr-lock-ctx');
                if (needsLock) {
                    $ctx.css({
                        top: '',
                        left: ''
                    });
                    $wnd.scrollLeft(scrollLeft);
                    $wnd.scrollTop(scrollTop);
                }
                // Put focus back to the last active element
                if (!prevAnim) {
                    if (!$activeEl) {
                        $activeEl = $elm;
                    }
                    setTimeout(function () {
                        if (focus === undefined || focus === true) {
                            preventShow = true;
                            $activeEl[0].focus();
                        } else if (focus) {
                            $(focus)[0].focus();
                        }
                    }, 200);
                }
            }
        }

        that._isVisible = false;

        isInserted = false;

        trigger('onHide');
    }

    function onPosition(ev) {
        clearTimeout(posDebounce[ev.type]);
        posDebounce[ev.type] = setTimeout(function () {
            var h,
                isScroll = ev.type == 'scroll';

            if (isScroll && !scrollLock) {
                return;
            }

            that.position(!isScroll);

            if (ev.type == 'orientationchange') {
                // Trigger reflow
                popup.style.display = 'none';
                h = popup.offsetHeight;
                popup.style.display = '';
            }
        }, 200);
    }

    function onFocus(ev) {
        if (ev.target.nodeType && !overlay.contains(ev.target)) {
            overlay.focus();
        }
    }

    function show(beforeShow, $elm) {
        if (beforeShow) {
            beforeShow();
        }

        if (that.show() !== false) {
            $activeElm = $elm;
        }
    }

    function set() {
        that._fillValue();
        trigger('onSet', {
            valueText: that._value
        });
    }

    function cancel() {
        trigger('onCancel', {
            valueText: that._value
        });
    }

    function clear() {
        that.setVal(null, true);
    }

    // Call the parent constructor
    Base.call(this, el, settings, true);

    /**
     * Positions the scroller on the screen.
     */
    that.position = function (check) {
        var anchor,
            anchorWidth,
            anchorHeight,
            anchorPos,
            anchorTop,
            anchorLeft,
            arrow,
            arrowWidth,
            arrowHeight,
            docHeight,
            docWidth,
            newHeight,
            newWidth,
            width,
            top,
            left,
            css = {},
            scrollLeft = 0,
            scrollTop = 0,
            minWidth = 0,
            totalWidth = 0;

        if (preventPos || !isInserted) {
            return;
        }

        that._position($markup);

        newHeight = markup.offsetHeight;
        newWidth = markup.offsetWidth;

        if (wndWidth === newWidth && wndHeight === newHeight && check) {
            return;
        }

        if (that._isFullScreen || /top|bottom/.test(s.display)) {
            // Set width, if document is larger than viewport, needs to be set before onPosition (for calendar)
            $popup.width(newWidth);
        } else {
            // Reset width
            $wrapper.width('');
        }

        if (trigger('onPosition', {
                target: markup,
                windowWidth: newWidth,
                windowHeight: newHeight
            }) === false || !isModal) {
            return;
        }

        // Set / unset liquid layout based on screen width, but only if not set explicitly by the user
        // if (that._isLiquid && s.layout !== 'liquid') {
        //     if (newWidth < 415) {
        //         $markup.addClass('mbsc-fr-liq');
        //     } else {
        //         $markup.removeClass('mbsc-fr-liq');
        //     }
        // }

        // Call position for nested mobiscroll components
        $('.mbsc-comp', $markup).each(function () {
            var inst = mobiscroll.instances[this.id];
            if (inst && inst !== that && inst.position) {
                inst.position();
            }
        });

        if (!that._isFullScreen && /center|bubble/.test(s.display)) {
            $('.mbsc-w-p', $markup).each(function () {
                // Need fractional values here, so offsetWidth is not ok
                width = this.getBoundingClientRect().width;
                totalWidth += width;
                minWidth = (width > minWidth) ? width : minWidth;
            });

            $wrapper.css({
                'width': that._isLiquid ? Math.min(s.maxPopupWidth, newWidth - 16) : Math.ceil(totalWidth > newWidth ? minWidth : totalWidth),
                'white-space': totalWidth > newWidth ? '' : 'nowrap'
            });
        }

        modalWidth = popup.offsetWidth;
        modalHeight = popup.offsetHeight;

        scrollLock = modalHeight <= newHeight && modalWidth <= newWidth;

        if (needsDimensions) {
            scrollLeft = $wnd.scrollLeft();
            scrollTop = $wnd.scrollTop();
        }

        if (s.display == 'center') {
            left = Math.max(0, scrollLeft + (newWidth - modalWidth) / 2);
            top = Math.max(0, scrollTop + (newHeight - modalHeight) / 2);
        } else if (s.display == 'bubble') {
            anchor = s.anchor === undefined ? $elm : $(s.anchor);

            arrow = $('.mbsc-fr-arr-i', $markup)[0];
            anchorPos = anchor.offset();
            anchorTop = anchorPos.top + (hasContext ? scrollTop - $ctx.offset().top : 0);
            anchorLeft = anchorPos.left + (hasContext ? scrollLeft - $ctx.offset().left : 0);

            anchorWidth = anchor[0].offsetWidth;
            anchorHeight = anchor[0].offsetHeight;

            arrowWidth = arrow.offsetWidth;
            arrowHeight = arrow.offsetHeight;

            // Horizontal positioning
            left = constrain(anchorLeft - (modalWidth - anchorWidth) / 2, scrollLeft + 8, scrollLeft + newWidth - modalWidth - 8);

            // Vertical positioning
            // Above the input
            top = anchorTop - modalHeight - arrowHeight / 2;
            // If doesn't fit above or the input is out of the screen
            if ((top < scrollTop) || (anchorTop > scrollTop + newHeight)) {
                $popup.removeClass('mbsc-fr-bubble-top').addClass('mbsc-fr-bubble-bottom');
                // Below the input
                top = anchorTop + anchorHeight + arrowHeight / 2;
            } else {
                $popup.removeClass('mbsc-fr-bubble-bottom').addClass('mbsc-fr-bubble-top');
            }

            // Set arrow position
            $('.mbsc-fr-arr', $markup).css({
                left: constrain(anchorLeft + anchorWidth / 2 - (left + (modalWidth - arrowWidth) / 2), 0, arrowWidth)
            });

            // Lock scroll only if popup is entirely in the viewport
            scrollLock = (top > scrollTop) && (left > scrollLeft) && (top + modalHeight <= scrollTop + newHeight) && (left + modalWidth <= scrollLeft + newWidth);

        } else {
            left = scrollLeft;
            top = s.display == 'top' ? scrollTop : Math.max(0, scrollTop + newHeight - modalHeight);
        }

        if (needsDimensions) {
            // If top + modal height > doc height, increase doc height
            docHeight = Math.max(top + modalHeight, hasContext ? ctx.scrollHeight : $(document).height());
            docWidth = Math.max(left + modalWidth, hasContext ? ctx.scrollWidth : $(document).width());
            $persp.css({
                width: docWidth,
                height: docHeight
            });

            // Check if scroll needed
            if (s.scroll && s.display == 'bubble' && ((top + modalHeight + 8 > scrollTop + newHeight) || (anchorTop > scrollTop + newHeight) || (anchorTop + anchorHeight < scrollTop))) {
                preventPos = true;
                setTimeout(function () {
                    preventPos = false;
                }, 300);
                $wnd.scrollTop(Math.min(anchorTop, top + modalHeight - newHeight + 8, docHeight - newHeight));
            }
        }

        css.top = Math.floor(top);
        css.left = Math.floor(left);

        $popup.css(css);

        wndWidth = newWidth;
        wndHeight = newHeight;
    };

    /**
     * Show mobiscroll on focus and click event of the parameter.
     * @param {HTMLElement} elm - Events will be attached to this element.
     * @param {Function} [beforeShow=undefined] - Optional function to execute before showing mobiscroll.
     */
    that.attachShow = function (elm, beforeShow) {
        var $label,
            $elm = $(elm),
            readOnly = $elm.prop('readonly');

        if (s.display !== 'inline') {
            if ((s.showOnFocus || s.showOnTap) && $elm.is('input,select')) {
                $elm.prop('readonly', true).on('mousedown.mbsc', function (ev) {
                    // Prevent input to get focus on tap (virtual keyboard pops up on some devices)
                    ev.preventDefault();
                }).on('focus.mbsc', function () {
                    if (that._isVisible) {
                        // Don't allow input focus if mobiscroll is being opened
                        this.blur();
                    }
                });

                $label = $('label[for="' + $elm.attr('id') + '"]');

                if (!$label.length) {
                    $label = $elm.closest('label');
                }
            }

            if ($elm.is('select')) {
                return;
            }

            if (s.showOnFocus) {
                $elm.on('focus.mbsc', function () {
                    if (!preventShow) {
                        show(beforeShow, $elm);
                    } else {
                        preventShow = false;
                    }
                });
            }

            if (s.showOnTap) {
                $elm.on('keydown.mbsc', function (ev) {
                    if (ev.keyCode == 32 || ev.keyCode == 13) { // Space or Enter
                        ev.preventDefault();
                        ev.stopPropagation();
                        show(beforeShow, $elm);
                    }
                });

                that.tap($elm, function () {
                    show(beforeShow, $elm);
                });

                if ($label && $label.length) {
                    that.tap($label, function () {
                        show(beforeShow, $elm);
                    });
                }
            }

            elmList.push({
                readOnly: readOnly,
                el: $elm,
                lbl: $label
            });
        }
    };

    /**
     * Set button handler.
     */
    that.select = function () {
        if (isModal) {
            that.hide(false, 'set', false, set);
        } else {
            set();
        }
    };

    /**
     * Cancel and hide the scroller instance.
     */
    that.cancel = function () {
        if (isModal) {
            that.hide(false, 'cancel', false, cancel);
        } else {
            cancel();
        }
    };

    /**
     * Clear button handler.
     */
    that.clear = function () {
        that._clearValue();
        trigger('onClear');
        if (isModal && that._isVisible && !that.live) {
            that.hide(false, 'clear', false, clear);
        } else {
            clear();
        }
    };

    /**
     * Enables the scroller and the associated input.
     */
    that.enable = function () {
        s.disabled = false;
        if (that._isInput) {
            $elm.prop('disabled', false);
        }
    };

    /**
     * Disables the scroller and the associated input.
     */
    that.disable = function () {
        s.disabled = true;
        if (that._isInput) {
            $elm.prop('disabled', true);
        }
    };

    /**
     * Shows the scroller instance.
     * @param {Boolean} prevAnim - Prevent animation if true
     * @param {Boolean} prevFocus - Prevent focusing if true
     */
    that.show = function (prevAnim, prevFocus) {

        function onAnimEnd() {
            $markup
                .off(animEnd, onAnimEnd)
                .removeClass('mbsc-anim-in mbsc-anim-trans mbsc-anim-trans-' + doAnim)
                .find('.mbsc-fr-popup')
                .removeClass('mbsc-anim-' + doAnim);
            onShow(prevFocus);
        }

        var hasButtons,
            html;

        if (s.disabled || that._isVisible) {
            return;
        }

        // Parse value from input
        that._readValue();

        if (trigger('onBeforeShow') === false) {
            return false;
        }

        $activeElm = null;

        doAnim = s.animate;
        buttons = s.buttons || [];

        needsDimensions = hasContext || s.display == 'bubble';
        needsLock = needsFixed && !needsDimensions && s.scrollLock;

        hasButtons = buttons.length > 0;

        touched = false;

        if (doAnim !== false) {
            if (s.display == 'top') {
                doAnim = doAnim || 'slidedown';
            } else if (s.display == 'bottom') {
                doAnim = doAnim || 'slideup';
            } else if (s.display == 'center' || s.display == 'bubble') {
                doAnim = doAnim || 'pop';
            }
        }

        if (isModal) {
            scrollTop = Math.max(0, $wnd.scrollTop());
            scrollLeft = Math.max(0, $wnd.scrollLeft());
            wndWidth = 0;
            wndHeight = 0;

            if (needsLock && !$lock.hasClass('mbsc-fr-lock-ios')) {
                //$lock.scrollTop(0);
                $ctx.css({
                    top: -scrollTop + 'px',
                    left: -scrollLeft + 'px'
                });
            }

            $lock.addClass((s.scrollLock ? 'mbsc-fr-lock' : '') + (needsLock ? ' mbsc-fr-lock-ios' : '') + (hasContext ? ' mbsc-fr-lock-ctx' : ''));

            // Hide virtual keyboard
            if ($(document.activeElement).is('input,textarea')) {
                document.activeElement.blur();
            }

            // Hide active instance
            if (mobiscroll.activeInstance) {
                mobiscroll.activeInstance.hide();
            }

            // Set active instance
            mobiscroll.activeInstance = that;
            ctx.mbscModals = ctx.mbscModals || 0;
            ctx.mbscLock = ctx.mbscLock || 0;
            ctx.mbscModals++;
            if (s.scrollLock) {
                ctx.mbscLock++;
            }
        }

        // Create wheels containers
        html = '<div lang="' + s.lang + '" class="mbsc-fr mbsc-no-touch mbsc-' + s.theme + (s.baseTheme ? ' mbsc-' + s.baseTheme : '') + ' mbsc-fr-' + s.display + ' ' +
            (s.cssClass || '') + ' ' +
            (s.compClass || '') +
            (that._isLiquid ? ' mbsc-fr-liq' : '') +
            (halfBorder ? ' mbsc-fr-hb' : '') +
            (needsLock ? ' mbsc-platform-ios' : '') +
            (hasButtons ? (buttons.length >= 3 ? ' mbsc-fr-btn-block ' : '') : ' mbsc-fr-nobtn') + '">' +
            (isModal ? '<div class="mbsc-fr-persp"><div class="mbsc-fr-overlay"></div><div role="dialog" tabindex="-1" class="mbsc-fr-scroll">' : '') + // Overlay
            '<div class="mbsc-fr-popup' +
            (s.rtl ? ' mbsc-rtl' : ' mbsc-ltr') +
            (s.headerText ? ' mbsc-fr-has-hdr' : '') +
            '">' + // Popup
            (s.display === 'bubble' ? '<div class="mbsc-fr-arr-w"><div class="mbsc-fr-arr-i"><div class="mbsc-fr-arr"></div></div></div>' : '') + // Bubble arrow
            '<div class="mbsc-fr-w">' + // Popup content
            '<div aria-live="assertive" class="mbsc-fr-aria mbsc-fr-hdn"></div>' +
            (s.headerText ? '<div class="mbsc-fr-hdr">' + (isString(s.headerText) ? s.headerText : '') + '</div>' : '') + // Header
            '<div class="mbsc-fr-c">'; // Wheel group container

        html += that._generateContent();

        html += '</div>';

        if (hasButtons) {
            html += '<div class="mbsc-fr-btn-cont">';
            $.each(buttons, function (i, b) {
                b = isString(b) ? that.buttons[b] : b;

                if (b.handler === 'set') {
                    b.parentClass = 'mbsc-fr-btn-s';
                }

                if (b.handler === 'cancel') {
                    b.parentClass = 'mbsc-fr-btn-c';
                }

                html += '<div' + (s.btnWidth ? ' style="width:' + (100 / buttons.length) + '%"' : '') + ' class="mbsc-fr-btn-w ' + (b.parentClass || '') + '"><div tabindex="0" role="button" class="mbsc-fr-btn' + i + ' mbsc-fr-btn-e ' + (b.cssClass === undefined ? s.btnClass : b.cssClass) + (b.icon ? ' mbsc-ic mbsc-ic-' + b.icon : '') + '">' + (b.text || '') + '</div></div>';
            });
            html += '</div>';
        }
        html += '</div></div></div></div>' + (isModal ? '</div></div>' : '');

        $markup = $(html);
        $persp = $('.mbsc-fr-persp', $markup);
        $overlay = $('.mbsc-fr-scroll', $markup);
        $wrapper = $('.mbsc-fr-w', $markup);
        $header = $('.mbsc-fr-hdr', $markup);
        $popup = $('.mbsc-fr-popup', $markup);
        $ariaDiv = $('.mbsc-fr-aria', $markup);

        markup = $markup[0];
        overlay = $overlay[0];
        popup = $popup[0];

        that._markup = $markup;
        that._header = $header;
        that._isVisible = true;

        posEvents = 'orientationchange resize';

        that._markupReady($markup);

        trigger('onMarkupReady', {
            target: markup
        });

        // Attach events
        if (isModal) {
            // Enter / ESC
            $(window).on('keydown', onWndKeyDown);

            // Prevent scroll if not specified otherwise
            if (s.scrollLock) {
                $markup.on('touchmove mousewheel wheel', function (ev) {
                    if (scrollLock) {
                        ev.preventDefault();
                    }
                });
            }

            if (s.focusTrap) {
                $wnd.on('focusin', onFocus);
            }

            if (s.closeOnOverlayTap) {
                var moved,
                    target,
                    startX,
                    startY;

                $overlay
                    .on('touchstart mousedown', function (ev) {
                        if (!target && ev.target == $overlay[0]) {
                            target = true;
                            moved = false;
                            startX = getCoord(ev, 'X');
                            startY = getCoord(ev, 'Y');
                        }
                    })
                    .on('touchmove mousemove', function (ev) {
                        if (target && !moved && (Math.abs(getCoord(ev, 'X') - startX) > 9 || Math.abs(getCoord(ev, 'Y') - startY) > 9)) {
                            moved = true;
                        }
                    })
                    .on('touchcancel', function () {
                        target = false;
                    })
                    .on('touchend touchcancel mouseup', function (ev) {
                        if (target && !moved) {
                            that.cancel();
                            if (ev.type != 'mouseup') {
                                preventClick();
                            }
                        }
                        target = false;
                    });
            }

            if (needsDimensions) {
                posEvents += ' scroll';
            }
        }

        // Wait for the toolbar and addressbar to appear on iOS
        setTimeout(function () {
            // Show
            if (isModal) {
                $markup.appendTo($ctx);
            } else if ($elm.is('div') && !that._hasContent) {
                // Insert inside the element on which was initialized
                $elm.empty().append($markup);
            } else {
                // Insert after the element
                if ($elm.hasClass('mbsc-control')) {
                    var $wrap = $elm.closest('.mbsc-control-w');
                    $markup.insertAfter($wrap);
                    if ($wrap.hasClass('mbsc-select')) {
                        $wrap.addClass('mbsc-select-inline');
                    }
                } else {
                    $markup.insertAfter($elm);
                }
            }

            isInserted = true;

            that._markupInserted($markup);

            trigger('onMarkupInserted', {
                target: markup
            });

            $markup
                .on('selectstart mousedown', prevdef) // Prevents blue highlight on Android and text selection in IE
                .on('click', '.mbsc-fr-btn-e', prevdef)
                .on('keydown', '.mbsc-fr-btn-e', function (ev) {
                    if (ev.keyCode == 32) { // Space
                        ev.preventDefault();
                        ev.stopPropagation();
                        this.click();
                    }
                })
                .on('keydown', function (ev) { // Trap focus inside modal
                    if (ev.keyCode == 32) { // Space
                        ev.preventDefault();
                    } else if (ev.keyCode == 9 && isModal && s.focusTrap) { // Tab
                        var $focusable = $markup.find('[tabindex="0"]').filter(function () {
                                return this.offsetWidth > 0 || this.offsetHeight > 0;
                            }),
                            index = $focusable.index($(':focus', $markup)),
                            i = $focusable.length - 1,
                            target = 0;

                        if (ev.shiftKey) {
                            i = 0;
                            target = -1;
                        }

                        if (index === i) {
                            $focusable.eq(target)[0].focus();
                            ev.preventDefault();
                        }
                    }
                })
                .on('touchstart mousedown pointerdown', '.mbsc-fr-btn-e', onBtnStart)
                .on('touchend', '.mbsc-fr-btn-e', onBtnEnd);

            $('input,select,textarea', $markup).on('selectstart mousedown', function (ev) {
                ev.stopPropagation();
            }).on('keydown', function (ev) {
                if (ev.keyCode == 32) { // Space
                    ev.stopPropagation();
                }
            });

            // Need event capture for this
            markup.addEventListener('touchstart', function () {
                if (!touched) {
                    touched = true;
                    $ctx.find('.mbsc-no-touch').removeClass('mbsc-no-touch');
                }
            }, true);

            // Init buttons
            $.each(buttons, function (i, b) {
                that.tap($('.mbsc-fr-btn' + i, $markup), function (ev) {
                    b = isString(b) ? that.buttons[b] : b;
                    (isString(b.handler) ? that.handlers[b.handler] : b.handler).call(this, ev, that);
                }, true);
            });

            that._attachEvents($markup);

            // Set position
            that.position();

            $wnd.on(posEvents, onPosition);

            if (isModal) {
                if (doAnim && !prevAnim) {
                    $markup
                        .addClass('mbsc-anim-in mbsc-anim-trans mbsc-anim-trans-' + doAnim)
                        .on(animEnd, onAnimEnd)
                        .find('.mbsc-fr-popup')
                        .addClass('mbsc-anim-' + doAnim);
                } else {
                    onShow(prevFocus);
                }
            }

            trigger('onShow', {
                target: markup,
                valueText: that._tempValue
            });

        }, needsLock ? 100 : 0);
    };

    /**
     * Hides the scroller instance.
     */
    that.hide = function (prevAnim, btn, force, callback) {

        function onAnimEnd() {
            $markup.off(animEnd, onAnimEnd);
            onHide(prevAnim);
        }

        // If onClose handler returns false, prevent hide
        if (!that._isVisible || (!force && !that._isValid && btn == 'set') || (!force && trigger('onBeforeClose', {
                valueText: that._tempValue,
                button: btn
            }) === false)) {
            return false;
        }

        if (isModal) {
            if ($(document.activeElement).is('input,textarea') && popup.contains(document.activeElement)) {
                document.activeElement.blur();
            }
            $(window).off('keydown', onWndKeyDown);
            delete mobiscroll.activeInstance;
        }

        // Hide wheels and overlay
        if ($markup) {
            if (isModal && doAnim && !prevAnim) {
                $markup
                    .addClass('mbsc-anim-out mbsc-anim-trans mbsc-anim-trans-' + doAnim)
                    .on(animEnd, onAnimEnd)
                    .find('.mbsc-fr-popup')
                    .addClass('mbsc-anim-' + doAnim);
            } else {
                onHide(prevAnim);
            }

            that._detachEvents($markup);

            // Stop positioning on window resize
            $wnd
                .off(posEvents, onPosition)
                .off('focusin', onFocus);
        }

        if (callback) {
            callback();
        }

        // For validation
        $elm.trigger('blur');

        trigger('onClose', {
            valueText: that._value
        });

    };

    that.ariaMessage = function (txt) {
        $ariaDiv.html('');
        setTimeout(function () {
            $ariaDiv.html(txt);
        }, 100);
    };

    /**
     * Return true if the scroller is currently visible.
     */
    that.isVisible = function () {
        return that._isVisible;
    };

    // Protected functions to override

    that.setVal = noop;

    that.getVal = noop;

    that._generateContent = noop;

    that._attachEvents = noop;

    that._detachEvents = noop;

    that._readValue = noop;

    that._clearValue = noop;

    that._fillValue = noop;

    that._markupReady = noop;

    that._markupInserted = noop;

    that._markupRemove = noop;

    that._position = noop;

    that.__processSettings = noop;

    that.__init = noop;

    that.__destroy = noop;

    // Generic frame functions

    /**
     * Destroys the mobiscroll instance.
     */
    that._destroy = function () {
        // Force hide without animation
        that.hide(true, false, true);

        $elm.off('.mbsc');

        // Remove all events from elements
        $.each(elmList, function (i, v) {
            v.el.off('.mbsc').prop('readonly', v.readOnly);
            if (v.lbl) {
                v.lbl.off('.mbsc');
            }
        });

        that.__destroy();
    };

    that._processSettings = function () {
        var b, i;

        that.__processSettings();

        // Add default buttons
        s.buttons = s.buttons || (s.display !== 'inline' ? ['set', 'cancel'] : []);

        // Hide header text in inline mode by default
        s.headerText = s.headerText === undefined ? (s.display !== 'inline' ? '{value}' : false) : s.headerText;

        buttons = s.buttons || [];
        isModal = s.display !== 'inline';
        hasContext = s.context != 'body';
        $ctx = $(s.context);
        $lock = hasContext ? $ctx : $('body,html');
        ctx = $ctx[0];

        that._window = $wnd = $(hasContext ? s.context : window);
        that.live = true;

        // If no set button is found, live mode is activated
        for (i = 0; i < buttons.length; i++) {
            b = buttons[i];
            if (b == 'ok' || b == 'set' || b.handler == 'set') {
                that.live = false;
            }
        }

        that.buttons.set = {
            text: s.setText,
            icon: s.setIcon,
            handler: 'set'
        };

        that.buttons.cancel = {
            text: s.cancelText,
            icon: s.cancelIcon,
            handler: 'cancel'
        };

        that.buttons.close = {
            text: s.closeText,
            icon: s.closeIcon,
            handler: 'cancel'
        };

        that.buttons.clear = {
            text: s.clearText,
            icon: s.clearIcon,
            handler: 'clear'
        };

        that._isInput = $elm.is('input');
    };

    /**
     * Scroller initialization.
     */
    that._init = function () {

        if (that._isVisible) {
            that.hide(true, false, true);
        }

        // Unbind all events (if re-init)
        $elm.off('.mbsc');

        that.__init();

        that._isLiquid = s.layout == 'liquid';

        if (isModal) {
            that._readValue();
            if (!that._hasContent) {
                that.attachShow($elm);
            }
        } else {
            that.show();
        }

        $elm.on('change.mbsc', function () {
            if (!that._preventChange) {
                that.setVal($elm.val(), true, false);
            }
            that._preventChange = false;
        });
    };

    that.buttons = {};
    that.handlers = {
        set: that.select,
        cancel: that.cancel,
        clear: that.clear
    };

    that._value = null;

    that._isValid = true;
    that._isVisible = false;

    // Constructor

    s = that.settings;
    trigger = that.trigger;

    if (!inherit) {
        that.init(settings);
    }
};

Frame.prototype._defaults = {
    // Localization
    lang: 'en',
    setText: 'Set',
    selectedText: '{count} selected',
    closeText: 'Close',
    cancelText: 'Cancel',
    clearText: 'Clear',
    // Options
    context: 'body',
    maxPopupWidth: 600,
    disabled: false,
    closeOnOverlayTap: true,
    showOnFocus: isAndroid || isIOS, // Needed for ion-input
    showOnTap: true,
    display: 'center',
    scroll: true,
    scrollLock: true,
    tap: true,
    btnClass: 'mbsc-fr-btn',
    btnWidth: true,
    focusTrap: true,
    focusOnClose: !isIOS8 // Temporary for iOS8
};

classes.Frame = Frame;

themes.frame.mobiscroll = {
    headerText: false,
    btnWidth: false
};

themes.scroller.mobiscroll = extend({}, themes.frame.mobiscroll, {
    rows: 5,
    showLabel: false,
    selectedLineBorder: 1,
    weekDays: 'min',
    checkIcon: 'ion-ios7-checkmark-empty',
    btnPlusClass: 'mbsc-ic mbsc-ic-arrow-down5',
    btnMinusClass: 'mbsc-ic mbsc-ic-arrow-up5',
    btnCalPrevClass: 'mbsc-ic mbsc-ic-arrow-left5',
    btnCalNextClass: 'mbsc-ic mbsc-ic-arrow-right5'
});

if (isBrowser) {
    // Prevent re-show on window focus
    $(window).on('focus', function () {
        if ($activeElm) {
            preventShow = true;
        }
    });
}

export default Frame;
