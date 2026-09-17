import { createComponent, enhance, registerComponent } from '@framework/renderer';
import { doc, forEach } from '../core/util/dom';
import { isString } from '../core/util/misc';
import { isBrowser } from '../core/util/platform';

export { registerComponent };

export function createComponentFactory<OptionsType, ComponentType>(Component: any, renderOptions?: any) {
  return (selector: string | HTMLElement, options?: OptionsType): ComponentType | { [key: string]: ComponentType } => {
    const ret: { [key: string]: ComponentType } = {};
    if (isString(selector)) {
      const elements = doc!.querySelectorAll(selector);
      let first: ComponentType;
      forEach(elements, (elm) => {
        const inst = createComponent(Component, elm as HTMLElement, options, renderOptions);
        ret[elm.id] = inst;
        if (!first) {
          first = inst;
        }
      });
      return elements.length === 1 ? first! : ret;
    } else {
      return createComponent(Component, selector, options, renderOptions);
    }
  };
}

if (isBrowser) {
  doc!.addEventListener('DOMContentLoaded', () => {
    enhance(doc);
  });

  doc!.addEventListener('mbsc-enhance', (ev: any) => {
    enhance(ev.target);
  });
}
