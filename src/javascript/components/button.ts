import { Button as ButtonComp } from '../../core/components/button/button.common';
import { MbscButtonOptions } from '../../core/components/button/button.types.public';
import { renderOptions } from '../../preact/components/button';
import { createComponentFactory } from '../base';

export class Button extends ButtonComp {
  public static _selector = '[mbsc-button]';
  public static _renderOpt = renderOptions;
}

export const button = /*#__PURE__*/ createComponentFactory<MbscButtonOptions, Button>(Button, renderOptions);

// Types
export * from '../../core/components/button/button.types.public';
