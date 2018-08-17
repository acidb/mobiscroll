import { $, instances } from '../core/core';

import { Input } from '../classes/input';
import { Button } from '../classes/button';
import { CheckBox } from '../classes/checkbox';
import { Radio } from '../classes/radio';
import { Select } from '../classes/select';
import { TextArea } from '../classes/textarea';
import { SegmentedItem } from '../classes/segmented';
import { Stepper } from '../classes/stepper';
import { Switch } from '../classes/switch';
import { Progress } from '../classes/progress';
import { Slider } from '../classes/slider';
import { Rating } from '../classes/rating';

import { getControlType } from '../classes/form-control';
import { sizeTextAreas } from '../classes/textarea';
import { CollapsibleBase } from '../util/collapsible-base';

let id = 0;

function initControls($ctx, controls, s, shallow) {
    $('input,select,textarea,progress,button', $ctx).each(function () {
        var control = this,
            $control = $(control),
            //$parent = $control.parent(),
            type = getControlType($control);

        // Skip elements with data-enhance="false"
        if ($control.attr('data-enhance') != 'false' /* TRIALCOND */ ) {

            if ($control.hasClass('mbsc-control')) {
                if (control.mbscInst) {
                    control.mbscInst.option({
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
                    case 'rating':
                        controls[control.id] = new Rating(control, {
                            theme: s.theme,
                            lang: s.lang,
                            rtl: s.rtl,
                            stopProp: s.stopProp
                        });
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

    $('[data-collapsible]:not(.mbsc-collapsible)', $ctx).each(function () {
        var control = this,
            $control = $(control),
            isOpen = $control.attr('data-open');

        if (!control.id) {
            control.id = 'mbsc-form-control-' + (++id);
        }

        controls[control.id] = new CollapsibleBase($control, { isOpen: isOpen !== undefined && isOpen != 'false' });
        instances[control.id] = controls[control.id];
    });

    // Set initial height for textareas
    if (!shallow) {
        sizeTextAreas();
    }
}

export {
    initControls
};
