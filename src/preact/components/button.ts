import { MbscButtonOptions } from '../../core/components/button/button.types.public';
import { IRenderOptions } from '../renderer';

export { Button } from '../../core/components/button/button.common';

export const renderOptions: IRenderOptions = {
  before(elm: HTMLElement, options: MbscButtonOptions) {
    options.tag = elm.nodeName.toLowerCase() as any;
  },
  hasChildren: true,
  parentClass: 'mbsc-button-txt',
  readProps: ['disabled'],
  slots: {
    endIcon: 'end-icon',
    icon: 'icon',
    startIcon: 'start-icon',
  },
};
