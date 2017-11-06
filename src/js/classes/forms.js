import mobiscroll, { $, isBrowser, Base } from '../core/core';
import { os, majorVersion } from '../util/platform';
import './page';
import '../util/notifications';

import Input from './input';
import Button from './button';
import CheckBox from './checkbox';
import Radio from './radio';
import Select from './select';
import TextArea from './textarea';
import SegmentedItem from './segmented';
import Stepper from './stepper';
import Switch from './switch';
import Progress from './progress';
import Slider from './slider';

import { getControlType } from './form-control';

import { sizeTextAreas } from './textarea';

let id = 0;

const halfBorder = os == 'ios' && majorVersion > 7;
const instances = mobiscroll.instances;

const Form = function (el, settings) {

    var s,
        cssClass = '',
        $ctx = $(el),
        controls = {},
        that = this;

    function touched() {
        $ctx.removeClass('mbsc-no-touch');
    }

    // Call the parent constructor
    Base.call(this, el, settings, true);

    /* TRIALFUNC */

    that.refresh = function (shallow) {
        $('input,select,textarea,progress,button', $ctx).each(function () {
            var inst,
                control = this,
                $control = $(control),
                //$parent = $control.parent(),
                type = getControlType($control);

            /* TRIAL */

            // Skip elements with data-enhance="false"
            if ($control.attr('data-enhance') != 'false' /* TRIALCOND */ ) {

                if ($control.hasClass('mbsc-control')) {
                    inst = instances[control.id] || controls[control.id];
                    if (inst && inst.option) {
                        inst.option({
                            theme: s.theme,
                            lang: s.lang,
                            rtl: s.rtl,
                            onText: s.onText,
                            offText: s.offText,
                            stopProp: s.stopProp
                        });
                    }
                } else {

                    if (!control.id) {
                        control.id = 'mbsc-form-control-' + (++id);
                    }

                    switch (type) {
                        case 'button':
                        case 'submit':
                            controls[control.id] = new Button(control, {
                                theme: s.theme,
                                tap: s.tap
                            });
                            break;
                        case 'switch':
                            controls[control.id] = new Switch(control, {
                                theme: s.theme,
                                lang: s.lang,
                                rtl: s.rtl,
                                tap: s.tap,
                                onText: s.onText,
                                offText: s.offText,
                                stopProp: s.stopProp
                            });
                            break;
                        case 'checkbox':
                            controls[control.id] = new CheckBox(control, {
                                tap: s.tap
                            });
                            break;
                        case 'range':
                            if (!$(control).parent().hasClass('mbsc-slider')) {
                                controls[control.id] = new Slider(control, {
                                    theme: s.theme,
                                    lang: s.lang,
                                    rtl: s.rtl,
                                    stopProp: s.stopProp
                                });
                            }
                            break;
                        case 'progress':
                            controls[control.id] = new Progress(control, {
                                theme: s.theme,
                                lang: s.lang,
                                rtl: s.rtl
                            });
                            break;
                        case 'radio':
                            controls[control.id] = new Radio(control, {
                                tap: s.tap
                            });
                            break;
                        case 'select':
                        case 'select-one':
                        case 'select-multiple':
                            controls[control.id] = new Select(control, {
                                tap: s.tap
                            });
                            break;
                        case 'textarea':
                            controls[control.id] = new TextArea(control, {
                                tap: s.tap
                            });
                            break;
                        case 'segmented':
                            controls[control.id] = new SegmentedItem(control, {
                                theme: s.theme,
                                tap: s.tap
                            });
                            break;
                        case 'stepper':
                            controls[control.id] = new Stepper(control, {
                                theme: s.theme
                            });
                            break;
                        case 'hidden':
                            return;
                        default:
                            controls[control.id] = new Input(control, {
                                tap: s.tap
                            });
                            break;
                    }
                }
            }

        });

        // Set initial height for textareas
        if (!shallow) {
            sizeTextAreas();
        }
    };

    /**
     * Form initialization.
     */
    that._init = function () {
        if (!mobiscroll.themes.form[s.theme]) {
            s.theme = 'mobiscroll';
        }

        if (!$ctx.hasClass('mbsc-form')) {
            $ctx.on('touchstart', touched).show();
        }

        if (cssClass) {
            $ctx.removeClass(cssClass);
        }

        // --- TRIAL SERVER CODE START ---
        cssClass = 'mbsc-form mbsc-no-touch mbsc-' + s.theme +
            (halfBorder ? ' mbsc-form-hb' : '') +
            (s.baseTheme ? ' mbsc-' + s.baseTheme : '') +
            (s.rtl ? ' mbsc-rtl' : ' mbsc-ltr');
        // --- TRIAL SERVER CODE END ---

        $ctx.addClass(cssClass);

        that.refresh();
    };

    /**
     * Destroys the mobiscroll instance.
     */
    that._destroy = function () {
        $ctx.removeClass(cssClass).off('touchstart', touched);

        for (var id in controls) {
            controls[id].destroy();
        }
    };

    // Constructor

    s = that.settings;

    that.init(settings);
};

// Extend defaults
Form.prototype = {
    _hasDef: true,
    _hasTheme: true,
    _hasLang: true,
    _class: 'form',
    _defaults: {
        tap: true,
        stopProp: true,
        // Localization
        lang: 'en'
    }
};

mobiscroll.themes.form.mobiscroll = {};

mobiscroll.classes.Form = Form;

mobiscroll.presetShort('form', 'Form');

// Init mbsc-enhance elements on page load
// ---

if (isBrowser) {
    $(function () {

        var selector = '[mbsc-enhance],[mbsc-form]';

        $(selector).each(function () {
            new Form(this);
        });

        $(document).on('mbsc-enhance', function (ev, settings) {
            if ($(ev.target).is(selector)) {
                new Form(ev.target, settings);
            } else {
                $(selector, ev.target).each(function () {
                    new Form(this, settings);
                });
            }
        });

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
    });
}

// ---
// Init end

export default Form;
