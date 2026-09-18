import { Directive } from '@angular/core';
import arrowDown from '../../../icons/ionicons/ios-arrow-down.svg';
import cloudUpload from '../../../icons/material/cloud-upload.svg';
import { BaseComponent } from '../../base';
import { listen, matches, trigger, unlisten, win } from '../../util/dom';
import { ANIMATION_START, CHANGE, INPUT, RESIZE } from '../../util/events';
import { gestureListener } from '../../util/gesture';
import { isArray, isEmpty, ngSetTimeout, UNDEFINED } from '../../util/misc';
import { Observable } from '../../util/observable';
import { MbscInputOptions } from './input.types.public';

/** @hidden */
export interface MbscInputState {
  disabled?: boolean;
  files?: string;
  hasFocus?: boolean;
  hasHover?: boolean;
  height?: number;
  isActive?: boolean;
  isFloatingActive?: boolean;
  isFocusVisible?: boolean;
  value?: string;
}

const resizeObservable = new Observable();
let resizeSubscribers = 0;
let resizeTimer: any;

function onWindowResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    resizeObservable.next();
  }, 100);
}

function subscribeResize(handler: any): number {
  if (!resizeSubscribers) {
    listen(win, RESIZE, onWindowResize);
  }
  resizeSubscribers++;
  return resizeObservable.subscribe(handler);
}

function unsubscribeResize(id: number) {
  resizeSubscribers--;
  resizeObservable.unsubscribe(id);
  if (!resizeSubscribers) {
    unlisten(win, RESIZE, onWindowResize);
  }
}

function checkAutoFill(el: HTMLElement): boolean {
  try {
    return matches(el, '*:-webkit-autofill');
  } catch (ex) {
    return false;
  }
}

/** @hidden */
@Directive({ selector: '[mbsc-inp-b]' })
export class InputBase extends BaseComponent<MbscInputOptions, MbscInputState> {
  public static defaults: MbscInputOptions = {
    dropdown: false,
    dropdownIcon: arrowDown,
    hideIcon: 'eye-blocked',
    inputStyle: 'underline',
    keepFocus: true,
    labelStyle: 'stacked',
    placeholder: '',
    ripple: false,
    rows: 6,
    showIcon: 'eye',
    type: 'text',
  };

  protected static _name = 'Input';

  public _cssClass?: string;
  public _disabled!: boolean;
  public _dummyElmClass?: string;
  public _endIconClass?: string;
  public _errorClass?: string;
  public _fieldSetClass?: string;
  public _hasEndIcon?: boolean;
  public _hasError?: boolean;
  public _hasStartIcon?: boolean;
  public _hidePass?: boolean;
  public _iconShow?: boolean;
  public _iconHide?: boolean;
  public _innerClass?: string;
  public _labelClass?: string;
  public _legendClass?: string;
  public _nativeElmClass?: string;
  public _passIconClass?: string;
  public _rippleClass?: string;
  public _selectIconClass?: string;
  public _startIconClass?: string;
  public _tabIndex: number | undefined;
  public _tagsArray?: string[];
  public _value?: any;

  public _tag = 'input';

  private _animateFloating?: boolean;
  private _preventFocus?: boolean;
  private _prevValue: any;
  private _shouldSize?: boolean;
  private _unsubscribe?: number;
  private _valueChecked?: boolean;
  private _unlisten?: () => void;

  public _change(val: any) {}

  public _onClick = () => {
    this._hidePass = !this._hidePass;
  };

  public _onMouseDown = (ev: any) => {
    if (this.s.tags) {
      this._preventFocus = true;
    }
  };

  public _onTagClear = (ev: any, index: number) => {
    ev.stopPropagation();
    ev.preventDefault();
    if (!this.s.disabled) {
      // If the component is disabled, we should change the value
      const value = [...this.s.pickerValue];
      value.splice(index, 1);
      // Trigger change and pass the new value in event detail
      trigger(this._el, CHANGE, value);
    }
  };

  protected _checkFloating() {
    const el = this._el;
    const s = this.s;
    const isAutoFill = checkAutoFill(el);
    let isFloatingActive = this.state.hasFocus || isAutoFill || !isEmpty(this.value);
    if (el && s.labelStyle === 'floating') {
      if (this._tag === 'select') {
        const select = el as HTMLSelectElement;
        const firstOption = select.options[0];
        isFloatingActive = !!(
          isFloatingActive ||
          select.multiple ||
          select.value ||
          (select.selectedIndex > -1 && firstOption && firstOption.label)
        );
      } else if (this.value === UNDEFINED) {
        const input = el as HTMLInputElement;
        isFloatingActive = !!(isFloatingActive || input.value);
      }
      this._valueChecked = true;
      ngSetTimeout(this, () => {
        this.setState({ isFloatingActive });
      });
    }
  }

  protected _mounted() {
    const s = this.s;
    const input: HTMLInputElement = this._el as HTMLInputElement;

    // In case of autofill in webkit browsers the animationstart event will fire
    // due to the empty animation added in the css,
    // because there's no other event in case of the initial autofill
    listen(input, ANIMATION_START, this._onAutoFill);

    if (this._tag === 'textarea') {
      listen(input, INPUT, this._sizeTextArea);
      this._unsubscribe = subscribeResize(this._sizeTextArea);
    }

    this._unlisten = gestureListener(input, {
      keepFocus: true,
      onBlur: () => {
        this.setState({
          hasFocus: false,
          isFloatingActive: !!input.value,
          isFocusVisible: false,
        });
      },
      onChange: (ev: any) => {
        if (s.type === 'file') {
          // Copy value on file upload
          const files = ev.target.files;
          const names = [];
          for (const file of files) {
            names.push(file.name);
          }
          this.setState({ files: names.join(', ') });
        }
        // TODO: we check defaultValue here not to be UNDEFINED, because the picker uses the defaultValue instead of value
        if (s.tags && s.value === UNDEFINED && s.defaultValue === UNDEFINED) {
          this.setState({ value: ev.target.value });
        }
        this._checkFloating();
        this._change(ev.target.value);
        this._emit('onChange', ev);
      },
      onFocus: (ev: any, isFocusVisible: boolean) => {
        if (!this._preventFocus) {
          this.setState({
            hasFocus: true,
            isFloatingActive: true,
            isFocusVisible: this.s.keepFocus || isFocusVisible,
          });
        }
        this._preventFocus = false;
      },
      onHoverIn: () => {
        if (!this._disabled) {
          this.setState({ hasHover: true });
        }
      },
      onHoverOut: () => {
        this.setState({ hasHover: false });
      },
      onInput: (ev: any) => {
        this._change(ev.target.value);
      },
    });
  }

  protected _render(s: MbscInputOptions, state: MbscInputState) {
    let hasEndIcon = !!(s.endIconSvg || s.endIcon);
    let pickerValue = s.pickerValue;
    const hasStartIcon = !!(s.startIconSvg || s.startIcon);
    const hasLabel = s.label !== UNDEFINED || s.hasChildren;
    const hasError = s.error!;
    const iconStartPosition = s.rtl ? 'right' : 'left';
    const iconEndPosition = s.rtl ? 'left' : 'right';
    const inputType = s.inputStyle;
    const labelType = s.labelStyle;
    const isFloating = labelType === 'floating';
    const isFloatingActive = !!(isFloating && hasLabel && (state.isFloatingActive || !isEmpty(s.value)));
    const disabled = s.disabled === UNDEFINED ? state.disabled! : s.disabled!;
    const prevS = this._prevS;
    const modelValue = s.modelValue !== UNDEFINED ? s.modelValue : s.value;
    const value = modelValue !== UNDEFINED ? modelValue : state.value !== UNDEFINED ? state.value : s.defaultValue;
    const commonClasses =
      this._theme +
      this._rtl +
      (hasError ? ' mbsc-error' : '') +
      (disabled ? ' mbsc-disabled' : '') +
      (state.hasHover ? ' mbsc-hover' : '') +
      (state.isFocusVisible && !disabled ? ' mbsc-focus' : '');

    if (s.type === 'file' && !hasEndIcon) {
      s.endIconSvg = cloudUpload;
      hasEndIcon = true;
    }

    if (s.tags) {
      if (isEmpty(pickerValue)) {
        pickerValue = [];
      }
      if (!isArray(pickerValue)) {
        pickerValue = [pickerValue];
      }
      this._tagsArray = s.pickerMap ? pickerValue.map((val: any) => s.pickerMap.get(val)) : isEmpty(value) ? [] : value.split(', ');
    }

    if (s.passwordToggle) {
      hasEndIcon = true;
      this._passIconClass =
        commonClasses +
        ' mbsc-toggle-icon' +
        ` mbsc-textfield-icon mbsc-textfield-icon-${inputType} mbsc-textfield-icon-${iconEndPosition}` +
        ` mbsc-textfield-icon-${inputType}-${iconEndPosition}` +
        (hasLabel ? ` mbsc-textfield-icon-${labelType}` : '');
      this._hidePass = this._hidePass === UNDEFINED ? s.type === 'password' : this._hidePass;
    }

    this._hasStartIcon = hasStartIcon;
    this._hasEndIcon = hasEndIcon;
    this._hasError = hasError;
    this._disabled = disabled;
    this._value = value;

    // Outer element classes
    this._cssClass =
      this._className +
      this._hb +
      commonClasses +
      ` mbsc-form-control-wrapper mbsc-textfield-wrapper mbsc-font` +
      ` mbsc-textfield-wrapper-${inputType}` +
      (disabled ? ` mbsc-disabled` : '') +
      (hasLabel ? ` mbsc-textfield-wrapper-${labelType}` : '') +
      (hasStartIcon ? ` mbsc-textfield-wrapper-has-icon-${iconStartPosition} ` : '') +
      (hasEndIcon ? ` mbsc-textfield-wrapper-has-icon-${iconEndPosition} ` : '');

    // Label classes
    if (hasLabel) {
      this._labelClass =
        commonClasses +
        ` mbsc-label mbsc-label-${labelType} mbsc-label-${inputType}-${labelType}` +
        (hasStartIcon ? ` mbsc-label-${inputType}-${labelType}-has-icon-${iconStartPosition} ` : '') +
        (hasEndIcon ? ` mbsc-label-${inputType}-${labelType}-has-icon-${iconEndPosition} ` : '') +
        (isFloating && this._animateFloating ? ' mbsc-label-floating-animate' : '') +
        (isFloatingActive ? ' mbsc-label-floating-active' : '');
    }

    // Inner element classes
    this._innerClass =
      commonClasses + ` mbsc-textfield-inner mbsc-textfield-inner-${inputType}` + (hasLabel ? ` mbsc-textfield-inner-${labelType}` : '');

    // Icon classes
    if (hasStartIcon) {
      this._startIconClass =
        commonClasses +
        ` mbsc-textfield-icon mbsc-textfield-icon-${inputType} mbsc-textfield-icon-${iconStartPosition}` +
        ` mbsc-textfield-icon-${inputType}-${iconStartPosition}` +
        (hasLabel ? ` mbsc-textfield-icon-${labelType}` : '');
    }

    if (hasEndIcon) {
      this._endIconClass =
        commonClasses +
        ` mbsc-textfield-icon mbsc-textfield-icon-${inputType} mbsc-textfield-icon-${iconEndPosition}` +
        ` mbsc-textfield-icon-${inputType}-${iconEndPosition}` +
        (hasLabel ? ` mbsc-textfield-icon-${labelType}` : '');
    }

    // Native element classes
    this._nativeElmClass =
      commonClasses +
      ' ' +
      (s.inputClass || '') +
      ` mbsc-textfield mbsc-textfield-${inputType}` +
      (s.dropdown ? ' mbsc-select' : '') +
      (hasLabel ? ` mbsc-textfield-${labelType} mbsc-textfield-${inputType}-${labelType}` : '') +
      (isFloatingActive ? ' mbsc-textfield-floating-active' : '') +
      (hasStartIcon
        ? ` mbsc-textfield-has-icon-${iconStartPosition} mbsc-textfield-${inputType}-has-icon-${iconStartPosition}` +
          (hasLabel ? ` mbsc-textfield-${inputType}-${labelType}-has-icon-${iconStartPosition}` : '')
        : '') +
      (hasEndIcon
        ? ` mbsc-textfield-has-icon-${iconEndPosition} mbsc-textfield-${inputType}-has-icon-${iconEndPosition}` +
          (hasLabel ? ` mbsc-textfield-${inputType}-${labelType}-has-icon-${iconEndPosition}` : '')
        : '');

    // Select
    if (this._tag === 'select' || s.dropdown) {
      this._selectIconClass =
        `mbsc-select-icon mbsc-select-icon-${inputType}` +
        this._rtl +
        this._theme +
        (hasLabel ? ` mbsc-select-icon-${labelType}` : '') +
        (hasStartIcon ? ` mbsc-select-icon-${iconStartPosition}` : '') +
        (hasEndIcon ? ` mbsc-select-icon-${iconEndPosition}` : '');
    }

    // Textarea
    if (this._tag === 'textarea' || s.tags) {
      this._cssClass += ' mbsc-textarea-wrapper';
      this._innerClass += ' mbsc-textarea-inner';
      this._nativeElmClass += ' mbsc-textarea';

      // Update the size of the textarea on certain setting changes
      if (
        this._tag === 'textarea' &&
        (value !== this._prevValue ||
          s.inputStyle !== prevS.inputStyle ||
          s.labelStyle !== prevS.labelStyle ||
          s.rows !== prevS.rows ||
          s.theme !== prevS.theme)
      ) {
        this._shouldSize = true;
      }
      this._prevValue = value;
    }

    if (s.tags) {
      this._innerClass += ' mbsc-textfield-tags-inner';
    }

    if (s.type === 'file') {
      this._dummyElmClass = this._nativeElmClass;
      this._nativeElmClass += ' mbsc-textfield-file';
    }

    // Error message classes
    this._errorClass =
      this._theme +
      this._rtl +
      ` mbsc-error-message mbsc-error-message-${inputType}` +
      (hasLabel ? ` mbsc-error-message-${labelType}` : '') +
      (hasStartIcon ? ` mbsc-error-message-has-icon-${iconStartPosition}` : '') +
      (hasEndIcon ? ` mbsc-error-message-has-icon-${iconEndPosition}` : '');

    if (s.notch && inputType === 'outline') {
      this._fieldSetClass =
        'mbsc-textfield-fieldset' +
        commonClasses +
        (hasStartIcon ? ` mbsc-textfield-fieldset-has-icon-${iconStartPosition}` : '') +
        (hasEndIcon ? ` mbsc-textfield-fieldset-has-icon-${iconEndPosition}` : '');

      this._legendClass =
        'mbsc-textfield-legend' +
        this._theme +
        (isFloatingActive || (hasLabel && labelType === 'stacked') ? ' mbsc-textfield-legend-active' : '');
    }

    if (s.ripple) {
      this._rippleClass =
        'mbsc-textfield-ripple' + this._theme + (hasError ? ' mbsc-error' : '') + (state.hasFocus ? ' mbsc-textfield-ripple-active' : '');
    }

    if (this._valueChecked) {
      this._animateFloating = true;
    }
  }

  protected _updated() {
    // Update the size of the textarea on certain setting changes
    if (this._shouldSize) {
      this._shouldSize = false;
      ngSetTimeout(this, () => {
        this._sizeTextArea();
      });
    }
    this._checkFloating();
  }

  protected _destroy() {
    unlisten(this._el, ANIMATION_START, this._onAutoFill);
    unlisten(this._el, INPUT, this._sizeTextArea);
    if (this._unsubscribe) {
      unsubscribeResize(this._unsubscribe);
    }
    if (this._unlisten) {
      this._unlisten();
    }
  }

  protected _sizeTextArea = () => {
    const input = this._el;
    const rowNr: any = this.s.rows;
    const lineHeight = 24;
    let height: number;
    let lineNr: number;
    let line: number;

    if (input.offsetHeight) {
      input.style.height = '';

      line = input.scrollHeight - input.offsetHeight;
      height = input.offsetHeight + (line > 0 ? line : 0);
      lineNr = Math.round(height / lineHeight);

      if (lineNr > rowNr) {
        height = lineHeight * rowNr + (height - lineNr * lineHeight);
        input.style.overflow = 'auto';
      } else {
        input.style.overflow = '';
      }

      if (height) {
        input.style.height = height + 'px';
      }
    }
  };

  private _onAutoFill = () => {
    if (this.s.labelStyle === 'floating' && checkAutoFill(this._el)) {
      this.setState({ isFloatingActive: true });
    }
  };
}
