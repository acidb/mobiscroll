import { Directive } from '@angular/core';
import { BaseComponent } from '../../base';
import { UNDEFINED } from '../../util/misc';
import { MbscRadioGroupOptions } from './radio.types.public';

let guid = 1;

/** @hidden */
@Directive({ selector: '[mbsc-rg-b]' })
export class RadioGroupBase extends BaseComponent<MbscRadioGroupOptions, any> {
  public static defaults: MbscRadioGroupOptions = {};

  // TODO: check why is this commented
  // protected static _name = 'RadioGroup';

  public _groupClass?: string;
  public _groupOpt: any;
  public _name!: string;

  private _id = 'mbsc-radio-group' + guid++;

  public _onChange = (ev: any, val: any) => {
    const s = this.s;
    this.value = val;
    this._change(val);
    if (s.onChange) {
      s.onChange(ev);
    }
  };

  public _change(value: any) {}

  protected _render(s: MbscRadioGroupOptions) {
    this._name = s.name === UNDEFINED ? this._id : s.name;
    this._groupClass = 'mbsc-radio-group' + this._theme + this._rtl;
    this._groupOpt = {
      color: s.color,
      disabled: s.disabled,
      name: this._name,
      onChange: this._onChange,
      position: s.position,
      rtl: s.rtl,
      value: s.modelValue !== UNDEFINED ? s.modelValue : s.value,
    };
  }
}
