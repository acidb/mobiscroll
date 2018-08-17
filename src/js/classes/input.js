import { FormControl, addIconToggle } from './form-control';

export class Input extends FormControl {
    constructor(elm, settings) {
        super(elm, settings);

        addIconToggle(this, this._$parent, this._$elm);
        this._$parent.addClass('mbsc-input');
    }

    destroy() {
        super.destroy();
        this._$parent
            .removeClass('mbsc-ic-left mbsc-ic-right')
            .find('.mbsc-input-ic')
            .remove();
    }
}
