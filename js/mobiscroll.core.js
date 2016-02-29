/*!
 * Mobiscroll v2.17.1
 * http://mobiscroll.com
 *
 * Copyright 2010-2015, Acid Media
 * Licensed under the MIT license.
 *
 */
(function ($, undefined) {

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
                new $.mobiscroll.classes[options.component || 'Scroller'](this, options);
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
        id = +new Date(),
        instances = {},
        extend = $.extend,
        mod = document.createElement('modernizr').style,
        has3d = testProps(['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective']),
        hasFlex = testProps(['flex', 'msFlex', 'WebkitBoxDirection']),
        prefix = testPrefix(),
        pr = prefix.replace(/^\-/, '').replace(/\-$/, '').replace('moz', 'Moz');

    $.fn.mobiscroll = function (method) {
        extend(this, $.mobiscroll.components);
        return init(this, method, arguments);
    };

    ms = $.mobiscroll = $.mobiscroll || {
        version: '2.17.1',
        util: {
            prefix: prefix,
            jsPrefix: pr,
            has3d: has3d,
            hasFlex: hasFlex,
            isOldAndroid: /android [1-3]/i.test(navigator.userAgent),
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
                return ev.changedTouches ? ev.changedTouches[0][prop] : e[prop];
            },
            getPosition: function (t, vertical) {
                var style = window.getComputedStyle ? getComputedStyle(t[0]) : t[0].style,
                    matrix,
                    px;

                if (has3d) {
                    $.each(['t', 'webkitT', 'MozT', 'OT', 'msT'], function (i, v) {
                        if (style[v + 'ransform'] !== undefined) {
                            matrix = style[v + 'ransform'];
                            return false;
                        }
                    });
                    matrix = matrix.split(')')[0].split(', ');
                    px = vertical ? (matrix[13] || matrix[5]) : (matrix[12] || matrix[4]);
                } else {
                    px = vertical ? style.top.replace('px', '') : style.left.replace('px', '');
                }

                return px;
            },
            addIcon: function ($control, ic) {
                var icons = {},
                    $parent = $control.parent(),
                    errorMsg = $parent.find('.mbsc-err-msg'),
                    align = $control.attr('data-icon-align') || 'left',
                    icon = $control.attr('data-icon');

                // Wrap input
                $('<span class="mbsc-input-wrap"></span>').insertAfter($control).append($control);

                if (errorMsg) {
                    $parent.find('.mbsc-input-wrap').append(errorMsg);
                }

                if (icon) {
                    if (icon.indexOf('{') !== -1) {
                        icons = JSON.parse(icon);
                    } else {
                        icons[align] = icon;
                    }

                    extend(icons, ic);

                    $parent
                        .addClass((icons.right ? 'mbsc-ic-right ' : '') + (icons.left ? ' mbsc-ic-left' : ''))
                        .find('.mbsc-input-wrap')
                        .append(icons.left ? '<span class="mbsc-input-ic mbsc-left-ic mbsc-ic mbsc-ic-' + icons.left + '"></span>' : '')
                        .append(icons.right ? '<span class="mbsc-input-ic mbsc-right-ic mbsc-ic mbsc-ic-' + icons.right + '"></span>' : '');
                }
            },
            constrain: function (val, min, max) {
                return Math.max(min, Math.min(val, max));
            },
            vibrate: function (time) {
                if ('vibrate' in navigator) {
                    navigator.vibrate(time || 50);
                }
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
            listview: {},
            menustrip: {},
            progress: {}
        },
        i18n: {},
        instances: instances,
        classes: {},
        components: {},
        defaults: {
            context: 'body',
            mousewheel: true,
            vibrate: true
        },
        setDefaults: function (o) {
            extend(this.defaults, o);
        },
        presetShort: function (name, c, p) {
            this.components[name] = function (s) {
                return init(this, extend(s, {
                    component: c,
                    preset: p === false ? undefined : name
                }), arguments);
            };
        }
    };

    $.mobiscroll.classes.Base = function (el, settings) {

        var lang,
            preset,
            s,
            theme,
            themeName,
            defaults,
            ms = $.mobiscroll,
            util = ms.util,
            getCoord = util.getCoord,
            that = this;

        that.settings = {};

        that._presetLoad = function () {};

        that._init = function (ss) {
            s = that.settings;

            // Update original user settings
            extend(settings, ss);

            // Load user defaults
            if (that._hasDef) {
                defaults = ms.defaults;
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
                that.trigger('onThemeLoad', [lang, settings]);
            }

            // Update settings object
            extend(s, theme, lang, defaults, settings);

            // Load preset settings
            if (that._hasPreset) {

                that._presetLoad(s);

                preset = ms.presets[that._class][s.preset];

                if (preset) {
                    preset = preset.call(el, that);
                    extend(s, preset, settings);
                }
            }
        };

        that._destroy = function () {
            that.trigger('onDestroy', []);

            // Delete scroller instance
            delete instances[el.id];

            that = null;
        };

        /**
         * Attach tap event to the given element.
         */
        that.tap = function (el, handler, prevent) {
            var startX,
                startY,
                target,
                moved;

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

                    if (ev.type == 'pointerdown') {
                        $(document)
                            .on('pointermove', onMove)
                            .on('pointerup', onEnd);
                    }
                }
            }

            function onMove(ev) {
                // If movement is more than 20px, don't fire the click event handler
                if (target && !moved && Math.abs(getCoord(ev, 'X') - startX) > 9 || Math.abs(getCoord(ev, 'Y') - startY) > 9) {
                    moved = true;
                }
            }

            function onEnd(ev) {
                if (target) {
                    if (!moved) {
                        ev.preventDefault();
                        handler.call(target, ev, that);
                    }

                    if (ev.type == 'pointerup') {
                        $(document)
                            .off('pointermove', onMove)
                            .off('pointerup', onEnd);
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
                    .on('touchstart.dw pointerdown.dw', onStart)
                    .on('touchcancel.dw pointercancel.dw', onCancel)
                    .on('touchmove.dw', onMove)
                    .on('touchend.dw', onEnd);
            }

            el.on('click.dw', function (ev) {
                ev.preventDefault();
                // If handler was not called on touchend, call it on click;
                handler.call(this, ev, that);
            });
        };

        /**
         * Triggers an event
         */
        that.trigger = function (name, args) {
            var ret;
            args.push(that);
            $.each([defaults, theme, preset, settings], function (i, v) {
                if (v && v[name]) { // Call preset event
                    ret = v[name].apply(el, args);
                }
            });
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

})(jQuery);
