import { Directive } from '@angular/core';
import { BaseComponent } from '../../base';
import { listen, trigger, unlisten } from '../../util/dom';
import { CHANGE } from '../../util/events';
import { emptyOrTrue, isEmpty, UNDEFINED } from '../../util/misc';
import { MbscStepperOptions } from './stepper.types.public';

/** @hidden */
export interface MbscStepperState {
  value?: number;
  disabled?: boolean;
}

/** @hidden */
@Directive({ selector: '[mbsc-stepper]' })
export class StepperBase extends BaseComponent<MbscStepperOptions, MbscStepperState> {
  public static defaults: MbscStepperOptions = {
    inputPosition: 'center',
  };

  protected static _name = 'Stepper';

  public _cssClass?: string;
  public _disabled?: boolean;
  public _disabledMinus?: boolean;
  public _disabledPlus?: boolean;
  public _input!: HTMLInputElement;
  public _max!: number;
  public _min!: number;
  public _step!: number;
  public _value!: number;

  private _changed?: boolean;

  public _onChange = (ev: any) => {
    const s = this.s;
    const val = this._round(+ev.target.value);
    // Write back validated value
    ev.target.value = val + '';

    // Uncontrolled
    if (s.value === UNDEFINED) {
      this.setState({ value: val });
    }

    this._change(val);

    if (s.onChange) {
      s.onChange(ev);
    }
  };

  public _onMinusClick = () => {
    this._setValue(this._value - this._step);
  };

  public _onPlusClick = () => {
    this._setValue(this._value + this._step);
  };

  public _setInput = (input: HTMLInputElement) => {
    this._input = input;
  };

  public _onLabelClick = (ev: any) => {
    ev.preventDefault();
  };

  public _change(val: number) {}

  protected _mounted() {
    listen(this._input, CHANGE, this._onChange);
  }

  protected _render(s: MbscStepperOptions, state: MbscStepperState) {
    this._max = isEmpty(s.max) ? 100 : +s.max!;
    this._min = isEmpty(s.min) ? 0 : +s.min!;
    this._step = isEmpty(s.step) ? 1 : +s.step!;

    const disabled = s.disabled === UNDEFINED ? state.disabled! : emptyOrTrue(s.disabled);
    const defVal = s.defaultValue !== UNDEFINED ? s.defaultValue : this._min || 0;
    const modelValue = s.modelValue !== UNDEFINED ? s.modelValue : s.value;
    const val =
      modelValue !== UNDEFINED
        ? modelValue // Controlled
        : state.value !== UNDEFINED
        ? state.value
        : defVal; // Uncontrolled

    this._value = this._round(val);
    this._changed = this._value !== +val;
    this._disabled = disabled;
    this._disabledMinus = this._value === this._min || disabled;
    this._disabledPlus = this._value === this._max || disabled;
    this._cssClass =
      'mbsc-stepper mbsc-form-control-wrapper mbsc-font mbsc-' +
      (s.color || 'color-none') +
      this._theme +
      this._rtl +
      this._hb +
      ' mbsc-stepper-' +
      s.inputPosition +
      (disabled ? ' mbsc-disabled' : '');
  }

  protected _updated() {
    this._input.value = this._value + '';
    if (this._changed) {
      trigger(this._input, CHANGE);
      this._changed = false;
    }
  }

  protected _destroy() {
    unlisten(this._input, CHANGE, this._onChange);
  }

  private _round(v: number) {
    const step = this._step;
    const scale = Math.abs(step) < 1 ? (step + '').split('.')[1].length : 0;
    return +Math.min(this._max, Math.max(Math.round(v / step) * step, this._min)).toFixed(scale);
  }

  private _setValue(val: number) {
    const oldValue = +this._input.value;
    const newValue = this._round(val);
    if (oldValue !== newValue) {
      this._input.value = newValue + '';
      trigger(this._input, CHANGE);
    }
  }
}
