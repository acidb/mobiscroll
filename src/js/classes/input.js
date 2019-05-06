import { FormControl, addIconToggle } from './form-control';

const events = ['focus', 'change', 'blur', 'animationstart'];

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
