/** @jsxRuntime classic */
/** @jsx createElement */
import { Button } from '@framework/components/button';
import { createElement } from '@framework/renderer';
import { StepperBase } from './stepper';
import { MbscStepperOptions } from './stepper.types.public';

import '../../base.scss';
import '../../shared/form-controls/form-controls.scss';
import './stepper.scss';

export function template(s: MbscStepperOptions, inst: StepperBase): any {
  const {
    children,
    className,
    color,
    defaultValue,
    description,
    inputClass,
    inputPosition,
    label,
    onChange,
    rtl,
    theme,
    themeVariant,
    value,
    ...other
  } = inst.props;
  // Need to use props here, otherwise all inherited settings will be included in ...other,
  // which will end up on the native element, resulting in invalid DOM
  const _theme = inst._theme;
  return (
    <label className={inst._cssClass} onClick={inst._onLabelClick}>
      <div className="mbsc-stepper-content">
        {label && (
          <span className={'mbsc-form-control-label mbsc-stepper-label' + _theme + (inst._disabled ? ' mbsc-disabled' : '')}>{label}</span>
        )}
        {description && <span className={'mbsc-description' + _theme + (inst._disabled ? ' mbsc-disabled' : '')}>{description}</span>}
      </div>
      <div className={'mbsc-stepper-control mbsc-flex' + _theme + inst._rtl}>
        <Button
          className="mbsc-stepper-minus mbsc-stepper-button"
          disabled={inst._disabledMinus}
          onClick={inst._onMinusClick}
          theme={s.theme}
          themeVariant={s.themeVariant}
        >
          <span className={'mbsc-stepper-inner' + _theme}>&ndash;</span>
        </Button>
        <input
          className={'mbsc-stepper-input' + (inst._disabled ? ' mbsc-disabled' : '') + ' ' + (s.inputClass || '') + _theme}
          disabled={inst._disabled}
          max={inst._max}
          min={inst._min}
          ref={inst._setInput}
          step={inst._step}
          type="number"
          {...other}
        />
        <Button
          className="mbsc-stepper-plus mbsc-stepper-button"
          disabled={inst._disabledPlus}
          onClick={inst._onPlusClick}
          theme={s.theme}
          themeVariant={s.themeVariant}
        >
          <span className={'mbsc-stepper-inner' + _theme}>+</span>
        </Button>
      </div>
    </label>
  );
}

export class Stepper extends StepperBase {
  public get value(): number {
    return this._value;
  }
  public set value(val: number) {
    this._value = val;
    this.setState({ value: val });
  }

  protected _template(s: MbscStepperOptions): any {
    return template(s, this);
  }
}
