import { $, autoInit } from '../core/core';
import { Input } from './input';

export class Select extends Input {
    constructor(elm, settings) {
        super(elm, settings);

        const $elm = this._$elm;
        const $parent = this._$parent;
        const $existing = $parent.find('.mbsc-select-input');
        const $input = $existing.length ? $existing : $('<input tabindex="-1" class="mbsc-select-input mbsc-control" readonly>');

        this._$input = $input;
        this._delm = $input[0];
        this._setText = this._setText.bind(this);

        $parent.addClass('mbsc-select' + (this._$frame ? ' mbsc-select-inline' : ''));

        $elm.after($input);

        $input.after('<span class="mbsc-select-ic mbsc-ic mbsc-ic-arrow-down5"></span>');

        // Update dummy input text on change
        $elm.on('change', this._setText);
        this._setText();
    }

    destroy() {
        super.destroy();
        this._$parent.find('.mbsc-select-ic').remove();
        this._$elm.off('change', this._setText);
    }

    _setText() {
        const elm = this._elm;
        const $elm = $(elm);
        // Check if select and mobiscroll select was not initialized
        if ($elm.is('select') && !$elm.hasClass('mbsc-comp')) {
            this._$input.val(elm.selectedIndex != -1 ? elm.options[elm.selectedIndex].text : '');
        }
        // Check floating label
        this.refresh();
    }
}

// Init mbsc-select elements on page load
autoInit('[mbsc-dropdown]', Select);