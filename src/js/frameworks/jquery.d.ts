
import { Form, MbscFormOptions } from '../classes/forms';
export { Form, MbscFormOptions };
import { Page, MbscPageOptions } from '../classes/page';
export { Page, MbscPageOptions };
import { Scroller, MbscScrollerOptions } from '../classes/scroller';
export { Scroller, MbscScrollerOptions };
import { Widget, MbscWidgetOptions } from '../classes/popup';
export { Widget, MbscWidgetOptions };
import { Popup, MbscPopupOptions } from '../classes/popup';
export { Popup, MbscPopupOptions };

export { IMobiscroll } from '../core/core';
export { mobiscroll as default } from '../core/core';

declare global {
    interface MobiscrollBundle {
        [index: number]: JQuery;
        form(options?: MbscFormOptions): JQuery;
        page(options?: MbscPageOptions): JQuery;
        scroller(options?: MbscScrollerOptions): JQuery;
        popup(options?: MbscPopupOptions): JQuery;
        widget(options?: MbscWidgetOptions): JQuery;
    }

    interface JQuery {
        mobiscroll(): MobiscrollBundle;
        mobiscroll(option: string): any;
    }
}