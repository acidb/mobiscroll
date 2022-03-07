import { mobiscroll } from '../core/dom';
import {
    $, extend,
    MbscCoreOptions
} from '../core/core';
import { MbscFrameOptions } from '../classes/frame';
import {
    AfterViewInit,
    // Component,
    // ContentChild,
    // ContentChildren,
    Directive,
    DoCheck,
    ElementRef,
    EventEmitter,
    // forwardRef,
    // Inject,
    Injectable,
    Input,
    // ModuleWithProviders,
    NgModule,
    NgZone,
    // OnChanges,
    OnDestroy,
    OnInit,
    // Optional,
    Output,
    // QueryList,
    SimpleChanges,
    // ViewChild,
    // ViewChildren,
    ViewContainerRef,
    // Injector,
    // ChangeDetectionStrategy,
    // ChangeDetectorRef
} from '@angular/core';

// // angular2 import { trigger, state, animate, transition, style } from '@angular/core'; // Angular 2.x
// // angular2 /*
// import { trigger, state, animate, transition, style } from '@angular/animations'; // Angular 4.x
// // angular2 */

import { CommonModule } from '@angular/common';

import {
    NgControl,
    ControlValueAccessor,
    // FormsModule
} from '@angular/forms';

import { Observable } from '../util/observable';

import { MbscFormValueBase } from '../input.angular';

export class MbscRouterToken { }

@Injectable()
export class MbscOptionsService {
    private _options: any;

    get options(): any {
        return this._options;
    }
    set options(o: any) {
        this._options = o;
    }
}

@Injectable()
export class MbscInputService {
    private _controlSet: boolean = false;
    get isControlSet(): boolean {
        return this._controlSet;
    }
    set isControlSet(v: boolean) {
        this._controlSet = v;
    }

    private _componentRef: MbscFormValueBase = undefined;
    get input(): MbscFormValueBase {
        return this._componentRef;
    }
    set input(v: MbscFormValueBase) {
        this._componentRef = v;
    }
}

@Injectable()
export class MbscListService {
    private addRemoveObservable: Observable<any> = new Observable();

    notifyAddRemove(item: any) {
        this.addRemoveObservable.next(item);
    }

    onAddRemove(): Observable<any> {
        return this.addRemoveObservable;
    }
}

@Directive({ selector: '[mbsc-b]' })
export class MbscBase implements AfterViewInit, OnDestroy {
    /**
     * The mobiscroll settings for the directive are passed through this input.
     */
    @Input('mbsc-options')
    options: MbscCoreOptions = {};

    @Input()
    cssClass: string;

    @Input()
    theme: string;

    @Input()
    themeVariant: 'auto' | 'dark' | 'light';

    @Input()
    lang: string;

    @Input()
    rtl: boolean;

    @Input()
    responsive: object;

    @Output()
    onInit: EventEmitter<{ inst: any }> = new EventEmitter();

    @Output()
    onDestroy: EventEmitter<{ inst: any }> = new EventEmitter();

    inlineOptionsObj: any = {};
    pendingValue: any = undefined;

    getInlineEvents() {
        for (let prop in this) {
            if ((this[prop] as any) instanceof (EventEmitter) && (!this.options || !((this.options as any)[prop]))) {
                this.inlineOptionsObj[prop] = (event: any, inst: any) => {
                    event.inst = inst;
                    (this[prop] as any).emit(event);
                };
            }
        }
    }

    /**
     * Used to add theme classes to the host on components - the mbsc-input components need to have a wrapper
     * with that css classes for the style to work
     */
    themeClassesSet = false;
    setThemeClasses() {
        $(this.initialElem.nativeElement).addClass(this.getThemeClasses());
        this.themeClassesSet = true;
    }
    clearThemeClasses() {
        $(this.initialElem.nativeElement).removeClass(this.getThemeClasses());
    }
    getThemeClasses() {
        let s = this.instance.settings;
        return 'mbsc-control-ng mbsc-' + s.theme + (s.baseTheme ? ' mbsc-' + s.baseTheme : '');
    }

    /**
     * Reference to the initialized mobiscroll instance
     */
    instance: any = null;

    /**
     * Reference to the html element the mobiscroll is initialized on.
     */
    element: any = null;

    /**
     * Sets the element, the mobiscroll should be initialized on
     * The initialElement is set if an input is not found inside of it.
     * NOTE: Should be called after the view was initialized!
     */
    protected setElement() {
        this.element = this.initialElem.nativeElement;
        let contentInput: any = $('input', this.initialElem.nativeElement);
        if (contentInput.length) {
            this.element = contentInput[0];
        }
    }


    constructor(public initialElem: ElementRef, protected zone: NgZone) {
        this.inlineOptionsObj.zone = zone;
    }

    /* AfterViewInit Interface */

    /**
     * Called after the view is initialized.
     * All the elements are in the DOM and ready for the initialization of the mobiscroll.
     */
    ngAfterViewInit() {
        this.setElement();
        this.startInit();
    }

    startInit() {
        this.getInlineEvents();
        let ionInput = this.getIonInput();
        if (ionInput && (ionInput.getInputElement || ionInput.then) && this.element.nodeName !== "INPUT") {
            if (ionInput.getInputElement) {
                ionInput.getInputElement().then((inp: any) => {
                    this.setElement();
                    this.initControl();
                });
            } else { // in the case of angular 9 the `ionInput` will be a promise that resolve with the ion-input instance
                ionInput.then((ionInpComponent: any) => {
                    ionInpComponent
                        .getInputElement()
                        .then((inp: any) => {
                            this.setElement();
                            this.initControl();
                        });
                });
            }
        } else if (!this.instance) {
            this.initControl();
        }
    }

    /**
     * Returns either the ion input component, or a promise that resolves with it or falsy if there's no ion-input
     *
     * NOTE: Starting from Angular 9, the ViewContainerRef no longer has the reference to the component. The component
     * instance in these cases can be aquired (not officially) from the nativeElement like below (componentOnReady fn.).
     */
    getIonInput() {
        const v = (this as any)._view;
        const native = this.initialElem.nativeElement;
        const ionInputNode = native.nodeName === "ION-INPUT";
        const inp1 = ionInputNode && v && v._data && v._data.componentView && v._data.componentView.component;
        const inp2 = ionInputNode && native.componentOnReady && native.componentOnReady();
        return inp1 || inp2;
    }

    initControl() { }

    /* OnDestroy Interface */

    ngOnDestroy() {
        if (this.instance) {
            this.instance.destroy();
        }
    }

    updateOptions(newOptions: any, optionChanged: boolean, invalidChanged: boolean, dataChanged: boolean) {
        if (optionChanged || invalidChanged) {
            setTimeout(() => {
                if (newOptions.theme && this.themeClassesSet) {
                    this.clearThemeClasses();
                }
                this.instance.option(newOptions, undefined, this.pendingValue);
                if (newOptions.theme && this.themeClassesSet) {
                    this.setThemeClasses();
                }
            });
        } else if (dataChanged) {
            (this as any).refreshData((this as any).data);
        } else if (this.instance.redraw) {
            this.instance.redraw();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        var optionChange = false,
            cloneChange = false,
            invalidChange = false,
            dataChange = false,
            newOptions: any = {};
        for (var prop in changes) {
            if (!changes[prop].firstChange && prop !== 'options' && prop !== 'value') {
                if ((this as any).cloneDictionary && (this as any).cloneDictionary[prop]) {
                    (this as any).makeClone(prop, changes[prop].currentValue);
                    if (this.instance) { // do we need this check?
                        this.instance.settings[prop] = changes[prop].currentValue;
                    }
                    if (prop == 'invalid') {
                        invalidChange = true;
                    }
                    if (prop == 'data') {
                        dataChange = true;
                    }
                    cloneChange = true;
                } else {
                    newOptions[prop] = changes[prop].currentValue;
                    optionChange = true;
                }
            } else if (!changes[prop].firstChange && prop !== 'value') {
                newOptions = extend(changes[prop].currentValue, newOptions);
                optionChange = true;
            } else if (changes[prop].firstChange) {
                if (prop !== 'options' && prop !== 'value') {
                    this.inlineOptionsObj[prop] = changes[prop].currentValue;
                }
            }
        }
        if (cloneChange) {
            extend(newOptions, (this as any).cloneDictionary);
        }
        if (optionChange || cloneChange) {
            this.updateOptions(newOptions, optionChange, invalidChange, dataChange);
        }
    }
}

@Directive({ selector: '[mbsc-v-b]' })
export class MbscValueBase extends MbscBase {
    /**
     * This method is called when the model changes, and the new value should propagate
     * to mobiscroll instance.
     * Should be implemented by the decendant classes
     * @param v The new value to be set
     */
    setNewValue(v: any): void { };

    /**
     * Constructor for the base mobiscroll control
     * @param initialElem Reference to the initial element the directive is put on
     * @param zone Reference to the NgZone service
     */
    constructor(initialElem: ElementRef, zone: NgZone) {
        super(initialElem, zone);
    }

    /**
     * Used to store the initial value of the model, until the mobiscroll instance is ready to take it
     */
    initialValue: any = undefined;

    /**
     * Saves the initial value when the instance is not ready yet.
     * In some cases the initial value is set when there is no view yet.
     * This proxy function saves the initial value and calls the appropriate setNewValue.
     * NOTE: after the instance is created, a setVal should be called to set the initial value to the instance
     * @param v The new value to set (it comes from the model)
     */
    protected setNewValueProxy(v: any) {
        if (!this.instance) {
            this.initialValue = v;
        }
        this.setNewValue(v);
    }
}

@Directive({ selector: '[mbsc-c-b]' })
export class MbscCloneBase extends MbscValueBase implements DoCheck, OnInit {
    constructor(initElem: ElementRef, zone: NgZone) {
        super(initElem, zone);
    }

    cloneDictionary: any = {};
    makeClone(setting: string, value: Array<any>) {
        if (value) {
            this.cloneDictionary[setting] = [];
            for (let i = 0; i < value.length; i++) {
                this.cloneDictionary[setting].push(value[i]);
            }
        } else {
            this.cloneDictionary[setting] = value;
        }
    }

    /**
     * Runs in every cycle and checks if the options changed from a previous value
     * The previous values are cloned and stored in the cloneDictionary
     * Checks for options only specified in the cloneDictionary
     */
    ngDoCheck() {
        let changed = false,
            data = false,
            invalid = false;

        for (let key in this.cloneDictionary) {
            if ((this as any)[key] !== undefined && !deepEqualsArray((this as any)[key], this.cloneDictionary[key])) {
                this.makeClone(key, (this as any)[key]);
                this.instance.settings[key] = (this as any)[key];
                changed = true;
                if (key == 'invalid') {
                    invalid = true;
                }
                if (key == 'data') {
                    data = true;
                }
            }
        }
        if (changed && this.instance) {
            this.updateOptions(this.cloneDictionary, false, invalid, data);
        }
    }

    ngOnInit() {
        for (let key in this.cloneDictionary) {
            this.makeClone(key, (this as any)[key]);
        }
    }
}

@Directive({ selector: '[mbsc-cc-b]' })
export class MbscControlBase extends MbscCloneBase implements ControlValueAccessor {

    // Not part of settings

    @Input('label-style')
    labelStyle: 'stacked' | 'inline' | 'floating';
    @Input('input-style')
    inputStyle: 'underline' | 'box' | 'outline';

    /**
     * Inputs needed for manualy editing the input element
     */
    @Input()
    showOnFocus: boolean;
    @Input()
    showOnTap: boolean;

    /**
     * Used to disable the control state in components
     */
    @Input()
    disabled: boolean;

    /**
     * Returns an object containing the extensions of the option object
     */
    get optionExtensions(): any {
        let externalOnClose = this.options && (this.options as any).onClose;
        let externalOnFill = this.options && (this.options as any).onFill;
        let onCloseEmitter = (this as any).onClose;
        return {
            onFill: (event: any, inst: any) => {
                // call the oldAccessor writeValue if it was overwritten
                if (this.oldAccessor) {
                    this.oldAccessor.writeValue(event.valueText);
                }
                else {
                    let ionInput = this.getIonInput();
                    if (ionInput) {
                        ionInput.value = event.valueText;
                    }
                }
                if (externalOnFill) {
                    externalOnFill(event, inst);
                }
            },
            onClose: (event: any, inst: any) => {
                // Call the onTouch function when the scroller closes - sets the form control touched
                this.onTouch();
                if (externalOnClose) {
                    externalOnClose(event, inst);
                }

                if (onCloseEmitter) {
                    event.inst = inst;
                    (onCloseEmitter as EventEmitter<{ inst: any }>).emit(event);
                }
            }
        }
    }

    get enableManualEdit(): boolean {
        var nsf = this.showOnFocus === false || (this.options as any).showOnFocus === false,
            nst = this.showOnTap === false || (this.options as any).showOnTap === false;
        return nsf && nst;
    }

    _needsTimeout: boolean = true;
    /**
     * This function propagates the value to the model
     * It's overwrittem in registerOnChange (if formControl is used)
     */
    onChange: (value: any) => any = () => { };

    /**
     * This function has to be called when the control is touched, to notify the validators (if formControl is used)
     * It's overwritter in registerOnTouched
     */
    onTouch: (ev?: any) => any = () => { };

    /**
     * EventEmitter for the value change
     * Used only without FormControl
     */
    onChangeEmitter: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Registers the change event handler on the element
     * Patches the FormControl value or emits the change emitter depending on
     * whether the FormControl is used or not
     */
    protected handleChange(element?: any): void {
        let that = this;
        $(element || this.element).on('change', function () {
            that.zone.run(function () {
                const elmValue = that.element.value;
                const instValue = that.instance._value;
                // the element's value cannot be null, if the element is empty, it will be an empty string
                // also the instance _value cannot be an empty string, bc. if the value is empty, under the hood
                // the _value will be set to null
                // SO the null and '' values are treated as equal, and there should not be a setVal call when these are to be used,
                // otherwise it will be an infinite loop.
                if (elmValue !== instValue && (instValue !== null || elmValue !== '') && that.enableManualEdit) {
                    that.instance.setVal(elmValue, true, true);
                } else {
                    let value = that.instance.getVal();
                    if (that.control) {
                        if (!valueEquals(value, (that.control as any).model)) {
                            that.onChange(value);
                            that.control.control.patchValue(value);
                        }
                    } else {
                        that.onChangeEmitter.emit(value);
                    }
                }
            })
        });
        function valueEquals(v1: any, v2: any) {
            if (v1 === v2) {
                return true;
            }
            if (v1 instanceof Date && v2 instanceof Date) {
                return (+v1) === (+v2);
            }
            return false;
        }
    }

    public oldAccessor: any = null;

    /**
     * Constructs the Base Control for value changes
     * @param initialElement Reference to the initial element the directive is used on
     * @param zone Reference to the NgZone service
     * @param control Reference to the FormControl if used (ngModel or formControl)
     */
    constructor(initialElement: ElementRef, zone: NgZone, protected control: NgControl, public _inputService: MbscInputService, public _view: ViewContainerRef) {
        super(initialElement, zone);

        this.overwriteAccessor();

        if (_inputService) {
            _inputService.isControlSet = true;
        }
    }

    overwriteAccessor() {
        if (this.control) {
            if (this.control.valueAccessor !== this) {
                this.oldAccessor = this.control.valueAccessor;
            }
            this.control.valueAccessor = this;
        }
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();

        this.handleChange();

        this.overwriteAccessor();

        // Register the control again to overwrite onTouch and onChange
        if (this.control && (this.control as any)._setUpControl) {
            (this.control as any)._setUpControl();
        }
    }


    /* ControlValueAccessor Interface */

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        if (this.oldAccessor && this.oldAccessor.setDisabledState) {
            this.oldAccessor.setDisabledState(isDisabled);
        }
        if (this.instance && this.instance.disable && this.instance.enable) {
            if (isDisabled) {
                this.instance.disable();
            } else {
                this.instance.enable();
            }
        }
    }

    /**
     * Called when the model changed
     * @param v the new value of the model
     */
    writeValue(v: any): void {
        if (this._needsTimeout) {
            this.pendingValue = v;
            setTimeout(() => {
                this.pendingValue = undefined;
                this.setNewValueProxy(v);
            });
        } else {
            this.setNewValueProxy(v);
        }
    }
}

@Directive({ selector: '[mbsc-fr-b]' })
export class MbscFrameBase extends MbscControlBase implements OnInit {
    @Input()
    options: MbscFrameOptions;

    @Input()
    dropdown: boolean;

    // Settings

    @Input()
    anchor: string | HTMLElement;
    @Input()
    animate: boolean | 'fade' | 'flip' | 'pop' | 'swing' | 'slidevertical' | 'slidehorizontal' | 'slidedown' | 'slideup';
    @Input()
    buttons: Array<any>;
    @Input()
    closeOnOverlayTap: boolean;
    @Input()
    context: string | HTMLElement;
    @Input()
    display: 'top' | 'bottom' | 'bubble' | 'inline' | 'center';
    @Input()
    showInput: boolean;
    @Input()
    focusOnClose: boolean | string | HTMLElement;
    @Input()
    focusTrap: boolean;
    @Input()
    headerText: string | boolean | ((formattedValue: string) => string);
    @Input()
    scrollLock: boolean;
    @Input()
    touchUi: boolean;

    // Events

    @Output()
    onBeforeClose: EventEmitter<{ valueText: string, button: string, inst: any }> = new EventEmitter();
    @Output()
    onBeforeShow: EventEmitter<{ inst: any }> = new EventEmitter();
    @Output()
    onCancel: EventEmitter<{ valuteText: string, inst: any }> = new EventEmitter();
    @Output()
    onClose: EventEmitter<{ valueText: string, inst: any }> = new EventEmitter();
    @Output()
    onFill: EventEmitter<{ inst: any }> = new EventEmitter();
    @Output()
    onMarkupReady: EventEmitter<{ target: HTMLElement, inst: any }> = new EventEmitter();
    @Output()
    onPosition: EventEmitter<{ target: HTMLElement, windowWidth: number, windowHeight: number, inst: any }> = new EventEmitter();
    @Output()
    onShow: EventEmitter<{ target: HTMLElement, valueText: string, inst: any }> = new EventEmitter();

    get inline(): boolean {
        return (this.display || (this.options && this.options.display)) === 'inline';
    }

    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, _inputService: MbscInputService, view: ViewContainerRef) {
        super(initialElem, zone, control, _inputService, view);
    }

    ngOnInit() {
        this.cloneDictionary.invalid = [];
        this.cloneDictionary.valid = [];
        super.ngOnInit();
    }
}

@Directive({ selector: '[mbsc-s-b]' })
export class MbscScrollerBase extends MbscFrameBase {

    // Settings

    @Input()
    circular: boolean | Array<boolean>;
    @Input()
    height: number;
    @Input()
    layout: 'liquid' | 'fixed';
    @Input()
    maxWidth: number | Array<number>;
    @Input()
    minWidth: number | Array<number>;
    @Input()
    multiline: number;
    @Input()
    readonly: boolean | Array<boolean>;
    @Input()
    rows: number;
    @Input()
    showLabel: boolean;
    @Input()
    showScrollArrows: boolean;
    @Input()
    wheels: Array<any>;
    @Input()
    width: number | Array<number>;

    /** Special event handler for validation
     * Needs to support return parameters, so it needs to be an @Input
     */
    @Input()
    validate: (event: { values: Array<any>, index: number, direction: number }, inst: any) => (void | { disabled?: Array<any>, valid?: Array<any> });

    // Localization settings

    @Input()
    cancelText: string;
    @Input()
    clearText: string;
    @Input()
    selectedText: string;
    @Input()
    setText: string;

    @Input()
    formatValue: (data: Array<any>) => string;
    @Input()
    parseValue: (valueText: string) => any;

    // Events

    @Output('onChange')
    onWheelChange: EventEmitter<{ valueText?: string, inst: any }> = new EventEmitter();
    @Output()
    onSet: EventEmitter<{ valueText?: string, inst: any }> = new EventEmitter();
    @Output()
    onItemTap: EventEmitter<{ inst: any }> = new EventEmitter();
    @Output()
    onClear: EventEmitter<{ inst: any }> = new EventEmitter();

    constructor(initialElement: ElementRef, zone: NgZone, control: NgControl, _inputService: MbscInputService, view: ViewContainerRef) {
        super(initialElement, zone, control, _inputService, view);
    }
}

@NgModule({
    imports: [CommonModule],
    declarations: [MbscBase, MbscValueBase, MbscCloneBase, MbscControlBase],
})
export class MbscBaseModule { }

@NgModule({
    imports: [CommonModule, MbscBaseModule],
    declarations: [MbscFrameBase],
})
export class MbscFrameBaseModule { }

@NgModule({
    imports: [CommonModule, MbscFrameBaseModule],
    declarations: [MbscScrollerBase],
})
export class MbscScrollerBaseModule { }

function deepEqualsArray(a1: Array<any>, a2: Array<any>): boolean {
    if (a1 === a2) {
        return true;
    } else if (!a1 || !a2 || a1.length !== a2.length) {
        return false;
    } else {
        for (let i = 0; i < a1.length; i++) {
            if (a1[i] !== a2[i]) {
                return false;
            }
        }
        return true;
    }
}

function isDateEqual(d1: any, d2: any): boolean {
    if ((d1 && !d2) || (d2 && !d1)) { // one of them is truthy and other is not
        return false;
    } else if (!d1 && !d2) {
        return true; // both of them are falsy
    } else {
        return d1 && d2 && d1.toString() === d2.toString();
    }
}

/**
 * Checks if the value passed is empty or the true string.
 * Used for determining if certain attributes are used on components.
 * FYI: when an attribute is used without a value, empty string is provided to this function. Ex. readonly
 * @param val The value of the attribute.
 */
function emptyOrTrue(val: any) {
    return (typeof (val) === 'string' && (val === 'true' || val === '')) || !!val;
}

const INPUT_TEMPLATE = `<mbsc-input *ngIf="!inline || showInput"
    [controlNg]="false" [name]="name" [theme]="theme" [themeVariant]="themeVariant" [label-style]="labelStyle" [input-style]="inputStyle" [disabled]="disabled" [dropdown]="dropdown" [placeholder]="placeholder"
    [error]="error" [errorMessage]="errorMessage"
    [icon]="inputIcon" [icon-align]="iconAlign">
    <ng-content></ng-content>
</mbsc-input>`;

export {
    $,
    extend,
    mobiscroll,
    deepEqualsArray,
    isDateEqual,
    emptyOrTrue,

    INPUT_TEMPLATE,

    // AfterViewInit,
    // CommonModule,
    // Component,
    // ContentChild,
    // ContentChildren,
    // ControlValueAccessor,
    // Directive,
    // DoCheck,
    // ElementRef,
    // EventEmitter,
    // FormsModule,
    // forwardRef,
    // Inject,
    // Injectable,
    // Input,
    // ModuleWithProviders,
    // NgControl,
    // NgModule,
    // NgZone,
    Observable,
    // OnChanges,
    // OnDestroy,
    // OnInit,
    // Optional,
    // Output,
    // QueryList,
    // SimpleChanges,
    // ViewChild,
    // ViewChildren,
    // ViewContainerRef,
    // Injector,
    // ChangeDetectionStrategy,
    // ChangeDetectorRef,
    //trigger, state, animate, transition, style
}