/*!
 * Mobiscroll v3.0.0
 * http://mobiscroll.com
 *
 * Copyright 2010-2016, Acid Media
 * Licensed under the MIT license.
 *
 */

var mobiscroll = mobiscroll || {};

(function (window, document, undefined) {

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

    function init(that, options, args) {
        var ret = that;

        // Init
        if (typeof options === 'object') {
            return that.each(function () {
                if (instances[this.id]) {
                    instances[this.id].destroy();
                }
                new ms.classes[options.component || 'Scroller'](this, options);
            });
        }

        // Method call
        if (typeof options === 'string') {
            that.each(function () {
                var r,
                    inst = instances[this.id];

                if (inst && inst[options]) {
                    r = inst[options].apply(this, Array.prototype.slice.call(args, 1));
                    if (r !== undefined) {
                        ret = r;
                        return false;
                    }
                }
            });
        }

        return ret;
    }

    var ms,
        platform,
        vers,
        empty = function () {},
        $ = typeof jQuery == 'undefined' ? mobiscroll.$ : jQuery,
        id = +new Date(),
        instances = {},
        extend = $.extend,
        userAgent = navigator.userAgent,
        device = userAgent.match(/Android|iPhone|iPad|iPod|Windows Phone|Windows|MSIE/i),
        mod = document.createElement('modernizr').style,
        has3d = testProps(['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective']),
        hasFlex = testProps(['flex', 'msFlex', 'WebkitBoxDirection']),
        prefix = testPrefix(),
        pr = prefix.replace(/^\-/, '').replace(/\-$/, '').replace('moz', 'Moz'),
        version = [];

    if (/Android/i.test(device)) {
        platform = 'android';
        vers = navigator.userAgent.match(/Android\s+([\d\.]+)/i);
        if (vers) {
            version = vers[0].replace('Android ', '').split('.');
        }
    } else if (/iPhone|iPad|iPod/i.test(device)) {
        platform = 'ios';
        vers = navigator.userAgent.match(/OS\s+([\d\_]+)/i);
        if (vers) {
            version = vers[0].replace(/_/g, '.').replace('OS ', '').split('.');
        }
    } else if (/Windows Phone/i.test(device)) {
        platform = 'wp';
    } else if (/Windows|MSIE/i.test(device)) {
        platform = 'windows';
    }

    ms = mobiscroll = {
        $: $,
        version: '3.0.0',
        util: {
            prefix: prefix,
            jsPrefix: pr,
            has3d: has3d,
            hasFlex: hasFlex,
            preventClick: function () {
                // Prevent ghost click
                ms.tapped++;
                setTimeout(function () {
                    ms.tapped--;
                }, 500);
            },
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
            getCoord: function (e, c, page) {
                var ev = e.originalEvent || e,
                    prop = (page ? 'page' : 'client') + c;

                // Multi touch support
                if (ev.targetTouches && ev.targetTouches[0]) {
                    return ev.targetTouches[0][prop];
                }

                if (ev.changedTouches && ev.changedTouches[0]) {
                    return ev.changedTouches[0][prop];
                }

                return e[prop];
            },
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
        tapped: 0,
        autoTheme: 'mobiscroll',
        presets: {
            scroller: {},
            numpad: {},
            listview: {},
            menustrip: {}
        },
        themes: {
            form: {},
            frame: {},
            scroller: {},
            listview: {},
            menustrip: {},
            progress: {}
        },
        platform: {
            name: platform,
            majorVersion: version[0],
            minorVersion: version[1]
        },
        i18n: {},
        instances: instances,
        classes: {},
        components: {},
        settings: {},
        setDefaults: function (o) {
            extend(this.settings, o);
        },
        presetShort: function (name, c, p) {
            ms[name] = function (selector, s) {
                var inst,
                    instIds,
                    ret = {},
                    options = s || {};

                $.extend(options, {
                    preset: p === false ? undefined : name
                });

                $(selector).each(function () {
                    if (instances[this.id]) {
                        instances[this.id].destroy();
                    }

                    inst = new ms.classes[c || 'Scroller'](this, options);
                    ret[this.id] = inst;
                });

                instIds = Object.keys(ret);

                return instIds.length == 1 ? ret[instIds[0]] : ret;
            };

            this.components[name] = function (s) {
                return init(this, extend(s, {
                    component: c,
                    preset: p === false ? undefined : name
                }), arguments);
            };
        }
    };

    $.mobiscroll = ms;

    $.fn.mobiscroll = function (method) {
        extend(this, ms.components);
        return init(this, method, arguments);
    };

    ms.classes.Base = function (el, settings) {

        var lang,
            preset,
            s,
            theme,
            themeName,
            trigger,
            defaults,
            util = ms.util,
            getCoord = util.getCoord,
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

            trigger('onProcessSettings');

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
            var startX,
                startY,
                target,
                moved,
                startTime;

            tolerance = tolerance || 9;

            function onStart(ev) {
                if (!target) {
                    // Can't always call preventDefault here, it kills page scroll
                    if (prevent) {
                        ev.preventDefault();
                    }
                    target = this;
                    startX = getCoord(ev, 'X');
                    startY = getCoord(ev, 'Y');
                    moved = false;
                    startTime = new Date();
                }
            }

            function onMove(ev) {
                // If movement is more than 20px, don't fire the click event handler
                if (target && !moved && (Math.abs(getCoord(ev, 'X') - startX) > tolerance || Math.abs(getCoord(ev, 'Y') - startY) > tolerance)) {
                    moved = true;
                }
            }

            function onEnd(ev) {
                if (target) {
                    if ((time && new Date() - startTime < 100) || !moved) {
                        ev.preventDefault();
                        handler.call(target, ev, that);
                    }

                    target = false;

                    util.preventClick();
                }
            }

            function onCancel() {
                target = false;
            }

            if (s.tap) {
                el
                    .on('touchstart.mbsc', onStart)
                    .on('touchcancel.mbsc', onCancel)
                    .on('touchmove.mbsc', onMove)
                    .on('touchend.mbsc', onEnd);
            }

            el.on('click.mbsc', function (ev) {
                ev.preventDefault();
                // If handler was not called on touchend, call it on click;
                handler.call(this, ev, that);
            });
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

        $(el).addClass('mbsc-comp');

        // Autogenerate id
        if (!el.id) {
            el.id = 'mobiscroll' + (++id);
        }

        // Save instance
        instances[el.id] = that;
    };

    // Prevent standard behaviour on body click
    function preventClick(ev) {
        // Textarea needs the mousedown event
        if (ms.tapped && !ev.tap && !(ev.target.nodeName == 'TEXTAREA' && ev.type == 'mousedown')) {
            ev.stopPropagation();
            ev.preventDefault();
            return false;
        }
    }

    if (document.addEventListener) {
        $.each(['mouseover', 'mousedown', 'mouseup', 'click'], function (i, ev) {
            document.addEventListener(ev, preventClick, true);
        });
    }

})(window, document);
