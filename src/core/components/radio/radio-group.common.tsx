/** @jsxRuntime classic */
/** @jsx createElement */
import { createElement } from '@framework/renderer';
import { RadioContext } from '../../shared/radio-context';
import { RadioGroupBase } from './radio-group';
import { MbscRadioGroupOptions } from './radio.types.public';

export function template(s: MbscRadioGroupOptions, inst: RadioGroupBase, content: any): any {
  return <div className={inst._groupClass}>{content}</div>;
}

/**
 * The RadioGroup.
 *
 * Usage:
 *
 * ```
 * <RadioGroup>...</RadioGroup>
 * ```
 */
export class RadioGroup extends RadioGroupBase {
  protected _template(s: MbscRadioGroupOptions): any {
    return <RadioContext.Provider value={this._groupOpt}>{template(s, this, s.children)}</RadioContext.Provider>;
  }
}
