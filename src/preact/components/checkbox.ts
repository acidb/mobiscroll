import { MbscCheckboxOptions } from '../../core/components/checkbox/checkbox.types.public';
import { IRenderOptions } from '../renderer';

export const renderOptions: IRenderOptions = {
  hasChildren: true,
  parentClass: 'mbsc-form-control-label',
  readProps: ['disabled'],
  renderToParent: true,
  before(elm: HTMLElement, options: MbscCheckboxOptions) {
    options.defaultChecked = (elm as HTMLInputElement).checked;
  },
};
