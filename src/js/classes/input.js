import FormControl from './form-control';
import {
    addIconToggle
} from '../util/forms';

class Input extends FormControl {
    constructor(elm) {
        super(elm);

        addIconToggle(this, this._$elm);
        this._$parent.addClass('mbsc-input');
    }

    destroy() {
        super.destroy();
        this._$parent
            .find('.mbsc-input-wrap')
            .before(this._$elm)
            .remove();
    }
}

export default Input;
