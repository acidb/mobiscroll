import { MbscSegmentedOptions } from '../../core/components/segmented/segmented.types.public';
import { doc, forEach } from '../../core/util/dom';
import { IRenderOptions } from '../renderer';

export { SegmentedGroup } from '../../core/components/segmented/segmented-group.common';
export { Segmented } from '../../core/components/segmented/segmented-item.common';

export const renderOptions: IRenderOptions = {
  hasChildren: true,
  parentClass: 'mbsc-button-txt',
  readAttrs: ['value'],
  readProps: ['disabled', 'name'],
  renderToParent: true,
  before(elm: HTMLElement, options: MbscSegmentedOptions) {
    options.select = (elm as HTMLInputElement).type === 'checkbox' ? 'multiple' : 'single';
    options.defaultChecked = (elm as HTMLInputElement).checked;
    options.inputClass = elm.getAttribute('class') || '';
    // Wrap element into a group
    const label = elm.parentNode as HTMLElement;
    const parent = label.parentNode as HTMLElement;
    if (parent.getAttribute('mbsc-segmented-group') === null) {
      const wrap = doc!.createElement('div');
      wrap.setAttribute('mbsc-segmented-group', '');
      parent.insertBefore(wrap, label);
      wrap.appendChild(label);
      const items = parent.querySelectorAll(`input[name="${(elm as HTMLInputElement).name}"]`);
      forEach(items, (item: Element) => {
        wrap.appendChild(item.parentNode!);
      });
    }
  },
};

export const groupRenderOptions: IRenderOptions = {
  hasChildren: true,
  parentClass: 'mbsc-segmented',
};
