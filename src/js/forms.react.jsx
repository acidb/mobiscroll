import React from 'react';
import ReactDOM from 'react-dom';
import {
    $,
    mobiscroll,
    classes,
    PropTypes,
    MbscOptimized,
    CorePropTypes,
    MbscInit,
    updateCssClasses
} from './frameworks/react';
import { Form } from './classes/forms';
import { Progress } from './classes/progress';
import { Slider } from './classes/slider';
import { Rating } from './classes/rating';
import { Input } from './classes/input';
import { TextArea } from './classes/textarea';
import { Select } from './classes/select';
import { Button } from './classes/button';
import { CheckBox } from './classes/checkbox';
import { Radio } from './classes/radio';
import { SegmentedItem } from './classes/segmented';
import { CollapsibleBase } from './util/collapsible-base';

import './page.react';

var reactNumber = PropTypes.number,
    reactString = PropTypes.string,
    reactFunc = PropTypes.func,
    reactBool = PropTypes.bool;

/** PropTypes for Form components */
const StepperPropTypes = {
    onInit: reactFunc,
    onChange: reactFunc,
    value: reactNumber,
    disabled: reactBool,
    min: reactNumber,
    max: reactNumber,
    step: reactNumber,
    val: PropTypes.oneOf(['left', 'right'])
};

const SwitchPropTypes = {
    onInit: reactFunc,
    onChange: reactFunc,
    checked: reactBool,
    disabled: reactBool,
    value: reactBool
};


class MbscForm extends MbscOptimized {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        renderForm: true
    }

    static propTypes = {
        ...CorePropTypes,
        labelStyle: reactString,
        inputStyle: reactString,
        onInit: reactFunc
    }

    componentDidMount() {
        // get settings from state
        var settings = this.getSettingsFromProps(this.props);
        // initialize the mobiscroll
        this.instance = new Form(ReactDOM.findDOMNode(this), settings);
    }

    componentDidUpdate() {
        if (!this.optimizeUpdate.updateOptions && this.optimizeUpdate.updateChildren) {
            this.instance.refresh(true);
        } else if (this.optimizeUpdate.updateOptions) {
            var settings = this.getSettingsFromProps(this.props);
            this.instance.option(settings);
        }
    }

    checkFormWrapper(component) {
        if (React.Children.count(component.props.children) == 1) {
            return (component.props.children.type == 'form');
        }
        return false;
    }

    render() {
        // passing through some of the element properties to its children
        var {
            action,
            method,
            noValidate,
            renderForm,
            name,
            target,
            autoComplete,
            onSubmit
        } = this.props;
        if (this.checkFormWrapper(this) || !renderForm) {
            return this.props.children;
        } else {
            return <form className={this.initialCssClass} action={action} name={name} target={target} method={method} autoComplete={autoComplete} noValidate={noValidate} onSubmit={onSubmit}>{this.props.children}</form>;
        }
    }
}

mobiscroll.Form = MbscForm;

class MbscLabel extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        ...MbscForm.propTypes,
        valid: PropTypes.bool,
        color: PropTypes.string,
        presetName: PropTypes.string
    }

    componentDidMount() {
        updateCssClasses.call(this, '', this.getClasses(this.props));
    }

    componentDidUpdate() {
        if (this.cssClassUpdate) {
            updateCssClasses.call(this, this.cssClassUpdate.prev, this.cssClassUpdate.next);
        }
    }

    shouldComponentUpdate(nextProps) {
        const nextClasses = this.getClasses(nextProps);
        const thisClasses = this.getClasses(this.props);
        if (thisClasses !== nextClasses) {
            this.cssClassUpdate = {
                prev: thisClasses,
                next: nextClasses
            };
        } else {
            this.cssClassUpdate = null;
        }
        return true;
    }

    getClasses(props) {
        /* eslint-disable no-unused-vars */
        // justification: variable 'valid' and 'className' is declared due to object decomposition
        var {
            valid,
            className,
            color,
            presetName
        } = props;

        /* eslint-enable */
        const cssClasses = [];

        if (color) {
            cssClasses.push('mbsc-' + presetName + '-' + color);
        }
        if (className) {
            cssClasses.push(className);
        }
        if (valid !== undefined && !valid) {
            cssClasses.push('mbsc-err');
        }
        var cssClass = '';
        if (cssClasses.length) {
            cssClass = cssClasses.reduce((pv, cv) => pv + ' ' + cv).replace(/\s+/g, ' ').trim();
        }
        return cssClass;
    }

    render = () => {
        /* eslint-disable no-unused-vars */
        // justification: variable 'valid' and 'className' is declared due to object decomposition
        var {
            valid,
            className,
            color,
            children,
            presetName,
            ...other
        } = this.props;

        /* eslint-enable */

        return <label {...other}>{children}</label>;
    }
}

mobiscroll.Form.Label = MbscLabel; // for backward compatibilty
mobiscroll.Label = MbscLabel;

class MbscInput extends MbscInit {
    constructor(props) {
        super(props);
        this.inputMounted = this.inputMounted.bind(this);
    }

    static propTypes = {
        disabled: PropTypes.bool,
        valid: PropTypes.bool,
        errorMessage: PropTypes.string,
        type: PropTypes.string,
        icon: PropTypes.string,
        iconAlign: PropTypes.string,
        passwordToggle: PropTypes.bool,
        iconShow: PropTypes.string,
        iconHide: PropTypes.string,
        name: PropTypes.string,
        dropdown: PropTypes.bool,
        inputStyle: PropTypes.string,
        labelStyle: PropTypes.string
    }

    componentDidMount() {
        var settings = this.getSettingsFromProps(this.props);
        this.instance = new Input(this.inputNode, settings);
    }

    inputMounted(input) {
        this.inputNode = input;
    }

    render() {
        /* eslint-disable no-unused-vars */
        var { valid, errorMessage, type, icon, iconAlign, passwordToggle, iconShow, iconHide, inputStyle, labelStyle, children, dropdown, ...other } = this.props;
        /* eslint-enable */

        var error = null;
        if (errorMessage && !valid) {
            error = <span className="mbsc-err-msg">{errorMessage}</span>;
        }
        var drop = null;
        if (dropdown) {
            drop = <span className="mbsc-select-ic mbsc-ic mbsc-ic-arrow-down5"></span>;
        }

        type = type || 'text';

        return <MbscLabel valid={valid} className={dropdown ? 'mbsc-select' : ''}>
            {children}
            <span className="mbsc-input-wrap">
                <input ref={this.inputMounted} type={type} data-icon={icon} data-icon-align={iconAlign} data-password-toggle={passwordToggle} data-icon-show={iconShow} data-icon-hide={iconHide} {...other} />
                {drop}
                {error}
            </span>
        </MbscLabel>;
    }
}

mobiscroll.Input = MbscInput;

class MbscTextArea extends MbscOptimized {
    constructor(props) {
        super(props);
        this.textMounted = this.textMounted.bind(this);
    }

    static propTypes = {
        disabled: PropTypes.bool,
        valid: PropTypes.bool,
        errorMessage: PropTypes.string,
        icon: PropTypes.string,
        iconAlign: PropTypes.string,
        name: PropTypes.string,
        inputStyle: PropTypes.string,
        labelStyle: PropTypes.string
    }

    /**
     * Override
     */
    componentDidUpdate() {
        var settings = this.getSettingsFromProps(this.props);
        if (this.optimizeUpdate) {
            if (this.optimizeUpdate.updateOptions) {
                this.instance.option(settings);
            }
            if (this.optimizeUpdate.updateValue) {
                this.instance.refresh();
            }
        } else {
            this.instance.option(settings);
            if (this.props.value !== undefined) {
                this.instance.refresh();
            }
        }
    }

    componentDidMount() {
        var settings = this.getSettingsFromProps(this.props);
        this.instance = new TextArea(this.inputNode, settings);
    }

    textMounted(input) {
        this.inputNode = input;
    }

    render() {
        /* eslint-disable no-unused-vars */
        var { valid, errorMessage, icon, iconAlign, inputStyle, labelStyle, children, ...other } = this.props;
        /* eslint-enable */
        var error = null;
        if (errorMessage && !valid) {
            error = <span className="mbsc-err-msg">{errorMessage}</span>;
        }

        return <MbscLabel valid={valid}>
            {children}
            <span className="mbsc-input-wrap">
                <textarea ref={this.textMounted} data-icon={icon} data-icon-align={iconAlign} {...other} />
                {error}
            </span>
        </MbscLabel>;
    }
}

mobiscroll.Textarea = MbscTextArea;

class MbscDropdown extends MbscInit {
    constructor(props) {
        super(props);
        this.selectMounted = this.selectMounted.bind(this);
    }

    static propTypes = {
        label: PropTypes.string,
        disabled: PropTypes.bool,
        valid: PropTypes.bool,
        errorMessage: PropTypes.string,
        icon: PropTypes.string,
        iconAlign: PropTypes.string,
        name: PropTypes.string,
        inputStyle: PropTypes.string,
        labelStyle: PropTypes.string
    }

    componentDidMount() {
        var settings = this.getSettingsFromProps(this.props);
        this.instance = new Select(this.selectNode, settings);
    }

    selectMounted(select) {
        this.selectNode = select;
    }

    componentDidUpdate() {
        this.instance._setText();
    }

    render() {
        /* eslint-disable no-unused-vars */
        var { label, valid, errorMessage, icon, iconAlign, inputStyle, labelStyle, children, ...other } = this.props;
        /* eslint-enable */
        var error = null;
        if (errorMessage && !valid) {
            error = <span className="mbsc-err-msg">{errorMessage}</span>;
        } else {
            error = <span></span>;
        }

        return <MbscLabel valid={valid}>
            {label}
            <span className="mbsc-input-wrap">
                <select ref={this.selectMounted} data-icon={icon} data-icon-align={iconAlign} {...other}>
                    {children}
                </select>
                {error}
            </span>
        </MbscLabel>;
    }
}

mobiscroll.Dropdown = MbscDropdown;

class MbscButton extends MbscInit {
    constructor(props) {
        super(props);
        this.btnMounted = this.btnMounted.bind(this);
    }

    static propTypes = {
        type: PropTypes.string,
        color: PropTypes.string,
        flat: PropTypes.bool,
        block: PropTypes.bool,
        outline: PropTypes.bool,
        icon: PropTypes.string,
        disabled: PropTypes.bool,
        name: PropTypes.string
    }

    componentDidMount() {
        var settings = this.getSettingsFromProps(this.props);
        this.instance = new Button(this.btnNode, settings);
        updateCssClasses.call(this, '', this.getCssClasses(this.props));
    }

    componentDidUpdate() {
        if (this.cssClassUpdate) {
            updateCssClasses.call(this, this.cssClassUpdate.prev, this.cssClassUpdate.next);
        }
    }

    shouldComponentUpdate(nextProps) {
        const nextClasses = this.getCssClasses(nextProps);
        const thisClasses = this.getCssClasses(this.props);
        if (thisClasses !== nextClasses) {
            this.cssClassUpdate = {
                prev: thisClasses,
                next: nextClasses
            };
        } else {
            this.cssClassUpdate = null;
        }
        return true;
    }

    btnMounted(btn) {
        this.btnNode = btn;
    }

    getCssClasses(props) {
        const { className, color, flat, block, outline } = props;
        const cssClasses = [];

        if (flat) {
            cssClasses.push('mbsc-btn-flat');
        }
        if (block) {
            cssClasses.push('mbsc-btn-block');
        }
        if (outline) {
            cssClasses.push('mbsc-btn-outline');
        }
        if (color) {
            cssClasses.push('mbsc-btn-' + color);
        }
        if (className) {
            cssClasses.push(className);
        }
        var cssClass = '';
        if (cssClasses.length) {
            cssClass = cssClasses.reduce((pv, cv) => pv + ' ' + cv).replace(/\s+/g, ' ').trim();
        }
        return cssClass;
    }

    render() {
        /* eslint-disable no-unused-vars */
        // justification: variables 'className', 'color', 'flat', 'block', 'outline' are declared due to object decomposition
        var { type, children, className, color, flat, block, outline, icon, ...other } = this.props;
        /* eslint-enable */
        type = type || 'button';

        return <button ref={this.btnMounted} type={type} data-icon={icon} {...other}>{children}</button>;
    }
}

mobiscroll.Button = MbscButton;

class MbscCheckbox extends MbscInit {
    constructor(props) {
        super(props);
        this.inputMounted = this.inputMounted.bind(this);
    }

    static propTypes = {
        color: PropTypes.string,
        disabled: PropTypes.bool,
        name: PropTypes.string,
        inputStyle: PropTypes.string
    }

    componentDidMount() {
        var settings = this.getSettingsFromProps(this.props);
        this.instance = new CheckBox(this.inputNode, settings);
    }

    inputMounted(inp) {
        this.inputNode = inp;
    }

    render() {
        /* eslint-disable no-unused-vars */
        var { color, children, inputStyle, ...other } = this.props;
        /* eslint-enable */
        return <MbscLabel color={color} presetName="checkbox">
            <input ref={this.inputMounted} type="checkbox" {...other} />
            {children}
        </MbscLabel>;
    }
}

mobiscroll.Checkbox = MbscCheckbox;

class MbscRadio extends MbscInit {
    constructor(props) {
        super(props);
        this.inputMounted = this.inputMounted.bind(this);
    }

    static propTypes = {
        color: PropTypes.string,
        name: PropTypes.string,
        disabled: PropTypes.bool,
        inputStyle: PropTypes.string
    }

    componentDidMount() {
        var settings = this.getSettingsFromProps(this.props);
        this.instance = new Radio(this.inputNode, settings);
    }

    inputMounted(inp) {
        this.inputNode = inp;
    }

    render() {
        /* eslint-disable no-unused-vars */
        var { color, children, inputStyle, ...other } = this.props;
        /* eslint-enable */
        return <MbscLabel color={color} presetName="radio">
            <input ref={this.inputMounted} type="radio" {...other} />
            {children}
        </MbscLabel>;
    }
}

mobiscroll.Radio = MbscRadio;

class MbscSegmented extends MbscInit {
    constructor(props) {
        super(props);
        this.inputMounted = this.inputMounted.bind(this);
    }

    static propTypes = {
        color: PropTypes.string,
        name: PropTypes.string,
        disabled: PropTypes.bool,
        multiSelect: PropTypes.bool,
        icon: PropTypes.string
    }

    componentDidMount() {
        var settings = this.getSettingsFromProps(this.props);
        this.instance = new SegmentedItem(this.inputNode, settings);
    }

    inputMounted(inp) {
        this.inputNode = inp;
    }

    render() {
        var { color, children, multiSelect, icon, ...other } = this.props;
        var type = multiSelect ? 'checkbox' : 'radio';
        return <MbscLabel color={color} presetName="segmented">
            <input ref={this.inputMounted} type={type} data-icon={icon} data-role="segmented" {...other} />
            {children}
        </MbscLabel>;
    }
}

mobiscroll.Segmented = MbscSegmented;

class MbscFormBase extends MbscOptimized {
    constructor(props, presetName) {
        super(props);
        this.presetName = presetName;
        this.inputMounted = this.inputMounted.bind(this);
    }

    static propTypes = {
        ...CorePropTypes,
        color: reactString
    }

    componentDidMount() {
        // get settings from state
        var settings = this.getSettingsFromProps(this.props, this.mbscInit);

        // initialize the mobiscroll
        this.instance = new classes[this.mbscInit.component || 'Scroller'](this.inputNode, settings);

        if (this.props.value !== undefined) {
            this.instance.setVal(this.props.value, true);
        }

        // Add change event listener if handler is passed
        $(this.inputNode).on('change', this.props.onChange || (function () { }));

        // sets the initial css classes on the element
        updateCssClasses.call(this, '', this.getCssClasses(this.props));
    }

    shouldComponentUpdate(nextProps) {
        const nextClasses = this.getCssClasses(nextProps);
        const thisClasses = this.getCssClasses(this.props);
        if (thisClasses !== nextClasses) {
            this.cssClassUpdate = {
                prev: thisClasses,
                next: nextClasses
            };
        } else {
            this.cssClassUpdate = null;
        }
        return super.shouldComponentUpdate(nextProps) || this.cssClassUpdate;
    }

    componentDidUpdate() {
        if (this.cssClassUpdate) {
            updateCssClasses.call(this, this.cssClassUpdate.prev, this.cssClassUpdate.next);
        }
    }

    inputMounted(input) {
        this.inputNode = input;
    }

    getCssClasses(props) {
        const { className, color } = props,
            cssClasses = [];

        if (color) {
            cssClasses.push('mbsc-' + this.presetName + '-' + color);
        }
        if (className) {
            cssClasses.push(className);
        }
        if (cssClasses.length) {
            return cssClasses.reduce((pv, cv) => pv + ' ' + cv).replace(/\s+/g, ' ').trim();
        } else {
            return '';
        }
    }

    render() {
        /* eslint-disable no-unused-vars */
        // justification: variables 'value', 'onChange' and 'className' are declared due to object decomposition
        var {
            className,
            children,
            value,
            onChange,
            name,
            color,
            ...other
        } = this.props;

        /* eslint-enable no-unused-vars */
        var type = this.inputType || 'text';

        return <div>
            {children}
            <input ref={this.inputMounted} type={type} data-role={name} {...other} />
        </div>;
    }
}

class MbscSwitch extends MbscFormBase {
    constructor(props) {
        super(props, 'switch');
        this.mbscInit = {
            component: 'Switch'
        };
        this.inputType = 'checkbox';
    }
}

MbscSwitch.propTypes = {
    ...MbscSwitch.propTypes,
    ...SwitchPropTypes
};

mobiscroll.Switch = MbscSwitch;

class MbscStepper extends MbscFormBase {
    constructor(props) {
        super(props, 'stepper');
        this.mbscInit = {
            component: 'Stepper'
        };
    }
}

MbscStepper.propTypes = {
    ...MbscStepper.propTypes,
    ...StepperPropTypes
};

mobiscroll.Stepper = MbscStepper;

// progress

class MbscColored extends MbscOptimized {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        updateCssClasses.call(this, '', this.getCssClasses(this.props));
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        if (this.cssClassUpdate) {
            updateCssClasses.call(this, this.cssClassUpdate.prev, this.cssClassUpdate.next);
        }
    }

    shouldComponentUpdate(nextProps) {
        const nextClasses = this.getCssClasses(nextProps);
        const thisClasses = this.getCssClasses(this.props);
        if (thisClasses !== nextClasses) {
            this.cssClassUpdate = {
                prev: thisClasses,
                next: nextClasses
            };
        } else {
            this.cssClassUpdate = null;
        }
        return super.shouldComponentUpdate(nextProps) || this.cssClassUpdate;
    }

    getCssClasses(props) {
        const { className, color } = props;
        const cssClasses = [];

        if (color) {
            cssClasses.push('mbsc-' + this.presetName + '-' + color);
        }

        if (className) {
            cssClasses.push(className);
        }

        if (cssClasses.length) {
            return cssClasses.reduce((pv, cv) => pv + ' ' + cv).replace(/\s+/g, ' ').trim();
        }
        else {
            return '';
        }
    }
}

class MbscProgress extends MbscColored {
    constructor(props) {
        super(props);
        this.presetName = 'progress';
        this.progressMounted = this.progressMounted.bind(this);
    }

    static propTypes = {
        ...CorePropTypes,
        "data-icon": reactString,
        "data-icon-align": PropTypes.oneOf(['left', 'right']),
        val: PropTypes.oneOf(['left', 'right']),
        disabled: reactBool,
        max: reactNumber,
        value: reactNumber,
        color: reactString,
        inputStyle: reactString
    }

    componentDidMount() {
        // get settings from state
        var settings = this.getSettingsFromProps(this.props);
        // initialize the mobiscroll
        this.instance = new Progress(this.progressNode, settings);
        if (this.props.value !== undefined) {
            this.instance.setVal(this.props.value, true);
        }
        super.componentDidMount();
    }

    progressMounted(progress) {
        this.progressNode = progress;
    }

    render() {
        /* eslint-disable no-unused-vars */
        // justification: variable 'value' and 'className' is defined due to object decomposotion
        var {
            className,
            children,
            value,
            color,
            inputStyle,
            ...other
        } = this.props;

        /* eslint-enable no-unused-vars */
        return <div>
            {children}
            <progress ref={this.progressMounted} {...other} />
        </div>;
    }
}

mobiscroll.Progress = MbscProgress;

// slider
class MbscSlider extends MbscColored {
    constructor(props) {
        super(props);
        this.presetName = 'slider';
        this.firstInputMounted = this.firstInputMounted.bind(this);
        this.parentMounted = this.parentMounted.bind(this);
    }

    static propTypes = {
        ...CorePropTypes,
        highlight: reactBool,
        live: reactBool,
        stepLabels: PropTypes.arrayOf(reactNumber),
        "data-icon": reactString,
        tooltip: reactBool,
        val: PropTypes.oneOf(['left', 'right']),
        disabled: reactBool,
        max: reactNumber,
        min: reactNumber,
        step: reactNumber,
        values: reactNumber,
        color: reactString,
        inputStyle: reactString
    }

    componentDidMount() {
        // get settings from state 
        var settings = this.getSettingsFromProps(this.props);
        // initialize the mobiscroll
        this.instance = new Slider(this.firstInput, settings);

        if (this.props.value !== undefined) {
            this.instance.setVal(this.props.value, true);
        }
        var that = this;
        // our own change handler - to receive the change event
        $(this.label).on('change', function () {
            if (that.props.onChange) {
                var values = that.instance.getVal();
                that.props.onChange(values);
            }
        });

        super.componentDidMount();
    }

    firstInputMounted(input) {
        this.firstInput = input;
    }

    parentMounted(label) {
        this.label = label;
    }

    onValueChanged() {
        // this is not triggered - or the event propagation is stopped somewhere on the line
        // to counter this we attach our own change handler in the `componentDidMount` function 
    }

    render() {
        /* eslint-disable no-unused-vars */
        // justification: variable 'onChange' and 'className' is defined due to object decomposotion
        var {
            children,
            value,
            onChange,
            className,
            icon,
            live,
            stepLabels,
            tooltip,
            color,
            inputStyle,
            ...other
        } = this.props,
            values = value || [];
        live = live || this.props['data-live'] || false;
        icon = icon || this.props['data-icon'];
        /* eslint-enable no-unused-vars */

        if (value !== undefined && !Array.isArray(value)) {
            values = [value];
        }

        return <label ref={this.parentMounted}>
            {children}
            {values.map(function (item, index) {
                if (index === 0) {
                    return <input ref={this.firstInputMounted} data-icon={icon} data-live={live} key={index} type="range" {...other} />;
                }
                return <input key={index} type="range" data-live={live} data-index={index} />;
            }, this)}
        </label>;
    }
}

mobiscroll.Slider = MbscSlider;

class MbscRating extends MbscColored {
    constructor(props) {
        super(props);
        this.presetName = 'rating';
        this.inputMounted = this.inputMounted.bind(this);
        this.parentMounted = this.parentMounted.bind(this);
    }

    static propTypes = {
        ...CorePropTypes,
        val: PropTypes.oneOf(['left', 'right']),
        disabled: reactBool,
        max: reactNumber,
        min: reactNumber,
        step: reactNumber,
        template: reactString,
        empty: reactString,
        filled: reactString,
        value: reactNumber,
        color: reactString,
        inputStyle: reactString
    }

    componentDidMount() {
        // get settings from state
        var settings = this.getSettingsFromProps(this.props);
        // initialize the mobiscroll
        this.instance = new Rating(this.inputNode, settings);
        if (this.props.value !== undefined) {
            this.instance.setVal(this.props.value, true);
        }

        $(this.label).on('change', () => {
            if (this.props.onChange) {
                var value = this.instance.getVal();
                this.props.onChange(value);
            }
        });

        super.componentDidMount();
    }

    inputMounted(input) {
        this.inputNode = input;
    }

    parentMounted(label) {
        this.label = label;
    }

    render() {
        /* eslint-disable no-unused-vars */
        // justification: variable 'value' and 'className' is defined due to object decomposotion
        var {
            className,
            children,
            onChange,
            value,
            empty,
            filled,
            template,
            val,
            color,
            inputStyle,
            ...other
        } = this.props;
        /* eslint-enable no-unused-vars */

        return <label ref={this.parentMounted}>
            {children}
            <input type="rating" data-role="rating" data-val={val} data-template={template} data-empty={empty} data-filled={filled} ref={this.inputMounted} {...other} />
        </label>;
    }
}

mobiscroll.Rating = MbscRating;

class MbscFormGroup extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        collapsible: PropTypes.any,
        open: PropTypes.bool,
        inset: PropTypes.any
    }

    componentDidMount() {
        if (this.props.collapsible !== undefined) {
            let isOpen = this.props.open || false;

            this.instance = new CollapsibleBase(ReactDOM.findDOMNode(this), { isOpen: isOpen });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.open !== undefined && (this.props.open != prevProps.open)) {
            if (this.props.open) {
                this.instance.show();
            } else {
                this.instance.hide();
            }
        }
    }

    render() {
        /* eslint-disable no-unused-vars */
        let { children, inset, collapsible, className, ...other } = this.props;
        let cssClasses = "mbsc-form-group" + (inset !== undefined ? '-inset' : '') + " " + (className || '');

        return <div className={cssClasses} {...other}>
            {children}
        </div>;
    }
}

mobiscroll.FormGroup = MbscFormGroup;
mobiscroll.MbscFormGroup = MbscFormGroup; // deprecated

class MbscFormGroupTitle extends React.Component {
    constructor(props) {
        super(props);
        this.cssClasses = "mbsc-form-group-title " + (this.props.className || '');
    }

    render() {
        return <div className={this.cssClasses}>{this.props.children}</div>;
    }
}

mobiscroll.FormGroupTitle = MbscFormGroupTitle;
mobiscroll.MbscFormGroupTitle = MbscFormGroupTitle; // deprecated

class MbscFormGroupContent extends React.Component {
    constructor(props) {
        super(props);
        this.cssClasses = "mbsc-form-group-content " + (this.props.className || '');
    }

    render() {
        return <div className={this.cssClasses}>{this.props.children}</div>;
    }
}

mobiscroll.FormGroupContent = MbscFormGroupContent;
mobiscroll.MbscFormGroupContent = MbscFormGroupContent; // deprecated


class MbscAccordion extends React.Component {
    constructor(props) {
        super(props);
        this.cssClasses = "mbsc-accordion " + (this.props.className || '');
    }

    render() {
        return <div className={this.cssClasses}>{this.props.children}</div>;
    }
}

mobiscroll.Accordion = MbscAccordion;

export default mobiscroll;
