import { ProgressBase } from './progress-base';
import { MbscFormOptions } from './forms';

export class Progress extends ProgressBase<MbscFormOptions> {
    refresh(): void;
    getVal(): number;
    setVal(v: number, fill?: boolean, change?: boolean): void;
}