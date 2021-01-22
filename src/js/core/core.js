/*!
 * Mobiscroll v4.10.8
 * http://mobiscroll.com
 *
 *
 * Copyright 2010-2018, Acid Media
 *
 */

import { mobiscroll, util } from './mobiscroll';
import { os, majorVersion, minorVersion, isBrowser, isDark } from '../util/platform';
import { noop, vibrate } from '../util/misc';
import { getCoord, preventClick, tap } from '../util/tap';

export default mobiscroll;

function getWidth(el) {
    return el[0].innerWidth || el.innerWidth();
}

function getThemeName(s) {
    var themeName = s.theme,
        themeVariant = s.themeVariant;

    if (themeName == 'auto' || !themeName) {
        themeName = ms.autoTheme;
    }

    if (themeName == 'default') {
        themeName = 'mobiscroll';
    }

    if (
        (themeVariant === 'dark' || (isDark && themeVariant === 'auto')) &&
        ms.themes.form[themeName + '-dark']
    ) {
        themeName = themeName + '-dark';
    } else if (themeVariant === 'light' && /.+-dark$/.test(themeName)) {
        themeName = themeName.replace(/-dark$/, '');
    }

    return themeName;
}

function autoInit(selector, Component, hasRefresh) {
    if (isBrowser) {
        $(function () {

            $(selector).each(function () {
                new Component(this, {});
            });

            $(document).on('mbsc-enhance', function (ev, settings) {
                if ($(ev.target).is(selector)) {
                    new Component(ev.target, settings || {});
                } else {
                    $(selector, ev.target).each(function () {
                        new Component(this, settings || {});
                    });
                }
            });

            if (hasRefresh) {
                $(document).on('mbsc-refresh', function (ev) {
                    var inst;

                    if ($(ev.target).is(selector)) {
                        inst = instances[ev.target.id];
                        if (inst) {
                            inst.refresh();
                        }
                    } else {
                        $(selector, ev.target).each(function () {
                            inst = instances[this.id];
                            if (inst) {
                                inst.refresh();
                            }
                        });
                    }
                });
            }
        });
    }
}

var ms,
    $ = mobiscroll.$,
    id = +new Date(),
    instances = {},
    classes = {},
    empty = {},
    breakpoints = {
        xsmall: 0,
        small: 576,
        medium: 768,
        large: 992,
        xlarge: 1200
    },
    extend = $.extend;

extend(util, {
    getCoord: getCoord,
    preventClick: preventClick,
    vibrate: vibrate
});

ms = extend(mobiscroll, {
    $: $,
    version: '4.10.8',
    autoTheme: 'mobiscroll',
    themes: {
        form: {},
        page: {},
        frame: {},
        scroller: {},
        listview: {},
        navigation: {},
        progress: {},
        card: {}
    },
    platform: {
        name: os,
        majorVersion: majorVersion,
        minorVersion: minorVersion
    },
    i18n: {},
    instances: instances,
    classes: classes,
    util: util,
    settings: {},
    setDefaults: function (o) {
        extend(this.settings, o);
    },
    customTheme: function (name, baseTheme) {
        var i,
            themes = mobiscroll.themes,
            comps = ['frame', 'scroller', 'listview', 'navigation', 'form', 'page', 'progress', 'card'];

        for (i = 0; i < comps.length; i++) {
            themes[comps[i]][name] = extend({}, themes[comps[i]][baseTheme], {
                baseTheme: baseTheme
            });
        }
    }
});

const Base = function (el, settings) {
    var ctx,
        lang,
        preset,
        resp,
        s,
        theme,
        themeName,
        trigger,
        defaults,
        that = this;

    that.settings = {};

    that.element = el;

    that._init = noop;

    that._destroy = noop;

    that._processSettings = noop;

    that._checkResp = function (width) {
        if (that && that._responsive) {
            var newResp = getResponsiveSettings(width);
            if (resp !== newResp) {
                resp = newResp;
                that.init({});
                return true;
            }
        }
    };

    that._getRespCont = function () {
        return $(s.context == 'body' ? window : s.context);
    };

    that.init = function (newSettings, newValue) {
        var key,
            value;

        // In case of settings update save the old value
        if (newSettings && that.getVal) {
            value = that.getVal();
        }

        // Reset settings object
        for (key in that.settings) {
            delete that.settings[key];
        }

        s = that.settings;

        // Update original user settings
        extend(settings, newSettings);

        // Load user defaults
        if (that._hasDef) {
            defaults = ms.settings;
        }

        // Create settings object
        extend(s, that._defaults, defaults, settings);

        ctx = that._getRespCont();

        if (that._responsive) {
            if (!resp) {
                resp = getResponsiveSettings();
            }
            extend(s, resp);
        }

        // Get theme defaults
        if (that._hasTheme) {

            themeName = getThemeName(s);

            settings.theme = themeName;

            theme = ms.themes[that._class] ? ms.themes[that._class][themeName] : {};
        }

        // Get language defaults
        if (that._hasLang) {
            lang = ms.i18n[s.lang];
        }

        // Update settings object
        extend(s, theme, lang, defaults, settings, resp);

        that._processSettings(resp || {});

        // Load preset settings
        if (that._presets) {

            preset = that._presets[s.preset];

            if (preset) {
                preset = preset.call(el, that, settings);
                extend(s, preset, settings, resp);
            }
        }

        that._init(newSettings);

        // In case of settings update reset the value.
        // This is needed to adapt the value for the updated settings
        // E.g. min/max, date format, etc.
        if (newSettings && that.setVal) {
            that.setVal(newValue === undefined ? value : newValue, true);
        }

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
    that.option = function (opt, value, newValue) {
        var obj = {},
            // preserve settings that are possible to change runtime
            dynamic = ['data', 'invalid', 'valid', 'readonly'];

        if (/calendar|eventcalendar|range/.test(s.preset)) {
            dynamic.push('marked', 'labels', 'colors');
        }

        if (typeof opt === 'object') {
            obj = opt;
        } else {
            obj[opt] = value;
        }

        dynamic.forEach(function (v) {
            settings[v] = s[v];
        });

        that.init(obj, newValue);
    };

    /**
     * Returns the mobiscroll instance.
     */
    that.getInst = function () {
        return that;
    };

    settings = settings || {};
    trigger = that.trigger;

    function getResponsiveSettings(w) {
        var result = empty,
            width;

        if (s.responsive) {
            width = w || getWidth(ctx);
            $.each(s.responsive, function (key, value) {
                if (width >= (value.breakpoint || breakpoints[key])) {
                    result = value;
                }
            });
        }
        return result;
    }

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
    classes,
    extend,
    getThemeName,
    getWidth,
    instances,
    isBrowser,
    mobiscroll,
    util,
    autoInit,
    Base,
    ms
};
