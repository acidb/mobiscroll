import mobiscroll from './mobiscroll';
export default mobiscroll;
export const $: any;
export const extend: any;

export interface MbscCoreOptions {
    // Settings
    theme?: string;
    lang?: string;
    rtl?: boolean;

    // Events
    onInit?(event: any, inst: any): void;
    onDestroy?(event: any, inst: any): void;
}

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
    showOnFocus?: boolean;
    showOnTap?: boolean;

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

export interface MbscScrollerOptions extends MbscFrameOptions {
    // Settings
    circular?: boolean | Array<boolean>;
    height?: number;
    layout?: 'liquid' | 'fixed';
    maxWidth?: number | Array<number>;
    minWidth?: number | Array<number>;
    multiline?: number;
    readOnly?: boolean | Array<boolean>;
    rows?: number;
    showLabel?: boolean;
    showScrollArrows?: boolean;
    wheels?: Array<any>;
    width?: number;

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
}

export interface MbscDataControlOptions {
    select?: 'single' | 'multiple' | number;
}

export type MbscDataFrameOptions = MbscDataControlOptions & MbscFrameOptions;

export interface MbscDatetimeOptions extends MbscScrollerOptions {
    // Settings
    defaultValue?: Date | Array<Date>;
    invalid?: Array<string | { start: Date, end: Date, d?: string } | Date>;
    max?: Date;
    min?: Date;
    steps?: { hour?: number, minute?: number, second?: number, zeroBased?: boolean };
    valid?: Array<string | { start: Date, end: Date, d?: string } | Date>;

    // localization
    ampmText?: string;
    amText?: string;
    dateFormat?: string;
    dateWheels?: string;
    dayNames?: Array<string>;
    dayNamesShort?: Array<string>;
    dayText?: string;
    hourText?: string;
    minuteText?: string;
    monthNames?: Array<string>;
    monthNamesShort?: Array<string>;
    monthSuffix?: string;
    monthText?: string;
    nowText?: string;
    pmText?: string;
    secText?: string;
    timeFormat?: string;
    timeWheels?: string;
    yearSuffix?: string;
    yearText?: string;
}

export interface MbscCalbaseOptions extends MbscDatetimeOptions {
    // Settings
    calendarHeight?: number;
    calendarWidth?: number;
    calendarScroll?: 'horizontal' | 'vertical';
    counter?: boolean;
    defaultValue?: Date | Array<Date>;
    months?: number | 'auto';
    outerMonthChange?: boolean;
    showOuterDays?: boolean;
    tabs?: boolean;
    weekCounter?: 'year' | 'month';
    weekDays?: 'full' | 'short' | 'min';
    yearChange?: boolean;

    // localization
    calendarText?: string;
    dateText?: string;
    dayNamesMin?: Array<string>;
    firstDay?: number;
    timeText?: string;

    // Events
    onTabChange?(event: { tab: 'calendar' | 'date' | 'time' }, inst: any): void;
    onDayChange?(event: { date: Date, marked?: any, selected?: 'start' | 'end', target: HTMLElement }, inst: any): void;
    onMonthChange?(event: { year: number, month: number }, inst: any): void;
    onMonthLoading?(event: { year: number, month: number }, inst: any): void;
    onMonthLoaded?(event: { year: number, month: number }, inst: any): void;
}