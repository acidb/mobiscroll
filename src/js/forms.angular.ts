import {
    extend,
    Component,
    MbscBase,
    MbscControlBase,
    deepEqualsArray,
    NgZone,
    ControlValueAccessor,
    NgControl,
    Optional,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ViewChildren,
    QueryList,
    Injectable,
    OnInit,
    Subject,
    Observable,
    MbscInputService,
    MbscOptionsService,
    AfterViewInit
} from './frameworks/angular';

import { Form } from './classes/forms';
import { Input as FormInput } from './classes/input';
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

@Component({
    selector: 'mbsc-form',
    template: `<div #rootElement><ng-content></ng-content></div>`,
    providers: [MbscOptionsService],
    exportAs: 'mobiscroll'
})
export class MbscForm extends MbscBase implements OnInit {
    private optionsObj: MbscFormOptions;
    _instance: Form;

    @Input('options')
    options: MbscFormOptions;

    @ViewChild('rootElement')
    rootElem: ElementRef;

    constructor(initialElem: ElementRef, private _formService: MbscOptionsService) {
        super(initialElem);
    }

    ngOnInit() {
        // make the options available for the children components
        // Note: inline evens should not be inherited
        this.optionsObj = extend({}, this.options, this.inlineOptions());
        this._formService.options = this.optionsObj;
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();

        let options = extend({}, this.inlineEvents(), this.options, this.inlineOptions());
        this._instance = new Form(this.rootElem.nativeElement, options);
    }
}

export class MbscFormBase extends MbscBase implements OnInit {
    protected _inheritedOptions: any;

    /**
     * Input for the color preset
     * Inherited by form controls
     */
    @Input()
    color: string;

    /**
     * Input for the control options
     */
    @Input()
    options: MbscFormOptions;

    /**
     * Input for the disabled state of the control
     */
    @Input()
    disabled: boolean = false;

    @Input()
    name: string;

    /**
     * Reference to the native element the controls is initialized on
     */
    @ViewChild('initElement')
    public _initElem: ElementRef;


    constructor(hostElem: ElementRef, protected _formService: MbscOptionsService) {
        super(hostElem);
    }


    /* OnInit Interface */

    ngOnInit() {
        // get inherited options from the parent form
        this._inheritedOptions = this._formService ? this._formService.options : {};
    }
}

export class MbscFormValueBase extends MbscFormBase implements ControlValueAccessor {
    _value: any;

    set innerValue(v: any) {
        this._value = v;
        this.onChange(v);
        this.valueChangeEmitter.emit(v);
    }
    get innerValue(): any {
        return this._value;
    }

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
     * Input for the value. Used when no ngModel is present.
     * ex. [value]="myValue"
     */
    @Input()
    set value(v: any) {
        this._value = v;
    }

    /**
     * Input for the error state of the control
     */
    @Input()
    error: boolean;

    /**
     * The error message shown, when the error state is on
     */
    @Input()
    errorMessage: string = '';

    /**
     * Event Emitter for the value. Used when no ngModel is present
     * ex. (value)="myValue"
     */
    @Output('valueChange')
    valueChangeEmitter: EventEmitter<string> = new EventEmitter<string>();


    constructor(hostElem: ElementRef, @Optional() _formService: MbscOptionsService, protected _control: NgControl, protected _noOverride: boolean) {
        super(hostElem, _formService);
        if (_control && !_noOverride) {
            _control.valueAccessor = this;
        }
    }

    /* ControlValueAccessor Interface */

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    /**
     * Called when the model changed
     * @param v the new value of the model
     */
    writeValue(v: any): void {
        this._value = v;
    }
}

export class MbscInputBase extends MbscFormValueBase {
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

    /**
     * The type of the control that will be generated. It is mapped to the native input type.
     */
    @Input()
    type: string = 'text';

    /**
     * Used to show a password toggle icon, when using a password type input
     */
    @Input('password-toggle')
    passwordToggle: boolean;

    /**
     * Specify the passwordToggle show icon.
    */
    @Input('icon-show')
    iconShow: string;

    /**
     *  Specify the passwordToggle hide icon.
    */
    @Input('icon-hide')
    iconHide: string;

    /**
     * Placeholder for the control
     */
    @Input()
    placeholder: string = '';


    constructor(initialElem: ElementRef, @Optional() _formService: MbscOptionsService, _control: NgControl, noOverride: boolean) {
        super(initialElem, _formService, _control, noOverride);
    }
}

@Component({
    selector: 'mbsc-input',
    host: { '[class.mbsc-control-ng]': 'controlNg' },
    template: `
        <label [class.mbsc-err]="error" [class.mbsc-select]="dropdown">
            <ng-content></ng-content>
            <span class="mbsc-input-wrap">
                <input #initElement [type]="type" [placeholder]="placeholder" [(ngModel)]="innerValue" (blur)="onTouch($event)"
                    [attr.name]="name"
                    [attr.data-icon]="icon ? icon : null"
                    [attr.data-icon-align]="iconAlign ? iconAlign : null"
                    [attr.data-password-toggle]="passwordToggle ? 'true': null"
                    [attr.data-icon-show]="iconShow ? iconShow : null"
                    [attr.data-icon-hide]="iconHide ? iconHide : null"
                    [disabled]="disabled" />
                <span *ngIf="dropdown" class="mbsc-select-ic mbsc-ic mbsc-ic-arrow-down5"></span>
                <span *ngIf="error && errorMessage" class="mbsc-err-msg">{{errorMessage}}</span>
            </span>
        </label>
    `,
    providers: [MbscInputService]
})
export class MbscInput extends MbscInputBase {
    _instance: FormInput;

    @Input()
    controlNg: boolean = true;

    @Input()
    dropdown: boolean = false;

    constructor(initialElem: ElementRef, @Optional() _formService: MbscOptionsService, protected _inputService: MbscInputService, @Optional() _control: NgControl) {
        super(initialElem, _formService, _control, _inputService.isControlSet);
        _inputService.input = this;
    }

    /* AfterViewInit Interface */

    ngAfterViewInit() {
        super.ngAfterViewInit();

        let options = extend({}, this._inheritedOptions, this.inlineEvents(), this.options, this.inlineOptions());
        this._instance = new FormInput(this._initElem.nativeElement, options);
    }
}

@Component({
    selector: 'mbsc-textarea',
    host: { 'class': 'mbsc-control-ng' },
    template: `
        <label [class.mbsc-err]="error">
            <ng-content></ng-content>
            <span class="mbsc-input-wrap">
                <textarea #initElement [placeholder]="placeholder" [(ngModel)]="innerValue" (blur)="onTouch($event)"
                    [attr.name]="name"
                    [attr.rows]="rows"
                    [attr.data-icon]="icon ? icon : null"
                    [attr.data-icon-align]="iconAlign ? iconAlign : null"
                    [disabled]="disabled"></textarea>
                <span *ngIf="error && errorMessage" class="mbsc-err-msg">{{errorMessage}}</span>
            </span>
        </label>
    `,
    providers: [MbscInputService]
})
export class MbscTextarea extends MbscInputBase {
    _instance: TextArea;

    @Input()
    rows: number | string;

    constructor(initialElem: ElementRef, @Optional() _formService: MbscOptionsService, protected _inputService: MbscInputService, @Optional() _control: NgControl) {
        super(initialElem, _formService, _control, _inputService.isControlSet);
        _inputService.input = this;
    }

    /** 
     * Override
     * To resize the textarea when programmatically changing it's value
     */
    @Input()
    set value(v: any) {
        this._value = v;
        this.resize();
    }

    /** 
     * Override
     * To resize the textarea when programmatically changing it's value
     */
    writeValue(v: any) {
        this._value = v;
        this.resize();
    }

    resize() {
        if (this._instance) {
            setTimeout(() => {
                this._instance.resize();
            });
        }
    }

    /* AfterViewInit Interface */

    ngAfterViewInit() {
        super.ngAfterViewInit();

        let options = extend({}, this._inheritedOptions, this.inlineEvents(), this.options, this.inlineOptions());
        this._instance = new TextArea(this._initElem.nativeElement, options);
    }
}


@Component({
    selector: 'mbsc-dropdown',
    host: { 'class': 'mbsc-control-ng' },
    template: `
        <label [class.mbsc-err]="error">
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
    _instance: Select;
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
            this._instance._setText();
        });
    }

    constructor(hostElem: ElementRef, @Optional() formService: MbscOptionsService, protected _inputService: MbscInputService, @Optional() control: NgControl) {
        super(hostElem, formService, control, _inputService.isControlSet);
        _inputService.input = this;
    }

    /* AfterViewInit Interface */

    ngAfterViewInit() {
        super.ngAfterViewInit();

        let options = extend({}, this._inheritedOptions, this.inlineEvents(), this.options, this.inlineOptions());
        this._instance = new Select(this._initElem.nativeElement, options);
        let that = this;
        setTimeout(function () { // setTimeout also needed because the inner value is not propagated to the underlying select yet
            // Needed when using reactive forms, because the writeValue is called before the instance is initialized
            that._instance._setText();
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
        if (this._instance) {
            let that = this;
            setTimeout(function () {
                that._instance._setText();
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
    `
})
export class MbscButton extends MbscFormBase {
    _instance: Button;
    _flat: boolean = false;
    _block: boolean = false;
    _outline: boolean = false;

    get cssClasses() {
        var classesObj: any = {
            'mbsc-btn-flat': this._flat,
            'mbsc-btn-block': this._block,
            'mbsc-btn-outline': this._outline
        };

        if (this.classes) {
            let cssClasses = this.classes.split(' ');
            if (cssClasses.length) {
                for (let i = 0; i < cssClasses.length; i++) {
                    if (cssClasses[i]) {
                        classesObj[cssClasses[i]] = true;
                    }
                }
            }
        }

        if (this.color) {
            classesObj['mbsc-btn-' + this.color] = true;
        }

        return classesObj;
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
        this._flat = (typeof val === 'string' && (val === 'true' || val === '')) || !!val;
    }

    @Input()
    set block(val: any) {
        // sets the block setting to true if empty string is provided, aka without value (ex. <mbsc-button block>)
        this._block = (typeof val === 'string' && (val === 'true' || val === '')) || !!val;
    }

    @Input()
    set outline(val: any) {
        // sets the outline setting to true if empty string is provided, aka without value (ex. <mbsc-button outline>)
        this._outline = (typeof val === 'string' && (val === 'true' || val === '')) || !!val;
    }

    constructor(hostElem: ElementRef, @Optional() formService: MbscOptionsService) {
        super(hostElem, formService);
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();

        let options = extend({}, this._inheritedOptions, this.inlineEvents(), this.options, this.inlineOptions());
        this._instance = new Button(this._initElem.nativeElement, options);
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
                [(ngModel)]="innerValue"
                (blur)="onTouch($event)" />
            <ng-content></ng-content>
        </label>
    `
})
export class MbscCheckbox extends MbscFormValueBase {
    _instance: CheckBox;
    /**
     * Input for the color preset
     */
    @Input()
    color: string;

    get colorClass(): any {
        let cl: any = {};
        if (this.color) {
            cl['mbsc-checkbox-' + this.color] = true;
        }
        return cl;
    }

    constructor(hostElem: ElementRef, @Optional() formService: MbscOptionsService, @Optional() control: NgControl) {
        super(hostElem, formService, control, false);
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();

        let options = extend({}, this._inheritedOptions, this.inlineEvents(), this.options, this.inlineOptions());
        this._instance = new CheckBox(this._initElem.nativeElement, options);
    }
}

@Component({
    selector: 'mbsc-switch',
    host: { 'class': 'mbsc-control-ng' },
    template: `
        <label [ngClass]="colorClass">
            <ng-content></ng-content>
            <input #initElement 
                type="checkbox"
                data-role="switch"
                [attr.name]="name"
                [disabled]="disabled"
                (blur)="onTouch($event)" />
        </label>
    `,
    exportAs: 'mobiscroll'
})
export class MbscSwitch extends MbscControlBase implements OnInit {
    protected _inheritedOptions: any;
    _instance: Switch;

    @Input('options')
    options: MbscFormOptions;

    @Input()
    disabled: boolean = false;

    @Input()
    name: string;

    @Input()
    color: string;

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

    @ViewChild('initElement')
    _initElem: ElementRef;

    get colorClass() {
        let cl: any = {};
        if (this.color) {
            cl['mbsc-switch-' + this.color] = true;
        }
        return cl;
    }

    constructor(hostElem: ElementRef, zone: NgZone, @Optional() protected _formService: MbscOptionsService, @Optional() control: NgControl) {
        super(hostElem, zone, control, null, null);
    }

    setNewValue(v: boolean) {
        if (this._instance) {
            if (this._instance.getVal() !== v) {
                this._instance.setVal(v, true, false);
            }
        }
    }

    ngOnInit() {
        this._inheritedOptions = this._formService ? this._formService.options : {};
        super.ngOnInit();
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();

        let options = extend({}, this._inheritedOptions, this.inlineEvents(), this.options, this.inlineOptions());
        this._instance = new Switch(this._initElem.nativeElement, options);

        if (this.initialValue !== undefined) {
            this._instance.setVal(this.initialValue, true, false);
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
                [disabled]="disabled" />
        </div>
    `,
    exportAs: 'mobiscroll'
})
export class MbscStepper extends MbscControlBase implements OnInit {
    protected _inheritedOptions: any;
    _instance: Stepper;

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

    get colorClass(): any {
        let cl: any = {};
        if (this.color) {
            cl['mbsc-stepper-' + this.color] = true;
        }
        return cl;
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
    @ViewChild('initElement')
    public _initElem: ElementRef;

    constructor(hostElement: ElementRef, zone: NgZone, @Optional() protected _formService: MbscOptionsService, @Optional() control: NgControl) {
        super(hostElement, zone, control, null, null);
    }

    setNewValue(v: number) {
        if (this._instance && this._instance.getVal() !== v) {
            this._instance.setVal(v, true, false);
        }
    }

    /* OnInit Interface */

    ngOnInit() {
        this._inheritedOptions = this._formService ? this._formService.options : {};
        super.ngOnInit();
    }

    /* AfterViewInit Interface */

    ngAfterViewInit() {
        super.ngAfterViewInit();

        let options = extend({}, this._inheritedOptions, this.inlineEvents(), this.options, this.inlineOptions());
        this._instance = new Stepper(this._initElem.nativeElement, options);

        if (this.initialValue !== undefined) {
            this._instance.setVal(this.initialValue, true, false);
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
                [attr.data-step-labels]="stepLabels"
                [attr.data-icon]="icon ? icon : null"
                [attr.data-icon-align]="iconAlign ? iconAlign : null"
                [attr.max]="max !== undefined ? max : null"
                [attr.data-val]="val !== undefined ? val : null"
            >
            </progress>
        </label>
    `,
    exportAs: 'mobiscroll'
})
export class MbscProgress extends MbscControlBase implements OnInit {
    protected _inheritedOptions: any;
    _instance: Progress;

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

    @Input()
    color: string;

    get colorClass(): any {
        let cl: any = {};
        if (this.color) {
            cl['mbsc-progress-' + this.color] = true;
        }
        return cl;
    }

    /**
     * Reference for the input element in the template.
     * The control is initialized on this element.
     */
    @ViewChild('initElement')
    public _initElem: ElementRef;

    constructor(hostElement: ElementRef, zone: NgZone, @Optional() protected _formService: MbscOptionsService, @Optional() control: NgControl) {
        super(hostElement, zone, control, null, null);
    }

    setNewValue(v: number) {
        if (this._instance && this._instance.getVal() !== v) {
            this._instance.setVal(v, true, false);
        }
    }

    /* OnInit Interface */

    ngOnInit() {
        this._inheritedOptions = this._formService ? this._formService.options : {};
        super.ngOnInit();
    }

    /* AfterViewInit Interface */

    ngAfterViewInit() {
        super.ngAfterViewInit();

        let options = extend({}, this._inheritedOptions, this.inlineEvents(), this.options, this.inlineOptions());
        this._instance = new Progress(this._initElem.nativeElement, options);

        if (this.initialValue !== undefined) {
            this._instance.setVal(this.initialValue, true, false);
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

    private _valueSubject: Subject<any> = new Subject<any>();
    onValueChanged(): Observable<any> {
        return this._valueSubject.asObservable();
    }
    changeValue(v: any) {
        this._valueSubject.next(v);
    }

    private _color: string;
    get color(): string {
        return this._color;
    }
    set color(v: string) {
        this._color = v;
    }
}


export class MbscRadioGroupBase extends MbscFormValueBase {
    @Input()
    name: string;

    @Input()
    set value(v: any) {
        this._value = v;
        this._radioService.changeValue(v);
    }

    constructor(hostElement: ElementRef, @Optional() formService: MbscOptionsService, public _radioService: MbscRadioService, control: NgControl) {
        super(hostElement, formService, control, null);
        this._radioService.onValueChanged().subscribe(v => {
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
}

@Component({
    selector: 'mbsc-radio-group',
    template: `<ng-content></ng-content>`,
    providers: [MbscRadioService]
})
export class MbscRadioGroup extends MbscRadioGroupBase {
    constructor(hostElement: ElementRef, @Optional() formService: MbscOptionsService, radioService: MbscRadioService, @Optional() control: NgControl) {
        super(hostElement, formService, radioService, control);
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
        </label>
    `
})
export class MbscRadio extends MbscFormBase {
    _instance: Radio;

    get checked(): boolean {
        return this.value == this.modelValue;
    }

    name: string;
    modelValue: any;
    color: string;

    @Input()
    value: any;

    get colorClass() {
        let cl: any = {};
        if (this.color) {
            cl['mbsc-radio-' + this.color] = true;
        }
        return cl;
    }

    clicked(e: any) {
        this._radioService.changeValue(this.value);
    }

    constructor(hostElement: ElementRef, @Optional() formService: MbscOptionsService, private _radioService: MbscRadioService) {
        super(hostElement, formService);
        this._radioService.onValueChanged().subscribe(v => {
            this.modelValue = v;
        });
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();

        let options = extend({}, this._inheritedOptions, this.inlineEvents(), this.options, this.inlineOptions());
        this._instance = new Radio(this._initElem.nativeElement, options);
    }

    ngOnInit() {
        super.ngOnInit();
        this.name = this._radioService.name;
        this.color = this._radioService.color;
    }
}

@Component({
    selector: 'mbsc-segmented-group',
    template: `<div class="mbsc-segmented"><ng-content></ng-content></div>`,
    providers: [MbscRadioService]
})
export class MbscSegmentedGroup extends MbscRadioGroupBase {
    @Input()
    select: string = 'single';

    get multiSelect(): boolean {
        return this.select == 'multiple';
    }

    constructor(hostElement: ElementRef, @Optional() formService: MbscOptionsService, radioService: MbscRadioService, @Optional() control: NgControl) {
        super(hostElement, formService, radioService, control);
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
    _instance: SegmentedItem;

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

    constructor(hostElement: ElementRef, @Optional() formService: MbscOptionsService, private _radioService: MbscRadioService) {
        super(hostElement, formService);
        this._radioService.onValueChanged().subscribe(v => {
            this.modelValue = v;
        });
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();

        let options = extend({}, this._inheritedOptions, this.inlineEvents(), this.options, this.inlineOptions());
        this._instance = new SegmentedItem(this._initElem.nativeElement, options);
    }

    ngOnInit() {
        super.ngOnInit();
        this.name = this._radioService.name;
        this.multiSelect = this._radioService.multiSelect;
        this.color = this._radioService.color;
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
                [attr.data-step-labels]="stepLabels"
                [attr.data-template]="valueTemplate"
                [attr.data-tooltip]="tooltip ? 'true' : null"
                [attr.data-highlight]="highlight"
                [attr.data-live]="live"
                [attr.data-icon]="icon ? icon : null"
                [attr.data-val]="val ? val : null"
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
    _instance: Slider;
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
    stepLabels: Array<number>;

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

    get colorClass(): any {
        let cl: any = {};
        if (this.color) {
            cl['mbsc-slider-' + this.color] = true;
        }
        return cl;
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
        this._instance.destroy();
        this.setElement();
        this.inputElements.forEach((input, index) => {
            if (index) {
                this.handleChange(input.nativeElement);
            }
        });
        let options = extend({}, this._inheritedOptions, this.inlineEvents(), this.options, this.inlineOptions());
        this._instance = new Slider(this.inputElements.first.nativeElement, options);
    }

    /**
     * NOTES: when using ngModel, the model value is available only in the next cycle.
     * This way we cannot determin if the slider should have single or multiple handles.
     * To counter this, we check in every cycle if the value type changes to array and
     * we reinitialize the control if needed.
     */
    setNewValue(v: any) {
        this._lastValue = v;
        if (this._instance) {
            let innerValue = this._instance.getVal();
            // check if last value type differs from the current value
            if (this.isMulti && (!innerValue || (innerValue as Array<number>).length != v.length)) {
                // reinitialize in the next cycle - new input elements should be generated by ngFor
                setTimeout(() => {
                    this.reInitialize();
                    this._instance.setVal(this._lastValue, true, false);
                });
            } else {
                let changed = (this.isMulti && !deepEqualsArray(innerValue as Array<number>, v)) || (!this.isMulti && innerValue !== v);
                if (changed) {
                    this._instance.setVal(v, true, false);
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

    ngAfterViewInit() {
        super.ngAfterViewInit();

        // handle change for each input (when multi value)
        this.inputElements.forEach((input, index) => {
            if (index) {
                this.handleChange(input.nativeElement);
            }
        });

        let options = extend({}, this._inheritedOptions, this.inlineEvents(), this.options, this.inlineOptions());
        this._instance = new Slider(this.inputElements.first.nativeElement, options);

        if (this.initialValue !== undefined && this.initialValue !== null) {
            this._instance.setVal(this.initialValue, true, false);
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
            [disabled]="disabled"
            (blur)="onTouch($event)" />
    </label>`
})
export class MbscRating extends MbscControlBase implements OnInit {
    _inheritedOptions: any;
    _instance: Rating;

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

    get colorClass(): any {
        let cl: any = {};
        if (this.color) {
            cl['mbsc-rating-' + this.color] = true;
        }
        return cl;
    }

    constructor(hostElem: ElementRef, zone: NgZone, @Optional() protected formService: MbscOptionsService, @Optional() control: NgControl) {
        super(hostElem, zone, control, null, null);
    }

    setNewValue(v: number) {
        if (this._instance) {
            if (this._instance.getVal() !== v) {
                this._instance.setVal(v, true, false);
            }
        }
    }

    ngOnInit() {
        this._inheritedOptions = this.formService ? this.formService.options : {};
        super.ngOnInit();
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();

        let options = extend({}, this._inheritedOptions, this.inlineEvents(), this.options, this.inlineOptions());
        this._instance = new Rating(this.element, options);

        if (this.initialValue !== undefined) {
            this._instance.setVal(this.initialValue, true, false);
        }
    }
}

@Component({
    selector: 'mbsc-form-group',
    template: '<ng-content></ng-content>',
    host: {
        '[class]': "inset !== undefined ? 'mbsc-form-group-inset' : 'mbsc-form-group'"
    },
    styles: [':host { display: block; }']
})
export class MbscFormGroup implements AfterViewInit {
    @Input()
    collapsible: any = null;

    _open: boolean = false;
    @Input()
    set open(v: boolean) {
        if (this._open != v && this._instance) {
            if (v) {
                this._instance.show();
            } else {
                this._instance.hide();
            }
        }
        this._open = v;
    }

    @Input()
    inset: string;

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

    constructor(public initialElem: ElementRef) {
        this.element = initialElem;
    }

    /* AfterViewInit Interface */
    ngAfterViewInit() {
        if (this.collapsible !== null) {
            this._instance = new CollapsibleBase(this.element.nativeElement, { isOpen: this._open !== false });
        }
    }

    /* OnDestroy Interface */
    ngOnDestroy() {
        if (this._instance) {
            this._instance.destroy();
        }
    }
}

@Component({
    selector: 'mbsc-form-group-title',
    template: '<ng-content></ng-content>',
    host: {
        'class': 'mbsc-form-group-title'
    },
    styles: [':host { display: block; }']
})
export class MbscFormGroupTitle { }

@Component({
    selector: 'mbsc-form-group-content',
    template: '<ng-content></ng-content>',
    host: {
        'class': 'mbsc-form-group-content'
    },
    styles: [':host { display: block; }']
})
export class MbscFormGroupContent { }

@Component({
    selector: 'mbsc-accordion',
    template: '<ng-content></ng-content>',
    host: {
        'class': 'mbsc-accordion'
    },
    styles: [':host { display: block; }']
})
export class MbscAccordion { }