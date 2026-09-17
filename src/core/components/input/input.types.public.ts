import { IBaseProps } from '../../base';

export interface MbscInputOptions extends IBaseProps {
  /**
   * Specifies the disabled state of the input.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Specifies the icon which will be displayed at the end of the input.
   * Use the [startIcon](#opt-startIcon) option for specifying an icon at the start.
   * @defaultValue undefined
   */
  endIcon?: string;
  /**
   * If `true`, the input will be displayed with error styles.
   * @defaultValue false
   */
  error?: boolean;
  /**
   * Error message for the input. If the [error](#opt-error) option is set to `true`, the message will be displayed.
   * @defaultValue undefined
   */
  errorMessage?: string;
  /**
   * Specifies the style of the input. Possible values:
   * - `'underline'`
   * - `'box'`
   * - `'outline'`
   *
   * The default value depends on the [theme](#opt-theme):
   * - iOS: `'underline'`
   * - Material: `'box'`
   * - Windows: `'outline'`
   *
   * @defaultValue undefined
   */
  inputStyle?: 'underline' | 'box' | 'outline';
  /**
   * Specifies the label of the input.
   * @defaultValue undefined
   */
  label?: string;
  /**
   * Specifies the position of the input label. Possible values:
   * - `'stacked'`
   * - `'inline'`
   * - `'floating'`
   *
   * The default value depends on the [theme](#opt-theme):
   * - iOS: `'inline'`
   * - Material: `'floating'`
   * - Windows: `'stacked'`
   *
   * @defaultValue undefined
   */
  labelStyle?: 'stacked' | 'inline' | 'floating';
  /**
   * Specifies the password toggle visibility on a password field.
   * @defaultValue false
   */
  passwordToggle?: boolean;
  /**
   * Specifies the placeholder text for the input.
   * @defaultValue undefined
   */
  placeholder?: string;
  /**
   * Specifies the icon which will be displayed at the start of the input.
   * Use the [endIcon](#opt-endIcon) option for specifying an icon at the end.
   * @defaultValue undefined
   */
  startIcon?: string;

  // #region Hidden options

  /** @hidden */
  clearIcon?: string;
  /** @hidden */
  defaultValue?: string;
  /** @hidden */
  dropdown?: boolean;
  /** @hidden */
  dropdownIcon?: string;
  /** @hidden */
  endIconSrc?: string;
  /** @hidden */
  endIconSvg?: string;
  /** @hidden */
  hideIcon?: string;
  /** @hidden */
  hideIconSvg?: string;
  /** @hidden */
  inputClass?: string;
  /** @hidden */
  keepFocus?: boolean;
  /** @hidden */
  modelValue?: any;
  /** @hidden */
  notch?: boolean;
  /** @hidden */
  pickerMap?: any;
  /** @hidden */
  pickerValue?: any;
  /** @hidden */
  responsive?: any;
  /** @hidden */
  ripple?: boolean;
  /** @hidden */
  rows?: number;
  /** @hidden */
  showIcon?: string;
  /** @hidden */
  showIconSvg?: string;
  /** @hidden */
  startIconSrc?: string;
  /** @hidden */
  startIconSvg?: string;
  /** @hidden */
  tags?: boolean;
  /** @hidden */
  type?: string;
  /** @hidden */
  value?: string;

  // Native input options

  /** @hidden */
  accept?: string;
  /** @hidden */
  autoCapitalize?: string;
  /** @hidden */
  autoComplete?: string;
  /** @hidden */
  autoCorrect?: string;
  /** @hidden */
  autoFocus?: boolean;
  /** @hidden */
  min?: number;
  /** @hidden */
  max?: number;
  /** @hidden */
  minLength?: number;
  /** @hidden */
  maxLength?: number;
  /** @hidden */
  pattern?: string;
  /** @hidden */
  readOnly?: boolean;
  /** @hidden */
  required?: boolean;
  /** @hidden */
  spellCheck?: boolean;
  /** @hidden */
  step?: number;

  /** @hidden */
  onChange?: any;
  /** @hidden */
  onClick?: any;
  /** @hidden */
  onFocus?: any;
  /** @hidden */
  onInput?: any; // Needed for Preact

  // #endregion Hidden options
}

export interface MbscDropdownOptions extends MbscInputOptions {
  /** @hidden */
  placeholder?: string;
  /** @hidden */
  passwordToggle?: boolean;
}

export interface MbscTextareaOptions extends MbscInputOptions {
  /**
   * Maximum number of rows to display before the textarea becomes scrollable.
   * @defaultValue 6
   */
  rows?: number;

  /** @hidden */
  passwordToggle?: boolean;
}
