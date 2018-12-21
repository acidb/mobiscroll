import { FormControl, addIconToggle } from './form-control';

const events = ['focus', 'change', 'blur'];

export class Input extends FormControl {
    constructor(elm, settings) {
        super(elm, settings);

        addIconToggle(this, this._$parent, this._$elm);

        this._$parent.addClass('mbsc-input');
        this.checkLabel = this.checkLabel.bind(this);

        // Attach events
        events.forEach(ev => {
            this._$elm.on(ev, this.checkLabel);
        });

        setTimeout(() => {
            // if label is floating and input is autofill, add floating active class
            // input has no value yet
            if (this._isFloating && this._$elm.is('*:-webkit-autofill')) {
                this._$parent.addClass('mbsc-label-floating-active');
            }
        });
    }


    checkLabel(ev) {
        if (this._isFloating) {
            if (this._elm.value || (ev && ev.type == 'focus')) {
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
