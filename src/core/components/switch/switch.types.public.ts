import { IBaseProps } from '../../base';

export interface MbscSwitchOptions extends IBaseProps {
  /**
   * Specifies the checked state of the switch.
   * When set, the switch is controlled: its state changes only when this option is updated,
   * e.g. from a change event handler.
   * @nonAngularText Use the [defaultChecked](#opt-defaultChecked) option to specify the initial state of an uncontrolled switch.
   * @defaultValue undefined
   * @option react
   * @option angular
   */
  checked?: boolean;
  /**
   * Specifies the predefined color of the switch.
   * @defaultValue undefined
   */
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  /**
   * Specifies the initial checked state of an uncontrolled switch.
   * Use the [checked](#opt-checked) option to control the state.
   * @defaultValue false
   * @option react
   * @option vue
   */
  defaultChecked?: boolean;
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
   * Triggered when the checked state of the switch changes, by clicking or dragging it.
   * @param event The click event of the underlying input element.
   * @option react
   * @option vue
   */
  onChange?: (event: any) => void;

  // #endregion Events
}
