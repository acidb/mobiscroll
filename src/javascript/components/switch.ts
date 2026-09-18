import { Switch as SwitchComp } from '../../core/components/switch/switch.common';
import { MbscSwitchOptions } from '../../core/components/switch/switch.types.public';
import { renderOptions } from '../../preact/components/switch';
import { createComponentFactory } from '../base';

export class Switch extends SwitchComp {
  public static _selector = '[mbsc-switch]';
  public static _renderOpt = renderOptions;
}

export const formSwitch = /*#__PURE__*/ createComponentFactory<MbscSwitchOptions, Switch>(Switch, renderOptions);

// Types
export * from '../../core/components/switch/switch.types.public';
