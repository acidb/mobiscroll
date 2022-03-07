import { os, isBrowser, isSafari, raf } from './platform';

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
        elm.__mbscTouched = 1;
    } else if (elm.__mbscTouched) {
        delete elm.__mbscTouched;
        return false;
    }
    return true;
}

function getPosition(t, vertical) {
    var prefixes = ['t', 'webkitT', 'MozT', 'OT', 'msT'],
        style = getComputedStyle(t[0]),
        i = 0,
        matrix,
        px,
        v;

    while (!matrix && i < prefixes.length) {
        v = prefixes[i];
        if (style[v + 'ransform'] !== undefined) {
            matrix = style[v + 'ransform'];
        }
        i++;
    }

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

        var ctx = canvas && canvas.getContext('2d');

        if (!ctx) {
            return '#fff';
        }

        // Use canvas element, since it does not require DOM append
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);

        var rgb = ctx.getImageData(0, 0, 1, 1).data;
        var delta = +rgb[0] * 0.299 + +rgb[1] * 0.587 + +rgb[2] * 0.114;
        var textColor = delta < 130 ? '#fff' : '#000';

        textColors[color] = textColor;

        return textColor;
    }
}

function scrollStep(el, startTime, from, to, callback) {
    var elapsed = Math.min(1, (new Date() - startTime) / 468),
        eased = 0.5 * (1 - Math.cos(Math.PI * elapsed)),
        current = from + (to - from) * eased;

    el.scrollTop = current;

    if (current !== to) {
        raf(function () {
            scrollStep(el, startTime, from, to, callback);
        });
    } else if (callback) {
        callback();
    }
}

function smoothScroll(el, to, prevAnim, callback) {
    if (prevAnim) {
        el.scrollTop = to;
        if (callback) {
            callback();
        }
    } else {
        scrollStep(el, new Date(), el.scrollTop, to, callback);
    }
}

function listen(el, event, handler, opt) {
    if (el) {
        el.addEventListener(event, handler, opt);
    }
}

function unlisten(el, event, handler, opt) {
    if (el) {
        el.removeEventListener(event, handler, opt);
    }
}

function matches(element, selector) {
    if (!selector || !element || element.nodeType !== 1) {
        return false;
    }
    var matchesSelector = element.matches || element.matchesSelector || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector;
    return matchesSelector.call(element, selector);
}

function closest(el, target, selector) {
    while (target) {
        if (matches(target, selector)) {
            return target;
        }
        target = target !== el ? target.parentNode : null;
    }
    return null;
}

function trigger(elm, name, data) {
    var evt;
    try {
        evt = new CustomEvent(name, {
            detail: data,
            bubbles: true,
            cancelable: true
        });
    } catch (e) {
        evt = document.createEvent('Event');
        evt.initEvent(name, true, true);
        evt.detail = data;
    }
    elm.dispatchEvent(evt);
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
    canvas,
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
    canvas = document.createElement('canvas');
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
    closest,
    cssPrefix,
    jsPrefix,
    listen,
    matches,
    getPosition,
    getTextColor,
    hasGhostClick,
    hasTransition,
    removeWindowFocus,
    smoothScroll,
    testTouch,
    trigger,
    unlisten
};
