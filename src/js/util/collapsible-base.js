import { $, classes } from '../core/core';
import { tap } from '../util/tap';
import { hasTransition } from './dom.js';

var nr = 1;

export class CollapsibleBase {

    constructor(elm, settings) {
        let $elm = $(elm);
        this._$elm = $elm;
        this.settings = settings;

        this._isOpen = settings.isOpen || false;
        this._$accordionParent = $elm.parent('[mbsc-accordion], mbsc-accordion, .mbsc-accordion');

        $elm.addClass('mbsc-collapsible ' + (this._isOpen ? 'mbsc-collapsible-open' : ''));

        if ($elm.hasClass('mbsc-card')) {
            // card enhance
            this._$header = $elm.find('.mbsc-card-header').addClass('mbsc-collapsible-header');
            this._$content = $elm.find('.mbsc-card-content').addClass('mbsc-collapsible-content');
        } else if ($elm.hasClass('mbsc-form-group') || $elm.hasClass('mbsc-form-group-inset')) {
            // form group enhance
            this._$header = $elm.find('.mbsc-form-group-title').addClass('mbsc-collapsible-header');
            this._$content = $elm.find('.mbsc-form-group-content').addClass('mbsc-collapsible-content');
        } else {
            // if it is used independently
            this._$header = $elm.find('.mbsc-collapsible-header');
            this._$content = $elm.find('.mbsc-collapsible-content');
        }

        if (!this._$content[0].id) {
            this._$content[0].id = 'mbsc-collapsible-' + nr++;
        }

        if (this._$header) {
            let $collapsibleIcon = $('<span class="mbsc-collapsible-icon mbsc-ic mbsc-ic-arrow-down5"></span>');

            tap(this, this._$header, () => {
                this.collapse();
            });

            this._$header
                .attr('role', 'button')
                .attr('aria-expanded', this._isOpen)
                .attr('aria-controls', this._$content[0].id)
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

        $elm[0].mbscInst = this;

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    collapse(show) {
        const $elm = this._$elm;
        const removeHeight = () => {
            this._$content
                .off('transitionend', removeHeight)
                .css('height', '');
        };

        if (show === undefined) {
            show = !this._isOpen;
        }

        if ((show && this._isOpen) || (!show && !this._isOpen)) {
            return;
        }

        if (show) {
            if (hasTransition) {
                this._$content
                    .on('transitionend', removeHeight)
                    .css('height', this._$content[0].scrollHeight);
            }
            $elm.addClass('mbsc-collapsible-open');
        } else {
            if (hasTransition) {
                this._$content.css('height', getComputedStyle(this._$content[0]).height);
            }
            setTimeout(() => {
                this._$content.css('height', 0);
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
        this._$header.find('mbsc-collapsible-icon').remove();
        this._$elm.removeClass('mbsc-collapsible mbsc-collapsible-open');
        this._$header.removeClass('mbsc-collapsible-header');
        this._$content.removeClass('mbsc-collapsible-content');
    }
}

classes.CollapsibleBase = CollapsibleBase;
