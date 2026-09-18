/** @jsxRuntime classic */
/** @jsx createElement */
import { Icon } from '@framework/components/icon';
import { createElement, Fragment } from '@framework/renderer';
import { ButtonBase } from './button';
import { MbscButtonOptions } from './button.types.public';

import '../../base.scss';
import './button.scss';

export function template(s: MbscButtonOptions, inst: ButtonBase, content: any): any {
  const {
    ariaLabel,
    children,
    className,
    color,
    endIcon,
    endIconSrc,
    endIconSvg,
    hasChildren,
    hidden,
    icon,
    iconSrc,
    iconSvg,
    ripple,
    rtl,
    role,
    startIcon,
    startIconSrc,
    startIconSvg,
    tag,
    tabIndex,
    theme,
    themeVariant,
    variant,
    ...other
  } = inst.props;
  // Need to use props here, otherwise all inherited settings will be included in ...other,
  // which will end up on the native element, resulting in invalid DOM

  const props = {
    'aria-label': ariaLabel,
    className: inst._cssClass,
    ref: inst._setEl,
    ...other,
  };

  const inner = (
    <Fragment>
      <span className={'mbsc-button-bg mbsc-button-' + s.variant + '-bg' + inst._theme} />
      <span className={'mbsc-button-txt mbsc-button-' + s.variant + '-txt' + inst._theme}>
        {inst._isIconOnly && <Icon className={inst._iconClass} name={icon} svg={iconSvg} theme={s.theme} />}
        {inst._hasStartIcon && <Icon className={inst._startIconClass} name={startIcon} svg={startIconSvg} theme={s.theme} />}
        {content}
        {inst._hasEndIcon && <Icon className={inst._endIconClass} name={endIcon} svg={endIconSvg} theme={s.theme} />}
      </span>
    </Fragment>
  );

  if (s.tag === 'span') {
    return (
      <span role={role} aria-disabled={s.disabled} tabIndex={inst._tabIndex} {...props}>
        {inner}
      </span>
    );
  }

  if (s.tag === 'a') {
    return (
      <a aria-disabled={s.disabled} tabIndex={inst._tabIndex} {...props}>
        {inner}
      </a>
    );
  }

  return (
    <button role={role} tabIndex={inst._tabIndex} {...props}>
      {inner}
    </button>
  );
}

/**
 * The Button component.
 *
 * Usage:
 *
 * ```
 * <Button icon="home">A button</Button>
 * ```
 */
export class Button extends ButtonBase {
  protected _template(s: MbscButtonOptions): any {
    return template(s, this, s.children);
  }
}
