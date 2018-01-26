import { $, extend, instances } from '../core/core';
import { tap } from '../util/tap';

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

let id = 0;

const wrapClass = 'mbsc-input-wrap';

function addIcon($control, ic) {
    var icons = {},
        $parent = $control.parent(),
        errorMsg = $parent.find('.mbsc-err-msg'),
        align = $control.attr('data-icon-align') || 'left',
        icon = $control.attr('data-icon');

    if ($parent.hasClass(wrapClass)) {
        $parent = $parent.parent();
    } else {
        // Wrap input
        $('<span class="' + wrapClass + '"></span>').insertAfter($control).append($control);
    }

    if (errorMsg) {
        $parent.find('.' + wrapClass).append(errorMsg);
    }

    if (icon) {
        if (icon.indexOf('{') !== -1) {
            icons = JSON.parse(icon);
        } else {
            icons[align] = icon;
        }
    }

    if (icon || ic) {
        extend(icons, ic);

        $parent
            .addClass((icons.right ? 'mbsc-ic-right ' : '') + (icons.left ? ' mbsc-ic-left' : ''))
            .find('.' + wrapClass)
            .append(icons.left ? '<span class="mbsc-input-ic mbsc-left-ic mbsc-ic mbsc-ic-' + icons.left + '"></span>' : '')
            .append(icons.right ? '<span class="mbsc-input-ic mbsc-right-ic mbsc-ic mbsc-ic-' + icons.right + '"></span>' : '');
    }
}

function addIconToggle(that, $parent, $control) {
    var icons = {},
        control = $control[0],
        toggle = $control.attr('data-password-toggle'),
        iconShow = $control.attr('data-icon-show') || 'eye',
        iconHide = $control.attr('data-icon-hide') || 'eye-blocked';

    if (toggle) {
        icons.right = control.type == 'password' ? iconShow : iconHide;
    }

    addIcon($control, icons);

    if (toggle) {
        tap(that, $parent.find('.mbsc-right-ic').addClass('mbsc-input-toggle'), function () {
            if (control.type == "text") {
                control.type = "password";
                $(this).addClass('mbsc-ic-' + iconShow).removeClass('mbsc-ic-' + iconHide);
            } else {
                control.type = "text";
                $(this).removeClass('mbsc-ic-' + iconShow).addClass('mbsc-ic-' + iconHide);
            }
        });
    }
}

function wrapLabel($parent, type) {
    // Wrap non-empty text nodes in span with mbsc-label class
    if (type != 'button' && type != 'submit' && type != 'segmented') {
        $parent.addClass('mbsc-control-w').find('label').addClass('mbsc-label');
        $parent.contents().filter(function () {
            return this.nodeType == 3 && this.nodeValue && /\S/.test(this.nodeValue);
        }).each(function () {
            $('<span class="mbsc-label"></span>').insertAfter(this).append(this);
        });
    }
}

function initControls($ctx, controls, s, shallow) {
    $('input,select,textarea,progress,button', $ctx).each(function () {
        var inst,
            control = this,
            $control = $(control),
            //$parent = $control.parent(),
            type = getControlType($control);

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

    // Set initial height for textareas
    if (!shallow) {
        sizeTextAreas();
    }
}

export {
    addIcon,
    addIconToggle,
    initControls,
    wrapLabel
};
