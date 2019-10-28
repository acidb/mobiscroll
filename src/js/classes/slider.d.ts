import { SliderBase } from './slider-base';
import { MbscFormOptions } from './forms';

export class Slider extends SliderBase {
    getVal(): number | Array<number>;
    setVal(v: number | Array<number>, fill?: boolean, change?: boolean): void;
}
