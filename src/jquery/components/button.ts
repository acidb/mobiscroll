import { Button as ButtonComp } from '../../core/components/button/button.common';
import { renderOptions } from '../../preact/components/button';

export class Button extends ButtonComp {
  public static _fname = 'button';
  public static _selector = '[mbsc-button]';
  public static _renderOpt = renderOptions;
}

// Types
export * from '../../core/components/button/button.types.public';
