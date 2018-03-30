import { SliderBase } from './slider-base';
import { MbscFormOptions } from './forms';

export class Slider extends SliderBase {
    constructor(element: any, settings: MbscFormOptions);
    getVal(): number | Array<number>;
    setVal(v: number | Array<number>, fill?: boolean, change?: boolean): void;
}