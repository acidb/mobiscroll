import { Base, MbscCoreOptions } from '../core/core';

export class Stepper  extends Base {
    constructor(element: any, settings: MbscCoreOptions);

    getVal(): number;
    setVal(v: number, fill?: boolean, change?: boolean): void;
}