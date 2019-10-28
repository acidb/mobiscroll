import { MbscCoreOptions } from '../core/core';
import { FormControl } from './form-control';

export interface MbscFormOptions extends MbscCoreOptions {
    inputStyle?: string;
    labelStyle?: string;
    enhance?: boolean;
    context?: string | HTMLElement;
}

export class Input extends FormControl {
    constructor(element: any, settings: MbscFormOptions);
    refresh(): void;
}