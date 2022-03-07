import { $, autoInit } from '../core/core';
import { FormControl } from './form-control';

export class SegmentedItem extends FormControl {
    constructor(elm, settings) {
        super(elm, settings);

        let $segmentCont;
        let $segment;

        const $elm = this._$elm;
        const $parent = this._$parent;

        if (!$parent.hasClass('mbsc-segmented-item-ready')) {
            $segmentCont = $('<div class="mbsc-segmented mbsc-segmented-group mbsc-no-touch"></div>');

            $parent.after($segmentCont);
            $parent.parent().find('input[name="' + $elm.attr('name') + '"]').each(function () {
                const $input = $(this);

                $segment = $input.parent().addClass('mbsc-segmented-item mbsc-segmented-item-ready');

                $('<span class="mbsc-segmented-content">' +
                    ($input.attr('data-icon') ? '<span class="mbsc-ic mbsc-ic-' + $input.attr('data-icon') + '"></span>' : '') +
                    '</span>').append($segment.contents()).appendTo($segment);

                $segment.prepend($input);

                $segmentCont.append($segment);
            });
        }

        this._$rippleElm = $elm.next();
    }

    getClassElm() {
        return this._$elm.closest('.mbsc-segmented');
    }
}


// Init mbsc-segmented elements on page load
autoInit('[mbsc-segmented]', SegmentedItem);
