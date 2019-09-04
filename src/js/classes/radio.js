import { FormControl } from './form-control';
import { autoInit } from '../core/core';

export class Radio extends FormControl {
    constructor(elm, settings) {
        super(elm, settings);

        this._$parent
            .addClass('mbsc-radio mbsc-control-w')
            .find('.mbsc-radio-box').remove();

        this._$elm.after('<span class="mbsc-radio-box"><span></span></span>');
    }
}

// Init mbsc-radio elements on page load
autoInit('[mbsc-radio]', Radio);