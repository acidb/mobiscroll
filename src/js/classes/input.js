import { FormControl, addIconToggle } from './form-control';

const events = ['focus', 'change', 'blur'];

export class Input extends FormControl {
    constructor(elm, settings) {
        super(elm, settings);

        addIconToggle(this, this._$parent, this._$elm);
        this._$parent.addClass('mbsc-input');

        // Attach events
        // Prevent 300ms click latency
        events.forEach(ev => {
            elm.addEventListener(ev, this);
        });

        setTimeout(() => {
            // if label is floating and input is autofill, add floating active class
            // input has no value yet
            if (this._isFloating && this._$elm.is("*:-webkit-autofill")) {
                this._$parent.addClass('mbsc-label-floating-active');
            }
        });
    }

    handleEvent(ev) {
        super.handleEvent(ev);
        switch (ev.type) {
            case 'focus':
                this.onFocus();
                break;
            case 'change':
            case 'blur':
                this.onChange();
                break;
        }
    }

    refresh() {
        this.onChange();
    }

    onChange() {
        if (this._isFloating) {
            if (!this._elm.value) {
                this._$parent.removeClass('mbsc-label-floating-active');
            } else {
                this._$parent.addClass('mbsc-label-floating-active');
            }
        }
    }

    onFocus() {
        if (this._isFloating) {
            this._$parent.addClass('mbsc-label-floating-active');
        }
    }

    destroy() {
        super.destroy();
        this._$parent
            .removeClass('mbsc-ic-left mbsc-ic-right')
            .find('.mbsc-input-ic')
            .remove();

        events.forEach(ev => {
            this._elm.removeEventListener(ev, this);
        });
    }
}
