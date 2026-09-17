import { MbscStepperOptions } from '../../core/components/stepper/stepper.types.public';
import { doc } from '../../core/util/dom';
import { IRenderOptions } from '../renderer';

export const renderOptions: IRenderOptions = {
  readProps: ['disabled', 'type', 'min', 'max', 'step'],
  renderToParent: true,
  before(elm: HTMLElement, options: MbscStepperOptions) {
    // Wrap input element (for proper merge)
    const parent = elm.parentNode!;
    const wrap = doc!.createElement('div');
    parent.insertBefore(wrap, elm);
    wrap.appendChild(elm);

    options.defaultValue = +(elm as HTMLInputElement).value;
    options.inputClass = elm.getAttribute('class') || '';

    const cont = doc!.createElement('div');
    parent.insertBefore(cont, wrap);
  },
};
