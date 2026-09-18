import { Checkbox as CheckboxComp } from '../../core/components/checkbox/checkbox.common';
import { MbscCheckboxOptions } from '../../core/components/checkbox/checkbox.types.public';
import { renderOptions } from '../../preact/components/checkbox';
import { createComponentFactory } from '../base';

export class Checkbox extends CheckboxComp {
  public static _selector = '[mbsc-checkbox]';
  public static _renderOpt = renderOptions;
}

export const checkbox = /*#__PURE__*/ createComponentFactory<MbscCheckboxOptions, Checkbox>(Checkbox, renderOptions);

// Types
export * from '../../core/components/checkbox/checkbox.types.public';
