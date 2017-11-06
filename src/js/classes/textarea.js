import {
    $,
    isBrowser
} from '../core/core';
import Input from './input';

const events = ['keydown', 'input', 'scroll'];

let sizeDebounce;

function sizeTextAreas() {
    clearTimeout(sizeDebounce);
    sizeDebounce = setTimeout(function () {
        $('textarea.mbsc-control').each(function () {
            sizeTextArea(this);
        });
    }, 100);
}

function sizeTextArea(control) {
    let height,
        lineNr,
        line,
        rowNr = $(control).attr('rows') || 6;

    if (control.offsetHeight) {
        control.style.height = '';

        line = control.scrollHeight - control.offsetHeight;
        height = control.offsetHeight + (line > 0 ? line : 0);
        lineNr = Math.round(height / 24);

        if (lineNr > rowNr) {
            control.scrollTop = height;
            height = 24 * rowNr + (height - lineNr * 24);
            $(control).addClass('mbsc-textarea-scroll');
        } else {
            $(control).removeClass('mbsc-textarea-scroll');
        }

        if (height) {
            control.style.height = height + 'px';
        }
    }
}

function scrollTextArea(elm) {
    const $elm = $(elm);

    if (!$elm.hasClass('mbsc-textarea-scroll')) {
        let line = elm.scrollHeight - elm.offsetHeight,
            height = elm.offsetHeight + line;

        elm.scrollTop = 0;
        elm.style.height = height + 'px';
    }
}

if (isBrowser) {
    // Set height of textareas on viewport size changes
    $(window).on('resize orientationchange', sizeTextAreas);
}

class TextArea extends Input {
    constructor(elm, settings) {
        super(elm, settings);

        this._$parent.addClass('mbsc-textarea');

        events.forEach(ev => {
            this._elm.addEventListener(ev, this);
        });

        sizeTextArea(elm);
    }

    destroy() {
        super.destroy();
        events.forEach(ev => {
            this._elm.removeEventListener(ev, this);
        });
    }

    handleEvent(ev) {
        super.handleEvent(ev);

        switch (ev.type) {
            case 'keydown':
            case 'input':
                this._onInput(ev);
                break;
            case 'scroll':
                scrollTextArea(this._elm);
        }
    }

    _onInput() {
        clearTimeout(this._debounce);
        this._debounce = setTimeout(() => {
            sizeTextArea(this._elm);
        }, 100);
    }
}

export {
    sizeTextAreas
};

export default TextArea;
