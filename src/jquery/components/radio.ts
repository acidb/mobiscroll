import { Radio as RadioComp } from '../../core/components/radio/radio.common';
import { renderOptions } from '../../preact/components/radio';

export class Radio extends RadioComp {
  public static _fname = 'radio';
  public static _selector = '[mbsc-radio]';
  public static _renderOpt = renderOptions;
}

// Types
export * from '../../core/components/radio/radio.types.public';
