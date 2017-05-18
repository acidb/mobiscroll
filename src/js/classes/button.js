import FormControl from './form-control';

class Button extends FormControl {
    constructor(elm, settings) {
        super(elm, settings);

        const $elm = this._$elm;
        const hasIcon = $elm.attr('data-icon');

        $elm.addClass('mbsc-btn').find('.mbsc-btn-ic').remove();

        if (hasIcon) {
            $elm.prepend('<span class="mbsc-btn-ic mbsc-ic mbsc-ic-' + hasIcon + '"></span>');
            if ($elm.text() === "") {
                $elm.addClass('mbsc-btn-icon-only');
            }
        }

        this._$rippleElm = $elm;
    }
}

export default Button;
