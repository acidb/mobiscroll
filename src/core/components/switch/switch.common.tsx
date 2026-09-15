/** @jsxRuntime classic */
/** @jsx createElement */
import { createElement } from '@framework/renderer';
import { noop } from '../../util/misc';
import { SwitchBase } from './switch';
import { MbscSwitchOptions } from './switch.types.public';

import '../../base.scss';
import '../../shared/form-controls/form-controls.scss';
import './switch.scss';

export function template(s: MbscSwitchOptions, inst: SwitchBase, content: any): any {
  const {
    children,
    className,
    color,
    defaultChecked,
    description,
    hasChildren,
    inputStyle,
    label,
    modelValue,
    onChange,
    position,
    rtl,
    theme,
    themeVariant,
    ...other
  } = inst.props;
  // Need to use props here, otherwise all inherited settings will be included in ...other,
  // which will end up on the native element, resulting in invalid DOM
  return (
    <label className={inst._cssClass} ref={inst._setEl} onClick={inst._onLabelClick}>
      <input
        type="checkbox"
        className="mbsc-form-control-input mbsc-reset"
        onChange={noop}
        disabled={inst._disabled}
        checked={inst._checked}
        ref={inst._setInput}
        {...other}
      />
      <span className={inst._handleContClass} ref={inst._setHandleCont}>
        <span className={inst._handleClass} ref={inst._setHandle} />
      </span>
      {(label || hasChildren) && (
        <span className={'mbsc-form-control-label' + inst._theme + (inst._disabled ? ' mbsc-disabled' : '')}>{label}</span>
      )}
      {description && <span className={'mbsc-description' + inst._theme + (inst._disabled ? ' mbsc-disabled' : '')}>{description}</span>}
      {content}
    </label>
  );
}

/**
 * The Switch component.
 *
 * Usage:
 * ```
 * <Switch label="Label" />
 * ```
 */
export class Switch extends SwitchBase {
  public get checked(): boolean {
    return this._checked;
  }
  public set checked(value: boolean) {
    this._checked = value;
    this.setState({ checked: value });
  }

  protected _template(s: MbscSwitchOptions): any {
    return template(s, this, s.children);
  }
}
