import { $, isBrowser } from '../core/core';

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

var animEnd,
    mod,
    cssPrefix,
    hasTouchAction,
    jsPrefix,
    textColors = {};

if (isBrowser) {
    mod = document.createElement('modernizr').style;
    cssPrefix = testPrefix();
    jsPrefix = cssPrefix.replace(/^\-/, '').replace(/\-$/, '').replace('moz', 'Moz');
    animEnd = mod.animation !== undefined ? 'animationend' : 'webkitAnimationEnd';
    hasTouchAction = mod.touchAction !== undefined;
}

export {
    animEnd,
    cssPrefix,
    jsPrefix,
    getPosition,
    getTextColor,
    hasTouchAction,
    testTouch
};
