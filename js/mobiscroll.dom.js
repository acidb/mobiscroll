var mobiscroll = mobiscroll || {};

(function (window, document, undefined) {

    var cssNumber = {
            'column-count': 1,
            'columns': 1,
            'font-weight': 1,
            'line-height': 1,
            'opacity': 1,
            'z-index': 1,
            'zoom': 1
        },
        propMap = {
            'readonly': 'readOnly'
        },
        emptyArray = [],
        slice = Array.prototype.slice;

    function isFunction(value) {
        return typeof value === "function";
    }

    function isObject(obj) {
        return typeof obj === "object";
    }

    function likeArray(obj) {
        return typeof obj.length == 'number';
    }

    function camelize(str) {
        return str.replace(/-+(.)?/g, function (match, chr) {
            return chr ? chr.toUpperCase() : '';
        });
    }

    function extend(target, source, deep) {
        for (var key in source) {
            if (deep && ($.isPlainObject(source[key]) || $.isArray(source[key]))) {
                if ($.isPlainObject(source[key]) && !$.isPlainObject(target[key]) || $.isArray(source[key]) && !$.isArray(target[key])) {
                    target[key] = {};
                }
                extend(target[key], source[key], deep);
            } else if (source[key] !== undefined) {
                target[key] = source[key];
            }
        }
    }

    function dasherize(str) {
        return str.replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/_/g, '-')
            .toLowerCase();
    }

    function maybeAddPx(name, value) {
        return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value;
    }

    var Dom = (function () {
        var Dom = function (arr) {
            var _this = this,
                i = 0;
            // Create array-like object
            for (i = 0; i < arr.length; i++) {
                _this[i] = arr[i];
            }
            _this.length = arr.length;
            // Return collection with methods
            return $(this);
        };

        var $ = function (selector, context) {
            var arr = [],
                i = 0;
            if (selector && !context) {
                if (selector instanceof Dom) {
                    return selector;
                }
            }

            if (isFunction(selector)) {
                return $(document).ready(selector);
            }

            if (selector) {
                // String
                if (typeof selector === 'string') {
                    var els, tempParent, html;
                    selector = html = selector.trim();
                    if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
                        var toCreate = 'div';
                        if (html.indexOf('<li') === 0) {
                            toCreate = 'ul';
                        }
                        if (html.indexOf('<tr') === 0) {
                            toCreate = 'tbody';
                        }
                        if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) {
                            toCreate = 'tr';
                        }
                        if (html.indexOf('<tbody') === 0) {
                            toCreate = 'table';
                        }
                        if (html.indexOf('<option') === 0) {
                            toCreate = 'select';
                        }
                        tempParent = document.createElement(toCreate);
                        tempParent.innerHTML = html;
                        for (i = 0; i < tempParent.childNodes.length; i++) {
                            arr.push(tempParent.childNodes[i]);
                        }
                    } else {
                        if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
                            // Pure ID selector
                            els = [document.getElementById(selector.split('#')[1])];
                        } else {
                            if (context instanceof Dom) {
                                context = context[0];
                            }
                            // Other selectors
                            els = (context || document).querySelectorAll(selector);

                        }
                        for (i = 0; i < els.length; i++) {
                            if (els[i]) {
                                arr.push(els[i]);
                            }
                        }
                    }
                }
                // Node/element
                else if (selector.nodeType || selector === window || selector === document) {
                    arr.push(selector);
                }
                //Array of elements or instance of Dom
                else if (selector.length > 0 && selector[0].nodeType) {
                    for (i = 0; i < selector.length; i++) {
                        arr.push(selector[i]);
                    }
                } else if ($.isArray(selector)) {
                    arr = selector;
                }
            }
            return new Dom(arr);
        };

        Dom.prototype = {
            ready: function (callback) {
                if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
                    callback($);
                } else {
                    document.addEventListener('DOMContentLoaded', function () {
                        callback($);
                    }, false);
                }
                return this;
            },
            concat: emptyArray.concat,
            empty: function () {
                return this.each(function () {
                    this.innerHTML = '';
                });
            },
            map: function (fn) {
                return $($.map(this, function (el, i) {
                    return fn.call(el, i, el);
                }));
            },
            slice: function () {
                return $(slice.apply(this, arguments));
            },
            // Classes and attriutes
            // NOTE: element.classList attribure is not supported on android 2.3!!!
            addClass: function (className) {
                if (typeof className === 'undefined') {
                    return this;
                }

                var classes = className.split(' ');

                for (var i = 0; i < classes.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        if (typeof this[j].classList !== 'undefined' && classes[i] !== '') {
                            this[j].classList.add(classes[i]);
                        }
                    }
                }
                return this;
            },
            removeClass: function (className) {
                var classes = className.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        if (typeof this[j].classList !== 'undefined' && classes[i] !== '') {
                            this[j].classList.remove(classes[i]);
                        }
                    }
                }
                return this;
            },
            hasClass: function (className) {
                return this[0] ? this[0].classList.contains(className) : false;
            },
            toggleClass: function (className) {
                var classes = className.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        if (typeof this[j].classList !== 'undefined') {
                            this[j].classList.toggle(classes[i]);
                        }
                    }
                }
                return this;
            },
            closest: function (selector, context) {
                var node = this[0],
                    collection = false;

                if (isObject(selector)) {
                    collection = $(selector);
                }
                while (node && !(collection ? collection.indexOf(node) >= 0 : $.matches(node, selector))) {
                    node = node !== context && node.nodeType !== node.DOCUMENT_NODE && node.parentNode;
                }

                return $(node);
            },
            attr: function (attrs, value) {
                var attr;

                if (arguments.length === 1 && typeof attrs === 'string' && this.length) {
                    // Get attr
                    attr = this[0].getAttribute(attrs);
                    return this[0] && (attr || attr === '') ? attr : undefined;
                } else {
                    // Set attrs
                    for (var i = 0; i < this.length; i++) {
                        if (arguments.length === 2) {
                            // String
                            this[i].setAttribute(attrs, value);
                        } else {
                            // Object
                            for (var attrName in attrs) {
                                this[i][attrName] = attrs[attrName];
                                this[i].setAttribute(attrName, attrs[attrName]);
                            }
                        }
                    }
                    return this;
                }
            },
            removeAttr: function (attr) {
                for (var i = 0; i < this.length; i++) {
                    this[i].removeAttribute(attr);
                }
                return this;
            },
            prop: function (props, value) {
                props = propMap[props] || props;
                if (arguments.length === 1 && typeof props === 'string') {
                    // Get prop
                    return this[0] ? this[0][props] : undefined;
                } else {
                    // Set props
                    for (var i = 0; i < this.length; i++) {
                        this[i][props] = value;
                    }
                    return this;
                }
            },
            val: function (value) {
                if (typeof value === 'undefined') {
                    if (this.length && this[0].multiple) {
                        return $.map(this.find('option:checked'), function (v) {
                            return v.value;
                        });
                    }
                    return this[0] ? this[0].value : undefined;
                }

                if (this.length && this[0].multiple) {
                    $.each(this[0].options, function () {
                        this.selected = value.indexOf(this.value) != -1;
                    });
                } else {
                    for (var i = 0; i < this.length; i++) {
                        this[i].value = value;
                    }
                }

                return this;
            },
            //Events
            on: function (eventName, targetSelector, listener, capture) {
                var events = eventName.split(' '),
                    i, j;

                function handleLiveEvent(e) {
                    var k,
                        parents,
                        target = e.target;

                    if ($(target).is(targetSelector)) {
                        listener.call(target, e);
                    } else {
                        parents = $(target).parents();
                        for (k = 0; k < parents.length; k++) {
                            if ($(parents[k]).is(targetSelector)) {
                                listener.call(parents[k], e);
                            }
                        }
                    }
                }

                function handleNamespaces(elm, name, listener, capture) {
                    var namespace = name.split('.');

                    if (!elm.DomNameSpaces) {
                        elm.DomNameSpaces = [];
                    }

                    elm.DomNameSpaces.push({
                        namespace: namespace[1],
                        event: namespace[0],
                        listener: listener,
                        capture: capture
                    });

                    elm.addEventListener(namespace[0], listener, capture);
                }

                for (i = 0; i < this.length; i++) {
                    if (isFunction(targetSelector) || targetSelector === false) {
                        // Usual events
                        if (isFunction(targetSelector)) {
                            capture = listener || false;
                            listener = targetSelector;
                        }
                        for (j = 0; j < events.length; j++) {
                            // check for namespaces
                            if (events[j].indexOf('.') != -1) {
                                handleNamespaces(this[i], events[j], listener, capture);
                            } else {
                                this[i].addEventListener(events[j], listener, capture);
                            }
                        }
                    } else {
                        // Live events
                        for (j = 0; j < events.length; j++) {
                            if (!this[i].DomLiveListeners) {
                                this[i].DomLiveListeners = [];
                            }

                            this[i].DomLiveListeners.push({
                                listener: listener,
                                liveListener: handleLiveEvent
                            });

                            if (events[j].indexOf('.') != -1) {
                                handleNamespaces(this[i], events[j], handleLiveEvent, capture);
                            } else {
                                this[i].addEventListener(events[j], handleLiveEvent, capture);
                            }
                        }
                    }
                }
                return this;
            },
            off: function (eventName, targetSelector, listener, capture) {
                var events,
                    i, j, k,
                    that = this;

                function removeEvents(event) {
                    var i, j,
                        item,
                        parts = event.split('.'),
                        name = parts[0],
                        ns = parts[1];

                    for (i = 0; i < that.length; ++i) {
                        if (that[i].DomNameSpaces) {
                            for (j = 0; j < that[i].DomNameSpaces.length; ++j) {
                                item = that[i].DomNameSpaces[j];

                                if (item.namespace == ns && (item.event == name || !name)) {
                                    that[i].removeEventListener(item.event, item.listener, item.capture);
                                    item.removed = true;
                                }
                            }
                            // remove the events from the DomNameSpaces array
                            for (j = that[i].DomNameSpaces.length - 1; j >= 0; --j) {
                                if (that[i].DomNameSpaces[j].removed) {
                                    that[i].DomNameSpaces.splice(j, 1);
                                }
                            }
                        }
                    }
                }

                events = eventName.split(' ');

                for (i = 0; i < events.length; i++) {
                    for (j = 0; j < this.length; j++) {
                        if (isFunction(targetSelector) || targetSelector === false) {
                            // Usual events
                            if (isFunction(targetSelector)) {
                                capture = listener || false;
                                listener = targetSelector;
                            }

                            if (events[i].indexOf('.') === 0) { // remove namespace events
                                removeEvents(events[i].substr(1), listener, capture);
                            } else {
                                this[j].removeEventListener(events[i], listener, capture);
                            }
                        } else {
                            // Live event
                            if (this[j].DomLiveListeners) {
                                for (k = 0; k < this[j].DomLiveListeners.length; k++) {
                                    if (this[j].DomLiveListeners[k].listener === listener) {
                                        this[j].removeEventListener(events[i], this[j].DomLiveListeners[k].liveListener, capture);
                                    }
                                }
                            }
                            if (this[j].DomNameSpaces && this[j].DomNameSpaces.length && events[i]) {
                                removeEvents(events[i]);
                            }
                        }
                    }
                }

                return this;
            },
            trigger: function (eventName, eventData) {
                var events = eventName.split(' ');
                for (var i = 0; i < events.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        var evt;
                        try {
                            evt = new CustomEvent(events[i], {
                                detail: eventData,
                                bubbles: true,
                                cancelable: true
                            });
                        } catch (e) {
                            evt = document.createEvent('Event');
                            evt.initEvent(events[i], true, true);
                            evt.detail = eventData;
                        }
                        this[j].dispatchEvent(evt);
                    }
                }
                return this;
            },
            // Sizing/Styles
            width: function (dim) {
                if (dim !== undefined) {
                    return this.css('width', dim);
                }

                if (this[0] === window) {
                    return window.innerWidth;
                } else if (this[0] === document) {
                    return document.documentElement.scrollWidth;
                } else {
                    return this.length > 0 ? parseFloat(this.css('width')) : null;
                }
            },
            height: function (dim) {
                if (dim !== undefined) {
                    return this.css('height', dim);
                }

                if (this[0] === window) {
                    return window.innerHeight;
                } else if (this[0] === document) {
                    var body = document.body,
                        html = document.documentElement;

                    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
                } else {
                    return this.length > 0 ? parseFloat(this.css('height')) : null;
                }
            },
            innerWidth: function () {
                var elm = this;
                if (this.length > 0) {
                    if (this[0].innerWidth) {
                        return this[0].innerWidth;
                    } else {
                        var size = this[0].offsetWidth,
                            sides = ['left', 'right'];

                        sides.forEach(function (side) {
                            size -= parseInt(elm.css(camelize('border-' + side + '-width')) || 0, 10);
                        });
                        return size;
                    }
                }
            },
            innerHeight: function () {
                var elm = this;
                if (this.length > 0) {
                    if (this[0].innerHeight) {
                        return this[0].innerHeight;
                    } else {
                        var size = this[0].offsetHeight,
                            sides = ['top', 'bottom'];

                        sides.forEach(function (side) {
                            size -= parseInt(elm.css(camelize('border-' + side + '-width')) || 0, 10);
                        });

                        return size;
                    }
                }
            },
            offset: function () {
                if (this.length > 0) {
                    var el = this[0],
                        box = el.getBoundingClientRect(),
                        body = document.body,
                        clientTop = el.clientTop || body.clientTop || 0,
                        clientLeft = el.clientLeft || body.clientLeft || 0,
                        scrollTop = window.pageYOffset || el.scrollTop,
                        scrollLeft = window.pageXOffset || el.scrollLeft;

                    return {
                        top: box.top + scrollTop - clientTop,
                        left: box.left + scrollLeft - clientLeft
                    };
                }
            },
            hide: function () {
                for (var i = 0; i < this.length; i++) {
                    this[i].style.display = 'none';
                }
                return this;
            },
            show: function () {
                for (var i = 0; i < this.length; i++) {
                    if (this[i].style.display == "none") {
                        this[i].style.display = '';
                    }

                    if (getComputedStyle(this[i], '').getPropertyValue("display") == "none") {
                        this[i].style.display = 'block';
                    }
                }

                return this;
            },
            clone: function () {
                return this.map(function () {
                    return this.cloneNode(true);
                });
            },
            styles: function () {
                return this[0] ? window.getComputedStyle(this[0], null) : undefined;
            },
            css: function (property, value) {
                var i,
                    key,
                    element = this[0],
                    css = '';

                if (arguments.length < 2) {
                    if (!element) {
                        return;
                    }
                    if (typeof property === 'string') {
                        return element.style[property] || getComputedStyle(element, '').getPropertyValue(property);
                    }
                }

                if (typeof property === 'string') {
                    if (!value && value !== 0) {
                        this.each(function () {
                            this.style.removeProperty(dasherize(property));
                        });
                    } else {
                        css = dasherize(property) + ":" + maybeAddPx(property, value);
                    }
                } else {
                    for (key in property) {
                        if (!property[key] && property[key] !== 0) {
                            for (i = 0; i < this.length; i++) {
                                this[i].style.removeProperty(dasherize(key));
                            }
                        } else {
                            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';';
                        }
                    }
                }

                return this.each(function () {
                    this.style.cssText += ';' + css;
                });
            },
            each: function (callback) {
                for (var i = 0; i < this.length; i++) {
                    if (callback.apply(this[i], [i, this[i]]) === false) {
                        break;
                    }
                }
                return this;
            },
            filter: function (callback) {
                var matchedItems = [];

                for (var i = 0; i < this.length; i++) {
                    if (isFunction(callback)) {
                        if (callback.call(this[i], i, this[i])) {
                            matchedItems.push(this[i]);
                        }
                    } else if ($.matches(this[i], callback)) {
                        matchedItems.push(this[i]);
                    }
                }

                return new Dom(matchedItems);
            },
            html: function (html) {
                if (typeof html === 'undefined') {
                    return this[0] ? this[0].innerHTML : undefined;
                } else {
                    this.empty();
                    for (var i = 0; i < this.length; i++) {
                        this[i].innerHTML = html;
                    }
                    return this;
                }
            },
            text: function (text) {
                if (typeof text === 'undefined') {
                    return this[0] ? this[0].textContent.trim() : null;
                } else {
                    for (var i = 0; i < this.length; i++) {
                        this[i].textContent = text;
                    }
                    return this;
                }
            },
            is: function (selector) {
                return this.length > 0 && $.matches(this[0], selector);
            },
            not: function (selector) {
                var nodes = [];
                if (isFunction(selector) && selector.call !== undefined) {
                    this.each(function (idx) {
                        if (!selector.call(this, idx)) {
                            nodes.push(this);
                        }
                    });
                } else {
                    var excludes = typeof selector == 'string' ? this.filter(selector) : (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector);

                    if (isObject(excludes)) {
                        excludes = $.map(excludes, function (el) {
                            return el;
                        });
                    }

                    this.each(function (i, el) {
                        if (excludes.indexOf(el) < 0) {
                            nodes.push(el);
                        }
                    });
                }

                return $(nodes);
            },
            indexOf: function (el) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] === el) {
                        return i;
                    }
                }
            },
            index: function (element) {
                return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
            },
            get: function (idx) {
                return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
            },
            eq: function (index) {
                if (typeof index === 'undefined') {
                    return this;
                }
                var length = this.length,
                    returnIndex;

                if (index > length - 1) {
                    return new Dom([]);
                }
                if (index < 0) {
                    returnIndex = length + index;
                    return returnIndex < 0 ? new Dom([]) : new Dom([this[returnIndex]]);
                }
                return new Dom([this[index]]);
            },
            append: function (newChild) {
                var i, j;
                for (i = 0; i < this.length; i++) {
                    if (typeof newChild === 'string') {
                        var tempDiv = document.createElement('div');
                        tempDiv.innerHTML = newChild;
                        while (tempDiv.firstChild) {
                            this[i].appendChild(tempDiv.firstChild);
                        }
                    } else if (newChild instanceof Dom) {
                        for (j = 0; j < newChild.length; j++) {
                            this[i].appendChild(newChild[j]);
                        }
                    } else {
                        this[i].appendChild(newChild);
                    }
                }
                return this;
            },
            appendTo: function (parent) {
                $(parent).append(this);
                return this;
            },
            prepend: function (newChild) {
                var i, j;
                for (i = 0; i < this.length; i++) {
                    if (typeof newChild === 'string') {
                        var tempDiv = document.createElement('div');
                        tempDiv.innerHTML = newChild;
                        for (j = tempDiv.childNodes.length - 1; j >= 0; j--) {
                            this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
                        }
                        // this[i].insertAdjacentHTML('afterbegin', newChild);
                    } else if (newChild instanceof Dom) {
                        for (j = 0; j < newChild.length; j++) {
                            this[i].insertBefore(newChild[j], this[i].childNodes[0]);
                        }
                    } else {
                        this[i].insertBefore(newChild, this[i].childNodes[0]);
                    }
                }
                return this;
            },
            prependTo: function (parent) {
                $(parent).prepend(this);
                return this;
            },
            insertBefore: function (selector) {
                var before = $(selector);

                for (var i = 0; i < this.length; i++) {
                    if (before.length === 1) {
                        before[0].parentNode.insertBefore(this[i], before[0]);
                    } else if (before.length > 1) {
                        for (var j = 0; j < before.length; j++) {
                            before[j].parentNode.insertBefore(this[i].cloneNode(true), before[j]);
                        }
                    }
                }
                return this;
            },
            insertAfter: function (selector) {
                var after = $(selector);
                for (var i = 0; i < this.length; i++) {
                    if (after.length === 1) {
                        after[0].parentNode.insertBefore(this[i], after[0].nextSibling);
                    } else if (after.length > 1) {
                        for (var j = 0; j < after.length; j++) {
                            after[j].parentNode.insertBefore(this[i].cloneNode(true), after[j].nextSibling);
                        }
                    }
                }

                return this;
            },
            next: function (selector) {
                if (this.length > 0) {
                    if (selector) {
                        if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
                            return new Dom([this[0].nextElementSibling]);
                        } else {
                            return new Dom([]);
                        }
                    } else {
                        if (this[0].nextElementSibling) {
                            return new Dom([this[0].nextElementSibling]);
                        } else {
                            return new Dom([]);
                        }
                    }
                } else {
                    return new Dom([]);
                }
            },
            nextAll: function (selector) {
                var nextEls = [],
                    el = this[0];

                if (!el) {
                    return new Dom([]);
                }
                while (el.nextElementSibling) {
                    var next = el.nextElementSibling;
                    if (selector) {
                        if ($(next).is(selector)) {
                            nextEls.push(next);
                        }
                    } else {
                        nextEls.push(next);
                    }
                    el = next;
                }
                return new Dom(nextEls);
            },
            prev: function (selector) {
                if (this.length > 0) {
                    if (selector) {
                        if (this[0].previousElementSibling && $(this[0].previousElementSibling).is(selector)) {
                            return new Dom([this[0].previousElementSibling]);
                        } else {
                            return new Dom([]);
                        }
                    } else {
                        if (this[0].previousElementSibling) {
                            return new Dom([this[0].previousElementSibling]);
                        } else {
                            return new Dom([]);
                        }
                    }
                } else {
                    return new Dom([]);
                }
            },
            prevAll: function (selector) {
                var prevEls = [];
                var el = this[0];
                if (!el) {
                    return new Dom([]);
                }
                while (el.previousElementSibling) {
                    var prev = el.previousElementSibling;
                    if (selector) {
                        if ($(prev).is(selector)) {
                            prevEls.push(prev);
                        }
                    } else {
                        prevEls.push(prev);
                    }
                    el = prev;
                }
                return new Dom(prevEls);
            },
            parent: function (selector) {
                var parents = [];
                for (var i = 0; i < this.length; i++) {
                    if (this[i].parentNode !== null) {
                        if (selector) {
                            if ($(this[i].parentNode).is(selector)) {
                                parents.push(this[i].parentNode);
                            }
                        } else {
                            parents.push(this[i].parentNode);
                        }
                    }
                }
                return $($.unique(parents));
            },
            parents: function (selector) {
                var parents = [];
                for (var i = 0; i < this.length; i++) {
                    var parent = this[i].parentNode;
                    while (parent) {
                        if (selector) {
                            if ($(parent).is(selector)) {
                                parents.push(parent);
                            }
                        } else {
                            parents.push(parent);
                        }
                        parent = parent.parentNode;
                    }
                }
                return $($.unique(parents));
            },
            find: function (selector) {
                var foundElements = [];
                for (var i = 0; i < this.length; i++) {
                    var found = this[i].querySelectorAll(selector);
                    for (var j = 0; j < found.length; j++) {
                        foundElements.push(found[j]);
                    }
                }
                return new Dom(foundElements);
            },
            children: function (selector) {
                var children = [];
                for (var i = 0; i < this.length; i++) {
                    var childNodes = this[i].childNodes;

                    for (var j = 0; j < childNodes.length; j++) {
                        if (!selector) {
                            if (childNodes[j].nodeType === 1) {
                                children.push(childNodes[j]);
                            }
                        } else {
                            if (childNodes[j].nodeType === 1 && $(childNodes[j]).is(selector)) {
                                children.push(childNodes[j]);
                            }
                        }
                    }
                }

                return new Dom($.unique(children));
            },
            remove: function () {
                for (var i = 0; i < this.length; i++) {
                    if (this[i].parentNode) {
                        this[i].parentNode.removeChild(this[i]);
                    }
                }
                return this;
            },
            add: function () {
                var dom = this;
                var i, j;
                for (i = 0; i < arguments.length; i++) {
                    var toAdd = $(arguments[i]);
                    for (j = 0; j < toAdd.length; j++) {
                        dom[dom.length] = toAdd[j];
                        dom.length++;
                    }
                }
                return dom;
            },
            before: function (elm) {
                $(elm).insertBefore(this);
                return this;
            },
            after: function (elm) {
                $(elm).insertAfter(this);
                return this;
            },
            scrollTop: function (value) {
                if (!this.length) {
                    return;
                }
                var hasScrollTop = 'scrollTop' in this[0];

                if (value === undefined) {
                    return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
                }
                return this.each(hasScrollTop ? function () {
                    this.scrollTop = value;
                } : function () {
                    this.scrollTo(this.scrollX, value);
                });
            },
            scrollLeft: function (value) {
                if (!this.length) {
                    return;
                }
                var hasScrollLeft = 'scrollLeft' in this[0];

                if (value === undefined) {
                    return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
                }
                return this.each(hasScrollLeft ? function () {
                    this.scrollLeft = value;
                } : function () {
                    this.scrollTo(value, this.scrollY);
                });
            },
            contents: function () {
                return this.map(function (i, v) {
                    return slice.call(v.childNodes);
                });
            },
            nextUntil: function (selector) {
                var n = this,
                    array = [];

                while (n.length && !n.filter(selector).length) {
                    array.push(n[0]);
                    n = n.next();
                }

                return $(array);
            },
            prevUntil: function (selector) {
                var n = this,
                    array = [];

                while (n.length && !$(n).filter(selector).length) {
                    array.push(n[0]);
                    n = n.prev();
                }

                return $(array);
            },
            detach: function () {
                return this.remove();
            }
        };

        // Link to prototype
        $.fn = Dom.prototype;

        return $;
    })();

    // Export to local scope
    var $ = Dom;

    // Export to mobiscroll
    mobiscroll.$ = Dom;

    // DOM Library Utilites
    $.inArray = function (elem, array, i) {
        return emptyArray.indexOf.call(array, elem, i);
    };

    $.extend = function (target) {
        var deep,
            args = slice.call(arguments, 1);

        if (typeof target == 'boolean') {
            deep = target;
            target = args.shift();
        }

        target = target || {};

        args.forEach(function (arg) {
            extend(target, arg, deep);
        });

        return target;
    };

    $.isFunction = isFunction;

    $.isArray = function (arr) {
        return Object.prototype.toString.apply(arr) === '[object Array]';
    };

    $.isPlainObject = function (obj) {
        return isObject(obj) && obj !== null && obj !== obj.window && Object.getPrototypeOf(obj) == Object.prototype;
    };

    $.each = function (obj, callback) {
        var i, prop;

        if (!isObject(obj) || !callback) {
            return;
        }

        if ($.isArray(obj) || obj instanceof Dom) {
            // Array
            for (i = 0; i < obj.length; i++) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        } else {
            // Object
            for (prop in obj) {
                if (obj.hasOwnProperty(prop) && prop !== 'length') {
                    if (callback.call(obj[prop], prop, obj[prop]) === false) {
                        break;
                    }
                }
            }
        }

        return this;
    };

    $.unique = function (arr) {
        var unique = [];
        for (var i = 0; i < arr.length; i++) {
            if (unique.indexOf(arr[i]) === -1) {
                unique.push(arr[i]);
            }
        }
        return unique;
    };

    $.map = function (elements, callback) {
        var value, values = [],
            i, key;
        if (likeArray(elements)) {
            for (i = 0; i < elements.length; i++) {
                value = callback(elements[i], i);
                if (value !== null) {
                    values.push(value);
                }
            }
        } else {
            for (key in elements) {
                value = callback(elements[key], key);
                if (value !== null) {
                    values.push(value);
                }
            }
        }

        return values.length > 0 ? $.fn.concat.apply([], values) : values;
    };

    $.matches = function (element, selector) {
        if (!selector || !element || element.nodeType !== 1) {
            return false;
        }

        var matchesSelector = element.matchesSelector || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector;

        return matchesSelector.call(element, selector);

    };

})(window, document);
