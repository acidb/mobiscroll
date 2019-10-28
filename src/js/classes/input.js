import { $, autoInit } from '../core/core';
import { FormControl, addIconToggle } from './form-control';

const events = ['focus', 'change', 'blur', 'animationstart'];

export class Input extends FormControl {
    constructor(elm, settings) {
        super(elm, settings);

        const $elm = this._$elm;
        const $parent = this._$parent;
        const $dummy = $parent.find('.mbsc-select-input, .mbsc-color-input');

        addIconToggle(this, $parent, $elm);

        this._checkLabel = this._checkLabel.bind(this);
        this._mouseDown = this._mouseDown.bind(this);
        this._setText = this._setText.bind(this);

        if (elm.type == 'file') {
            // Copy attributes and create dummy input
            const $existing = $parent.find('.mbsc-file-input');
            this._$input = $existing.length ? $existing : $('<input type="text" class="' +
                ($elm.attr('class') || '') + ' mbsc-file-input" placeholder="' +
                ($elm.attr('placeholder') || '') +
                '"/>').insertAfter($elm);

            // Copy value on file upload
            $elm.on('change', this._setText);
        }

        $parent.addClass('mbsc-input').on('mousedown', this._mouseDown);

        // Attach events
        events.forEach(ev => {
            $elm.on(ev, this._checkLabel);
        });

        // Move the dummy input after the element for correct styling
        if ($dummy.length) {
            $elm.after($dummy);
            if ($dummy.hasClass('mbsc-select-input')) {
                this._delm = $dummy[0];
                this.refresh();
            }
        }
    }

    _setText(ev) {
        const files = ev.target.files;
        const names = [];

        for (let i = 0; i < files.length; ++i) {
            names.push(files[i].name);
        }
        names.join(', ');
        this._$input.val(names);
    }

    _checkLabel(ev) {
        if (this._isFloating) {
            // In case of select we need to check the dummy element
            const elm = this._delm || this._elm;
            // In case of autofill in webkit browsers the animationstart event will fire 
            // due to the empty animation added in the css,
            // because there's no other event in case of the initial autofill
            if (elm.value || document.activeElement === elm || (ev && (ev.type == 'focus' || (ev.type == 'animationstart' && this._$elm.is('*:-webkit-autofill'))))) {
                this._$parent.addClass('mbsc-label-floating-active');
            } else {
                this._$parent.removeClass('mbsc-label-floating-active');
            }
        }
    }


    _mouseDown(ev) {
        // Will prevent floating label animation when loosing focus only for a brief moment
        if (document.activeElement === this._elm && ev.target !== this._elm) {
            ev.preventDefault();
        }
    }

    refresh() {
        this._checkLabel();
    }

    destroy() {
        super.destroy();
        this._$parent
            .off('mousedown', this._mouseDown)
            .removeClass('mbsc-ic-left mbsc-ic-right')
            .find('.mbsc-input-ic')
            .remove();

        this._$parent
            .find('.mbsc-input-fill')
            .remove();

        events.forEach(ev => {
            this._$elm.off(ev, this._checkLabel);
        });

        this._$elm.off('change', this._setText);
    }
}

// Init mbsc-input elements on page load
autoInit('[mbsc-input]', Input);
