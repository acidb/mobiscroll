import { Checkbox as CheckboxComp } from '../../core/components/checkbox/checkbox.common';
import { renderOptions } from '../../preact/components/checkbox';

export class Checkbox extends CheckboxComp {
  public static _fname = 'checkbox';
  public static _selector = '[mbsc-checkbox]';
  public static _renderOpt = renderOptions;
}

// Types
export * from '../../core/components/checkbox/checkbox.types.public';
