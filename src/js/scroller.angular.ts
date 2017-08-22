import {
    extend,
    mobiscroll,
    MbscControlBase,
    Directive,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    NgZone,
    Optional,
    NgControl,
    MbscInputService
} from './frameworks/angular';

import Scroller from './classes/scroller';
import { MbscScrollerOptions } from './core/core';

@Directive({
    selector: '[mbsc-scroller]',
    exportAs: 'mobiscroll'
})
export class MbscScroller extends MbscControlBase {
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

    constructor(initialElement: ElementRef, zone: NgZone, @Optional() control: NgControl, @Optional() inputService: MbscInputService) {
        super(initialElement, zone, control, inputService);
    }

    /**
     * If the new value differs from the current value
     * sets the new value to the instance and writes it to the input
     * @param v The new value to be set
     */
    setNewValue(v: string) {
        if (this._instance) {
            let innerValue: string = this._instance.getVal();
            // set value to instance if differs from the model
            if (innerValue !== v) {
                this._instance.setVal(v, true, false);
                if (this._inputService && this._inputService.input) {
                    this._inputService.input.innerValue = this._instance._value;
                }
            }
        }
    }

    /**
     * Called after the view is initialized.
     * All the elements are in the DOM and ready for the initialization of the mobiscroll.
     */
    ngAfterViewInit() {
        super.ngAfterViewInit();

        let options = extend({}, this.options, this.optionExtensions);
        this._instance = new Scroller(this.element, options);

        // set the initial value - needed when there's no ngModel in use
        if (this.initialValue !== undefined) {
            this._instance.setVal(this.initialValue, true, false);
        }
    }
}