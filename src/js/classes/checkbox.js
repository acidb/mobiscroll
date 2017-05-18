import FormControl from './form-control';

class CheckBox extends FormControl {
    constructor(elm) {
        super(elm);

        this._$parent
            .prepend(this._$elm)
            .addClass('mbsc-checkbox mbsc-control-w')
            .find('.mbsc-checkbox-box').remove();

        this._$elm.after('<span class="mbsc-checkbox-box"></span>');
    }
}

export default CheckBox;
