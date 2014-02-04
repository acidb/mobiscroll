/*jslint eqeq: true, plusplus: true, undef: true, sloppy: true, vars: true, forin: true */
if (!window.jQuery) {

    var jQuery = jq;

    (function ($) {
        var document = window.document,
            classSelectorRE = /^\.([\w-]+)$/,
            idSelectorRE = /^#([\w-]+)$/,
            tagSelectorRE = /^[\w-]+$/,
            rtable = /^t(?:able|d|h)$/i,
            rroot = /^(?:body|html)$/i,
            tempParent = document.createElement('div'),
            emptyArray = [],
            slice = emptyArray.slice,
            class2type = {},
            toString = class2type.toString;

        function type(obj)          { return obj == null ? String(obj) : class2type[toString.call(obj)] || "object" }
        function isWindow(obj)      { return obj != null && obj == obj.window }
        function isObject(obj)      { return type(obj) == "object" }
        function isPlainObject(obj) { return isObject(obj) && !isWindow(obj) && obj.__proto__ == Object.prototype }
        function isArray(value)     { return value instanceof Array }

        function extend(target, source, deep) {
            for (key in source)
                if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                    if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                        target[key] = {}
                    if (isArray(source[key]) && !isArray(target[key]))
                        target[key] = []
                    extend(target[key], source[key], deep)
                } else if (source[key] !== undefined)
                    target[key] = source[key]
        }

        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        function matches(element, selector) {
            if (!element || element.nodeType !== 1) {
                return false;
            }

            var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                                  element.oMatchesSelector || element.matchesSelector;

            if (matchesSelector) {
                return matchesSelector.call(element, selector);
            }
            // fall back to performing a selector:
            var match, parent = element.parentNode, temp = !parent
            if (temp) (parent = tempParent).appendChild(element)
            match = ~qsa(parent, selector).indexOf(element)
            temp && tempParent.removeChild(element)
            return match
        }

        function qsa(element, selector){
            var found
            return (element === document && idSelectorRE.test(selector)) ?
            ( (found = element.getElementById(RegExp.$1)) ? [found] : emptyArray ) :
            (element.nodeType !== 1 && element.nodeType !== 9) ? emptyArray :
            slice.call(
                classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) :
                tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) :
                element.querySelectorAll(selector)
                )
        }

        function camelize(str) {
            return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' });
        }

        $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
            class2type[ "[object " + name + "]" ] = name.toLowerCase()
        });

        ['width', 'height'].forEach(function(dimension){
            $.fn[dimension] = function(value){
                var body = document.body,
                    html = document.documentElement,
                    offset, Dimension = dimension.replace(/./, function(m){return m[0].toUpperCase()})
                if (value === undefined) return this[0] == window ? document.documentElement['client' + Dimension] :
                    this[0] == document ? Math.max(body['scroll' + Dimension], body['offset' + Dimension], html['client' + Dimension], html['scroll' + Dimension], html['offset' + Dimension]) : //document.documentElement['offset' + Dimension] :
                    (offset = this.offset()) && offset[dimension]
                else return this.each(function(idx){
                    var el = $(this)
                    el.css(dimension, value)
                })
            }
        });

        ['width', 'height'].forEach(function(dimension) {
            var offset, Dimension = dimension.replace(/./, function(m) {return m[0].toUpperCase()});
            $.fn['outer' + Dimension] = function(margin) {
                var elem = this;
                if (elem) {
                    var size = elem[0]['offset' + Dimension];
                    var sides = {'width': ['left', 'right'], 'height': ['top', 'bottom']};
                    sides[dimension].forEach(function(side) {
                         if (margin) {
                            size += parseInt(elem.css(camelize('margin-' + side)), 10);
                        }
                    });
                    return size;
                }
                else {
                    return null;
                }
            };
        });

        ['width', 'height'].forEach(function (dimension) {
            var offset, Dimension = dimension.replace(/./, function (m) { return m[0].toUpperCase(); });
            $.fn['inner' + Dimension] = function () {
                var elem = this;
                if (elem[0]['inner' + Dimension]) {
                    return elem[0]['inner' + Dimension];
                } else {
                    var size = elem[0]['offset' + Dimension],
                        sides = {'width': ['left', 'right'], 'height': ['top', 'bottom']};
                    sides[dimension].forEach(function (side) {
                            size -= parseInt(elem.css(camelize('border-' + side + '-width')), 10);
                    });
                    return size;
                }
            };
        });

        ["Left", "Top"].forEach(function(name, i) {
            var method = "scroll" + name;
            function isWindow( obj ) {
                return obj && typeof obj === "object" && "setInterval" in obj;
            }
            function getWindow( elem ) {
                return isWindow( elem ) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;
            }

            $.fn[method] = function( val ) {
                var elem, win;
                if (val === undefined) {
                    elem = this[0];
                    if (!elem) {
                        return null;
                    }
                    win = getWindow(elem);
                    // Return the scroll offset
                    return win ? ("pageXOffset" in win) ? win[i ? "pageYOffset" : "pageXOffset"] :
                        win.document.documentElement[method] ||
                        win.document.body[method] :
                        elem[method];
                }

                // Set the scroll offset
                this.each(function() {
                    win = getWindow(this);
                    if (win) {
                        var xCoord = !i ? val : $(win).scrollLeft();
                        var yCoord = i ? val : $(win).scrollTop();
                        win.scrollTo(xCoord, yCoord);
                    }
                    else {
                        this[method] = val;
                    }
                });
            }
        });

        $.fn.position = function() {
            if (!this[0]) {
                return null;
            }

            var elem = this[0],

            // Get *real* offsetParent
            offsetParent = this.offsetParent(),
            // Get correct offsets
            offset       = this.offset(),
            parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

            // Subtract element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            offset.top  -= parseFloat($(elem).css("margin-top")) || 0;
            offset.left -= parseFloat($(elem).css("margin-left")) || 0;

            // Add offsetParent borders
            parentOffset.top  += parseFloat($(offsetParent[0]).css("border-top-width")) || 0;
            parentOffset.left += parseFloat($(offsetParent[0]).css("border-left-width")) || 0;

            // Subtract the two offsets
            return {
                top:  offset.top  - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        };

        $.fn.offsetParent = function() {
            var ret = $();
            this.each(function(){
                var offsetParent = this.offsetParent || document.body;
                while ( offsetParent && (!rroot.test(offsetParent.nodeName) && $(offsetParent).css("position") === "static") ) {
                    offsetParent = offsetParent.offsetParent;
                }
                ret.push(offsetParent);
            });
            return ret;
        };

        $.fn.focus = function (handler) {
            if (handler === undefined) {
                return $(this).trigger('focus');
            } else {
                return $(this).bind('focus', handler);
            }
        };

        $.fn.blur = function (handler) {
            if (handler === undefined) {
                return $(this).trigger('blur');
            } else {
                return $(this).bind('blur', handler);
            }
        };

        $.fn.slice = function () {
            return $(slice.apply(this, arguments));
        };

        $.fn.before = function (elm) {
            $(elm).insertBefore(this);
            return this;
        };

        $.fn.pluck = function (property) {
            return this.map(function (i, e) { return e[property]; });
        };

        $.fn.prev = function (selector) {
            var p = this.pluck('previousElementSibling');
            return p[0][0] ? $(p[0]).filter(selector || '*') : $([]);
        };

        $.fn.next = function (selector) {
            var n = this.pluck('nextElementSibling');
            return n[0][0] ? $(n[0]).filter(selector || '*') : $([]);
        };

        $.fn.prevUntil = function (selector) {
            var n = this,
                array = [];

            while (n.length && !$(n).filter(selector).length) {
                array.push(n[0]);
                n = n.prev();
            }

            return $(array);
        };

        $.fn.nextUntil = function (selector) {
            var n = this,
                array = [];

            while (n.length && !n.filter(selector).length) {
                array.push(n[0]);
                n = n.next();
            }

            return $(array);
        };

        $.inArray = function (value, array, fromIndex) {
            var i = fromIndex || 0;
            while (i < array.length) {
                if (array[i++] == value) {
                    return --i;
                }
            }
            return -1;
        };

        $.isPlainObject = function (v) {
            return $.isObject(v);
        };

        $.fn._css = $.fn.css;
        $.fn.css = function (attr, val, obj) {
            if ($.isObject(attr)) {
                var i;
                for (i in attr) {
                    $(this)._css(i, isNumeric(attr[i]) ? attr[i] + 'px' : attr[i], obj);
                }
                return this;
            } else {
                return $(this)._css(attr, isNumeric(val) ? val + 'px' : val, obj);
            }
        };

        // Copy all but undefined properties from one or more
        // objects to the `target` object.
        $.extend = function (target) {
            arguments[0] = arguments[0] || {};
            var deep, args = slice.call(arguments, 1)
            if (typeof target == 'boolean') {
                deep = target
                target = args.shift()
            }
            args.forEach(function (arg) {
                extend(target, arg, deep)
            })
            return target
        }

    })(jQuery);

}
