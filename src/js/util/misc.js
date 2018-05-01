function noop() {}

function objectToArray(obj) {
    var arr = [],
        i;

    for (i in obj) {
        arr.push(obj[i]);
    }

    return arr;
}

function arrayToObject(arr) {
    var obj = {},
        i;

    if (arr) {
        for (i = 0; i < arr.length; i++) {
            obj[arr[i]] = arr[i];
        }
    }

    return obj;
}

function isNumeric(a) {
    return a - parseFloat(a) >= 0;
}

function isString(s) {
    return typeof s === 'string';
}

function constrain(val, min, max) {
    return Math.max(min, Math.min(val, max));
}

function pad(num, size) {
    num = num + '';
    size = size || 2;
    while (num.length < size) {
        num = '0' + num;
    }
    return num;
}

function throttle(fn, threshhold) {
    var last,
        timer;

    threshhold = threshhold || 100;

    return function () {
        var context = this,
            now = +new Date(),
            args = arguments;

        if (last && now < last + threshhold) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
            }, threshhold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
}

function vibrate(time) {
    if ('vibrate' in navigator) {
        navigator.vibrate(time || 50);
    }
}

function getPercent(v, min, max) {
    return (v - min) * 100 / (max - min);
}

function getBoolAttr(attr, def, $elm) {
    var v = $elm.attr(attr);
    return v === undefined || v === '' ? def : v === 'true';
}

export {
    arrayToObject,
    constrain,
    isNumeric,
    isString,
    noop,
    objectToArray,
    throttle,
    vibrate,
    pad,
    getPercent,
    getBoolAttr
};
