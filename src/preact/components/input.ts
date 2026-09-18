import { MbscInputOptions } from '../../core/components/input/input.types.public';
import { doc } from '../../core/util/dom';
import { IRenderOptions } from '../renderer';

export { Input } from '../../core/components/input/input.common';

export const inputRenderOptions: IRenderOptions = {
  hasChildren: true,
  parentClass: 'mbsc-label',
  readAttrs: ['placeholder', 'rows'],
  readProps: ['disabled', 'type'],
  renderToParent: true,
  slots: {
    endIcon: 'end-icon',
    label: 'label',
    startIcon: 'start-icon',
  },
  before(elm: HTMLElement, options: MbscInputOptions, children: any) {
    // Wrap input element (for proper merge)
    const parent = elm.parentNode!;
    const wrap = doc!.createElement('span');
    parent.insertBefore(wrap, elm);
    wrap.appendChild(elm);

    options.inputClass = elm.getAttribute('class') || '';
    options.defaultValue = (elm as HTMLInputElement).value;

    // In case of the select the children are the options, NOT the label
    if (elm.nodeName === 'SELECT') {
      delete options.hasChildren;
    }

    // The first child will be the label element
    if (!options.label && options.hasChildren) {
      options.label = children[0].textContent;
    }

    // Create placeholder for label
    if (options.label) {
      const label = doc!.createElement('span');
      parent.insertBefore(label, wrap);
    }
  },
};

export const selectRenderOptions: IRenderOptions = {
  ...inputRenderOptions,
  hasValue: true,
  parentClass: 'mbsc-select',
  useOwnChildren: true,
};

export const textareaRenderOptions: IRenderOptions = {
  ...inputRenderOptions,
  hasValue: true,
};
