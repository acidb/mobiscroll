import { Directive } from '@angular/core';
import { BaseComponent } from '../../base';
import { gestureListener } from '../../util/gesture';
import { ENTER, SPACE } from '../../util/keys';
import { UNDEFINED } from '../../util/misc';
import { MbscButtonOptions } from './button.types.public';

/** @hidden */
export interface MbscButtonState {
  hasFocus?: boolean;
  hasHover?: boolean;
  isActive?: boolean;
}

/** @hidden */
@Directive({ selector: '[mbsc-btn-b]' })
export class ButtonBase extends BaseComponent<MbscButtonOptions, MbscButtonState> {
  /** @hidden */
  public static defaults: MbscButtonOptions = {
    ripple: false,
    role: 'button',
    tag: 'button',
    variant: 'standard',
  };

  protected static _name = 'Button';

  /** @hidden */
  public _cssClass?: string;
  /** @hidden */
  public _endIconClass?: string;
  /** @hidden */
  public _hasStartIcon?: boolean;
  /** @hidden */
  public _hasEndIcon?: boolean;
  /** @hidden */
  public _iconClass?: string;
  /** @hidden */
  public _isIconOnly?: boolean;
  /** @hidden */
  public _startIconClass?: string;
  /** @hidden */
  public _tabIndex: number | undefined;

  private _unlisten?: () => void;

  protected _mounted() {
    this._unlisten = gestureListener(this._el, {
      onBlur: () => {
        this.setState({ hasFocus: false });
      },
      onFocus: () => {
        this.setState({ hasFocus: true });
      },
      onHoverIn: () => {
        if (!this.s.disabled) {
          this.setState({ hasHover: true });
        }
      },
      onHoverOut: () => {
        this.setState({ hasHover: false });
      },
      onKeyDown: (ev: any) => {
        switch (ev.keyCode) {
          case ENTER:
          case SPACE:
            this._el.click();
            ev.preventDefault();
            break;
        }
      },
      onPress: () => {
        this.setState({ isActive: true });
      },
      onRelease: () => {
        this.setState({ isActive: false });
      },
      onStart: () => ({ ripple: this.s.ripple && !this.s.disabled }),
    });
  }

  protected _render(s: MbscButtonOptions, state: MbscButtonState) {
    const disabled = s.disabled;
    this._isIconOnly = !!(s.icon || s.iconSvg);
    this._hasStartIcon = !!(s.startIcon || s.startIconSvg);
    this._hasEndIcon = !!(s.endIcon || s.endIconSvg);
    this._tabIndex = disabled || s.hidden ? UNDEFINED : s.tabIndex || 0;
    this._cssClass =
      this._className +
      ' mbsc-reset mbsc-font mbsc-button' +
      this._theme +
      this._rtl +
      ' mbsc-button-' +
      s.variant +
      (this._isIconOnly ? ' mbsc-icon-button' : '') +
      (disabled ? ' mbsc-disabled' : '') +
      (s.color ? ' mbsc-button-' + s.color : '') +
      (state.hasFocus && !disabled ? ' mbsc-focus' : '') +
      (state.isActive && !disabled ? ' mbsc-active' : '') +
      (state.hasHover && !disabled ? ' mbsc-hover' : '');

    this._iconClass = 'mbsc-button-icon' + this._rtl;
    this._startIconClass = this._iconClass + ' mbsc-button-icon-start';
    this._endIconClass = this._iconClass + ' mbsc-button-icon-end';

    // Workaround for mouseleave not firing on disabled button
    if (s.disabled && state.hasHover) {
      setTimeout(() => {
        this.setState({ hasHover: false });
      });
    }
  }

  protected _destroy() {
    if (this._unlisten) {
      this._unlisten();
    }
  }
}
