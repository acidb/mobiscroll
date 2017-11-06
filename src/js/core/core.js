/*!
 * Mobiscroll v3.2.6
 * http://mobiscroll.com
 *
 * Copyright 2010-2016, Acid Media
 * Licensed under the MIT license.
 *
 */

import mobiscroll from './mobiscroll';
import { os, majorVersion, minorVersion, isBrowser } from '../util/platform';
import { noop, vibrate } from '../util/misc';
import { getCoord, preventClick, tap } from '../util/tap';

export default mobiscroll;

var ms,
    $ = mobiscroll.$,
    id = +new Date(),
    instances = {},
    extend = $.extend;

ms = extend(mobiscroll, {
    $: $,
    version: '3.2.6',
    util: {
        getCoord: getCoord,
        preventClick: preventClick,
        vibrate: vibrate
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
    platform: {
        name: os,
        majorVersion: majorVersion,
        minorVersion: minorVersion
    },
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
            themes[comps[i]][name] = extend({}, themes[comps[i]][baseTheme], {
                baseTheme: baseTheme
            });
        }
    }
});

ms.presetShort = ms.presetShort || function () {};

const Base = function (el, settings) {
    var lang,
        preset,
        s,
        theme,
        themeName,
        trigger,
        defaults,
        that = this;

    that.settings = {};

    that._init = noop;

    that._destroy = noop;

    that._processSettings = noop;

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

export {
    $,
    extend,
    isBrowser,
    Base
};
