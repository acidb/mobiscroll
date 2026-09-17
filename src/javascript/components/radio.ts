import { Radio as RadioComp } from '../../core/components/radio/radio.common';
import { MbscRadioOptions } from '../../core/components/radio/radio.types.public';
import { renderOptions } from '../../preact/components/radio';
import { createComponentFactory } from '../base';

export class Radio extends RadioComp {
  public static _selector = '[mbsc-radio]';
  public static _renderOpt = renderOptions;
}

export const radio = /*#__PURE__*/ createComponentFactory<MbscRadioOptions, Radio>(Radio, renderOptions);

// Types
export * from '../../core/components/radio/radio.types.public';
