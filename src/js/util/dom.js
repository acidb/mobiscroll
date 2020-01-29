import { $, isBrowser } from '../core/core';
import { os, isSafari, raf } from './platform';

function testProps(props) {
    var i;
    for (i in props) {
        if (mod[props[i]] !== undefined) {
            return true;
        }
    }
    return false;
}

function testPrefix() {
    var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
        p;

    for (p in prefixes) {
        if (testProps([prefixes[p] + 'Transform'])) {
            return '-' + prefixes[p].toLowerCase() + '-';
        }
    }
    return '';
}

function testTouch(e, elm) {
    if (e.type == 'touchstart') {
        $(elm).attr('data-touch', '1');
    } else if ($(elm).attr('data-touch')) {
        $(elm).removeAttr('data-touch');
        return false;
    }
    return true;
}

function getPosition(t, vertical) {
    var style = getComputedStyle(t[0]),
        matrix,
        px;

    $.each(['t', 'webkitT', 'MozT', 'OT', 'msT'], function (i, v) {
        if (style[v + 'ransform'] !== undefined) {
            matrix = style[v + 'ransform'];
            return false;
        }
    });
    matrix = matrix.split(')')[0].split(', ');
    px = vertical ? (matrix[13] || matrix[5]) : (matrix[12] || matrix[4]);

    return px;
}

function getTextColor(color) {
    if (color) {
        // Cache calculated text colors, because it is slow
        if (textColors[color]) {
            return textColors[color];
        }
        var $div = $('<div style="background-color:' + color + ';"></div>').appendTo('body'),
            style = getComputedStyle($div[0]),
            rgb = style.backgroundColor.replace(/rgb|rgba|\(|\)|\s/g, '').split(','),
            delta = rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114,
            txt = delta < 130 ? '#fff' : '#000';

        $div.remove();

        textColors[color] = txt;

        return txt;
    }
}

function scrollStep($el, startTime, from, to, callback) {
    var elapsed = Math.min(1, (new Date() - startTime) / 468),
        eased = 0.5 * (1 - Math.cos(Math.PI * elapsed)),
        current = from + (to - from) * eased;

    $el.scrollTop(current);

    if (current !== to) {
        raf(function () {
            scrollStep($el, startTime, from, to, callback);
        });
    } else if (callback) {
        callback();
    }
}

function smoothScroll(el, to, prevAnim, callback) {
    var $el = $(el);
    if (prevAnim) {
        $el.scrollTop(to);
        if (callback) {
            callback();
        }
    } else {
        scrollStep($el, new Date(), $el.scrollTop(), to, callback);
    }
}

function listen(el, event, handler, opt) {
    if (el) {
        el.addEventListener(event, handler, opt);
    }
}

function unlisten(el, event, handler) {
    if (el) {
        el.removeEventListener(event, handler);
    }
}

function setFocusInvisible() {
    win.__mbscFocusVisible = false;
}

function setFocusVisible() {
    win.__mbscFocusVisible = true;
}

function addWindowFocus() {
    let focusCount = win.__mbscFocusCount || 0;
    if (focusCount === 0) {
        listen(win, 'mousedown', setFocusInvisible, true);
        listen(win, 'keydown', setFocusVisible, true);
    }
    win.__mbscFocusCount = ++focusCount;
}

function removeWindowFocus() {
    let focusCount = win.__mbscFocusCount || 0;
    win.__mbscFocusCount = --focusCount;
    if (win.__mbscFocusCount === 0) {
        unlisten(win, 'mousedown', setFocusInvisible);
        unlisten(win, 'keydown', setFocusVisible);
    }
}

var animEnd,
    mod,
    cssPrefix,
    hasGhostClick,
    hasTransition,
    isWebView,
    isWkWebView,
    jsPrefix,
    win,
    textColors = {};

if (isBrowser) {
    win = window;
    mod = document.createElement('modernizr').style;
    cssPrefix = testPrefix();
    jsPrefix = cssPrefix.replace(/^-/, '').replace(/-$/, '').replace('moz', 'Moz');
    animEnd = mod.animation !== undefined ? 'animationend' : 'webkitAnimationEnd';
    hasTransition = mod.transition !== undefined;
    // UIWebView on iOS still has the ghost click, 
    // WkWebView does not have a ghost click, but it's hard to tell if it's UIWebView or WkWebView
    // In addition in iOS 12.2 if we enable tap handling, it brakes the form inputs
    // (keyboard appears, but the cursor is not in the input).
    isWebView = os === 'ios' && !isSafari;
    isWkWebView = isWebView && win.webkit && win.webkit.messageHandlers;
    hasGhostClick = mod.touchAction === undefined || (isWebView && !isWkWebView);
}

export {
    addWindowFocus,
    animEnd,
    cssPrefix,
    jsPrefix,
    listen,
    getPosition,
    getTextColor,
    hasGhostClick,
    hasTransition,
    removeWindowFocus,
    smoothScroll,
    testTouch,
    unlisten
};
