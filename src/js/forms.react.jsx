import React from 'react';
import ReactDOM from 'react-dom';
import {
    $,
    extend,
    mobiscroll,
    createReactClass,
    PropTypes
} from './frameworks/react';
import './page.react';
import './classes/forms';

var reactNumber = PropTypes.number,
    reactString = PropTypes.string,
    reactFunc = PropTypes.func,
    reactBool = PropTypes.bool;

/** PropTypes for Form components */
mobiscroll.react.mixins.StepperPropTypes = {
    propTypes: {
        onInit: reactFunc,
        onChange: reactFunc,
        value: reactNumber,
        disabled: reactBool,
        min: reactNumber,
        max: reactNumber,
        step: reactNumber,
        val: PropTypes.oneOf(['left', 'right'])
    }
};

mobiscroll.react.mixins.SwitchPropTypes = {
    propTypes: {
        onInit: reactFunc,
        onChange: reactFunc,
        checked: reactBool,
        disabled: reactBool,
        value: reactBool
    }
};

mobiscroll.Form = createReactClass({
    mixins: [
        mobiscroll.react.mixins.InitialOptionsMixin,
        mobiscroll.react.mixins.UpdateOptimizeMixin,
        mobiscroll.react.mixins.UnmountMixin,
        mobiscroll.react.mixins.CorePropTypes
    ],
    propTypes: {
        onInit: reactFunc
    },
    getDefaultProps: function () {
        return {
            renderForm: true
        };
    },
    componentDidMount: function () {
        // get settings from state
        var settings = extend({}, this.state.options);
        // initialize the mobiscroll
        this.instance = new mobiscroll.classes.Form(ReactDOM.findDOMNode(this), settings);
    },
    componentDidUpdate: function () {
        if (!this.optimizeUpdate.updateOptions && this.optimizeUpdate.updateChildren) {
            this.instance.refresh(true);
        }
    },
    checkFormWrapper: function (component) {
        if (React.Children.count(component.props.children) == 1) {
            return (component.props.children.type == 'form');
        }
        return false;
    },
    render: function () {
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
});

mobiscroll.Form.Label = createReactClass({
    propTypes: {
        valid: PropTypes.bool
    },
    getInitialState: function () {
        this.initialCssClass = (this.props.className || '') + (this.props.valid === undefined || this.props.valid ? '' : ' mbsc-err');
        return {
            cssClasses: this.props.className || ''
        };
    },
    render: function () {
        /* eslint-disable no-unused-vars */
        // justification: variable 'valid' and 'className' is declared due to object decomposition
        var {
            valid,
            className,
            ...other
        } = this.props;

        /* eslint-enable */

        return <label className={this.initialCssClass} {...other}>{this.props.children}</label>;
    },
    componentWillReceiveProps: function (nextProps) {
        var currentClasses = (this.state.cssClasses || '') + (this.props.valid === undefined || this.props.valid ? '' : ' mbsc-err'),
            nextClasses = (nextProps.className || '') + (this.props.valid === undefined || nextProps.valid ? '' : ' mbsc-err');
        if (currentClasses != nextClasses || nextProps.valid != this.props.valid) {
            mobiscroll.react.updateCssClasses.call(this, currentClasses, nextClasses);
        }
        if (this.state.cssClasses !== nextProps.cssClasses) {
            this.setState({
                cssClasses: nextProps.className
            });
        }
    }
});


mobiscroll.Switch = mobiscroll.react.createFormComponent({
    component: 'Switch'
}, 'checkbox', [mobiscroll.react.mixins.SwitchPropTypes]);

mobiscroll.Stepper = mobiscroll.react.createFormComponent({
    component: 'Stepper'
}, undefined, [mobiscroll.react.mixins.StepperPropTypes]);

// progress

mobiscroll.Progress = createReactClass({
    mixins: [
        mobiscroll.react.mixins.InitialOptionsMixin,
        mobiscroll.react.mixins.UpdateOptimizeMixin,
        mobiscroll.react.mixins.UnmountMixin,
        mobiscroll.react.mixins.CorePropTypes
    ],
    propTypes: {
        "data-icon": reactString,
        "data-icon-align": PropTypes.oneOf(['left', 'right']),
        val: PropTypes.oneOf(['left', 'right']),
        disabled: reactBool,
        max: reactNumber,
        value: reactNumber
    },
    componentDidMount: function () {
        // get settings from state
        var settings = extend({}, this.state.options);
        // initialize the mobiscroll
        this.instance = new mobiscroll.classes.Progress(this.progressNode, settings);
        if (this.state.value !== undefined) {
            this.instance.setVal(this.state.value, true);
        }
    },
    progressMounted: function (progress) {
        this.progressNode = progress;
    },
    render: function () {
        /* eslint-disable no-unused-vars */
        // justification: variable 'value' and 'className' is defined due to object decomposotion
        var {
            className,
            children,
            value,
            ...other
        } = this.props;

        /* eslint-enable no-unused-vars */

        return <div className={this.initialCssClass}>
            {children}
            <progress ref={this.progressMounted} {...other} />
        </div>;
    }
});

// slider

mobiscroll.Slider = createReactClass({
    mixins: [
        mobiscroll.react.mixins.InitialOptionsMixin,
        mobiscroll.react.mixins.UpdateOptimizeMixin,
        mobiscroll.react.mixins.UnmountMixin,
        mobiscroll.react.mixins.CorePropTypes
    ],
    propTypes: {
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
        values: reactNumber
    },
    componentDidMount: function () {
        // get settings from state 
        var settings = extend({}, this.state.options);
        // initialize the mobiscroll
        this.instance = new mobiscroll.classes.Slider(this.firstInput, settings);

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
    },
    firstInputMounted: function (input) {
        this.firstInput = input;
    },
    parentMounted: function (label) {
        this.label = label;
    },
    onValueChanged: function () {
        // this is not triggered - or the event propagation is stopped somewhere on the line
        // to counter this we attach our own change handler in the `componentDidMount` function 
    },
    render: function () {
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
            ...other
        } = this.props,
            values = value || [];
        live = live || this.props['data-live'] || false;
        icon = icon || this.props['data-icon'];
        /* eslint-enable no-unused-vars */

        if (value !== undefined && !Array.isArray(value))
            values = [value];

        return <label ref={this.parentMounted} className={this.initialCssClass}>
            {children}
            {values.map(function(item, index) {
                if (index === 0) {
                    return <input ref={this.firstInputMounted} data-icon={icon} data-live={live} key={index} type="range" {...other} />;
                }
                return <input key={index} type="range" data-live={live} data-index={index} />;
            }, this)}
        </label>;
    }
});


export default mobiscroll;
