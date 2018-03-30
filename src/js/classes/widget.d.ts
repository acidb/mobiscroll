import { Frame, MbscFrameOptions } from './frame';

export interface MbscWidgetOptions extends MbscFrameOptions { }

export class Widget extends Frame {
    settings: MbscWidgetOptions;
    constructor(element: any, settings: MbscWidgetOptions);
}
