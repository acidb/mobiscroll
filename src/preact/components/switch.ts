import { MbscSwitchOptions } from '../../core/components/switch/switch.types.public';
import { IRenderOptions } from '../renderer';

export const renderOptions: IRenderOptions = {
  hasChildren: true,
  parentClass: 'mbsc-form-control-label',
  readProps: ['disabled'],
  renderToParent: true,
  before(elm: HTMLElement, options: MbscSwitchOptions) {
    options.defaultChecked = (elm as HTMLInputElement).checked;
  },
};
