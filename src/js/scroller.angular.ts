import {
    Directive,
    Component,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    NgZone,
    Optional,
    ViewContainerRef,
    NgModule,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl } from '@angular/forms';
import {
    extend,
    MbscScrollerBase,
    MbscScrollerBaseModule,
    INPUT_TEMPLATE,
    MbscInputService,
    MbscOptionsService,
} from './frameworks/angular';

import { Scroller, MbscScrollerOptions } from './classes/scroller';
import { MbscInputModule } from './input.angular';
export { MbscScrollerOptions };

@Directive({
    selector: '[mbsc-scroller]',
    exportAs: 'mobiscroll'
})
export class MbscScroller extends MbscScrollerBase {
    instance: Scroller;

    /**
     * The mobiscroll settings for the directive are passed through this input.
     */
    @Input('mbsc-options')
    public options: MbscScrollerOptions = {};

    /** 
     * Called when the model changes
     * Used only without FormControl 
     */
    @Input('mbsc-scroller')
    set value(v: string) {
        this.setNewValueProxy(v);
    }

    /**
     * EventEmitter for the value change
     * Used only without FormControl
     */
    @Output('mbsc-scrollerChange')
    onChangeEmitter: EventEmitter<string> = new EventEmitter<string>();

    constructor(initialElement: ElementRef, zone: NgZone, @Optional() control: NgControl, @Optional() inputService: MbscInputService, @Optional() public optionService: MbscOptionsService, view: ViewContainerRef) {
        super(initialElement, zone, control, inputService, view);
    }

    /**
     * If the new value differs from the current value
     * sets the new value to the instance and writes it to the input
     * @param v The new value to be set
     */
    setNewValue(v: string) {
        if (this.instance) {
            let innerValue: string = this.instance.getVal();
            // set value to instance if differs from the model
            if (innerValue !== v) {
                this.instance.setVal(v, true, false);
                if (this._inputService && this._inputService.input) {
                    this._inputService.input.innerValue = this.instance._value;
                }
            }
        }
    }

    initControl() {
        let options = extend({}, this.optionService ? this.optionService.options : {}, this.options, this.inlineOptionsObj, this.optionExtensions);
        this.instance = new Scroller(this.element, options);

        // set the initial value - needed when there's no ngModel in use
        if (this.initialValue !== undefined) {
            this.instance.setVal(this.initialValue, true, false);
        }
    }
}

@Component({
    selector: 'mbsc-scroller',
    exportAs: 'mobiscroll',
    template: INPUT_TEMPLATE
})
export class MbscScrollerComponent extends MbscScroller {
    @Input('icon')
    inputIcon: string;
    @Input('icon-align')
    iconAlign: 'left' | 'right';
    @Input()
    name: string;
    @Input()
    error: boolean;
    @Input()
    errorMessage: string = '';
    @Input()
    options: MbscScrollerOptions;
    @Input()
    placeholder: string = '';

    constructor(initialElem: ElementRef, zone: NgZone, @Optional() control: NgControl, @Optional() inputService: MbscInputService, @Optional() optionService: MbscOptionsService) {
        super(initialElem, zone, control, inputService, optionService, null);
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.setThemeClasses();
    }
}

@NgModule({
    imports: [CommonModule, MbscScrollerBaseModule, MbscInputModule],
    declarations: [MbscScroller, MbscScrollerComponent],
    exports: [MbscScroller, MbscScrollerComponent]
})
export class MbscScrollerModule { }