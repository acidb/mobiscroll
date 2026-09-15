import { IBaseProps } from '../../base';

export interface MbscStepperOptions extends IBaseProps {
  /**
   * Specifies the predefined color of the stepper.
   * @defaultValue undefined
   */
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  /**
   * Specifies the description text of the stepper.
   * @defaultValue undefined
   */
  description?: string;
  /**
   * Specifies the disabled state of the stepper.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Specifies the input field position compared to the +/- stepper buttons.
   * @defaultValue 'center'
   */
  inputPosition?: 'start' | 'end' | 'center';
  /**
   * Specifies the label of the stepper.
   * @defaultValue undefined
   */
  label?: string;
  /**
   * Specifies the maximum value that can be selected.
   * @defaultValue 100
   */
  min?: number;
  /**
   * Specifies the minimum value that can be selected.
   * @defaultValue 0
   */
  max?: number;
  /**
   * Specifies the step between values.
   * @defaultValue 1
   */
  step?: number;

  /** @hidden */
  defaultValue?: number;
  /** @hidden */
  inputClass?: string;
  /** @hidden */
  modelValue?: number;
  /** @hidden */
  responsive?: any;
  /** @hidden */
  value?: number;

  /** @hidden */
  onChange?: any;
}
