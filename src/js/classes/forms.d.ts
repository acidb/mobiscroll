import { Base, MbscCoreOptions } from '../core/core';
import '../util/notifications';

export interface MbscFormOptions extends MbscCoreOptions {
    inputStyle?: string;
    labelStyle?: string;
}

export class Form extends Base {
    settings: MbscFormOptions;
    constructor(element: any, settings: MbscFormOptions);
    refresh(shallow?: boolean): void;
}