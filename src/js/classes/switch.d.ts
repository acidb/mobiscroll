import { SliderBase } from './slider-base';
import { MbscFormOptions } from './forms';

export class Switch extends SliderBase {
    setVal(val: boolean, fill?: boolean, change?: boolean): void;
    getVal(): boolean;
}
