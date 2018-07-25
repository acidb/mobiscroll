import { Frame, MbscFrameOptions } from './frame';

export interface MbscPopupOptions extends MbscFrameOptions { }
export interface MbscWidgetOptions extends MbscPopupOptions { }

export class Popup extends Frame {
    settings: MbscPopupOptions;
    constructor(element: any, settings: MbscPopupOptions);
}

export class Widget extends Popup {
    settings: MbscWidgetOptions;
    constructor(element: any, settings: MbscWidgetOptions);
}