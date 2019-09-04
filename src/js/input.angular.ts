import {
    extend,
    MbscBase,
    ViewChild,
    OnInit,
    emptyOrTrue,
    ControlValueAccessor,
    Component,
    Input,
    Output,
    EventEmitter,
    NgControl,
    ElementRef,
    Optional,
    MbscOptionsService,
    MbscInputService,
    NgModule,
    NgZone,
    FormsModule,
    CommonModule
} from './frameworks/angular';

import { Input as FormInput, MbscFormOptions } from './classes/input';

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
    @ViewChild('initElement', { static: false } as any)
    public _initElem: ElementRef;


    constructor(hostElem: ElementRef, protected _formService: MbscOptionsService, zone: NgZone) {
        super(hostElem, zone);
    }


    /* OnInit Interface */

    ngOnInit() {
        // get inherited options from the parent form
        this._inheritedOptions = this._formService ? this._formService.options : {};
    }
}

export class MbscFormValueBase extends MbscFormBase implements ControlValueAccessor {
    _value: any;
    _readonly: boolean;

    @Input()
    set readonly(val: any) {
        // sets the readonly setting to true if empty string is provided, aka without value (ex. <mbsc-rating readonly>)
        this._readonly = emptyOrTrue(val);
    }

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
     * To resize the textarea when programmatically changing it's value
     */
    @Input()
    set value(v: any) {
        this._value = v;
        this.refresh();
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


    constructor(hostElem: ElementRef, @Optional() _formService: MbscOptionsService, protected _control: NgControl, protected _noOverride: boolean, zone: NgZone) {
        super(hostElem, _formService, zone);
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

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }

    /**
     * Called when the model changed
     * @param v the new value of the model
     * To resize the textarea when programmatically changing it's value
     */
    writeValue(v: any) {
        this._value = v;
        this.refresh();
    }

    refresh() {
        if (this.instance && this.instance.refresh) {
            setTimeout(() => {
                this.instance.refresh();
            });
        }
    }
}

export class MbscInputBase extends MbscFormValueBase {
    @Input()
    autocomplete: 'on' | 'off';
    @Input()
    autocapitalize: string;
    @Input()
    autocorrect: string;
    @Input()
    spellcheck: string;
    @Input()
    autofocus: string;

    @Input()
    minlength: number;
    @Input()
    maxlength: number;
    @Input()
    required: string;

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
     *  Specify the upload icon.
     */
    @Input('icon-upload')
    iconUpload: boolean;

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

    /**
     * Placeholder for the control
     */
    @Input()
    placeholder: string = '';


    constructor(initialElem: ElementRef, @Optional() _formService: MbscOptionsService, _control: NgControl, noOverride: boolean, zone: NgZone) {
        super(initialElem, _formService, _control, noOverride, zone);
    }
}

@Component({
    selector: 'mbsc-input',
    host: { '[class.mbsc-control-ng]': 'controlNg' },
    template: `
        <label 
            [class.mbsc-err]="error" [class.mbsc-select]="dropdown"
            [class.mbsc-input-box]="inputStyle == 'box'"
            [class.mbsc-input-outline]="inputStyle == 'outline'"
            [class.mbsc-label-stacked]="labelStyle == 'stacked'"
            [class.mbsc-label-inline]="labelStyle == 'inline'"
            [class.mbsc-label-floating]="labelStyle == 'floating'"
        >
            <ng-content></ng-content>
            <span class="mbsc-input-wrap">
                <input #initElement [type]="type" [placeholder]="placeholder" [(ngModel)]="innerValue" (blur)="onTouch($event)"
                    [attr.name]="name"
                    [attr.data-icon]="icon ? icon : null"
                    [attr.data-icon-align]="iconAlign ? iconAlign : null"
                    [attr.data-password-toggle]="passwordToggle ? 'true': null"
                    [attr.data-icon-show]="iconShow ? iconShow : null"
                    [attr.data-icon-hide]="iconHide ? iconHide : null"
                    [attr.data-icon-upload]="iconUpload ? iconUpload : null"
                    [attr.min]="min"
                    [attr.max]="max"
                    [attr.minlength]="minlength"
                    [attr.maxlength]="maxlength"
                    [attr.autocomplete]="autocomplete" 
                    [attr.autocapitalize]="autocapitalize"
                    [attr.autocorrect]="autocorrect"
                    [attr.spellcheck]="spellcheck"
                    [attr.autofocus]="autofocus"
                    [attr.step]="step"
                    [attr.pattern]="pattern"
                    [attr.required]="required"
                    [attr.accept]="accept"
                    [attr.multiple]="multiple"
                    [disabled]="disabled"
                    [attr.readonly]="_readonly" />
                <span *ngIf="dropdown" class="mbsc-select-ic mbsc-ic mbsc-ic-arrow-down5"></span>
                <span *ngIf="error && errorMessage" class="mbsc-err-msg">{{errorMessage}}</span>
            </span>
        </label>
    `,
    providers: [MbscInputService]
})
export class MbscInput extends MbscInputBase {
    instance: FormInput;

    @Input()
    min: number;
    @Input()
    max: number;
    
    @Input()
    step: number;
    @Input()
    pattern: string;
    
    @Input()
    accept: string;
    @Input()
    multiple: string;

    @Input()
    controlNg: boolean = true;

    @Input()
    dropdown: boolean = false;

    constructor(initialElem: ElementRef, @Optional() _formService: MbscOptionsService, protected _inputService: MbscInputService, @Optional() _control: NgControl, zone: NgZone) {
        super(initialElem, _formService, _control, _inputService.isControlSet, zone);
        _inputService.input = this;
    }

    initControl() {
        let options = extend({}, this._inheritedOptions, this.options, this.inlineOptionsObj);
        this.instance = new FormInput(this._initElem.nativeElement, options);
        setTimeout(() => {
            this.instance.refresh(); // needed to check for floating labels when using reactive forms
        });
    }
}

@NgModule({
    imports: [FormsModule, CommonModule],
    declarations: [MbscInput],
    exports: [MbscInput]
})
export class MbscInputModule { }