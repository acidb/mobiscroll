import { $, autoInit } from '../core/core';
import { FormControl, addIconToggle } from './form-control';

const events = ['focus', 'change', 'blur', 'animationstart'];

export class Input extends FormControl {
    constructor(elm, settings) {
        super(elm, settings);

        const $elm = this._$elm;
        const $dummy = this._$parent.find('.mbsc-select-input');

        addIconToggle(this, this._$parent, $elm);

        if (elm.type == 'file') {
            // Copy attributes and create dummy input
            var $inp = $('<input type="text" class="' +
                ($elm.attr('class') || '') + '" placeholder="' +
                ($elm.attr('placeholder') || '') +
                '"/>').insertAfter($elm);

            // Copy value on file upload
            $elm.on('change', function (ev) {
                var files = ev.target.files,
                    names = [];

                for (var i = 0; i < files.length; ++i) {
                    names.push(files[i].name);
                }
                names.join(', ');
                $inp.val(names);
            });
        }

        this._$parent.addClass('mbsc-input');
        this.checkLabel = this.checkLabel.bind(this);

        // Attach events
        events.forEach(ev => {
            $elm.on(ev, this.checkLabel);
        });

        // Move the dummy input after the element for correct styling
        if ($dummy.length) {
            $elm.after($dummy);
            this._delm = $dummy[0];
            this.refresh();
        }
    }

    checkLabel(ev) {
        if (this._isFloating) {
            // In case of select we need to check the dummy element
            const elm = this._delm || this._elm;
            // In case of autofill in webkit browsers the animationstart event will fire 
            // due to the empty animation added in the css,
            // because there's no other event in case of the initial autofill
            if (elm.value || (ev && (ev.type == 'focus' || (ev.type == 'animationstart' && this._$elm.is('*:-webkit-autofill'))))) {
                this._$parent.addClass('mbsc-label-floating-active');
            } else {
                this._$parent.removeClass('mbsc-label-floating-active');
            }
        }
    }

    refresh() {
        this.checkLabel();
    }

    destroy() {
        super.destroy();
        this._$parent
            .removeClass('mbsc-ic-left mbsc-ic-right')
            .find('.mbsc-input-ic')
            .remove();

        this._$parent
            .find('.mbsc-input-fill')
            .remove();

        events.forEach(ev => {
            this._$elm.off(ev, this.checkLabel);
        });
    }
}

// Init mbsc-input elements on page load
autoInit('[mbsc-input]', Input);