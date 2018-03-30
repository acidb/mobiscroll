import { Base, MbscCoreOptions } from '../core/core';

export interface MbscPageOptions extends MbscCoreOptions {
    // Settings
    context?: string | HTMLElement;
}

export class Page extends Base {
    settings: MbscPageOptions;
    constructor(element: any, settings: MbscPageOptions);
}