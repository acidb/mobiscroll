import React from 'react';
import ReactDOM from 'react-dom';
import { mobiscroll } from '../core/dom';
import { $, extend, classes } from '../core/core';

import PropTypes from 'prop-types';

var boolType = PropTypes.bool,
    stringType = PropTypes.string,
    funcType = PropTypes.func,
    numType = PropTypes.number,
    objType = PropTypes.object,
    dateType = PropTypes.oneOfType([
        objType,
        stringType
    ]),
    numOrArray = PropTypes.oneOfType([
        numType,
        PropTypes.arrayOf(numType)
    ]);

/** Mixin for enumerating the core PropTypes */
export const CorePropTypes = {
    theme: stringType,
    lang: stringType,
    rtl: boolType,
    responsive: objType,
    context: PropTypes.oneOfType([stringType, objType])
};

export const FramePropTypes = {
    anchor: PropTypes.oneOfType([stringType, objType]),
    animate: PropTypes.oneOfType([boolType, PropTypes.oneOf(['fade', 'flip', 'pop', 'swing', 'slidevertical', 'slidehorizontal', 'slidedown', 'slideup'])]),
    buttons: PropTypes.array,
    closeOnOverlayTap: boolType,
    cssClass: stringType,
    disabled: boolType,
    display: PropTypes.oneOf(['top', 'bottom', 'bubble', 'inline', 'center']),
    focusOnClose: PropTypes.oneOfType([boolType, stringType, objType]),
    focusTrap: boolType,
    headerText: PropTypes.oneOfType([boolType, stringType, funcType]),
    scrollLock: boolType,
    showOnFocus: boolType,
    showOnTap: boolType,
    touchUi: boolType,
    onBeforeClose: funcType,
    onBeforeShow: funcType,
    onCancel: funcType,
    onClose: funcType,
    onDestroy: funcType,
    onMarkupReady: funcType,
    onPosition: funcType,
    onShow: funcType
};

export const ScrollerPropTypes = {
    circular: PropTypes.oneOfType([
        boolType,
        PropTypes.arrayOf(boolType)
    ]),
    height: numType,
    layout: PropTypes.oneOf(['liquid', 'fixed']),
    maxWidth: numOrArray,
    minWidth: numOrArray,
    multiline: numType,
    readOnly: PropTypes.oneOfType([
        boolType,
        PropTypes.arrayOf(boolType)
    ]),
    rows: numType,
    showLabel: boolType,
    showScrollArrows: boolType,
    wheels: PropTypes.array,
    width: numType,
    onChange: funcType,
    validate: funcType,
    onSet: funcType,
    onItemTap: funcType,
    onClear: funcType,
    cancelText: stringType,
    clearText: stringType,
    selectedText: stringType,
    setText: stringType,
    formatValue: funcType,
    parseValue: funcType
};

export const DatetimePropTypes = {
    defaultValue: dateType,
    invalid: PropTypes.array,
    max: dateType,
    min: dateType,
    returnFormat: PropTypes.oneOf(['iso8601', 'moment', 'locale', 'jsdate']),
    steps: PropTypes.shape({
        hour: numType,
        minute: numType,
        second: numType,
        zeroBased: boolType
    }),
    valid: PropTypes.array,
    ampmText: stringType,
    amText: stringType,
    dateFormat: stringType,
    dateWheels: stringType,
    dayNames: PropTypes.arrayOf(stringType),
    dayNamesShort: PropTypes.arrayOf(stringType),
    dayText: stringType,
    hourText: stringType,
    minuteText: stringType,
    monthNames: PropTypes.arrayOf(stringType),
    monthNamesShort: PropTypes.arrayOf(stringType),
    monthSuffix: stringType,
    monthText: stringType,
    nowText: stringType,
    pmText: stringType,
    secText: stringType,
    timeFormat: stringType,
    timeWheels: stringType,
    yearSuffix: stringType,
    yearText: stringType
};

export const CalbasePropTypes = {
    calendarHeight: numType,
    calendarScroll: PropTypes.oneOf(['horizontal', 'vertical']),
    calendarWidth: numType,
    counter: boolType,
    defaultValue: PropTypes.oneOfType([
        dateType,
        PropTypes.array
    ]),
    events: PropTypes.arrayOf(PropTypes.shape({
        start: dateType,
        end: dateType,
        d: PropTypes.oneOfType([objType, numType, stringType]),
        text: stringType,
        color: stringType,
        background: stringType,
        cssClass: stringType
    })),
    labels: PropTypes.arrayOf(PropTypes.shape({
        start: dateType,
        end: dateType,
        d: PropTypes.oneOfType([objType, numType, stringType]),
        text: stringType,
        color: stringType,
        background: stringType,
        cssClass: stringType
    })),
    marked: PropTypes.arrayOf(PropTypes.oneOfType([objType, numType, stringType,
        PropTypes.shape({
            d: PropTypes.oneOfType([objType, stringType, numType]),
            color: stringType,
            background: stringType,
            cssClass: stringType
        })])),
    colors: PropTypes.arrayOf(PropTypes.shape({
        d: PropTypes.oneOfType([objType, stringType, numType]),
        background: stringType,
        cssClass: stringType
    })),
    months: numType,
    weeks: numType,
    outerMonthChange: boolType,
    showOuterDays: boolType,
    tabs: boolType,
    weekCounter: PropTypes.oneOf(['year', 'month']),
    weekDays: PropTypes.oneOf(['full', 'short', 'min']),
    yearChange: boolType,
    dateText: stringType,
    dayNames: PropTypes.arrayOf(stringType),
    dayNamesMin: PropTypes.arrayOf(stringType),
    firstDay: numType,
    timeText: stringType,
    onTabChange: funcType,
    onDayChange: funcType,
    onMonthChange: funcType,
    onMonthLoading: funcType,
    onMonthLoaded: funcType,
    onPageChange: funcType,
    onPageLoading: funcType,
    onPageLoaded: funcType,
    onSetDate: funcType
};

export function updateCssClasses(currentClasses, nextClasses) {
    var node = ReactDOM.findDOMNode(this);
    var currentNormal = currentClasses.replace(/\s+/g, ' ').trim();
    var nextNormal = nextClasses.replace(/\s+/g, ' ').trim();
    if (currentNormal) {
        node.classList.remove.apply(node.classList, currentNormal.split(' '));
    }
    if (nextNormal) {
        node.classList.add.apply(node.classList, nextNormal.split(' '));
    }
}

export function deepCompare(a, b) {
    var leftChain = [],
        rightChain = [];

    function compare2Objects(x, y) {
        var p;

        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
            return true;
        }

        // Compare primitives and functions.     
        // Check if both arguments link to the same object.
        // Especially useful on step when comparing prototypes
        if (x === y) {
            return true;
        }

        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions passed across iframes
        if ((typeof x === 'function' && typeof y === 'function') ||
            (x instanceof Date && y instanceof Date) ||
            (x instanceof RegExp && y instanceof RegExp) ||
            (x instanceof String && y instanceof String) ||
            (x instanceof Number && y instanceof Number)) {
            return x.toString() === y.toString();
        }

        // At last checking prototypes as good a we can
        if (!(x instanceof Object && y instanceof Object)) {
            return false;
        }

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
            return false;
        }

        if (x.constructor !== y.constructor) {
            return false;
        }

        if (x.prototype !== y.prototype) {
            return false;
        }

        // Check for infinitive linking loops
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
            return false;
        }

        // Quick checking of one object beeing a subset of another.
        // todo: cache the structure of arguments[0] for performance
        for (p in y) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            } else if (typeof y[p] !== typeof x[p]) {
                return false;
            }
        }

        for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            } else if (typeof y[p] !== typeof x[p]) {
                return false;
            }

            switch (typeof (x[p])) {
                case 'object':
                case 'function':

                    leftChain.push(x);
                    rightChain.push(y);

                    if (!compare2Objects(x[p], y[p])) {
                        return false;
                    }

                    leftChain.pop();
                    rightChain.pop();
                    break;

                default:
                    if (x[p] !== y[p]) {
                        return false;
                    }
                    break;
            }
        }
        return true;
    }

    return compare2Objects(a, b);
}

export class MbscInit extends React.Component {
    constructor(props) {
        super(props);

        // the initial css class will not change this way, and wont trigger any re-render. We will handle the className changes in the componentWillReceive function
        // Note: every render function should use the this.initialCssClass instead of passing through the className prop 
        this.initialCssClass = this.props.className || '';
    }

    // Dummy render function
    render() { return null; }

    // generates the mobiscroll options object based on the props passed
    getSettingsFromProps(props, extra) {
        var optionObj = {};
        if (props !== undefined) {
            // support individual properties and options object property for settings
            // the value should not be part of the options object
            // data should not be part of the options object 

            /* eslint-disable no-unused-vars */
            // justification: the variables 'value', 'data', 'children' and 'className' are declared due to object decomposition
            var {
                options,
                children,
                value,
                data,
                className,
                ...other
            } = props;

            /* eslint-enable no-unused-vars */

            var optionStr = options || '{}';
            optionObj = options || {};
            if (options !== undefined && typeof (optionStr) === 'string') { // when options are passed as string we need to create an object from it
                optionObj = (new Function('return ' + optionStr + ';'))();
            }

            // the priority of the options passed (later will have higher prio): 
            // 1. options property
            // 2. individual properties
            optionObj = extend({}, optionObj, other, extra || {});
        }
        return optionObj;
    }

    // cleans up on unmount
    componentWillUnmount() {
        this.instance.destroy();
        // Also need to delete reference to the instance
        delete this.instance;
    }
}

/** The base class for the mobiscroll components
 * Generates the Mobiscroll options object from the react component properties
 * Setting initial state 
 * Updating state based on new props 
 * Updating mobiscroll based on state */
export class MbscBase extends MbscInit {
    constructor(props) {
        super(props);
    }

    // updates mobiscroll with new options
    componentDidUpdate() {
        var settings = this.getSettingsFromProps(this.props);
        if (this.optimizeUpdate) {
            if (this.optimizeUpdate.updateOptions) {
                this.instance.option(settings);
            }
            if (this.optimizeUpdate.updateValue && this.props.value !== undefined && !deepCompare(this.props.value, this.instance.getVal())) {
                this.instance.setVal(this.props.value, true);
            }
        } else {
            this.instance.option(settings);
            if (this.props.value !== undefined) {
                this.instance.setVal(this.props.value, true);
            }
        }
    }
}

export class MbscOptimized extends MbscBase {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        const nextOptions = this.getSettingsFromProps(nextProps);
        const thisOptions = this.getSettingsFromProps(this.props);
        // check if the options or the value changed
        var updateOptions = !deepCompare(nextOptions, thisOptions),
            updateValue = !deepCompare(nextProps.value, this.props.value),
            updateChildren = !deepCompare(nextProps.children, this.props.children);
        // save what should be updated inside mobiscroll
        this.optimizeUpdate = {
            updateOptions: updateOptions,
            updateValue: updateValue,
            updateChildren: updateChildren
        };
        // component should update if the options or the value changed
        const shouldUpdate = updateOptions || updateValue || updateChildren;
        return shouldUpdate;
    }
}

/** Class for the generic mobiscroll components */
export class MbscInputBase extends MbscOptimized {
    static propTypes = {
        ...CorePropTypes,
        ...FramePropTypes
    }

    render() {
        // passing through some of the element properties to its children
        var {
            type,
            readOnly,
            disabled,
            placeholder
        } = this.props;

        // default input type if there are no children components
        type = type || "text";
        // default to input if there are no childrens
        if (this.props.children) {
            return this.props.children;
        } else {
            return <input className={this.initialCssClass} type={type} readOnly={readOnly} disabled={disabled} placeholder={placeholder} />;
        }
    }

    componentDidMount() {
        // get settings from state
        var settings = this.getSettingsFromProps(this.props, this.mbscInit);
        // initialize the mobiscroll
        var element = ReactDOM.findDOMNode(this);
        var input = $(element).find('input');
        if (input.length) {
            element = input;
        }

        this.instance = new classes[this.mbscInit.component || 'Scroller'](element, settings);
        if (this.props.value !== undefined) {
            this.instance.setVal(this.props.value, true);
        }
    }
}


/** Class for the list based mobiscroll components */
export class MbscListsBase extends MbscOptimized {
    static propTypes = {
        ...CorePropTypes,
        ...FramePropTypes,
        ...ScrollerPropTypes
    }

    render() {
        return <ul className={this.initialCssClass + ' mbsc-cloak'}>{this.props.children}</ul>;
    }

    componentDidMount() {
        // get settings from state
        var settings = this.getSettingsFromProps(this.props, this.mbscInit);
        // get the DOM node
        var DOMNode = ReactDOM.findDOMNode(this);

        // initialize the mobiscroll
        this.instance = new classes[this.mbscInit.component || 'Scroller'](DOMNode, settings);

        if (this.props.value !== undefined) {
            this.instance.setVal(this.props.value, true);
        }

        // Stop Propagation of click events to avoid the same data-reactid js error when inline mode
        // the _markup does not exist for components that are not derived from Mobiscroll Frame (listview, menustrip, forms)
        // we can use the original dom node for these non-frame components, because they dont clone the markup
        (this.instance._markup || $(DOMNode)).on('click', function (event) {
            event.stopPropagation();
        });
    }

    componentDidUpdate() {
        if (!this.optimizeUpdate.updateOptions && this.optimizeUpdate.updateChildren) {
            this.instance.option(this.getSettingsFromProps(this.props)); // the option needs to be called because of the children changes - the list components might need a refresh method
        }

        // Stop Propagation of click events to avoid the same data-reactid js error when inline mode
        // the _markup does not exist for components that are not derived from Mobiscroll Frame (listview, menustrip, forms)
        // we can use the original dom node for these non-frame components, because they dont clone the markup
        var DOMNode = ReactDOM.findDOMNode(this);
        (this.instance._markup || $(DOMNode)).on('click', function (event) {
            event.stopPropagation();
        });
    }
}

export { $, extend, mobiscroll, classes, dateType, PropTypes };
export default mobiscroll;
