import { MbscRadioOptions } from '../../core/components/radio/radio.types.public';
import { IRenderOptions } from '../renderer';

export const renderOptions: IRenderOptions = {
  hasChildren: true,
  parentClass: 'mbsc-form-control-label',
  readAttrs: ['value'],
  readProps: ['disabled', 'name'],
  renderToParent: true,
  before(elm: HTMLElement, options: MbscRadioOptions) {
    options.defaultChecked = (elm as HTMLInputElement).checked;
  },
};
