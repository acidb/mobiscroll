import { IBaseProps } from '../../base';

export interface MbscSwitchOptions extends IBaseProps {
  /**
   * Specifies the predefined color of the switch.
   * @defaultValue undefined
   */
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  /**
   * Specifies the description text of the switch.
   * @defaultValue undefined
   */
  description?: string;
  /**
   * Specifies the disabled state of the switch.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Specifies the label of the switch.
   * @defaultValue undefined
   */
  label?: string;
  /**
   * Sets the position of the switch depending on the [rtl](#localization-rtl) option.
   * When in left-to-right mode, `'start'` will render the switch to the left, and `'end'` will render it to the right.
   * In right-to-left mode, `'start'` will render the switch to the right, and `'end'` will render it to the left.
   * @defaultValue 'end'
   */
  position?: 'start' | 'end';

  /** @hidden */
  checked?: boolean;
  /** @hidden */
  defaultChecked?: boolean;
  /** @hidden */
  inputStyle?: 'underline' | 'box' | 'outline';
  /** @hidden */
  modelValue?: boolean;
  /** @hidden */
  responsive?: any;
  /** @hidden */
  value?: any;

  /** @hidden */
  onChange?: any;
}
