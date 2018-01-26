import { FormControl } from './form-control';

export class Radio extends FormControl {
    constructor(elm, settings) {
        super(elm, settings);

        this._$parent
            .addClass('mbsc-radio mbsc-control-w')
            .find('.mbsc-radio-box').remove();

        this._$elm.after('<span class="mbsc-radio-box"><span></span></span>');
    }
}
