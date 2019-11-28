import { mobiscroll, IMobiscroll } from './mobiscroll';
export { mobiscroll, IMobiscroll };
export const $: any;
export const extend: any;

export interface MbscCoreOptions {
    // Settings
    cssClass?: string;
    theme?: string;
    themeVariant?: 'auto' | 'dark' | 'light';
    lang?: string;
    rtl?: boolean;
    responsive?: object;
    tap?: boolean;

    // Events
    onInit?(event: any, inst: any): void;
    onDestroy?(event: any, inst: any): void;
}

export class Base<T extends MbscCoreOptions> {
    settings: T;

    constructor(element: any, settings: T);

    init(settings?: T): void;
    destroy(): void;
    tap(el: any, handler: (ev?: any, inst?: any) => void, prevent?: boolean, tolerance?: number, time?: any): void;
    trigger(name: string, event?: any): any;
    option(options: string | T, value?: any): void;
    getInst(): Base<T>;
}




