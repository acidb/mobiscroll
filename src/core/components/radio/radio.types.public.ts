import { IBaseProps } from '../../base';

export interface MbscRadioOptions extends IBaseProps {
  /**
   * Specifies the predefined color of the radio button.
   * @defaultValue undefined
   */
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  /**
   * Specifies the description text of the radio button.
   * @defaultValue undefined
   */
  description?: string;
  /**
   * Specifies the disabled state of the radio button.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Specifies the id of the radio button.
   * @defaultValue undefined
   */
  id?: string;
  /**
   * Specifies the label of the radio button.
   * @defaultValue undefined
   */
  label?: string;
  /**
   * Specifies the name of the radio button.
   * @defaultValue undefined
   */
  name?: string;
  /**
   * Sets the position of the radio button depending on the [rtl](#localization-rtl) option.
   * When in left-to-right mode, `'start'` will render the radio button to the left, and `'end'` will render it to the right.
   * In right-to-left mode, `'start'` will render the radio button to the right, and `'end'` will render it to the left.
   * @defaultValue 'end'
   */
  position?: 'start' | 'end';

  /** @hidden */
  checked?: boolean;
  /** @hidden */
  defaultChecked?: boolean;
  /** @hidden */
  modelValue?: any;
  /** @hidden */
  responsive?: any;
  /** @hidden */
  value?: any;

  /** @hidden */
  onChange?: any;
}

export interface MbscRadioGroupOptions extends IBaseProps {
  /**
   * Specifies the predefined color for all the radio buttons in the group.
   * @defaultValue undefined
   */
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  /**
   * Specifies the name for the radio button group.
   * @defaultValue undefined
   */
  name?: string;
  /**
   * Sets the position of all the radio buttons in the group depending on the [rtl](#localization-rtl) option.
   * When in left-to-right mode, `'start'` will render the radio button to the left, and `'end'` will render it to the right.
   * In right-to-left mode, `'start'` will render the radio button to the right, and `'end'` will render it to the left.
   * @defaultValue 'end'
   */
  position?: 'start' | 'end';

  /** @hidden */
  disabled?: boolean;
  /** @hidden */
  modelValue?: any;
  /** @hidden */
  value?: any;

  /** @hidden */
  onChange?: any;
}
