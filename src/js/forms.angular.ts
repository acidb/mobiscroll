import {
    Directive,
    Component,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    NgZone,
    Optional,
    QueryList,
    Injectable,
    OnInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    ViewChild,
    ViewChildren,
    NgModule,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl } from '@angular/forms';
import {
    extend,
    MbscBase,
    MbscBaseModule,
    MbscControlBase,
    deepEqualsArray,
    Observable,
    MbscInputService,
    MbscOptionsService,
    emptyOrTrue
} from './frameworks/angular';

import { Form } from './classes/forms';
import { TextArea } from './classes/textarea';
import { Select } from './classes/select';
import { Button } from './classes/button';
import { CheckBox } from './classes/checkbox';
import { Switch } from './classes/switch';
import { Stepper } from './classes/stepper';
import { Progress } from './classes/progress';
import { Radio } from './classes/radio';
import { SegmentedItem } from './classes/segmented';
import { Slider } from './classes/slider';
import { Rating } from './classes/rating';

import { MbscFormOptions } from './classes/forms';

export { MbscFormOptions };

import { CollapsibleBase } from './util/collapsible-base.js';
import { FormsModule } from '@angular/forms';

import { MbscInputModule, MbscInputBase, MbscFormValueBase, MbscFormBase, MbscInput } from './input.angular';

export { MbscInput };

@Component({
    selector: 'mbsc-form',
    template: `<div #rootElement><ng-content></ng-content></div>`,
    providers: [MbscOptionsService],
    exportAs: 'mobiscroll'
})
export class MbscForm extends MbscBase implements OnInit {
    private optionsObj: MbscFormOptions;
    instance: Form;

    @Input('options')
    options: MbscFormOptions;

    @Input()
    enhance: boolean = false;

    @Input()
    context: string | HTMLElement;

    /**
     *  Specify the inputStyle.
    */
    @Input('input-style')
    inputStyle: string;

    /**
     *  Specify the labelStyle.
    */
    @Input('label-style')
    labelStyle: string;

    @ViewChild('rootElement', { static: false } as any)
    rootElem: ElementRef;

    constructor(initialElem: ElementRef, private _formService: MbscOptionsService, zone: NgZone) {
        super(initialElem, zone);
    }

    ngOnInit() {
        // make the options available for the children components
        // Note: inline evens should not be inherited
        this.optionsObj = extend({}, this.options, this.inlineOptionsObj);
        this._formService.options = this.optionsObj;
    }

    initControl() {
        const opt = this.options;
        if (opt && opt.enhance === undefined) {
            opt.enhance = false;
        }
        const options = extend({}, opt, this.inlineOptionsObj);
        this.instance = new Form(this.rootElem.nativeElement, options);
    }
}

@Component({
    selector: 'mbsc-textarea',
    host: { 'class': 'mbsc-control-ng' },
    template: `
            <label 
                [class.mbsc-err]="error"
                [class.mbsc-input-box]="inputStyle == 'box'"
                [class.mbsc-input-outline]="inputStyle == 'outline'"
                [class.mbsc-label-stacked]="labelStyle == 'stacked'"
                [class.mbsc-label-inline]="labelStyle == 'inline'"
                [class.mbsc-label-floating]="labelStyle == 'floating'"
            >
            <ng-content></ng-content>
            <span class="mbsc-input-wrap">
                <textarea #initElement [placeholder]="placeholder" [(ngModel)]="innerValue" (blur)="onTouch($event)"
                    [attr.name]="name"
                    [attr.rows]="rows"
                    [attr.wrap]="wrap"
                    [attr.minlength]="minlength"
                    [attr.maxlength]="maxlength"
                    [attr.autocomplete]="autocomplete" 
                    [attr.autocapitalize]="autocapitalize"
                    [attr.autocorrect]="autocorrect"
                    [attr.spellcheck]="spellcheck"
                    [attr.autofocus]="autofocus"
                    [attr.required]="required"
                    [attr.data-icon]="icon ? icon : null"
                    [attr.data-icon-align]="iconAlign ? iconAlign : null"
                    [disabled]="disabled"
                    [readonly]="_readonly"></textarea>
                <span *ngIf="error && errorMessage" class="mbsc-err-msg">{{errorMessage}}</span>
            </span>
        </label>
    `,
    providers: [MbscInputService]
})
export class MbscTextarea extends MbscInputBase {
    instance: TextArea;

    @Input()
    rows: number | string;
    @Input()
    wrap: 'hard' | 'soft' | 'off';

    constructor(initialElem: ElementRef, @Optional() _formService: MbscOptionsService, protected _inputService: MbscInputService, @Optional() _control: NgControl, zone: NgZone) {
        super(initialElem, _formService, _inputService, _control, zone);
        _inputService.input = this;
    }

    initControl() {
        let options = extend({}, this._inheritedOptions, this.options, this.inlineOptionsObj);
        this.instance = new TextArea(this._initElem.nativeElement, options);
    }
}


@Component({
    selector: 'mbsc-dropdown',
    host: { 'class': 'mbsc-control-ng' },
    template: `
            <label 
                [class.mbsc-err]="error"
                [class.mbsc-input-box]="inputStyle == 'box'"
                [class.mbsc-input-outline]="inputStyle == 'outline'"
                [class.mbsc-label-stacked]="labelStyle == 'stacked'"
                [class.mbsc-label-inline]="labelStyle == 'inline'"
                [class.mbsc-label-floating]="labelStyle == 'floating'"
            >
            {{label}}
            <span class="mbsc-input-wrap">
                <select #initElement
                    [(ngModel)]="innerValue" 
                    [attr.name]="name"
                    [attr.data-icon]="icon ? icon : null"
                    [attr.data-icon-align]="iconAlign ? iconAlign : null"
                    [disabled]="disabled"
                    (blur)="onTouch($event)">
                    <ng-content></ng-content>
                </select>
                <span *ngIf="error && errorMessage" class="mbsc-err-msg">{{errorMessage}}</span>
            </span>
        </label>
    `,
    providers: [MbscInputService]
})
export class MbscDropdown extends MbscFormValueBase {
    instance: Select;
    /**
     * Input for the label
     */
    @Input()
    label: string;

    /**
     * Input for the icon
     */
    @Input()
    icon: string;

    /**
     * Input for the icon alignment
     * Can be one of 'left' or 'right'
     */
    @Input('icon-align')
    iconAlign: string;

    @Input()
    set value(v: any) {
        this._value = v;
        setTimeout(() => {
            this.instance._setText();
        });
    }

    /**
     *  Specify the inputStyle.
    */
    @Input('input-style')
    inputStyle: string;

    /**
     *  Specify the labelStyle.
    */
    @Input('label-style')
    labelStyle: string;

    constructor(hostElem: ElementRef, @Optional() formService: MbscOptionsService, protected _inputService: MbscInputService, @Optional() control: NgControl, zone: NgZone) {
        super(hostElem, formService, _inputService, control, zone);
        _inputService.input = this;
    }

    initControl() {
        let options = extend({}, this._inheritedOptions, this.options, this.inlineOptionsObj);
        this.instance = new Select(this._initElem.nativeElement, options);
        let that = this;
        setTimeout(function () { // setTimeout also needed because the inner value is not propagated to the underlying select yet
            // Needed when using reactive forms, because the writeValue is called before the instance is initialized
            that.instance._setText();
        });
    }

    /* ControlValueAccessor Interface override */

    /**
     * Called when the model changed
     * Override base class beaviour for the select. It needs to call the setText in order to populate the dummy input
     * @param v the new value of the model
     */
    writeValue(v: any): void {
        this._value = v;
        if (this.instance) {
            let that = this;
            setTimeout(function () {
                that.instance._setText();
            });
        }
    }
}

@Component({
    selector: 'mbsc-button',
    template: `
        <button #initElement 
            [type]="type"
            [ngClass]="cssClasses"
            [attr.name]="name"
            [attr.data-icon]="icon ? icon : null"
            [disabled]="disabled">
            <ng-content></ng-content>
        </button>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MbscButton extends MbscFormBase {
    instance: Button;
    _flat: boolean = false;
    _block: boolean = false;
    _outline: boolean = false;

    _classesObj: any = {};
    get cssClasses() {
        for (var k in this._classesObj) { delete this._classesObj[k] };
        this._classesObj['mbsc-btn-flat'] = this._flat;
        this._classesObj['mbsc-btn-block'] = this._block;
        this._classesObj['mbsc-btn-outline'] = this._outline;

        if (this.classes) {
            let cssClasses = this.classes.split(' ');
            if (cssClasses.length) {
                for (let i = 0; i < cssClasses.length; i++) {
                    if (cssClasses[i]) {
                        this._classesObj[cssClasses[i]] = true;
                    }
                }
            }
        }

        if (this.color) {
            this._classesObj['mbsc-btn-' + this.color] = true;
        }

        return this._classesObj;
    }

    @Input('class')
    classes: string;

    @Input()
    type: string = 'button';

    @Input()
    icon: string;

    @Input()
    set flat(val: any) {
        // sets the flat setting to true if empty string is provided, aka without value (ex. <mbsc-button flat>)
        this._flat = emptyOrTrue(val);
    }

    @Input()
    set block(val: any) {
        // sets the block setting to true if empty string is provided, aka without value (ex. <mbsc-button block>)
        this._block = emptyOrTrue(val);
    }

    @Input()
    set outline(val: any) {
        // sets the outline setting to true if empty string is provided, aka without value (ex. <mbsc-button outline>)
        this._outline = emptyOrTrue(val);
    }

    constructor(hostElem: ElementRef, @Optional() formService: MbscOptionsService, zone: NgZone) {
        super(hostElem, formService, zone);
    }

    initControl() {
        let options = extend({}, this._inheritedOptions, this.options, this.inlineOptionsObj);
        this.instance = new Button(this._initElem.nativeElement, options);
    }
}

@Component({
    selector: 'mbsc-checkbox',
    host: { 'class': 'mbsc-control-ng' },
    template: `
        <label [ngClass]="colorClass">
            <input #initElement 
                type="checkbox"
                [attr.name]="name"
                [disabled]="disabled"
                [attr.data-label-style]="labelStyle"
                [attr.data-input-style]="inputStyle"
                [(ngModel)]="innerValue"
                (blur)="onTouch($event)" />
            <ng-content></ng-content>
            <span *ngIf="error && errorMessage" class="mbsc-err-msg">{{errorMessage}}</span>
        </label>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MbscCheckbox extends MbscFormValueBase {
    instance: CheckBox;
    /**
     * Input for the color preset
     */
    @Input()
    color: string;

    /**
     *  Specify the inputStyle.
    */
    @Input('input-style')
    inputStyle: string;

    /**
     *  Specify the labelStyle.
    */
    @Input('label-style')
    labelStyle: string;

    _colorClass: any = {};
    get colorClass(): any {
        for (var k in this._colorClass) { delete this._colorClass[k]; }
        if (this.color) {
            this._colorClass['mbsc-checkbox-' + this.color] = true;
        }
        if (this.error) {
            this._colorClass['mbsc-err'] = true;
        }
        return this._colorClass;
    }

    constructor(hostElem: ElementRef, public cdr: ChangeDetectorRef, @Optional() formService: MbscOptionsService, @Optional() _inputService: MbscInputService, @Optional() control: NgControl, zone: NgZone) {
        super(hostElem, formService, _inputService, control, zone);
    }

    initControl() {
        let options = extend({}, this._inheritedOptions, this.options, this.inlineOptionsObj);
        this.instance = new CheckBox(this._initElem.nativeElement, options);
    }

    /** Overwritten to work with onPush change detection strategy 
     * When using the onPush changedetection strategy and the value is set from the model, 
     * the UI doesn't change (because there is no input change) unless we trigger a change manually */
    writeValue(v: any) {
        this._value = v;
        this.cdr.detectChanges();
    }
}

@Component({
    selector: 'mbsc-switch',
    host: { 'class': 'mbsc-control-ng' },
    template: `
        <label [ngClass]="colorClass">
            <ng-content></ng-content>
            <span *ngIf="error && errorMessage" class="mbsc-err-msg">{{errorMessage}}</span>
            <input #initElement 
                type="checkbox"
                data-role="switch"
                [attr.name]="name"
                [attr.data-label-style]="labelStyle"
                [attr.data-input-style]="inputStyle"
                [disabled]="disabled"
                (blur)="onTouch($event)" />
        </label>
    `,
    exportAs: 'mobiscroll',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MbscSwitch extends MbscControlBase implements OnInit {
    protected _inheritedOptions: any;
    instance: Switch;

    @Input('options')
    options: MbscFormOptions;

    @Input()
    disabled: boolean = false;

    @Input()
    name: string;

    @Input()
    color: string;

    @Input()
    error: boolean;
    @Input()
    errorMessage: string;

    /** 
     * Called when the model changes
     * Used only without FormControl 
     */
    @Input('value')
    set value(v: boolean) {
        this.setNewValueProxy(v);
    }

    /**
     * EventEmitter for the value change
     * Used only without FormControl
     */
    @Output('valueChange')
    onChangeEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('initElement', { static: false } as any)
    _initElem: ElementRef;

    _colorClass: any = {};
    get colorClass() {
        for (var k in this._colorClass) { delete this._colorClass[k] };
        if (this.color) {
            this._colorClass['mbsc-switch-' + this.color] = true;
        }
        if (this.error) {
            this._colorClass['mbsc-err'] = true;
        }
        return this._colorClass;
    }

    constructor(hostElem: ElementRef, zone: NgZone, @Optional() protected _formService: MbscOptionsService, @Optional() control: NgControl) {
        super(hostElem, zone, control, null, null);
    }

    setNewValue(v: boolean) {
        if (this.instance) {
            if (this.instance.getVal() !== v) {
                this.instance.setVal(v, true, false);
            }
        }
    }

    ngOnInit() {
        this._inheritedOptions = this._formService ? this._formService.options : {};
        super.ngOnInit();
    }

    initControl() {
        let options = extend({}, this._inheritedOptions, this.options, this.inlineOptionsObj);
        this.instance = new Switch(this._initElem.nativeElement, options);

        if (this.initialValue !== undefined) {
            this.instance.setVal(this.initialValue, true, false);
        }
    }
}

/**
 * Note on the template: Wrapper needs to be a div (instead of label) - not to fire click events twice
 */
@Component({
    selector: 'mbsc-stepper',
    host: { 'class': 'mbsc-control-ng' },
    template: `
        <div [ngClass]="colorClass">
            <ng-content></ng-content>
            <input #initElement
                data-role="stepper"
                [attr.name]="name"
                [attr.min]="min !== undefined ? min : null"
                [attr.max]="max !== undefined ? max : null"
                [attr.step]="step !== undefined ? step : null"
                [attr.data-val]="val ? val : null"
                [attr.data-label-style]="labelStyle"
                [attr.data-input-style]="inputStyle"
                [disabled]="disabled" 
                [readonly]="_readonly"/>
        </div>
    `,
    exportAs: 'mobiscroll',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MbscStepper extends MbscControlBase implements OnInit {
    protected _inheritedOptions: any;
    instance: Stepper;
    _readonly: boolean;

    @Input()
    set readonly(val: any) {
        // sets the readonly setting to true if empty string is provided, aka without value (ex. <mbsc-rating readonly>)
        this._readonly = emptyOrTrue(val);
    }

    @Input('options')
    options: MbscFormOptions;

    @Input()
    set value(v: number) {
        this.setNewValueProxy(v);
    }

    @Input()
    name: string;

    @Input()
    min: number = undefined;

    @Input()
    max: number = undefined;

    @Input()
    step: number = undefined;

    /**
     * Input for the data-val attribute. Can be one of 'left' or 'right'
     */
    @Input()
    val: string = undefined;

    /**
     * Input for the disabled state
     */
    @Input()
    disabled: boolean = false;

    /**
     * Input for the color preset
     */
    @Input()
    color: string;

    _colorClass: any = {};
    get colorClass(): any {
        for (var k in this._colorClass) { delete this._colorClass[k]; }
        if (this.color) {
            this._colorClass['mbsc-stepper-' + this.color] = true;
        }
        return this._colorClass;
    }

    /**
     * EventEmitter for the value change
     * Used when no ngModel is specified on the component
     */
    @Output('valueChange')
    onChangeEmitter: EventEmitter<number> = new EventEmitter<number>();

    /**
     * Reference for the input element in the template.
     * The control is initialized on this element.
     */
    @ViewChild('initElement', { static: false } as any)
    public _initElem: ElementRef;

    constructor(hostElement: ElementRef, zone: NgZone, @Optional() protected _formService: MbscOptionsService, @Optional() control: NgControl) {
        super(hostElement, zone, control, null, null);
    }

    setNewValue(v: number) {
        if (this.instance && this.instance.getVal() !== v) {
            this.instance.setVal(v, true, false);
        }
    }

    /* OnInit Interface */

    ngOnInit() {
        this._inheritedOptions = this._formService ? this._formService.options : {};
        super.ngOnInit();
    }

    initControl() {
        let options = extend({}, this._inheritedOptions, this.options, this.inlineOptionsObj);
        this.instance = new Stepper(this._initElem.nativeElement, options);

        if (this.initialValue !== undefined) {
            this.instance.setVal(this.initialValue, true, false);
        }
    }

}

@Component({
    selector: 'mbsc-progress',
    host: { 'class': 'mbsc-control-ng' },
    template: `
        <label [ngClass]="colorClass">
            <ng-content></ng-content>
            <progress #initElement
                [attr.data-step-labels]="dataStepLabels"
                [attr.data-icon]="icon ? icon : null"
                [attr.data-icon-align]="iconAlign ? iconAlign : null"
                [attr.data-label-style]="labelStyle"
                [attr.data-input-style]="inputStyle"
                [attr.max]="max !== undefined ? max : null"
                [attr.data-val]="val !== undefined ? val : null"
            >
            </progress>
        </label>
    `,
    exportAs: 'mobiscroll',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MbscProgress extends MbscControlBase implements OnInit {
    protected _inheritedOptions: any;
    instance: Progress;

    @Input('options')
    options: MbscFormOptions;

    @Input()
    set value(v: number) {
        this.setNewValueProxy(v);
    }

    @Input()
    max: number = undefined;

    @Input()
    icon: string = undefined;

    @Input('icon-align')
    iconAlign: string = undefined;

    /**
     * Input for the data-val attribute. 
     * It Specifies the value position. Can be one of 'left' or 'right'
     */
    @Input()
    val: string = undefined;

    /**
     * Input for the disabled state
     */
    @Input()
    disabled: boolean = false;

    @Input('step-labels')
    stepLabels: Array<number>;

    get dataStepLabels(): string | null {
        if (typeof (this.stepLabels) === 'string') {
            return this.stepLabels;
        } else {
            return null;
        }
    }

    @Input()
    color: string;

    _colorClass: any = {};
    get colorClass(): any {
        for (var k in this._colorClass) { delete this._colorClass[k]; }
        if (this.color) {
            this._colorClass['mbsc-progress-' + this.color] = true;
        }
        return this._colorClass;
    }

    /**
     * Reference for the input element in the template.
     * The control is initialized on this element.
     */
    @ViewChild('initElement', { static: false } as any)
    public _initElem: ElementRef;

    constructor(hostElement: ElementRef, zone: NgZone, @Optional() protected _formService: MbscOptionsService, @Optional() control: NgControl) {
        super(hostElement, zone, control, null, null);
    }

    setNewValue(v: number) {
        if (this.instance && this.instance.getVal() !== v) {
            this.instance.setVal(v, true, false);
        }
    }

    /* OnInit Interface */

    ngOnInit() {
        this._inheritedOptions = this._formService ? this._formService.options : {};
        super.ngOnInit();
    }

    initControl() {
        let options = extend({}, this._inheritedOptions, this.options, this.inlineOptionsObj);
        this.instance = new Progress(this._initElem.nativeElement, options);

        if (this.initialValue !== undefined) {
            this.instance.setVal(this.initialValue, true, false);
        }
    }
}

let groupName = 1;

@Injectable()
export class MbscRadioService {
    private _name: string;
    get name(): string {
        if (!this._name) {
            this._name = 'mbsc-radio-group-' + (groupName++);
        }
        return this._name;
    }
    set name(n: string) {
        this._name = n;
    }

    private _multiSelect: boolean;
    get multiSelect(): boolean {
        return this._multiSelect;
    }
    set multiSelect(v: boolean) {
        this._multiSelect = v;
    }

    private _lastValue: any = null;
    private _valueObservable: Observable<any> = new Observable<any>();
    onValueChanged(): Observable<any> {
        return this._valueObservable;
    }
    changeValue(v: any) {
        this._valueObservable.next(v);
        this._lastValue = v;
    }
    /**
     * Returns the last value that was set to the Radio/Segmented
     */
    get getLastValue(): any {
        return this._lastValue;
    }

    private _color: string;
    get color(): string {
        return this._color;
    }
    set color(v: string) {
        this._color = v;
    }
}

@Directive({ selector: '[mbsc-rg-b]' })
export class MbscRadioGroupBase extends MbscFormValueBase {
    @Input()
    name: string;

    @Input()
    set value(v: any) {
        this._value = v;
        this._radioService.changeValue(v);
    }

    valueObserver: number;
    constructor(hostElement: ElementRef, @Optional() formService: MbscOptionsService, @Optional() _inputService: MbscInputService, public _radioService: MbscRadioService, control: NgControl, zone: NgZone) {
        super(hostElement, formService, _inputService, control, zone);
        this.valueObserver = this._radioService.onValueChanged().subscribe((v: any) => {
            this.innerValue = v;
            this.onTouch();
        });
    }

    /* OnInit Interface */

    ngOnInit() {
        super.ngOnInit();
        if (this.name) {
            this._radioService.name = this.name;
        }
        if (this.color) {
            this._radioService.color = this.color;
        }
    }

    /**
     * Override base class write value to notify subscribed radio buttons of the value change
     * Triggered when the change comes from the model.
     */
    writeValue(v: any) {
        this._value = v;
        this._radioService.changeValue(v);
    }

    /** Overriden for there is no instance tied to this component */
    updateOptions() { }

    ngOnDestroy() {
        this._radioService.onValueChanged().unsubscribe(this.valueObserver);
        super.ngOnDestroy();
    }
}

@Component({
    selector: 'mbsc-radio-group',
    template: `<ng-content></ng-content>`,
    providers: [MbscRadioService]
})
export class MbscRadioGroup extends MbscRadioGroupBase {
    constructor(hostElement: ElementRef, @Optional() formService: MbscOptionsService, @Optional() _inputService: MbscInputService, radioService: MbscRadioService, @Optional() control: NgControl, zone: NgZone) {
        super(hostElement, formService, _inputService, radioService, control, zone);
    }
}

@Component({
    selector: 'mbsc-radio',
    host: { 'class': 'mbsc-control-ng' },
    template: `
        <label [ngClass]="colorClass">
            <input #initElement 
                type="radio" 
                [attr.name]="name" 
                [attr.value]="value"
                [value]="value" 
                [checked]="checked"
                [disabled]="disabled"
                (click)="clicked($event)" />
            <ng-content></ng-content>
            <span *ngIf="error && errorMessage" class="mbsc-err-msg">{{errorMessage}}</span>
        </label>
    `
})
export class MbscRadio extends MbscFormBase {
    instance: Radio;

    get checked(): boolean {
        return this.value == this.modelValue;
    }

    name: string;
    modelValue: any;
    color: string;

    @Input()
    value: any;
    @Input()
    error: boolean;
    @Input()
    errorMessage: string;

    _colorClass: any = {};
    get colorClass() {
        for (var k in this._colorClass) { delete this._colorClass[k]; }
        if (this.color) {
            this._colorClass['mbsc-radio-' + this.color] = true;
        }
        if (this.error) {
            this._colorClass['mbsc-err'] = true;
        }
        return this._colorClass;
    }

    clicked(e: any) {
        this._radioService.changeValue(this.value);
    }

    valueObserver: number;

    /**
     * Constructor
     * Subscribes to the parent group for value changes.
     * When generated dynamically (ex. *ngFor), the value is set before the components are created so
     * it is needed to get the last value and set it as initial
     */
    constructor(hostElement: ElementRef, @Optional() formService: MbscOptionsService, private _radioService: MbscRadioService, zone: NgZone) {
        super(hostElement, formService, zone);
        // get the initial value
        const v = this._radioService.getLastValue;
        if (v !== null) { // if there is an initial value, set it
            this.modelValue = v;
        }
        // subscribe to parent group for value changes
        this.valueObserver = this._radioService.onValueChanged().subscribe((v: any) => {
            this.modelValue = v;
        });
    }

    initControl() {
        let options = extend({}, this._inheritedOptions, this.options, this.inlineOptionsObj);
        this.instance = new Radio(this._initElem.nativeElement, options);
    }

    ngOnInit() {
        super.ngOnInit();
        this.name = this._radioService.name;
        this.color = this._radioService.color;
    }

    ngOnDestroy() {
        this._radioService.onValueChanged().unsubscribe(this.valueObserver);
        super.ngOnDestroy();
    }
}

@Component({
    selector: 'mbsc-segmented-group',
    template: `<div class="mbsc-segmented mbsc-segmented-group mbsc-no-touch"><ng-content></ng-content></div>`,
    providers: [MbscRadioService]
})
export class MbscSegmentedGroup extends MbscRadioGroupBase {
    @Input()
    select: string = 'single';

    get multiSelect(): boolean {
        return this.select == 'multiple';
    }

    constructor(hostElement: ElementRef, @Optional() formService: MbscOptionsService, @Optional() _inputService: MbscInputService, radioService: MbscRadioService, @Optional() control: NgControl, zone: NgZone) {
        super(hostElement, formService, _inputService, radioService, control, zone);
    }

    ngOnInit() {
        super.ngOnInit();
        this._radioService.multiSelect = this.multiSelect;
        if (this.color) {
            this._radioService.color = this.color;
        }
    }
}


@Component({
    selector: 'mbsc-segmented',
    host: { '[class]': 'cssClass' },
    template: `
        <label class="mbsc-segmented-item-ready">
            <input #initElement 
                data-role="segmented"
                [type]="multiSelect ? 'checkbox' : 'radio'" 
                [value]="value" 
                [checked]="isChecked"
                [disabled]="disabled"
                [attr.name]="name" 
                [attr.value]="value"
                [attr.data-icon]="icon ? icon : null"
                (click)="clicked($event)" />
            <span class="mbsc-segmented-content">
                <span *ngIf="icon" class="{{'mbsc-ic mbsc-ic-' + icon }}"></span>
                <ng-content></ng-content>
            </span>
        </label>
    `
})
export class MbscSegmented extends MbscFormBase {
    instance: SegmentedItem;

    get isChecked(): boolean {
        if (this.multiSelect) {
            if (this.checked !== undefined) {
                return this.checked;
            } else {
                return this.modelValue && this.modelValue.includes(this.value);
            }
        } else {
            return this.value == this.modelValue;
        }
    }

    name: string;
    modelValue: any;
    multiSelect: boolean;

    @Input()
    icon: string;

    @Input()
    value: any;

    @Input()
    checked: any;

    @Output()
    checkedChange: EventEmitter<any> = new EventEmitter<any>();

    clicked(e: any) {
        if (this.multiSelect && this.checked !== undefined) {
            this.checkedChange.emit(!(!!this.checked));
        } else {
            if (this.multiSelect) {
                if (this.modelValue.includes(this.value)) {
                    let i = this.modelValue.indexOf(this.value);
                    this.modelValue.splice(i, 1);
                } else {
                    this.modelValue.push(this.value);
                }
                this._radioService.changeValue(this.modelValue);
            } else {
                this._radioService.changeValue(this.value);
            }
        }
    }

    get cssClass(): string {
        let cl = 'mbsc-segmented-item';
        if (this.color) {
            cl += ' mbsc-segmented-' + this.color;
        }
        return cl;
    }

    valueObserver: number;
    constructor(hostElement: ElementRef, @Optional() formService: MbscOptionsService, private _radioService: MbscRadioService, zone: NgZone) {
        super(hostElement, formService, zone);
        const v = this._radioService.getLastValue;
        if (v !== null) {
            this.modelValue = v;
        }
        this.valueObserver = this._radioService.onValueChanged().subscribe((v: any) => {
            this.modelValue = v;
        });
    }

    initControl() {
        let options = extend({}, this._inheritedOptions, this.options, this.inlineOptionsObj);
        this.instance = new SegmentedItem(this._initElem.nativeElement, options);
    }

    ngOnInit() {
        super.ngOnInit();
        this.name = this._radioService.name;
        this.multiSelect = this._radioService.multiSelect;
        this.color = this._radioService.color;
    }

    ngOnDestroy() {
        this._radioService.onValueChanged().unsubscribe(this.valueObserver);
        super.ngOnDestroy();
    }
}

@Component({
    selector: 'mbsc-slider',
    host: { 'class': 'mbsc-control-ng' },
    template: `
        <label [ngClass]="colorClass">
            <ng-content></ng-content>
            <input #inputElements *ngFor="let v of dummyArray" 
                type="range"
                [disabled]="disabled"
                [attr.value]="dummyArray.length > 1 && initialValue ? initialValue[v]: initialValue"
                [attr.data-step-labels]="dataStepLabels"
                [attr.data-template]="valueTemplate"
                [attr.data-tooltip]="tooltip ? 'true' : null"
                [attr.data-highlight]="highlight"
                [attr.data-live]="live"
                [attr.data-icon]="icon ? icon : null"
                [attr.data-val]="val ? val : null"
                [attr.data-label-style]="labelStyle"
                [attr.data-input-style]="inputStyle"
                [attr.name]="name"
                [attr.max]="max !== undefined ? max : null"
                [attr.min]="min !== undefined ? min : null"
                [attr.step]="step !== undefined ? step : null"
                (blur)="onTouch($event)" />
        </label>
    `,
    exportAs: 'mobiscroll'
})
export class MbscSlider extends MbscControlBase {
    instance: Slider;
    _lastValue: any;
    _dummy: Array<number> = undefined;

    get isMulti(): boolean {
        return this._lastValue instanceof Array;
    }

    get dummyArray(): Array<number> {
        if (!this._dummy || (this.isMulti && this._lastValue && this._lastValue.length && this._dummy.length !== this._lastValue.length)) {
            this._dummy = Array(this.isMulti ? this._lastValue.length : 1).fill(0).map((x, i) => i);
        }
        return this._dummy;
    }

    protected _inheritedOptions: any;

    _needsTimeout: boolean = false;

    @Input('options')
    options: MbscFormOptions;

    @Input()
    name: string;

    @Input()
    tooltip: boolean;

    @Input()
    highlight: boolean;

    @Input()
    live: boolean;

    @Input('value-template')
    valueTemplate: string;

    @Input()
    icon: string;

    @Input()
    val: string;

    @Input()
    max: number;

    @Input()
    min: number;

    @Input()
    step: number;

    @Input()
    disabled: boolean = false;

    @Input('step-labels')
    stepLabels: string | Array<number>;

    get dataStepLabels(): string | null {
        if (typeof (this.stepLabels) === 'string') {
            return this.stepLabels;
        } else {
            return null;
        }
    }

    /** 
     * Called when the model changes
     * Used only without FormControl 
     */
    @Input('value')
    set value(v: any) {
        this.setNewValueProxy(v);
    }

    /**
     * Input for the color presets
     */
    @Input()
    color: string;

    _colorClass: any = {};
    get colorClass(): any {
        for (var k in this._colorClass) { delete this._colorClass[k]; }
        if (this.color) {
            this._colorClass['mbsc-slider-' + this.color] = true;
        }
        return this._colorClass;
    }

    /**
     * EventEmitter for the value change
     * Used only without FormControl
     */
    @Output('valueChange')
    onChangeEmitter: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren('inputElements')
    public inputElements: QueryList<ElementRef>;

    constructor(hostElement: ElementRef, @Optional() private _formService: MbscOptionsService, zone: NgZone, @Optional() control: NgControl) {
        super(hostElement, zone, control, null, null);
    }


    /**
     * Reinitializes the slider control
     */
    reInitialize() {
        this.instance.destroy();
        this.setElement();
        this.inputElements.forEach((input, index) => {
            if (index) {
                this.handleChange(input.nativeElement);
            }
        });
        let options = extend({}, this._inheritedOptions, this.options, this.inlineOptionsObj);
        this.instance = new Slider(this.inputElements.first.nativeElement, options);
    }

    /**
     * NOTES: when using ngModel, the model value is available only in the next cycle.
     * This way we cannot determin if the slider should have single or multiple handles.
     * To counter this, we check in every cycle if the value type changes to array and
     * we reinitialize the control if needed.
     */
    setNewValue(v: any) {
        this._lastValue = v;
        if (this.instance) {
            let innerValue = this.instance.getVal();
            // check if last value type differs from the current value
            if (this.isMulti && (!innerValue || (innerValue as Array<number>).length != v.length)) {
                // reinitialize in the next cycle - new input elements should be generated by ngFor
                setTimeout(() => {
                    this.reInitialize();
                    this.instance.setVal(this._lastValue, true, false);
                });
            } else {
                let changed = (this.isMulti && !deepEqualsArray(innerValue as Array<number>, v)) || (!this.isMulti && innerValue !== v);
                if (changed) {
                    this.instance.setVal(v, true, false);
                }
            }
        }
    }

    /* OnInit Interface */

    ngOnInit() {
        this._inheritedOptions = this._formService ? this._formService.options : {};
        super.ngOnInit();
    }

    /* AfterViewInit Interface */

    initControl() {
        // handle change for each input (when multi value)
        this.inputElements.forEach((input, index) => {
            if (index) {
                this.handleChange(input.nativeElement);
            }
        });

        let options = extend({}, this._inheritedOptions, this.options, this.inlineOptionsObj);
        this.instance = new Slider(this.inputElements.first.nativeElement, options);

        if (this.initialValue !== undefined && this.initialValue !== null) {
            this.instance.setVal(this.initialValue, true, false);
        }
    }
}

@Component({
    selector: 'mbsc-rating',
    host: { 'class': 'mbsc-control-ng' },
    template: `<label [ngClass]="colorClass">
        <ng-content></ng-content>
        <input type="rating" data-role="rating" 
            [attr.name]="name"
            [attr.min]="min !== undefined ? min : null"
            [attr.max]="max !== undefined ? max : null"
            [attr.step]="step !== undefined ? step : null"
            [attr.data-val]="val ? val : null"
            [attr.data-template]="template ? template : null"
            [attr.data-empty]="empty"
            [attr.data-filled]="filled"
            [attr.data-label-style]="labelStyle"
            [attr.data-input-style]="inputStyle"
            [disabled]="disabled"
            [readonly]="_readonly"
            (blur)="onTouch($event)" />
    </label>`
})
export class MbscRating extends MbscControlBase implements OnInit {
    _inheritedOptions: any;
    instance: Rating;

    @Input()
    options: MbscFormOptions;

    @Input()
    name: string;

    @Input()
    min: number = undefined;

    @Input()
    max: number = undefined;

    @Input()
    step: number = undefined;

    @Input()
    disabled: boolean = false;

    @Input()
    empty: string;

    @Input()
    filled: string;

    _readonly: boolean;
    @Input()
    set readonly(val: any) {
        // sets the readonly setting to true if empty string is provided, aka without value (ex. <mbsc-rating readonly>)
        this._readonly = emptyOrTrue(val);
    }

    /**
     * Input for the data-val attribute. Can be one of 'left' or 'right'
     */
    @Input()
    val: 'left' | 'right' = undefined;

    @Input()
    template: string;
    /** 
     * Called when the model changes
     * Used only without FormControl 
     */
    @Input('value')
    set value(v: number) {
        this.setNewValueProxy(v);
    }

    /**
     * EventEmitter for the value change
     * Used only without FormControl
     */
    @Output('valueChange')
    onChangeEmitter: EventEmitter<number> = new EventEmitter<number>();

    /**
     * Input for the color presets
     */
    @Input()
    color: string;

    _colorClass: any = {};
    get colorClass(): any {
        for (var k in this._colorClass) { delete this._colorClass[k]; }
        if (this.color) {
            this._colorClass['mbsc-rating-' + this.color] = true;
        }
        return this._colorClass;
    }

    constructor(hostElem: ElementRef, zone: NgZone, @Optional() protected formService: MbscOptionsService, @Optional() control: NgControl) {
        super(hostElem, zone, control, null, null);
    }

    setNewValue(v: number) {
        if (this.instance) {
            if (this.instance.getVal() !== v) {
                this.instance.setVal(v, true, false);
            }
        }
    }

    ngOnInit() {
        this._inheritedOptions = this.formService ? this.formService.options : {};
        super.ngOnInit();
    }

    initControl() {
        let options = extend({}, this._inheritedOptions, this.options, this.inlineOptionsObj);
        this.instance = new Rating(this.element, options);

        if (this.initialValue !== undefined) {
            this.instance.setVal(this.initialValue, true, false);
        }
    }
}

@Component({
    selector: 'mbsc-form-group',
    template: '<ng-content></ng-content>',
    host: {
        '[class.mbsc-form-group-inset]': 'emptyOrTrue(inset)',
        '[class.mbsc-form-group]': '!emptyOrTrue(inset)'
    },
    styles: [':host { display: block; }']
})
export class MbscFormGroup implements AfterViewInit {
    @Input()
    collapsible: any = null;

    _open: boolean = false;
    @Input()
    set open(v: boolean) {
        if (this._open != v && this.instance) {
            if (v) {
                this.instance.show();
            } else {
                this.instance.hide();
            }
        }
        this._open = v;
    }

    /** Note on type: using as attribute without a value (empty string) */
    @Input()
    inset: string;

    /**
     * Reference to the initialized collapsible instance
     */
    instance: any = null;

    /**
     * Reference to the html element the mobiscroll is initialized on. 
     */
    element: any = null;

    constructor(public initialElem: ElementRef) {
        this.element = initialElem;
    }

    /**
     * Checks if the value passed is empty or the true string. Used for determining if certain attributes are used on components
     * @param v The value
     */
    emptyOrTrue(v: any): boolean {
        return emptyOrTrue(v);
    }

    /* AfterViewInit Interface */
    ngAfterViewInit() {
        if (this.collapsible !== null) {
            this.instance = new CollapsibleBase(this.element.nativeElement, { isOpen: this._open !== false });
        }
    }

    /* OnDestroy Interface */
    ngOnDestroy() {
        if (this.instance) {
            this.instance.destroy();
        }
    }
}

@Component({
    selector: 'mbsc-form-group-title',
    template: '<ng-content></ng-content>',
    host: {
        '[class.mbsc-form-group-title]': 'true'
    },
    styles: [':host { display: block; }']
})
export class MbscFormGroupTitle { }

@Component({
    selector: 'mbsc-form-group-content',
    template: '<ng-content></ng-content>',
    host: {
        '[class.mbsc-form-group-content]': 'true'
    },
    styles: [':host { display: block; }']
})
export class MbscFormGroupContent { }

@Component({
    selector: 'mbsc-accordion',
    template: '<ng-content></ng-content>',
    host: {
        '[class.mbsc-accordion]': 'true'
    },
    styles: [':host { display: block; }']
})
export class MbscAccordion { }

const comp = [
    MbscForm,
    MbscTextarea,
    MbscDropdown,
    MbscButton,
    MbscCheckbox,
    MbscSwitch,
    MbscStepper,
    MbscProgress,
    MbscRadioGroup,
    MbscRadioGroupBase,
    MbscRadio,
    MbscSegmentedGroup,
    MbscSegmented,
    MbscSlider,
    MbscRating,
    MbscFormGroup,
    MbscFormGroupTitle,
    MbscFormGroupContent,
    MbscAccordion
];

@NgModule({
    imports: [FormsModule, CommonModule, MbscBaseModule, MbscInputModule],
    declarations: comp,
    exports: [comp, MbscInputModule, MbscInput]
})
export class MbscFormsModule { }