import { Switch as SwitchComp } from '../../core/components/switch/switch.common';
import { renderOptions } from '../../preact/components/switch';

export class Switch extends SwitchComp {
  public static _fname = 'switch';
  public static _selector = '[mbsc-switch]';
  public static _renderOpt = renderOptions;
}

// Types
export * from '../../core/components/switch/switch.types.public';
