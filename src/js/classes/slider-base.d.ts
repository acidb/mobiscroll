import { ProgressBase } from './progress-base';
import { MbscFormOptions } from './forms';

export class SliderBase extends ProgressBase<MbscFormOptions> {
    refresh(): void;
    getVal(): any;
    setVal(val: any, fill?: boolean, change?: boolean): void;
}