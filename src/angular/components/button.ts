import { ChangeDetectionStrategy, Component, ContentChild, Input, ViewEncapsulation } from '@angular/core';
import { ButtonBase } from '../../core/components/button/button';
import { MbscCustomEndIcon, MbscCustomIcon, MbscCustomStartIcon } from './icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.aria-disabled]': 'disabled ? "true" : undefined',
    '[attr.aria-label]': 'ariaLabel',
    '[attr.role]': 's.role',
    '[attr.tabindex]': '_tabIndex',
    '[class]': '_cssClass',
  },
  selector: 'mbsc-button',
  styleUrls: ['../../core/base.scss', '../../core/components/button/button.scss'],
  template: `
    <span [class]="'mbsc-button-bg mbsc-button-' + s.variant + '-bg' + _theme"></span>
    <span [class]="'mbsc-flex mbsc-button-txt mbsc-button-' + s.variant + '-txt' + _theme">
      <mbsc-icon *mbscIf="_isIconOnly || _customIcon" [class]="_iconClass" [name]="s.icon" [svg]="s.iconSvg" [theme]="s.theme">
        <ng-content select="[mbsc-icon]"></ng-content>
      </mbsc-icon>
      <mbsc-icon
        *mbscIf="_hasStartIcon || _customStartIcon"
        [class]="_startIconClass"
        [name]="s.startIcon"
        [svg]="s.startIconSvg"
        [theme]="s.theme"
      >
        <ng-content select="[mbsc-start-icon]"></ng-content>
      </mbsc-icon>
      <ng-content></ng-content>
      <mbsc-icon *mbscIf="_hasEndIcon || _customEndIcon" [class]="_endIconClass" [name]="s.endIcon" [svg]="s.endIconSvg" [theme]="s.theme">
        <ng-content select="[mbsc-end-icon]"></ng-content>
      </mbsc-icon>
    </span>
  `,
})
export class MbscButton extends ButtonBase {
  /** @hidden */
  @ContentChild(MbscCustomIcon, { static: false } as any)
  public _customIcon?: MbscCustomIcon;

  /** @hidden */
  @ContentChild(MbscCustomStartIcon, { static: false } as any)
  public _customStartIcon?: MbscCustomStartIcon;

  /** @hidden */
  @ContentChild(MbscCustomEndIcon, { static: false } as any)
  public _customEndIcon?: MbscCustomEndIcon;

  /** {@inheritDoc MbscButtonOptions.ariaLabel} */
  @Input()
  public ariaLabel?: string;

  /** {@inheritDoc MbscButtonOptions.color} */
  @Input()
  public color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';

  /** {@inheritDoc MbscButtonOptions.disabled} */
  @Input()
  public disabled?: boolean;

  /** {@inheritDoc MbscButtonOptions.endIcon} */
  @Input()
  public endIcon?: string;

  /** @hidden */
  @Input()
  public endIconSrc?: string;

  /** {@inheritDoc MbscButtonOptions.endIconSvg} */
  @Input()
  public endIconSvg?: string;

  /** @hidden */
  @Input()
  public hidden?: boolean;

  /** {@inheritDoc MbscButtonOptions.icon} */
  @Input()
  public icon?: string;

  /** {@inheritDoc MbscButtonOptions.iconSvg} */
  @Input()
  public iconSvg?: string;

  /** @hidden */
  @Input()
  public iconSrc?: string;

  /** @hidden */
  @Input()
  public ripple?: boolean;

  /** {@inheritDoc MbscButtonOptions.role} */
  @Input()
  public role?: 'button' | 'none';

  /** {@inheritDoc MbscButtonOptions.startIcon} */
  @Input()
  public startIcon?: string;

  /** @hidden */
  @Input()
  public startIconSrc?: string;

  /** {@inheritDoc MbscButtonOptions.startIconSvg} */
  @Input()
  public startIconSvg?: string;

  /** {@inheritDoc MbscButtonOptions.tabIndex} */
  @Input()
  public tabIndex?: number;

  /** {@inheritDoc MbscButtonOptions.variant} */
  @Input()
  public variant?: 'standard' | 'flat' | 'outline';
}
