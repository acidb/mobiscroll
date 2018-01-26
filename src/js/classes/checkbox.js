import { FormControl } from './form-control';

export class CheckBox extends FormControl {
    constructor(elm, settings) {
        super(elm, settings);

        this._$parent
            .prepend(this._$elm)
            .addClass('mbsc-checkbox mbsc-control-w')
            .find('.mbsc-checkbox-box').remove();

        this._$elm.after('<span class="mbsc-checkbox-box"></span>');
    }
}
