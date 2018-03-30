import { ProgressBase } from './progress-base';
import { MbscCoreOptions } from '../core/core';

export class SliderBase extends ProgressBase {
    constructor(element: any, settings: MbscCoreOptions);
    refresh(): void;
    getVal(): any;
    setVal(val: any, fill?: boolean, change?: boolean): void;
}