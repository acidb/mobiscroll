/** @jsxRuntime classic */
/** @jsx createElement */
import { createElement } from '@framework/renderer';
import { RadioContext } from '../../shared/radio-context';
import { MbscRadioState, RadioBase } from './radio';
import { MbscRadioGroupOptions, MbscRadioOptions } from './radio.types.public';

import '../../base.scss';
import '../../shared/form-controls/form-controls.scss';
import './radio.scss';

export function template(s: MbscRadioOptions, inst: RadioBase, content: any, groupOpt: MbscRadioGroupOptions): any {
  const {
    children,
    className,
    color,
    defaultChecked,
    description,
    hasChildren,
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

  inst._groupOptions(groupOpt);
  return (
    <label className={inst._cssClass}>
      <input
        checked={inst._checked}
        className="mbsc-form-control-input mbsc-reset"
        disabled={inst._disabled}
        name={inst._name}
        onChange={inst._onChange}
        type="radio"
        value={inst._value}
        ref={inst._setInput}
        {...other}
      />
      <span className={inst._boxClass}>
        <span className="mbsc-radio-ring" />
      </span>
      {(label || hasChildren) && (
        <span className={'mbsc-form-control-label' + inst._theme + (inst._disabled ? ' mbsc-disabled' : '')}>{label}</span>
      )}
      {description && <span className={'mbsc-description' + inst._theme + (inst._disabled ? ' mbsc-disabled' : '')}>{description}</span>}
      {content}
    </label>
  );
}

export class Radio extends RadioBase {
  public get checked(): boolean {
    return this._checked;
  }
  public set checked(value: boolean) {
    this._checked = value;
    this._toggle(value);
  }

  protected _template(s: MbscRadioOptions, state: MbscRadioState): any {
    return createElement(RadioContext.Consumer, null, ((groupOpt: MbscRadioGroupOptions) =>
      template(s, this, s.children, groupOpt)) as any);
  }
}
