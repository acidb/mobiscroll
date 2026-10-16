import { IBaseProps } from '../../base';

export interface MbscRadioOptions extends IBaseProps {
  /**
   * Specifies the checked state of the radio button.
   * When set, the radio button is controlled: its state changes only when this option is updated,
   * e.g. from a change event handler.
   * @nonAngularText Use the [defaultChecked](#opt-defaultChecked) option to specify the initial state of an uncontrolled radio button.
   * @defaultValue undefined
   * @option react
   * @option angular
   */
  checked?: boolean;
  /**
   * Specifies the predefined color of the radio button.
   * @defaultValue undefined
   */
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  /**
   * Specifies the initial checked state of an uncontrolled radio button.
   * Use the [checked](#opt-checked) option to control the state.
   * @defaultValue false
   * @option react
   * @option vue
   */
  defaultChecked?: boolean;
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
  modelValue?: any;
  /** @hidden */
  responsive?: any;
  /** @hidden */
  value?: any;

  // #region Events

  /**
   * @event
   * Triggered when the radio button gets checked.
   * @param event The change event of the underlying input element.
   * @option react
   * @option vue
   */
  onChange?: (event: any) => void;

  // #endregion Events
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

  // #region Events

  /**
   * @event
   * Triggered when a radio button of the group gets checked.
   * @param event The change event of the checked radio button's input element.
   * @option react
   * @option vue
   */
  onChange?: (event: any) => void;

  // #endregion Events
}
