import { MbscPageOptions } from '../../core/components/page/page.types.public';
import { IRenderOptions } from '../renderer';

export const renderOptions: IRenderOptions = {
  hasChildren: true,
  parentClass: 'mbsc-page',
  before(elm: HTMLElement, options: MbscPageOptions) {
    options.tag = elm.nodeName.toLowerCase();
  },
};
