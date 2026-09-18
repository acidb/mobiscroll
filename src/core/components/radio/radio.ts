import { Directive } from '@angular/core';
import { BaseComponent } from '../../base';
import { setRadio, subscribeRadio, unsubscribeRadio } from '../../shared/radio-helper';
import { gestureListener } from '../../util/gesture';
import { emptyOrTrue, UNDEFINED } from '../../util/misc';
import { MbscRadioGroupOptions, MbscRadioOptions } from './radio.types.public';

let guid = 1;

/** @hidden */
export interface MbscRadioState {
  checked?: boolean;
  disabled?: boolean;
  hasFocus?: boolean;
  hasHover?: boolean;
  isActive?: boolean;
}

/** @hidden */
@Directive({ selector: '[mbsc-radio-b]' })
export class RadioBase extends BaseComponent<MbscRadioOptions, MbscRadioState> {
  public static defaults: MbscRadioOptions = {
    position: 'start',
  };

  protected static _name = 'Radio';

  public _boxClass?: string;
  public _checked!: boolean;
  public _cssClass?: string;
  public _disabled?: boolean;
  public _name!: string;
  public _id?: string;
  public _input!: HTMLInputElement;
  public _value: any;

  public _onGroupChange?: (ev: any, value: any) => void;

  private _unlisten?: () => void;
  private _unsubscribe?: number;

  public _setInput = (inp: HTMLInputElement) => {
    this._input = inp;
  };

  public _change(checked: boolean) {}

  public _onChange = (ev: any) => {
    const s = this.s;
    const checked = ev.target.checked;

    this._change(checked);

    // Notify group
    if (this._onGroupChange) {
      this._onGroupChange(ev, this._value);
    }

    this._toggle(checked);

    if (s.onChange) {
      s.onChange(ev);
    }
  };

  public _onValueChange = (value: any) => {
    const s = this.s;
    const checked = value === this._value;
    // Uncontrolled
    if (s.checked === UNDEFINED) {
      this.setState({ checked });
    }
    this._change(checked);
  };

  public _groupOptions({ color, disabled, name, onChange, position, rtl, value }: MbscRadioGroupOptions) {
    const s = this.s;
    const state = this.state;
    const isRtl = rtl === UNDEFINED ? s.rtl : rtl;
    const col = color === UNDEFINED ? s.color : color;
    const p = position === UNDEFINED ? s.position : position;
    const pos = p === 'start' ? (s.rtl ? 'right' : 'left') : s.rtl ? 'left' : 'right';
    const dis = disabled === UNDEFINED ? (s.disabled === UNDEFINED ? state.disabled! : emptyOrTrue(s.disabled)) : emptyOrTrue(disabled);
    const modelValue = s.modelValue !== UNDEFINED ? s.modelValue === s.value : s.checked;
    const checked =
      modelValue !== UNDEFINED
        ? emptyOrTrue(modelValue) // Controlled
        : state.checked === UNDEFINED
        ? emptyOrTrue(s.defaultChecked)
        : state.checked; // Uncontrolled

    this._id = s.id === UNDEFINED ? this._id || 'mbsc-radio-' + guid++ : s.id;
    this._value = s.value === UNDEFINED ? this._id : s.value;
    this._onGroupChange = onChange;
    this._name = name === UNDEFINED ? s.name! : name;
    this._rtl = isRtl ? ' mbsc-rtl' : ' mbsc-ltr';
    this._checked = value === UNDEFINED ? checked : value === this._value;
    this._disabled = dis;

    this._cssClass =
      'mbsc-radio mbsc-form-control-wrapper mbsc-font ' +
      this._className +
      this._theme +
      this._rtl +
      this._hb +
      ' mbsc-radio-' +
      pos +
      (dis ? ' mbsc-disabled' : '');

    this._boxClass =
      'mbsc-radio-box' +
      this._theme +
      ' mbsc-radio-box-' +
      pos +
      (state.hasFocus && !dis ? ' mbsc-focus' : '') +
      (state.hasHover && !dis ? ' mbsc-hover' : '') +
      (state.isActive && !dis ? ' mbsc-active' : '') +
      (col ? ' mbsc-radio-box-' + col : '') +
      (dis ? ' mbsc-disabled' : '') +
      (this._checked ? ' mbsc-checked' : '');
  }

  protected _toggle(checked: boolean) {
    // Uncontrolled
    if (this.s.checked === UNDEFINED) {
      this.setState({ checked });
    }
    if (checked) {
      setRadio(this._name, this._value);
    }
  }

  protected _mounted() {
    this._unlisten = gestureListener(this._input, {
      onBlur: () => {
        this.setState({ hasFocus: false });
      },
      onFocus: () => {
        this.setState({ hasFocus: true });
      },
      onHoverIn: () => {
        this.setState({ hasHover: true });
      },
      onHoverOut: () => {
        this.setState({ hasHover: false });
      },
      onPress: () => {
        this.setState({ isActive: true });
      },
      onRelease: () => {
        this.setState({ isActive: false });
      },
    });
  }

  protected _updated() {
    if (this._name && !this._unsubscribe) {
      this._unsubscribe = subscribeRadio(this._name, this._onValueChange);
    }
  }

  protected _destroy() {
    if (this._unsubscribe) {
      unsubscribeRadio(this._name, this._unsubscribe);
      this._unsubscribe = UNDEFINED;
    }
    if (this._unlisten) {
      this._unlisten();
    }
  }
}
