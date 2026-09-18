/** @jsxRuntime classic */
/** @jsx createElement */
import { createElement } from '@framework/renderer';
import { CheckboxBase } from './checkbox';
import { MbscCheckboxOptions } from './checkbox.types.public';

import '../../base.scss';
import '../../shared/form-controls/form-controls.scss';
import './checkbox.scss';

export function template(s: MbscCheckboxOptions, inst: CheckboxBase, content: any): any {
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
    <label className={inst._cssClass}>
      <input
        type="checkbox"
        className="mbsc-form-control-input mbsc-reset"
        onChange={inst._onChange}
        disabled={inst._disabled}
        checked={inst._checked}
        ref={inst._setInput}
        {...other}
      />
      <span className={inst._boxClass}>
        <span className={'mbsc-checkbox-ring' + inst._theme} />
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
 * The Checkbox component.
 *
 * Usage:
 *
 * ```
 * <Checkbox label="Label" />
 * ```
 */
export class Checkbox extends CheckboxBase {
  public get checked(): boolean {
    return this._checked;
  }
  public set checked(value: boolean) {
    this._checked = value;
    this.setState({ checked: value });
  }

  protected _template(s: MbscCheckboxOptions): any {
    return template(s, this, s.children);
  }
}
