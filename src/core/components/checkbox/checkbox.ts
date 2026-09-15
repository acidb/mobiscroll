import { Directive } from '@angular/core';
import { BaseComponent } from '../../base';
import { gestureListener } from '../../util/gesture';
import { emptyOrTrue, UNDEFINED } from '../../util/misc';
import { MbscCheckboxOptions } from './checkbox.types.public';

/** @hidden */
export interface MbscCheckboxState {
  checked?: boolean;
  disabled?: boolean;
  hasFocus?: boolean;
  hasHover?: boolean;
  isActive?: boolean;
}

/** @hidden */
@Directive({ selector: '[mbsc-cb-b]' })
export class CheckboxBase extends BaseComponent<MbscCheckboxOptions, MbscCheckboxState> {
  public static defaults: MbscCheckboxOptions = {
    position: 'start',
  };

  protected static _name = 'Checkbox';

  public _boxClass?: string;
  public _checked!: boolean;
  public _cssClass?: string;
  public _disabled?: boolean;
  public _input!: HTMLInputElement;

  private _unlisten?: () => void;

  public _change(checked: boolean) {}

  public _onChange = (ev: any) => {
    const s = this.s;
    const checked = ev.target.checked;

    // Uncontrolled
    if (s.checked === UNDEFINED) {
      this._checked = checked;
      this.setState({ checked });
    }
    this._change(checked);

    if (s.onChange) {
      s.onChange(ev);
    }
  };

  public _setInput = (input: HTMLInputElement) => {
    this._input = input;
  };

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

  protected _render(s: MbscCheckboxOptions, state: MbscCheckboxState) {
    const disabled = s.disabled === UNDEFINED ? state.disabled! : emptyOrTrue(s.disabled);
    const position = s.position === 'start' ? (s.rtl ? 'right' : 'left') : s.rtl ? 'left' : 'right';
    const modelValue = s.modelValue !== UNDEFINED ? s.modelValue : s.checked;

    this._disabled = disabled;
    this._checked =
      modelValue !== UNDEFINED
        ? emptyOrTrue(modelValue) // Controlled
        : state.checked === UNDEFINED
        ? emptyOrTrue(s.defaultChecked)
        : state.checked; // Uncontrolled

    this._cssClass =
      'mbsc-checkbox mbsc-form-control-wrapper mbsc-font ' +
      this._className +
      this._theme +
      this._rtl +
      this._hb +
      ' mbsc-checkbox-' +
      position +
      (disabled ? ' mbsc-disabled' : '');

    this._boxClass =
      'mbsc-checkbox-box' +
      this._theme +
      ' mbsc-checkbox-box-' +
      position +
      (state.hasFocus && !disabled ? ' mbsc-focus' : '') +
      (state.hasHover && !disabled ? ' mbsc-hover' : '') +
      (state.isActive && !disabled ? ' mbsc-active' : '') +
      (s.color ? ' mbsc-checkbox-box-' + s.color : '') +
      (disabled ? ' mbsc-disabled' : '') +
      (this._checked ? ' mbsc-checked' : '');
  }

  protected _destroy() {
    if (this._unlisten) {
      this._unlisten();
    }
  }
}
