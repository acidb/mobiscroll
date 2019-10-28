import { Frame, MbscFrameOptions } from './frame';

export interface MbscPopupOptions extends MbscFrameOptions {
    okText?: string;
    onSet?(event: { valueText?: string }, inst: any): void;
}
export interface MbscWidgetOptions extends MbscPopupOptions { }

export class Popup extends Frame<MbscPopupOptions> {
}

export class Widget extends Popup {
    settings: MbscWidgetOptions;
    constructor(element: any, settings: MbscWidgetOptions);
}