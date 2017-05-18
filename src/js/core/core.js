/*!
 * Mobiscroll v3.2.0
 * http://mobiscroll.com
 *
 * Copyright 2010-2016, Acid Media
 * Licensed under the MIT license.
 *
 */

import mobiscroll from './mobiscroll';
import platform from '../util/platform';
import {
    preventClick,
    getCoord,
    tap
} from '../util/tap';

export default mobiscroll;

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

var ms,
    empty = function () {},
    $ = mobiscroll.$,
    id = +new Date(),
    instances = {},
    extend = $.extend,
    mod = document.createElement('modernizr').style,
    prefix = testPrefix(),
    pr = prefix.replace(/^\-/, '').replace(/\-$/, '').replace('moz', 'Moz'),
    animEnd = mod.animation !== undefined ? 'animationend' : 'webkitAnimationEnd';

ms = extend(mobiscroll, {
    $: $,
    version: '3.2.0',
    util: {
        prefix: prefix,
        jsPrefix: pr,
        animEnd: animEnd,
        preventClick: preventClick,
        testTouch: function (e, elm) {
            if (e.type == 'touchstart') {
                $(elm).attr('data-touch', '1');
            } else if ($(elm).attr('data-touch')) {
                $(elm).removeAttr('data-touch');
                return false;
            }
            return true;
        },
        objectToArray: function (obj) {
            var arr = [],
                i;

            for (i in obj) {
                arr.push(obj[i]);
            }

            return arr;
        },
        arrayToObject: function (arr) {
            var obj = {},
                i;

            if (arr) {
                for (i = 0; i < arr.length; i++) {
                    obj[arr[i]] = arr[i];
                }
            }

            return obj;
        },
        isNumeric: function (a) {
            return a - parseFloat(a) >= 0;
        },
        isString: function (s) {
            return typeof s === 'string';
        },
        getCoord: getCoord,
        getPosition: function (t, vertical) {
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
        },
        constrain: function (val, min, max) {
            return Math.max(min, Math.min(val, max));
        },
        vibrate: function (time) {
            if ('vibrate' in navigator) {
                navigator.vibrate(time || 50);
            }
        },
        throttle: function (fn, threshhold) {
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
    },
    autoTheme: 'mobiscroll',
    presets: {
        scroller: {},
        numpad: {},
        listview: {},
        menustrip: {}
    },
    themes: {
        form: {},
        page: {},
        frame: {},
        scroller: {},
        listview: {},
        menustrip: {},
        progress: {}
    },
    platform: platform,
    i18n: {},
    instances: instances,
    classes: {},
    components: {},
    settings: {},
    setDefaults: function (o) {
        extend(this.settings, o);
    },
    customTheme: function (name, baseTheme) {
        var i,
            themes = mobiscroll.themes,
            comps = ['frame', 'scroller', 'listview', 'menustrip', 'form', 'progress'];

        for (i = 0; i < comps.length; i++) {
            themes[comps[i]][name] = mobiscroll.$.extend({}, themes[comps[i]][baseTheme], {
                baseTheme: baseTheme
            });
        }
    }
});

ms.presetShort = ms.presetShort || function () {};

ms.classes.Base = function (el, settings) {

    var lang,
        preset,
        s,
        theme,
        themeName,
        trigger,
        defaults,
        that = this;

    that.settings = {};

    that._init = empty;

    that._destroy = empty;

    that._processSettings = empty;

    that.init = function (ss) {
        var key;

        // Reset settings object
        for (key in that.settings) {
            delete that.settings[key];
        }

        s = that.settings;

        // Update original user settings
        extend(settings, ss);

        // Load user defaults
        if (that._hasDef) {
            defaults = ms.settings;
        }

        // Create settings object
        extend(s, that._defaults, defaults, settings);

        // Get theme defaults
        if (that._hasTheme) {

            themeName = s.theme;

            if (themeName == 'auto' || !themeName) {
                themeName = ms.autoTheme;
            }

            if (themeName == 'default') {
                themeName = 'mobiscroll';
            }

            settings.theme = themeName;

            theme = ms.themes[that._class] ? ms.themes[that._class][themeName] : {};
        }

        // Get language defaults
        if (that._hasLang) {
            lang = ms.i18n[s.lang];
        }

        if (that._hasTheme) {
            trigger('onThemeLoad', {
                lang: lang,
                settings: settings
            });
        }

        // Update settings object
        extend(s, theme, lang, defaults, settings);

        that._processSettings();

        // Load preset settings
        if (that._hasPreset) {

            preset = ms.presets[that._class][s.preset];

            if (preset) {
                preset = preset.call(el, that);
                extend(s, preset, settings);
            }
        }

        that._init(ss);

        trigger('onInit');
    };

    that.destroy = function () {
        if (that) {
            that._destroy();
            trigger('onDestroy');

            // Delete scroller instance
            delete instances[el.id];

            that = null;
        }
    };

    /**
     * Attach tap event to the given element.
     */
    that.tap = function (el, handler, prevent, tolerance, time) {
        tap(that, el, handler, prevent, tolerance, time);
    };

    /**
     * Triggers an event
     */
    that.trigger = function (name, ev) {
        var ret,
            i,
            v,
            s = [defaults, theme, preset, settings];

        for (i = 0; i < 4; i++) {
            v = s[i];
            if (v && v[name]) {
                ret = v[name].call(el, ev || {}, that);
            }
        }

        return ret;
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
     * Returns the mobiscroll instance.
     */
    that.getInst = function () {
        return that;
    };

    settings = settings || {};
    trigger = that.trigger;

    function construct() {
        $(el).addClass('mbsc-comp');

        // Autogenerate id
        if (!el.id) {
            el.id = 'mobiscroll' + (++id);
        } else if (instances[el.id]) {
            instances[el.id].destroy();
        }

        // Save instance
        instances[el.id] = that;
        that.__ready = true;
    }

    if (!that.__ready) {
        construct();
    }
};
