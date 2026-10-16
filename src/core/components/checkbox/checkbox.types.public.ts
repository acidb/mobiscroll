import { IBaseProps } from '../../base';

export interface MbscCheckboxOptions extends IBaseProps {
  /**
   * Specifies the checked state of the checkbox.
   * When set, the checkbox is controlled: its state changes only when this option is updated,
   * e.g. from a change event handler.
   * @nonAngularText Use the [defaultChecked](#opt-defaultChecked) option to specify the initial state of an uncontrolled checkbox.
   * @defaultValue undefined
   * @option react
   * @option angular
   */
  checked?: boolean;
  /**
   * Specifies the predefined color of the checkbox.
   * @defaultValue undefined
   */
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  /**
   * Specifies the initial checked state of an uncontrolled checkbox.
   * Use the [checked](#opt-checked) option to control the state.
   * @defaultValue false
   * @option react
   * @option vue
   */
  defaultChecked?: boolean;
  /**
   * Specifies the description text of the checkbox.
   * @defaultValue undefined
   */
  description?: string;
  /**
   * Specifies the disabled state of the checkbox.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Specifies the label of the checkbox.
   * @defaultValue undefined
   */
  label?: string;
  /**
   * Sets the position of the checkbox depending on the [rtl](#localization-rtl) option.
   * When in left-to-right mode, `'start'` will render the checkbox to the left, and `'end'` will render it to the right.
   * In right-to-left mode, `'start'` will render the checkbox to the right, and `'end'` will render it to the left.
   * @defaultValue 'end'
   */
  position?: 'start' | 'end';

  /** @hidden */
  inputStyle?: 'underline' | 'box' | 'outline';
  /** @hidden */
  modelValue?: boolean;
  /** @hidden */
  responsive?: any;
  /** @hidden */
  value?: any;

  // #region Events

  /**
   * @event
   * Triggered when the checked state of the checkbox changes.
   * @param event The change event of the underlying input element.
   * @option react
   * @option vue
   */
  onChange?: (event: any) => void;

  // #endregion Events
}
