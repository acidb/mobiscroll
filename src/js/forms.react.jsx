import React from 'react';
import ReactDOM from 'react-dom';
import {
    $,
    extend,
    mobiscroll,
    classes,
    updateCssClasses,
    PropTypes,
    MbscOptimized,
    CorePropTypes,
    MbscInit
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
        onInit: reactFunc
    }

    componentDidMount = () => {
        // get settings from state
        var settings = extend({}, this.state.options);
        // initialize the mobiscroll
        this.instance = new Form(ReactDOM.findDOMNode(this), settings);
    }

    componentDidUpdate = () => {
        if (!this.optimizeUpdate.updateOptions && this.optimizeUpdate.updateChildren) {
            this.instance.refresh(true);
        } else if (this.optimizeUpdate.updateOptions) {
            var settings = extend({}, this.state.options);
            this.instance.option(settings);
        }
    }

    checkFormWrapper = (component) => {
        if (React.Children.count(component.props.children) == 1) {
            return (component.props.children.type == 'form');
        }
        return false;
    }

    render = () => {
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
        this.initialCssClass = (this.props.className || '') + (this.props.valid === undefined || this.props.valid ? '' : ' mbsc-err');
        this.state = {
            cssClasses: this.props.className || ''
        };
    }

    static propTypes = {
        valid: PropTypes.bool,
        color: PropTypes.string,
        presetName: PropTypes.string
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
        var presetClass = '';
        if (color) {
            presetClass = 'mbsc-' + presetName + '-' + color;
        }
        var cssClass = presetClass + (this.initialCssClass ? ' ' : '') + this.initialCssClass;
        return <label className={cssClass} {...other}>{children}</label>;
    }

    componentWillReceiveProps = (nextProps) => {
        var currentClasses = (this.state.cssClasses || '') + (this.props.valid === undefined || this.props.valid ? '' : ' mbsc-err'),
            nextClasses = (nextProps.className || '') + (this.props.valid === undefined || nextProps.valid ? '' : ' mbsc-err');
        if (currentClasses != nextClasses || nextProps.valid != this.props.valid) {
            updateCssClasses.call(this, currentClasses, nextClasses);
        }
        if (this.state.cssClasses !== nextProps.cssClasses) {
            this.setState({
                cssClasses: nextProps.className
            });
        }
    }
}

mobiscroll.Form.Label = MbscLabel; // for backward compatibilty
mobiscroll.Label = MbscLabel;

class MbscInput extends MbscInit {
    constructor(props) {
        super(props);
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
        name: PropTypes.string
    }

    componentDidMount = () => {
        var settings = extend({}, this.state.options);
        this.instance = new Input(this.inputNode, settings);
    }

    inputMounted = (input) => {
        this.inputNode = input;
    }

    render = () => {
        var { valid, errorMessage, type, icon, iconAlign, passwordToggle, iconShow, iconHide, children, ...other } = this.props;
        var error = null;
        if (errorMessage && !valid) {
            error = <span className="mbsc-err-msg">{errorMessage}</span>;
        }

        type = type || 'text';

        return <MbscLabel valid={valid}>
            {children}
            <span className="mbsc-input-wrap">
                <input ref={this.inputMounted} type={type} data-icon={icon} data-icon-align={iconAlign} data-password-toggle={passwordToggle} data-icon-show={iconShow} data-icon-hide={iconHide} {...other} />
                {error}
            </span>
        </MbscLabel>;
    }
}

mobiscroll.Input = MbscInput;

class MbscTextArea extends MbscInit {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        disabled: PropTypes.bool,
        valid: PropTypes.bool,
        errorMessage: PropTypes.string,
        icon: PropTypes.string,
        iconAlign: PropTypes.string,
        name: PropTypes.string
    }

    componentDidMount = () => {
        var settings = extend({}, this.state.options);
        this.instance = new TextArea(this.inputNode, settings);
    }

    textMounted = (input) => {
        this.inputNode = input;
    }

    render = () => {
        var { valid, errorMessage, icon, iconAlign, children, ...other } = this.props;
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
    }

    static propTypes = {
        label: PropTypes.string,
        disabled: PropTypes.bool,
        valid: PropTypes.bool,
        errorMessage: PropTypes.string,
        icon: PropTypes.string,
        iconAlign: PropTypes.string,
        name: PropTypes.string
    }

    componentDidMount = () => {
        var settings = extend({}, this.state.options);
        this.instance = new Select(this.selectNode, settings);
    }

    selectMounted = (select) => {
        this.selectNode = select;
    }

    componentDidUpdate = () => {
        this.instance._setText();
    }

    render = () => {
        var { label, valid, errorMessage, icon, iconAlign, children, ...other } = this.props;
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

    componentDidMount = () => {
        var settings = extend({}, this.state.options);
        this.instance = new Button(this.btnNode, settings);
    }

    btnMounted = (btn) => {
        this.btnNode = btn;
    }

    render = () => {
        var { type, children, color, flat, block, outline, icon, ...other } = this.props;
        type = type || 'button';

        var cssClass = '';
        if (flat) {
            cssClass += ' mbsc-btn-flat';
        }
        if (block) {
            cssClass += ' mbsc-btn-block';
        }
        if (outline) {
            cssClass += ' mbsc-btn-outline';
        }
        if (color) {
            cssClass += ' mbsc-btn-' + color;
        }
        if (this.initialCssClass) {
            cssClass += ' ' + this.initialCssClass;
        }
        cssClass = cssClass.trim();

        return <button className={cssClass} ref={this.btnMounted} type={type} data-icon={icon} {...other}>{children}</button>;
    }
}

mobiscroll.Button = MbscButton;

class MbscCheckbox extends MbscInit {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        color: PropTypes.string,
        disabled: PropTypes.bool,
        name: PropTypes.string
    }

    componentDidMount = () => {
        var settings = extend({}, this.state.options);
        this.instance = new CheckBox(this.inputNode, settings);
    }

    inputMounted = (inp) => {
        this.inputNode = inp;
    }

    render = () => {
        var { color, children, ...other } = this.props;
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
    }

    static propTypes = {
        color: PropTypes.string,
        name: PropTypes.string,
        disabled: PropTypes.bool
    }

    componentDidMount = () => {
        var settings = extend({}, this.state.options);
        this.instance = new Radio(this.inputNode, settings);
    }

    inputMounted = (inp) => {
        this.inputNode = inp;
    }

    render = () => {
        var { color, children, ...other } = this.props;
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
    }

    static propTypes = {
        color: PropTypes.string,
        name: PropTypes.string,
        disabled: PropTypes.bool,
        multiSelect: PropTypes.bool,
        icon: PropTypes.string
    }

    componentDidMount = () => {
        var settings = extend({}, this.state.options);
        this.instance = new SegmentedItem(this.inputNode, settings);
    }

    inputMounted = (inp) => {
        this.inputNode = inp;
    }

    render = () => {
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
    }

    static propTypes = {
        ...CorePropTypes,
        color: reactString
    }

    componentDidMount = () => {
        // get settings from state
        var settings = extend({}, this.mbscInit, this.state.options);

        // initialize the mobiscroll
        this.instance = new classes[this.mbscInit.component || 'Scroller'](this.inputNode, settings);

        if (this.state.value !== undefined) {
            this.instance.setVal(this.state.value, true);
        }

        // Add change event listener if handler is passed
        $(this.inputNode).on('change', this.props.onChange || (function () { }));
    }

    inputMounted = (input) => {
        this.inputNode = input;
    }

    render = () => {
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
        var presetClass = '';
        if (color) {
            presetClass = 'mbsc-' + this.presetName + '-' + color;
        }
        var type = this.inputType || 'text';

        return <div className={presetClass + (this.initialCssClass ? ' ' + this.initialCssClass : '')}>
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

class MbscProgress extends MbscOptimized {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        ...CorePropTypes,
        "data-icon": reactString,
        "data-icon-align": PropTypes.oneOf(['left', 'right']),
        val: PropTypes.oneOf(['left', 'right']),
        disabled: reactBool,
        max: reactNumber,
        value: reactNumber,
        color: reactString
    }

    componentDidMount = () => {
        // get settings from state
        var settings = extend({}, this.state.options);
        // initialize the mobiscroll
        this.instance = new Progress(this.progressNode, settings);
        if (this.state.value !== undefined) {
            this.instance.setVal(this.state.value, true);
        }
    }

    progressMounted = (progress) => {
        this.progressNode = progress;
    }

    render = () => {
        /* eslint-disable no-unused-vars */
        // justification: variable 'value' and 'className' is defined due to object decomposotion
        var {
            className,
            children,
            value,
            color,
            ...other
        } = this.props;

        /* eslint-enable no-unused-vars */
        var presetClass = '';
        if (color) {
            presetClass = 'mbsc-progress-' + color;
        }
        var cssClass = presetClass + (this.initialCssClass ? ' ' + this.initialCssClass : '');
        return <div className={cssClass}>
            {children}
            <progress ref={this.progressMounted} {...other} />
        </div>;
    }
}

mobiscroll.Progress = MbscProgress;

// slider
class MbscSlider extends MbscOptimized {
    constructor(props) {
        super(props);
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
        color: reactString
    }

    componentDidMount = () => {
        // get settings from state 
        var settings = extend({}, this.state.options);
        // initialize the mobiscroll
        this.instance = new Slider(this.firstInput, settings);

        if (this.state.value !== undefined) {
            this.instance.setVal(this.state.value, true);
        }
        var that = this;
        // our own change handler - to receive the change event
        $(this.label).on('change', function () {
            if (that.props.onChange) {
                var values = that.instance.getVal();
                that.props.onChange(values);
            }
        });
    }

    firstInputMounted = (input) => {
        this.firstInput = input;
    }

    parentMounted = (label) => {
        this.label = label;
    }

    onValueChanged = () => {
        // this is not triggered - or the event propagation is stopped somewhere on the line
        // to counter this we attach our own change handler in the `componentDidMount` function 
    }

    render = () => {
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
            ...other
        } = this.props,
            values = value || [];
        live = live || this.props['data-live'] || false;
        icon = icon || this.props['data-icon'];
        /* eslint-enable no-unused-vars */

        if (value !== undefined && !Array.isArray(value)) {
            values = [value];
        }

        var presetClass = '';
        if (color) {
            presetClass = 'mbsc-slider-' + color;
        }
        var cssClass = presetClass + (this.initialCssClass ? ' ' + this.initialCssClass : '');

        return <label ref={this.parentMounted} className={cssClass}>
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

class MbscRating extends MbscOptimized {
    constructor(props) {
        super(props);
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
        color: reactString
    }

    componentDidMount = () => {
        // get settings from state
        var settings = extend({}, this.state.options);
        // initialize the mobiscroll
        this.instance = new Rating(this.inputNode, settings);
        if (this.state.value !== undefined) {
            this.instance.setVal(this.state.value, true);
        }

        $(this.label).on('change', () => {
            if (this.props.onChange) {
                var value = this.instance.getVal();
                this.props.onChange(value);
            }
        });
    }

    inputMounted = (input) => {
        this.inputNode = input;
    }

    parentMounted = (label) => {
        this.label = label;
    }

    render = () => {
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
            ...other
        } = this.props;
        /* eslint-enable no-unused-vars */

        var presetClass = '';
        if (color) {
            presetClass = 'mbsc-rating-' + color;
        }
        var cssClass = presetClass + (this.initialCssClass ? ' ' + this.initialCssClass : '');

        return <label className={cssClass} ref={this.parentMounted}>
            {children}
            <input type="rating" data-role="rating" data-val={val} data-template={template} data-empty={empty} data-filled={filled} ref={this.inputMounted} {...other} />
        </label>;
    }
}

mobiscroll.Rating = MbscRating;

export default mobiscroll;
