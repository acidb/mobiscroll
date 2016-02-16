//(function (window, document, undefined) {

    var cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
        emptyArray = [],
        slice = Array.prototype.slice,
        filter = emptyArray.filter;

    function isFunction(value) { return typeof value === "function" }
    function isWindow(obj)     { return obj != null && obj === obj.window }
    function isDocument(obj)   { return obj != null && obj.nodeType === obj.DOCUMENT_NODE }
    function isObject(obj)     { return typeof obj === "object" }
    function compact(array) { return filter.call(array, function(item){ return item != null }) }
    function likeArray(obj) { return typeof obj.length == 'number' }
    function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
    function camelize(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }

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


    function dasherize(str) {
        return str.replace(/::/g, '/')
               .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
               .replace(/([a-z\d])([A-Z])/g, '$1_$2')
               .replace(/_/g, '-')
               .toLowerCase()
    }

    function maybeAddPx(name, value) {
        return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value;
    }

    var Dom = (function () {
        var Dom = function (arr) {
            var _this = this, i = 0;
            // Create array-like object
            for (i = 0; i < arr.length; i++) {
                _this[i] = arr[i];
            }
            _this.length = arr.length;
            // Return collection with methods
            return $(this);
        };
        var $ = function (selector, context) {
            var arr = [], i = 0;
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
                        if (html.indexOf('<li') === 0) toCreate = 'ul';
                        if (html.indexOf('<tr') === 0) toCreate = 'tbody';
                        if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
                        if (html.indexOf('<tbody') === 0) toCreate = 'table';
                        if (html.indexOf('<option') === 0) toCreate = 'select';
                        tempParent = document.createElement(toCreate);
                        tempParent.innerHTML = html;
                        for (i = 0; i < tempParent.childNodes.length; i++) {
                            arr.push(tempParent.childNodes[i]);
                        }
                    }
                    else {
                        if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
                            // Pure ID selector
                            els = [document.getElementById(selector.split('#')[1])];
                        }
                        else {
                            //console.log('$ context', context);
                            // console.log('$-ba', ( context  || document));
                            if (context instanceof Dom) {
                                 context = context[0];
                            } 
                            // Other selectors
                            els = (context || document).querySelectorAll(selector);

                        }
                        for (i = 0; i < els.length; i++) {
                            if (els[i]) arr.push(els[i]);
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
        concat: emptyArray.concat,
        ready: function(callback) {
            // need to check if document.body exists for IE as that browser reports
            // document ready when it hasn't yet created the body element
            if (/complete|loaded|interactive/.test(document.readyState) && document.body) callback($)
            else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
            return this
        },
        empty: function(){
            return this.each(function(){ this.innerHTML = '' })
        },
        map: function(fn){
            return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
        },

        slice: function(){
            return $(slice.apply(this, arguments))
        },

        // Classes and attriutes
        addClass: function (className) {
            if (typeof className === 'undefined') {
                return this;
            }

            var classes = className.split(' ');

            for (var i = 0; i < classes.length; i++) {
                for (var j = 0; j < this.length; j++) {
                    if (typeof this[j].classList !== 'undefined' && classes[i] != '') this[j].classList.add(classes[i]);
                }
            }
            return this;
        },
        removeClass: function (className) {
            var classes = className.split(' ');
            for (var i = 0; i < classes.length; i++) {
                for (var j = 0; j < this.length; j++) {
                    if (typeof this[j].classList !== 'undefined' && classes[i] != '') this[j].classList.remove(classes[i]);
                }
            }
            return this;
        },
        hasClass: function (className) {
            if (!this[0]) return false;
            else return this[0].classList.contains(className);
        },
        toggleClass: function (className) {
            var classes = className.split(' ');
            for (var i = 0; i < classes.length; i++) {
                for (var j = 0; j < this.length; j++) {
                    if (typeof this[j].classList !== 'undefined') this[j].classList.toggle(classes[i]);
                }
            }
            return this;
        },
        closest: function(selector, context) {
          var node = this[0], collection = false;
          if (typeof selector == 'object') { 
              collection = $(selector) 
          }
          while (node && !(collection ? collection.indexOf(node) >= 0 : $.matches(node, selector))) {
                node = node !== context && !(node.nodeType == node.DOCUMENT_NODE)/*isDocument(node)*/ && node.parentNode;
          }

          return $(node)
        },
        attr: function (attrs, value) {
            var attr;
            
            if (arguments.length === 1 && typeof attrs === 'string') {
                // Get attr
                attr = this[0].getAttribute(attrs);
                
                if (this[0] && attr) {
                    return attr;
                }
                else {
                    return undefined;
                } 
            }
            else {
                // Set attrs
                for (var i = 0; i < this.length; i++) {
                    if (arguments.length === 2) {
                        // String
                        this[i].setAttribute(attrs, value);
                    }
                    else {
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
            if (arguments.length === 1 && typeof props === 'string') {
                // Get prop
                if (this[0]) return this[0][props];
                else return undefined;
            }
            else {
                // Set props
                for (var i = 0; i < this.length; i++) {
                    if (arguments.length === 2) {
                        // String
                        this[i][props] = value;
                    }
                    else {
                        // Object
                        for (var propName in props) {
                            this[i][propName] = props[propName];
                        }
                    }
                }
                return this;
            }
        },
        data: function (key, value) {
            if (typeof value === 'undefined') {
                // Get value
                if (this[0]) {
                    if (this[0].DomElementDataStorage && (key in this[0].DomElementDataStorage)) {
                        return this[0].DomElementDataStorage[key];
                    }
                    else {
                        var dataKey = this[0].getAttribute('data-' + key);    
                        if (dataKey) {
                            return dataKey;
                        }
                        else return undefined;
                    }
                }
                else return undefined;
            }
            else {
                // Set value
                for (var i = 0; i < this.length; i++) {
                    var el = this[i];
                    if (!el.DomElementDataStorage) el.DomElementDataStorage = {};
                    el.DomElementDataStorage[key] = value;
                }
                return this;
            }
        },
        removeData: function(key) {
            for (var i = 0; i < this.length; i++) {
                var el = this[i];
                if (el.DomElementDataStorage && el.DomElementDataStorage[key]) {
                    el.DomElementDataStorage[key] = null;
                    delete el.DomElementDataStorage[key];
                }
            }
        },
        dataset: function () {
            var el = this[0];
            if (el) {
                var dataset = {};
                if (el.dataset) {
                    for (var dataKey in el.dataset) {
                        dataset[dataKey] = el.dataset[dataKey];
                    }
                }
                else {
                    for (var i = 0; i < el.attributes.length; i++) {
                        var attr = el.attributes[i];
                        if (attr.name.indexOf('data-') >= 0) {
                            dataset[$.toCamelCase(attr.name.split('data-')[1])] = attr.value;
                        }
                    }
                }
                for (var key in dataset) {
                    if (dataset[key] === 'false') dataset[key] = false;
                    else if (dataset[key] === 'true') dataset[key] = true;
                    else if (parseFloat(dataset[key]) === dataset[key] * 1) dataset[key] = dataset[key] * 1;
                }
                return dataset;
            }
            else return undefined;
        },
        val: function (value) {
            if (typeof value === 'undefined') {
                if (this[0]) return this[0].value;
                else return undefined;
            }
            else {
                for (var i = 0; i < this.length; i++) {
                    this[i].value = value;
                }
                return this;
            }
        },
        // Transforms
        transform : function (transform) {
            for (var i = 0; i < this.length; i++) {
                var elStyle = this[i].style;
                elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
            }
            return this;
        },
        transition: function (duration) {
            if (typeof duration !== 'string') {
                duration = duration + 'ms';
            }
            for (var i = 0; i < this.length; i++) {
                var elStyle = this[i].style;
                elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
            }
            return this;
        },
        //Events
        on: function (eventName, targetSelector, listener, capture) {
            function handleLiveEvent(e) {
                var target = e.target;
                if ($(target).is(targetSelector)) listener.call(target, e);
                else {
                    var parents = $(target).parents();
                    for (var k = 0; k < parents.length; k++) {
                        if ($(parents[k]).is(targetSelector)) listener.call(parents[k], e);
                    }
                }
            }
            var events = eventName.split(' ');
            var i, j;
            for (i = 0; i < this.length; i++) {
                if (typeof targetSelector === 'function' || targetSelector === false) {
                    // Usual events
                    if (typeof targetSelector === 'function') {
                        listener = arguments[1];
                        capture = arguments[2] || false;
                    }
                    for (j = 0; j < events.length; j++) {
                        this[i].addEventListener(events[j], listener, capture);
                    }
                }
                else {
                    //Live events
                    for (j = 0; j < events.length; j++) {
                        if (!this[i].DomLiveListeners) this[i].DomLiveListeners = [];
                        this[i].DomLiveListeners.push({listener: listener, liveListener: handleLiveEvent});
                        this[i].addEventListener(events[j], handleLiveEvent, capture);
                    }
                }
            }

            return this;
        },
        off: function (eventName, targetSelector, listener, capture) {
            var events = eventName.split(' ');
            for (var i = 0; i < events.length; i++) {
                for (var j = 0; j < this.length; j++) {
                    if (typeof targetSelector === 'function' || targetSelector === false) {
                        // Usual events
                        if (typeof targetSelector === 'function') {
                            listener = arguments[1];
                            capture = arguments[2] || false;
                        }
                        this[j].removeEventListener(events[i], listener, capture);
                    }
                    else {
                        // Live event
                        if (this[j].DomLiveListeners) {
                            for (var k = 0; k < this[j].DomLiveListeners.length; k++) {
                                if (this[j].DomLiveListeners[k].listener === listener) {
                                    this[j].removeEventListener(events[i], this[j].DomLiveListeners[k].liveListener, capture);
                                }
                            }
                        }
                    }
                }
            }
            return this;
        },
//        once: function (eventName, targetSelector, listener, capture) {
//            var dom = this;
//            if (typeof targetSelector === 'function') {
//                listener = arguments[1];
//                capture = arguments[2];
//                targetSelector = false;
//            }
//            function proxy(e) {
//                listener.call(e.target, e);
//                dom.off(eventName, targetSelector, proxy, capture);
//            }
//            return dom.on(eventName, targetSelector, proxy, capture);
//        },
        trigger: function (eventName, eventData) {
            var events = eventName.split(' ');
            for (var i = 0; i < events.length; i++) {
                for (var j = 0; j < this.length; j++) {
                    var evt;
                    try {
                        evt = new CustomEvent(events[i], {detail: eventData, bubbles: true, cancelable: true});
                    }
                    catch (e) {
                        evt = document.createEvent('Event');
                        evt.initEvent(events[i], true, true);
                        evt.detail = eventData;
                    }
                    this[j].dispatchEvent(evt);
                }
            }
            return this;
        },
       /* transitionEnd: function (callback) {
            var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
                i, j, dom = this;
            function fireCallBack(e) {
                if (e.target !== this) return;
                callback.call(this, e);
                for (i = 0; i < events.length; i++) {
                    dom.off(events[i], fireCallBack);
                }
            }
            if (callback) {
                for (i = 0; i < events.length; i++) {
                    dom.on(events[i], fireCallBack);
                }
            }
            return this;
        },
        animationEnd: function (callback) {
            var events = ['webkitAnimationEnd', 'OAnimationEnd', 'MSAnimationEnd', 'animationend'],
                i, j, dom = this;
            function fireCallBack(e) {
                callback(e);
                for (i = 0; i < events.length; i++) {
                    dom.off(events[i], fireCallBack);
                }
            }
            if (callback) {
                for (i = 0; i < events.length; i++) {
                    dom.on(events[i], fireCallBack);
                }
            }
            return this;
        },*/
        // Sizing/Styles
        width: function (dim) {
            if (dim || dim === '') {
                $(this).css('width', dim);
                return this; // !!!
            }

            if (this[0] === window) {
                return window.innerWidth;
            } else if (this[0] === document) {
                return document.documentElement.scrollWidth;
            }
            else {
                if (this.length > 0) {
                    return parseFloat(this.css('width'));
                }
                else {
                    return null;
                }
            }
        },
        height: function (dim) {
            if (dim || dim === '') {
                $(this).css('height', dim);
                return this; // !!!
            }

            if (this[0] === window) {
                return window.innerHeight;
            } else if (this[0] === document) {
                 var body = document.body,
                     html = document.documentElement;

                var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
                // !!!! check
                return height;//document.documentElement.scrollHeight;
            }
            else {
                if (this.length > 0) {
                    return parseFloat(this.css('height'));
                }
                else {
                    return null;
                }
            }
        },
        outerWidth: function (includeMargins) {
            if (this.length > 0) {
                if (includeMargins) {
                    var styles = this.styles();
                    return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));    
                }
                else
                    return this[0].offsetWidth;
            }
            else return null;
        },
        outerHeight: function (includeMargins) {
            if (this.length > 0) {
                if (includeMargins) {
                    var styles = this.styles();
                    return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));    
                }
                else
                    return this[0].offsetHeight;
            }
            else return null;
        },
        innerWidth: function () {
            var elem = this;
            if (elem[0]['innerWidth']) {
                return elem[0]['innerWidth'];
            } else {
                var size = elem[0]['offsetWidth'],
                    sides =  ['left', 'right'];
                sides.forEach(function (side) {
                    size -= parseInt(elem.css(camelize('border-' + side + '-width')), 10);
                });
                return size;
            }
        },
        innerHeight: function () {
            var elem = this;
            if (elem[0]['innerHeight']) {
                return elem[0]['innerHeight'];
            } else {
                var size = elem[0]['offsetWidth'],
                    sides =  ['top', 'bottom'];
                sides.forEach(function (side) {
                    size -= parseInt(elem.css(camelize('border-' + side + '-width')), 10);
                });
                return size;
            }
        },
        offset: function () {
            if (this.length > 0) {
                var el = this[0];
                var box = el.getBoundingClientRect();
                var body = document.body;
                var clientTop  = el.clientTop  || body.clientTop  || 0;
                var clientLeft = el.clientLeft || body.clientLeft || 0;
                var scrollTop  = window.pageYOffset || el.scrollTop;
                var scrollLeft = window.pageXOffset || el.scrollLeft;
                return {
                    top: box.top  + scrollTop  - clientTop,
                    left: box.left + scrollLeft - clientLeft
                };
            }
            else {
                return null;
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
                this[i].style.display = 'block';
            }
            return this;
        },
        clone: function() {
           return $(this[0].cloneNode(true));
        },
        styles: function () {
            var i, styles;
            if (this[0]) return window.getComputedStyle(this[0], null);
            else return undefined;
        },
        /*css: function (props, value) {
            //console.log('css', props, value);
            var i;
            if (arguments.length === 1) {
                if (typeof props === 'string') {
                   // console.log(this, props);
                    if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
                }
                else {
                    //console.log('css elsebe', props);
                    for (i = 0; i < this.length; i++) {
                        for (var prop in props) {
                            console.log('ITT',this[i].style, props, prop, 'utolos',  props[prop]);
                            this[i].style[prop] = props[prop];
                        }
                    }
                    return this;
                }
            }
            if (arguments.length === 2 && typeof props === 'string') {
                for (i = 0; i < this.length; i++) {
                    this[i].style[props] = value;
                }
                return this;
            }
            return this;
        },*/
        css: function(property, value) {
          if (arguments.length < 2) {
            var computedStyle, element = this[0]
            if(!element) return
            computedStyle = getComputedStyle(element, '')
            if (typeof property === 'string')
              return element.style[property] || computedStyle.getPropertyValue(property)
            else if ($.isArray(property)) {
              var props = {}
              $.each(property, function(_, prop) {
                props[prop] = (element.style[prop] || computedStyle.getPropertyValue(prop))
              })
              return props
            }
          }

          var css = ''
          if (typeof property === 'string') {
            if (!value && value !== 0)
              this.each(function(){ this.style.removeProperty(dasherize(property)) })
            else
              css = dasherize(property) + ":" + maybeAddPx(property, value)
          } else {
            for (key in property)
              if (!property[key] && property[key] !== 0)
                this.each(function(){ this.style.removeProperty(dasherize(key)) })
              else
                css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
          }

          return this.each(function(){ this.style.cssText += ';' + css })
        },

        //Dom manipulation
        each: function (callback) {
            for (var i = 0; i < this.length; i++) {
                if (callback.apply(this[i], [i, this[i]]) === false) {
                    break;
                }
            }
            return this;
            
         /* emptyArray.every.call(this, function(el, idx){
            return callback.call(el, idx, el) !== false
          });
            
          return this;*/
        },
        filter: function (callback) {
            var matchedItems = [];
            var dom = this;
            
            if (isFunction(callback)) {
                for (var i = 0; i < dom.length; i++) {
                    if (callback.call(dom[i], i, dom[i])) matchedItems.push(dom[i]);
                }
                return new Dom(matchedItems);
            }
            
            return filter.call(this, function (element) { return $.matches(element, callback) });
        },
        /*filter: function(selector) {
            var matchedItems = [];
            
          //  console.log('filter selector', selector);
            
            if (isFunction(selector)) {
                return this.not(this.not(selector));
            }
            
            return filter.call(this, function (element) { return $.matches(element, selector) }); //$(matchedItems);
        },*/
        html: function (html) {
            if (typeof html === 'undefined') {
                return this[0] ? this[0].innerHTML : undefined;
            }
            else {
                for (var i = 0; i < this.length; i++) {
                    this[i].innerHTML = html;
                }
                return this;
            }
        },
        text: function (text) {
            if (typeof text === 'undefined') {
                if (this[0]) {
                    return this[0].textContent.trim();
                }
                else return null;
            }
            else {
                for (var i = 0; i < this.length; i++) {
                    this[i].textContent = text;
                }
                return this;
            }
        },
        is: function (selector) {
            if (!this[0] || typeof selector === 'undefined') return false;
            var compareWith, i;
            if (typeof selector === 'string') {
                var el = this[0];
                if (el === document) return selector === document;
                if (el === window) return selector === window;

                if (el.matches) return el.matches(selector);
                else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
                else if (el.mozMatchesSelector) return el.mozMatchesSelector(selector);
                else if (el.msMatchesSelector) return el.msMatchesSelector(selector);
                else {
                    compareWith = $(selector);
                    for (i = 0; i < compareWith.length; i++) {
                        if (compareWith[i] === this[0]) return true;
                    }
                    return false;
                }
            }
            else if (selector === document) return this[0] === document;
            else if (selector === window) return this[0] === window;
            else {
                if (selector.nodeType || selector instanceof Dom) {
                    compareWith = selector.nodeType ? [selector] : selector;
                    for (i = 0; i < compareWith.length; i++) {
                        if (compareWith[i] === this[0]) return true;
                    }
                    return false;
                }
                return false;
            }

        },
        not: function(selector) {
            var nodes=[];
            if (isFunction(selector) && selector.call !== undefined) {
                this.each(function(idx) {
                    if (!selector.call(this,idx)) {
                        nodes.push(this)
                    }
                });
            }
            else {
                var excludes = typeof selector == 'string' ? this.filter(selector) : (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector);

                this.each(function(i,el) {
                    if (excludes.indexOf(el) < 0) nodes.push(el);
                });
            }

            return $(nodes)
        },
        indexOf: function (el) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === el) return i;
            }
        },
        /*index: function () {
            if (this[0]) {
                var child = this[0];
                var i = 0;
                while ((child = child.previousSibling) !== null) {
                    if (child.nodeType === 1) i++;
                }
                return i;
            }
            else return undefined;
        },*/
        index: function(element){
          return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
        },
        eq: function (index) {
            if (typeof index === 'undefined') return this;
            var length = this.length;
            var returnIndex;
            if (index > length - 1) {
                return new Dom([]);
            }
            if (index < 0) {
                returnIndex = length + index;
                if (returnIndex < 0) return new Dom([]);
                else return new Dom([this[returnIndex]]);
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
                }
                else if (newChild instanceof Dom) {
                    for (j = 0; j < newChild.length; j++) {
                        this[i].appendChild(newChild[j]);
                    }
                }
                else {
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
                }
                else if (newChild instanceof Dom) {
                    for (j = 0; j < newChild.length; j++) {
                        this[i].insertBefore(newChild[j], this[i].childNodes[0]);
                    }
                }
                else {
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
                }
                else if (before.length > 1) {
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
                }
                else if (after.length > 1) {
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
                    if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) return new Dom([this[0].nextElementSibling]);
                    else return new Dom([]);
                }
                else {
                    if (this[0].nextElementSibling) return new Dom([this[0].nextElementSibling]);
                    else return new Dom([]);
                }
            }
            else return new Dom([]);
        },
        nextAll: function (selector) {
            var nextEls = [];
            var el = this[0];
            if (!el) return new Dom([]);
            while (el.nextElementSibling) {
                var next = el.nextElementSibling;
                if (selector) {
                    if($(next).is(selector)) nextEls.push(next);
                }
                else nextEls.push(next);
                el = next;
            }
            return new Dom(nextEls);
        },
        prev: function (selector) {
            if (this.length > 0) {
                if (selector) {
                    if (this[0].previousElementSibling && $(this[0].previousElementSibling).is(selector)) return new Dom([this[0].previousElementSibling]);
                    else return new Dom([]);
                }
                else {
                    if (this[0].previousElementSibling) return new Dom([this[0].previousElementSibling]);
                    else return new Dom([]);
                }
            }
            else return new Dom([]);
        },
        prevAll: function (selector) {
            var prevEls = [];
            var el = this[0];
            if (!el) return new Dom([]);
            while (el.previousElementSibling) {
                var prev = el.previousElementSibling;
                if (selector) {
                    if($(prev).is(selector)) prevEls.push(prev);
                }
                else prevEls.push(prev);
                el = prev;
            }
            return new Dom(prevEls);
        },
        parent: function (selector) {
            var parents = [];
            for (var i = 0; i < this.length; i++) {
                if (this[i].parentNode !== null) {
                    if (selector) {
                        if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
                    }
                    else {
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
                        if ($(parent).is(selector)) parents.push(parent);
                    }
                    else {
                        parents.push(parent);
                    }
                    parent = parent.parentNode;
                }
            }
            return $($.unique(parents));
        },
        find : function (selector) {
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
                        if (childNodes[j].nodeType === 1) children.push(childNodes[j]);
                    }
                    else {
                        if (childNodes[j].nodeType === 1 && $(childNodes[j]).is(selector)) children.push(childNodes[j]);
                    }
                }
            }

            return new Dom($.unique(children));
        },
        remove: function () {
            for (var i = 0; i < this.length; i++) {
                if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
            }
            return this;
        },
        detach: function () {
            return this.remove();
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
        }
    };

    // Link to prototype
    $.fn = Dom.prototype;

    $.fn.before = function (elm) {
        $(elm).insertBefore(this);
        return this;
    };

    $.fn.after = function (elm) {
        $(elm).insertAfter(this);
        return this;
    };

    // Plugins
    $.fn.scrollTo = function (left, top, duration, easing, callback) {
        if (arguments.length === 4 && typeof easing === 'function') {
            callback = easing;
            easing = undefined;
        }
        return this.each(function () {
            var el = this;
            var currentTop, currentLeft, maxTop, maxLeft, newTop, newLeft, scrollTop, scrollLeft;
            var animateTop = top > 0 || top === 0;
            var animateLeft = left > 0 || left === 0;
            if (typeof easing === 'undefined') {
                easing = 'swing';
            }
            if (animateTop) {
                currentTop = el.scrollTop;
                if (!duration) {
                    el.scrollTop = top;
                }
            }
            if (animateLeft) {
                currentLeft = el.scrollLeft;
                if (!duration) {
                    el.scrollLeft = left;
                }
            }
            if (!duration) return;
            if (animateTop) {
                maxTop = el.scrollHeight - el.offsetHeight;
                newTop = Math.max(Math.min(top, maxTop), 0);
            }
            if (animateLeft) {
                maxLeft = el.scrollWidth - el.offsetWidth;
                newLeft = Math.max(Math.min(left, maxLeft), 0);
            }
            var startTime = null;
            if (animateTop && newTop === currentTop) animateTop = false;
            if (animateLeft && newLeft === currentLeft) animateLeft = false;
            function render(time) {
                if (time === undefined) {
                    time = new Date().getTime();
                }
                if (startTime === null) {
                    startTime = time;
                }
                var doneLeft, doneTop, done;
                var progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
                var easeProgress = easing === 'linear' ? progress : (0.5 - Math.cos( progress * Math.PI ) / 2);
                if (animateTop) scrollTop = currentTop + (easeProgress * (newTop - currentTop));
                if (animateLeft) scrollLeft = currentLeft + (easeProgress * (newLeft - currentLeft));
                if (animateTop && newTop > currentTop && scrollTop >= newTop)  {
                    el.scrollTop = newTop;
                    done = true;
                }
                if (animateTop && newTop < currentTop && scrollTop <= newTop)  {
                    el.scrollTop = newTop;
                    done = true;
                }

                if (animateLeft && newLeft > currentLeft && scrollLeft >= newLeft)  {
                    el.scrollLeft = newLeft;
                    done = true;
                }
                if (animateLeft && newLeft < currentLeft && scrollLeft <= newLeft)  {
                    el.scrollLeft = newLeft;
                    done = true;
                }

                if (done) {
                    if (callback) callback();
                    return;
                }
                if (animateTop) el.scrollTop = scrollTop;
                if (animateLeft) el.scrollLeft = scrollLeft;
                $.requestAnimationFrame(render);
            }
            $.requestAnimationFrame(render);
        });
    };

     $.fn.scrollTop =  function(value){
      if (!this.length) return
      var hasScrollTop = 'scrollTop' in this[0]
      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
      return this.each(hasScrollTop ?
        function(){ this.scrollTop = value } :
        function(){ this.scrollTo(this.scrollX, value) })
    };

    $.fn.scrollLeft = function(value){
      if (!this.length) return
      var hasScrollLeft = 'scrollLeft' in this[0]
      if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
      return this.each(hasScrollLeft ?
        function(){ this.scrollLeft = value } :
        function(){ this.scrollTo(value, this.scrollY) })
    };

    $.fn.contents = function () {
        return this.map(function (i, v) {
            return slice.call(v.childNodes)
        })
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

    $.fn.prevUntil = function (selector) {
        var n = this,
            array = [];

        while (n.length && !$(n).filter(selector).length) {
            array.push(n[0]);
            n = n.prev();
        }

        return $(array);
    };

            return $;
    })();


    // Export to local scope
    var $ = Dom;

    // Export to Window
    window.Dom = Dom;
    window.jQuery = Dom;

    $.inArray = function(elem, array, i) {
        return emptyArray.indexOf.call(array, elem, i)
    }

    // DOM Library Utilites
    $.parseUrlQuery = function (url) {
        var query = {}, i, params, param;
        if (url.indexOf('?') >= 0) url = url.split('?')[1];
        else return query;
        params = url.split('&');
        for (i = 0; i < params.length; i++) {
            param = params[i].split('=');
            query[param[0]] = param[1];
        }
        return query;
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
    };


    $.isFunction = isFunction;

    $.isArray = function (arr) {
        if (Object.prototype.toString.apply(arr) === '[object Array]') return true;
        else return false;
    };

    $.isPlainObject = function (obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
    };

    $.each = function (obj, callback) {
        if (typeof obj !== 'object') return;
        if (!callback) return;
        var i, prop;
        if ($.isArray(obj) || obj instanceof Dom) {
            // Array
            for (i = 0; i < obj.length; i++) {
                callback(i, obj[i]);
            }
        }
        else {
            // Object
            for (prop in obj) {
                if (obj.hasOwnProperty(prop) && prop !== 'length') {
                    callback(prop, obj[prop]);
                }
            }
        }
    };

    $.unique = function (arr) {
        var unique = [];
        for (var i = 0; i < arr.length; i++) {
            if (unique.indexOf(arr[i]) === -1) unique.push(arr[i]);
        }
        return unique;
    };

    $.map = function(elements, callback) {
        var value, values = [], i, key
        if (likeArray(elements)) {
          for (i = 0; i < elements.length; i++) {
            value = callback(elements[i], i)
            if (value != null) values.push(value)
          }
        }
        else {
          for (key in elements) {
            value = callback(elements[key], key)
            if (value != null) values.push(value)
          }
        }
            return flatten(values)
    };


    $.matches = function(element, selector) {
        if (!selector || !element || element.nodeType !== 1) {
            return false
        }

        var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||lement.oMatchesSelector || element.matchesSelector;
         // console.log('matches', element, selector)
        if (matchesSelector) {
            return matchesSelector.call(element, selector);
        }
        // fall back to performing a selector:
        var match, parent = element.parentNode, temp = !parent
        if (temp) (parent = tempParent).appendChild(element)
        match = ~$(parent, selector).indexOf(element)
        temp && tempParent.removeChild(element)
        return match
    }



    //})(window, document);