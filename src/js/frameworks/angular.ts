import { mobiscroll } from '../core/dom';
import {
    $, extend,
    MbscCoreOptions
} from '../core/core';
import { MbscFrameOptions } from '../classes/frame';
import { MbscScrollerOptions } from '../classes/scroller';
import {
    AfterViewInit,
    Component,
    ContentChild,
    ContentChildren,
    Directive,
    DoCheck,
    ElementRef,
    EventEmitter,
    forwardRef,
    Inject,
    Injectable,
    Input,
    NgModule,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    QueryList,
    SimpleChanges,
    ViewChild,
    ViewChildren,
    ViewContainerRef
} from '@angular/core';

// // angular2 import { trigger, state, animate, transition, style } from '@angular/core'; // Angular 2.x
// // angular2 /*
// import { trigger, state, animate, transition, style } from '@angular/animations'; // Angular 4.x
// // angular2 */

import { CommonModule } from '@angular/common';

import {
    NgControl,
    ControlValueAccessor,
    FormsModule
} from '@angular/forms';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { MbscFormValueBase } from '../forms.angular';

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
    private addRemoveSubject: Subject<any> = new Subject();

    notifyAddRemove(item: any) {
        this.addRemoveSubject.next(item);
    }

    onAddRemove(): Observable<any> {
        return this.addRemoveSubject.asObservable();
    }
}

class MbscBase implements AfterViewInit, OnDestroy {
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
    lang: string;
    @Input()
    rtl: boolean;
    @Input()
    responsive: object;
    @Output()
    onInit: EventEmitter<{ inst: any }> = new EventEmitter();
    @Output()
    onDestroy: EventEmitter<{ inst: any }> = new EventEmitter();

    inlineOptions(): MbscCoreOptions {
        return {
            cssClass: this.cssClass,
            theme: this.theme,
            lang: this.lang,
            rtl: this.rtl,
            responsive: this.responsive
        };
    }

    inlineEvents(): MbscCoreOptions {
        return {
            onInit: (event: { inst: any }, inst: any) => {
                event.inst = inst;
                this.onInit.emit(event);
            },
            onDestroy: (event: { inst: any }, inst: any) => {
                event.inst = inst;
                this.onDestroy.emit(event);
            }
        }
    }


    /**
     * Used to add theme classes to the host on components - the mbsc-input components need to have a wrapper
     * with that css classes for the style to work
     */
    setThemeClasses() {
        var themeClass = 'mbsc-control-ng mbsc-' + this._instance.settings.theme + (this._instance.settings._baseTheme ? ' mbsc-' + this._instance.settings._baseTheme : '');
        $(this.initialElem.nativeElement).addClass(themeClass);
    }

    /**
     * Reference to the initialized mobiscroll instance
     * For internal use only
     */
    _instance: any = null;

    /**
     * Reference to the html element the mobiscroll is initialized on. 
     */
    element: any = null;

    /**
     * Public getter for the mobiscroll instance
     */
    get instance(): any {
        return this._instance;
    }

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

    constructor(public initialElem: ElementRef) { }

    /* AfterViewInit Interface */

    /**
     * Called after the view is initialized.
     * All the elements are in the DOM and ready for the initialization of the mobiscroll.
     */
    ngAfterViewInit() {
        this.setElement();
    }


    /* OnDestroy Interface */

    ngOnDestroy() {
        if (this._instance) {
            this._instance.destroy();
        }
    }
}

abstract class MbscValueBase extends MbscBase {
    /**
     * This method is called when the model changes, and the new value should propagate
     * to mobiscroll instance.
     * Should be implemented by the decendant classes
     * @param v The new value to be set
     */
    abstract setNewValue(v: any): void;

    /**
     * Constructor for the base mobiscroll control
     * @param initialElem Reference to the initial element the directive is put on
     * @param zone Reference to the NgZone service
     */
    constructor(initialElem: ElementRef, protected zone: NgZone) {
        super(initialElem);
    }

    /**
     * Used to store the initial value of the model, until the mobiscroll instance is ready to take it
     */
    protected initialValue: any = undefined;

    /**
     * Saves the initial value when the instance is not ready yet.
     * In some cases the initial value is set when there is no view yet. 
     * This proxy function saves the initial value and calls the appropriate setNewValue.
     * NOTE: after the instance is created, a setVal should be called to set the initial value to the instance 
     * @param v The new value to set (it comes from the model)
     */
    protected setNewValueProxy(v: any) {
        if (!this._instance) {
            this.initialValue = v;
        }
        this.setNewValue(v);
    }
}

abstract class MbscCloneBase extends MbscValueBase implements DoCheck, OnInit {
    constructor(initElem: ElementRef, zone: NgZone) {
        super(initElem, zone);
    }

    cloneDictionary: any = {};
    makeClone(setting: string, value: Array<any>) {
        this.cloneDictionary[setting] = [];
        if (value) {
            for (let i = 0; i < value.length; i++) {
                this.cloneDictionary[setting].push(value[i]);
            }
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
                this._instance.settings[key] = (this as any)[key];
                changed = true;
                if (key == 'invalid') {
                    invalid = true;
                }
                if (key == 'data') {
                    data = true;
                }
            }
        }
        if (changed && this._instance) {
            if (invalid) {
                this._instance.option(this.cloneDictionary);
            } else if (data) {
                (this as any).refreshData((this as any).data);
            } else if (this._instance.redraw) {
                this._instance.redraw();
            }
        }
    }

    ngOnInit() {
        for (let key in this.cloneDictionary) {
            this.makeClone(key, (this as any)[key]);
        }
    }
}

abstract class MbscControlBase extends MbscCloneBase implements ControlValueAccessor {

    /**
     * Inputs needed for manualy editing the input element
     */
    @Input()
    showOnFocus: boolean;
    @Input()
    showOnTap: boolean;

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
                else if (this.initialElem.nativeElement.nodeName === "ION-INPUT") {
                    let v = this._view as any;
                    let ionInput = v && v._data && v._data.componentView && v._data.componentView.component;
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
    onChange: any = () => { };

    /**
     * This function has to be called when the control is touched, to notify the validators (if formControl is used)
     * It's overwritter in registerOnTouched
     */
    onTouch: any = () => { };

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
                if (that.element.value !== that._instance._value && that.enableManualEdit) {
                    that._instance.setVal(that.element.value, true, true);
                } else {
                    let value = that._instance.getVal();
                    if (that.control) {
                        that.onChange(value);
                        that.control.control.patchValue(value);
                    } else {
                        that.onChangeEmitter.emit(value);
                    }
                }
            })
        });
    }

    protected oldAccessor: any;

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
            setTimeout(() => {
                this.setNewValueProxy(v);
            });
        } else {
            this.setNewValueProxy(v);
        }
    }
}

abstract class MbscFrameBase extends MbscControlBase implements OnInit {
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
    disabled: boolean;
    @Input()
    display: 'top' | 'bottom' | 'bubble' | 'inline' | 'center';
    @Input()
    focusOnClose: boolean | string | HTMLElement;
    @Input()
    focusTrap: boolean;
    @Input()
    headerText: string | boolean | ((formattedValue: string) => string);
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

    inlineOptions(): MbscFrameOptions {
        return extend(super.inlineOptions(), {
            anchor: this.anchor,
            animate: this.animate,
            buttons: this.buttons,
            closeOnOverlayTap: this.closeOnOverlayTap,
            context: this.context,
            disabled: this.disabled,
            display: this.display,
            focusOnClose: this.focusOnClose,
            focusTrap: this.focusTrap,
            headerText: this.headerText,
            showOnFocus: this.showOnFocus,
            showOnTap: this.showOnTap,
            touchUi: this.touchUi
        });
    }

    inlineEvents(): MbscFrameOptions {
        return extend(super.inlineEvents(), {
            onBeforeClose: (event: { valueText: string, button: string, inst: any }, inst: any) => {
                event.inst = inst;
                this.onBeforeClose.emit(event);
            },
            onBeforeShow: (event: { inst: any }, inst: any) => {
                event.inst = inst;
                this.onBeforeShow.emit(event);
            },
            onCancel: (event: { valuteText: string, inst: any }, inst: any) => {
                event.inst = inst;
                this.onCancel.emit(event);
            },
            onClose: (event: { valueText: string, inst: any }, inst: any) => {
                event.inst = inst;
                this.onClose.emit(event);
            },
            onFill: (event: { inst: any }, inst: any) => {
                event.inst = inst;
                this.onFill.emit(event);
            },
            onMarkupReady: (event: { target: HTMLElement, inst: any }, inst: any) => {
                event.inst = inst;
                this.onMarkupReady.emit(event);
            },
            onPosition: (event: { target: HTMLElement, windowWidth: number, windowHeight: number, inst: any }, inst: any) => {
                event.inst = inst;
                this.onPosition.emit(event);
            },
            onShow: (event: { target: HTMLElement, valueText: string, inst: any }, inst: any) => {
                event.inst = inst;
                this.onShow.emit(event);
            }
        });
    }

    get inline(): boolean {
        return (this.display || this.options.display) === 'inline';
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

abstract class MbscScrollerBase extends MbscFrameBase {

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
    readOnly: boolean | Array<boolean>;
    @Input()
    rows: number;
    @Input()
    showLabel: boolean;
    @Input()
    showScrollArrows: boolean;
    @Input()
    wheels: Array<any>;
    @Input()
    width: number;

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

    inlineOptions(): MbscScrollerOptions {
        return extend(super.inlineOptions(), {
            circular: this.circular,
            height: this.height,
            layout: this.layout,
            maxWidth: this.maxWidth,
            minWidth: this.minWidth,
            multiline: this.multiline,
            readOnly: this.readOnly,
            rows: this.rows,
            showLabel: this.showLabel,
            showScrollArrows: this.showScrollArrows,
            wheels: this.wheels,
            width: this.width,
            cancelText: this.cancelText,
            clearText: this.clearText,
            selectedText: this.selectedText,
            setText: this.setText,
            validate: this.validate,
            formatValue: this.formatValue,
            parseValue: this.parseValue
        });
    }

    inlineEvents(): MbscScrollerOptions {
        return extend(super.inlineEvents(), {
            onChange: (event: { valueText?: string, inst: any }, inst: any) => {
                event.inst = inst;
                this.onWheelChange.emit(event);
            },
            onSet: (event: { valueText?: string, inst: any }, inst: any) => {
                event.inst = inst;
                this.onSet.emit(event);
            },
            onItemTap: (event: { inst: any }, inst: any) => {
                event.inst = inst;
                this.onItemTap.emit(event);
            },
            onClear: (event: { inst: any }, inst: any) => {
                event.inst = inst;
                this.onClear.emit(event);
            }
        })
    }


    constructor(initialElement: ElementRef, zone: NgZone, control: NgControl, _inputService: MbscInputService, view: ViewContainerRef) {
        super(initialElement, zone, control, _inputService, view);
    }
}

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
    } else {
        return d1 && d2 && d1.toString() === d2.toString();
    }
}

const INPUT_TEMPLATE = `<div *ngIf="inline"></div><mbsc-input *ngIf="!inline" 
    [controlNg]="false" [name]="name" [theme]="theme" [disabled]="disabled" [dropdown]="dropdown" [placeholder]="placeholder"
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

    INPUT_TEMPLATE,

    MbscBase,
    MbscValueBase,
    MbscCloneBase,
    MbscControlBase,
    MbscFrameBase,
    MbscScrollerBase,

    AfterViewInit,
    CommonModule,
    Component,
    ContentChild,
    ContentChildren,
    ControlValueAccessor,
    Directive,
    DoCheck,
    ElementRef,
    EventEmitter,
    FormsModule,
    forwardRef,
    Inject,
    Injectable,
    Input,
    NgControl,
    NgModule,
    NgZone,
    Observable,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    QueryList,
    SimpleChanges,
    Subject,
    ViewChild,
    ViewChildren,
    ViewContainerRef
    //trigger, state, animate, transition, style
}