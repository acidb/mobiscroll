import { $, classes } from '../core/core';
import { tap } from '../util/tap';
import { hasTransition } from './dom.js';

var nr = 1;

export class CollapsibleBase {

    constructor(elm, settings) {
        let content;
        let $header;
        let $content;
        let $elm = $(elm);

        this.settings = settings;

        this._isOpen = settings.isOpen || false;

        $elm.addClass('mbsc-collapsible ' + (this._isOpen ? 'mbsc-collapsible-open' : ''));

        if ($elm.hasClass('mbsc-card')) {
            // card enhance
            $header = $elm.find('.mbsc-card-header').eq(0).addClass('mbsc-collapsible-header');
            $content = $elm.find('.mbsc-card-content').eq(0).addClass('mbsc-collapsible-content');
        } else if ($elm.hasClass('mbsc-form-group') || $elm.hasClass('mbsc-form-group-inset')) {
            // form group enhance
            $header = $elm.find('.mbsc-form-group-title').eq(0).addClass('mbsc-collapsible-header');
            $content = $elm.find('.mbsc-form-group-content').eq(0).addClass('mbsc-collapsible-content');
        } else {
            // if it is used independently
            $header = $elm.find('.mbsc-collapsible-header').eq(0);
            $content = $elm.find('.mbsc-collapsible-content').eq(0);
        }

        content = $content[0];

        if (content && !content.id) {
            content.id = 'mbsc-collapsible-' + nr++;
        }

        if ($header.length && content) {
            let $collapsibleIcon = $('<span class="mbsc-collapsible-icon mbsc-ic mbsc-ic-arrow-down5"></span>');

            tap(this, $header, () => {
                this.collapse();
            });

            $header
                .attr('role', 'button')
                .attr('aria-expanded', this._isOpen)
                .attr('aria-controls', content.id)
                .attr('tabindex', '0')
                .on('mousedown', (ev) => {
                    // prevent focus on mouse down
                    ev.preventDefault();
                })
                .on('keydown', (ev) => {
                    if (ev.which === 32 || ev.keyCode == 13) { //space or enter 
                        ev.preventDefault();
                        this.collapse();
                    }
                })
                .append($collapsibleIcon);
        }

        elm.mbscInst = this;

        this._$header = $header;
        this._$content = $content;
        this._$elm = $elm;
        this._$accordionParent = $elm.parent('[mbsc-accordion], mbsc-accordion, .mbsc-accordion');

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    collapse(show) {
        const $elm = this._$elm;
        const $content = this._$content;
        const removeHeight = () => {
            $content
                .off('transitionend', removeHeight)
                .css('height', '');
        };

        if (show === undefined) {
            show = !this._isOpen;
        }

        if ((show && this._isOpen) || (!show && !this._isOpen) || !$content.length) {
            return;
        }

        if (show) {
            if (hasTransition) {
                $content
                    .on('transitionend', removeHeight)
                    .css('height', $content[0].scrollHeight);
            }
            $elm.addClass('mbsc-collapsible-open');
        } else {
            if (hasTransition) {
                $content.css('height', getComputedStyle($content[0]).height);
            }
            setTimeout(() => {
                $content.css('height', 0);
                $elm.removeClass('mbsc-collapsible-open');
            });
        }

        if (show && this._$accordionParent) {
            this._$accordionParent.find('.mbsc-collapsible-open').each(function () {
                if (this !== $elm[0]) {
                    this.mbscInst.hide();
                }
            });
        }

        this._isOpen = show;
        this._$header.attr('aria-expanded', this._isOpen);
    }

    show() {
        this.collapse(true);
    }

    hide() {
        this.collapse(false);
    }

    toggle() {
        this.collapse();
    }

    destroy() {
        this._$elm.removeClass('mbsc-collapsible mbsc-collapsible-open');
        this._$content.removeClass('mbsc-collapsible-content');
        this._$header
            .removeClass('mbsc-collapsible-header')
            .find('.mbsc-collapsible-icon').remove();
    }
}

classes.CollapsibleBase = CollapsibleBase;
