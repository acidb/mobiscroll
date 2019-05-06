import { Frame, MbscFrameOptions } from './frame';

export interface MbscScrollerOptions extends MbscFrameOptions {
    // Settings
    circular?: boolean | Array<boolean>;
    height?: number;
    maxWidth?: number | Array<number>;
    minWidth?: number | Array<number>;
    multiline?: number;
    readOnly?: boolean | Array<boolean>;
    rows?: number;
    showLabel?: boolean;
    showScrollArrows?: boolean;
    wheels?: {
        [index: number]: {
            [index: number]: {
                label?: string,
                key?: string | number,
                circular?: boolean,
                cssClass?: string,
                data: Array<string | { display: string, value: any }> | ((index: number) => string | { display: string, value: any }),
                getIndex?: (value: any) => number
            }
        }
    };
    width?: number | Array<number>;

    // Events
    onChange?(event: { valueText?: string }, inst: any): void;
    validate?(data: { values: Array<any>, index: number, direction: number }, inst: any): (void | { disabled?: Array<any>, valid?: Array<any> });
    onSet?(event: { valueText?: string }, inst: any): void;
    onItemTap?(event: any, inst: any): void;
    onClear?(event: any, inst: any): void;

    // localization
    cancelText?: string;
    clearText?: string;
    selectedText?: string;
    setText?: string;

    formatValue?(data: Array<any>): string;
    parseValue?(valueText: string): any;
}

export class Scroller extends Frame {
    settings: MbscScrollerOptions;

    constructor(element: any, settings: MbscScrollerOptions);

    setVal(value: any, fill?: boolean, change?: boolean, temp?: boolean, time?: number): void;
    getVal(temp?: boolean): any;
    setArrayVal(value: any, fill?: boolean, change?: boolean, temp?: boolean, time?: number): void;
    getArrayVal(temo?: boolean): any;
    changeWheel(
        wheels: {
            [index: number]: {
                label?: string,
                key?: string | number,
                circular?: boolean,
                cssClass?: string,
                data: Array<string | { display: string, value: any }> | ((index: number) => string | { display: string, value: any }),
                getIndex?: (value: any) => number
            },
            [index: string]: {
                label?: string,
                key?: string | number,
                circular?: boolean,
                cssClass?: string,
                data: Array<string | { display: string, value: any }> | ((index: number) => string | { display: string, value: any }),
                getIndex?: (value: any) => number
            }
        },
        time: number,
        manual?: boolean): void;
    getValidValue(index?: number, val?: any, dir?: any, dis?: boolean): any;
}
