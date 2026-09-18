import { IBaseProps } from '../../base';

export interface MbscSegmentedOptions extends IBaseProps {
  /**
   * Specifies the accessible name of the segmented button. Recommended for icon-only buttons.
   * @defaultValue undefined
   */
  ariaLabel?: string;
  /**
   * Specifies the predefined color of the segmented button.
   * @defaultValue undefined
   */
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  /**
   * Specifies the description text of the segmented button.
   * @defaultValue undefined
   */
  description?: string;
  /**
   * Specifies the disabled state of the segmented button.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Specifies the icon which will be displayed at the end of the segmented button.
   * Use the [startIcon](#opt-startIcon) option for specifying an icon at the start.
   * @defaultValue undefined
   */
  endIcon?: any;
  /**
   * Specifies the icon for an icon-only segmented button.
   * @defaultValue undefined
   */
  icon?: any;
  /**
   * Specifies the id of the segmented button.
   * @defaultValue undefined
   */
  id?: string;
  /**
   * Specifies the label of the segmented button.
   * @defaultValue undefined
   */
  label?: string;
  /**
   * Specifies the name of the segmented button.
   * @defaultValue undefined
   */
  name?: string;
  /**
   * Specifies the icon which will be displayed at the start of the segmented button.
   * Use the [endIcon](#opt-endIcon) option for specifying an icon at the end.
   * @defaultValue undefined
   */
  startIcon?: any;

  /** @hidden */
  checked?: boolean;
  /** @hidden */
  defaultChecked?: boolean;
  /** @hidden */
  endIconSrc?: string;
  /** @hidden */
  endIconSvg?: string;
  /** @hidden */
  iconSrc?: string;
  /** @hidden */
  iconSvg?: string;
  /** @hidden */
  inputClass?: string;
  /** @hidden */
  modelValue?: boolean;
  /** @hidden */
  responsive?: any;
  /** @hidden */
  ripple?: boolean;
  /** @hidden */
  select?: 'single' | 'multiple';
  /** @hidden */
  startIconSrc?: string;
  /** @hidden */
  startIconSvg?: string;
  /** @hidden */
  value?: any;

  /** @hidden */
  onChange?: any;
}

export interface MbscSegmentedGroupOptions extends IBaseProps {
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
   * Specifies the selection type of the segmented group.
   * @defaultValue 'single'
   */
  select?: 'single' | 'multiple';

  /** @hidden */
  drag?: boolean;
  /** @hidden */
  disabled?: boolean;
  /** @hidden */
  modelValue?: any;
  /** @hidden */
  value?: any;

  /** @hidden */
  onChange?: any;
}
