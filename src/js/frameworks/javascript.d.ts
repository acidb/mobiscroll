
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

import { IMobiscroll as _IMobiscroll } from '../core/core';

export interface IMobiscroll extends _IMobiscroll {
    form(selector: string | HTMLElement, options?: MbscFormOptions): Form;
    page(selector: string | HTMLElement, options?: MbscPageOptions): Page;
    scroller(selector: string | HTMLElement, options?: MbscScrollerOptions): Scroller;
    popup(selector: string | HTMLElement, options?: MbscPopupOptions): Popup;
    widget(selector: string | HTMLElement, options?: MbscWidgetOptions): Widget;
}

export const mobiscroll: IMobiscroll;
export as namespace mobiscroll;
export default mobiscroll;