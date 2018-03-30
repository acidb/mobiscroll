import { ProgressBase } from './progress-base';

export class Progress extends ProgressBase {
    constructor(element: any, settings: any);
    refresh(): void;
    getVal(): number;
    setVal(v: number, fill?: boolean, change?: boolean): void;
}