import { Form, MbscFormOptions } from '../classes/forms';
export { Form, MbscFormOptions };
import { Page, MbscPageOptions } from '../classes/page';
export { Page, MbscPageOptions };
import { Scroller, MbscScrollerOptions } from '../classes/scroller';
export { Scroller, MbscScrollerOptions };
import { Widget, MbscWidgetOptions } from '../classes/widget';
export { Widget, MbscWidgetOptions };

import { IMobiscroll as _IMobiscroll } from '../core/core';

export interface IMobiscroll extends _IMobiscroll {
    form(selector: string, options?: MbscFormOptions): Form;
    page(selector: string, options?: MbscPageOptions): Page;
    scroller(selector: string, options?: MbscScrollerOptions): Scroller;
    widget(selector: string, options?: MbscWidgetOptions): Widget;
}

export const mobiscroll: IMobiscroll;
export as namespace mobiscroll;
export default mobiscroll;
