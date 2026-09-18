import { IBaseProps } from '../../base';

export interface MbscButtonOptions extends IBaseProps {
  /**
   * Specifies the accessible name of the button. Recommended for icon-only buttons.
   * @defaultValue undefined
   */
  ariaLabel?: string;
  /**
   * Specifies the predefined color of the button.
   * @defaultValue undefined
   */
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  /**
   * Specifies the disabled state of the button.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Specifies the icon which will be displayed at the end of the button.
   * Use the [startIcon](#opt-startIcon) option for specifying an icon at the start.
   * @defaultValue undefined
   */
  endIcon?: any;
  /**
   * Specifies the icon for an icon-only button.
   * @defaultValue undefined
   */
  icon?: any;
  /**
   * Specifies the icon which will be displayed at the start of the button.
   * Use the [endIcon](#opt-endIcon) option for specifying an icon at the end.
   * @defaultValue undefined
   */
  startIcon?: any;
  /**
   * Specifies the `tabindex` attribute of the button.
   * @defaultValue undefined
   */
  tabIndex?: number;
  /**
   * Specifies the style of the button.
   * @defaultValue 'standard'
   */
  variant?: 'standard' | 'flat' | 'outline';

  // #region Hidden options

  /** @hidden */
  endIconSrc?: string;
  /** @hidden */
  endIconSvg?: string;
  /** @hidden */
  hidden?: boolean;
  /** @hidden */
  iconSrc?: string;
  /** @hidden */
  iconSvg?: string;
  /** @hidden */
  id?: string;
  /** @hidden */
  onClick?: any;
  /** @hidden */
  responsive?: any;
  /** @hidden */
  ripple?: boolean;
  /** @hidden */
  role?: 'button' | 'none';
  /** @hidden */
  startIconSrc?: string;
  /** @hidden */
  startIconSvg?: string;
  /** @hidden */
  tag?: 'button' | 'span' | 'a';
  /** @hidden */
  type?: 'button' | 'submit' | 'reset';

  // #endregion Hidden options
}
