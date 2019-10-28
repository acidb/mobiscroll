import { Base, MbscCoreOptions } from '../core/core';

export interface MbscFrameOptions extends MbscCoreOptions {
    // Settings
    anchor?: string | HTMLElement;
    animate?: boolean | 'fade' | 'flip' | 'pop' | 'swing' | 'slidevertical' | 'slidehorizontal' | 'slidedown' | 'slideup';
    buttons?: Array<any>;
    closeOnOverlayTap?: boolean;
    context?: string | HTMLElement;
    disabled?: boolean;
    display?: 'top' | 'bottom' | 'bubble' | 'inline' | 'center';
    focusOnClose?: boolean | string | HTMLElement;
    focusTrap?: boolean;
    headerText?: string | boolean | ((formattedValue: string) => string);
    layout?: 'liquid' | 'fixed';
    scrollLock?: boolean;
    showOnFocus?: boolean;
    showOnTap?: boolean;
    showOverlay?: boolean;
    touchUi?: boolean;
    labelStyle?: 'stacked' | 'inline' | 'floating';
    inputStyle?: 'underline' | 'box' | 'outline';

    // Events
    onBeforeClose?(event: { valueText: string, button: string }, inst: any): void;
    onBeforeShow?(event: any, inst: any): void;
    onCancel?(event: { valuteText: string }, inst: any): void;
    onClose?(event: { valueText: string }, inst: any): void;
    onDestroy?(event: any, inst: any): void;
    onFill?(event: any, inst: any): void;
    onMarkupReady?(event: { target: HTMLElement }, inst: any): void;
    onPosition?(event: { target: HTMLElement, windowWidth: number, windowHeight: number }, inst: any): void;
    onShow?(event: { target: HTMLElement, valueText: string }, inst: any): void;

}

export interface MbscDataControlOptions {
    select?: 'single' | 'multiple' | number;
}

export type MbscDataFrameOptions = MbscDataControlOptions & MbscFrameOptions;

export class Frame<T extends MbscFrameOptions> extends Base<T> {
    buttons: object;
    handlers: {
        set: () => void,
        cancel: () => void,
        clear: () => void
    };
    _value: any;
    _isValid: boolean;
    _isVisible: boolean;

    position(check?: boolean): void;
    attachShow(elm: any, beforeShow?: () => void): void;
    select(): void;
    cancel(): void;
    clear(): void;
    enable(): void;
    disable(): void;
    show(prevAnim?: boolean, prevFocus?: boolean): void;
    hide(prevAnim?: boolean, btn?: string, force?: boolean, callback?: () => void): void;
    isVisible(): boolean;
}