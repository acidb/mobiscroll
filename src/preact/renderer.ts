import { doc, forEach, matches } from '../core/util/dom';
import { isString, UNDEFINED } from '../core/util/misc';
import { createContext, createElement, Fragment, options, render } from './lib/src/index';
import { PureComponent } from './pure';

export { createContext, createElement, Fragment, render, PureComponent };

export const isPreact = true;
export const isVue = false;
export const ON_ANIMATION_END = 'onAnimationEnd';
export const ON_CONTEXT_MENU = 'onContextMenu';
export const ON_DOUBLE_CLICK = 'onDoubleClick';
export const ON_KEY_DOWN = 'onKeyDown';
export const ON_MOUSE_DOWN = 'onMouseDown';
export const ON_MOUSE_LEAVE = 'onMouseLeave';
export const ON_MOUSE_ENTER = 'onMouseEnter';
export const ON_MOUSE_MOVE = 'onMouseMove';

options.vnode = (vnode) => {
  const props = vnode.props;
  const normalizedProps: any = {};
  // Only check props on Element nodes
  if (isString(vnode.type)) {
    for (let i in props) {
      const value = (props as any)[i];
      // Alter preact behavior to modify onAnimationEnd to onanimationend, to make it work on older Edge versions.
      if (/^onAni/.test(i)) {
        i = i.toLowerCase();
      } else if (/ondoubleclick/i.test(i)) {
        i = 'ondblclick';
      }
      normalizedProps[i] = value;
    }
    vnode.props = normalizedProps;
  }
};

export function unmountComponentAtNode(container: any) {
  if (container._children) {
    render(null, container);
    return true;
  }
  return false;
}

export interface IRenderOptions {
  /**
   * Set this to true, when the component has real DOM children which should be added when the virtual dom is rendered
   */
  hasChildren?: boolean;
  /**
   *
   */
  hasValue?: boolean;
  /**
   * Css class of the element where the real DOM child elements should be rendered
   */
  parentClass?: string;
  /**
   * List of attributes which should be read from the native element and pass as options to the component
   */
  readAttrs?: string[];
  /**
   * List of props which should be read from the native element and pass as options to the component
   */
  readProps?: string[];
  /**
   * Set this to true to render the component to the parent of the element and not in the element itself
   * (like in the case of form inputs)
   */
  renderToParent?: boolean;
  /**
   * List of slots where additional DOM elements can be rendered, besides the children
   */
  slots?: { [key: string]: string };
  /**
   * Set this to true to use the element's children instead of the parent's children, when renderToParent is true
   */
  useOwnChildren?: boolean;
  /**
   * Hook which runs right before calling the render function.
   * Useful to run component specific logic, like DOM transformations, etc.
   */
  before?: (elm: HTMLElement, opt: any, children: any[]) => void;
}

const components: any = {};
let guid = 0;

export function initComponents(target: any, selector: string, Component: any, renderOptions?: IRenderOptions, opt?: any) {
  if (matches(target, selector)) {
    if (!target.__mbscFormInst) {
      createComponent(Component, target, opt, renderOptions, true);
    }
  } else {
    const elements = target.querySelectorAll(selector);
    forEach(elements, (elm: any) => {
      if (!elm.__mbscFormInst) {
        createComponent(Component, elm, opt, renderOptions, true);
      }
    });
  }
}

/**
 * Creates and renders a Preact component for/inside the specified element.
 * @param Component The component which needs to be created.
 * @param elm The element for which the component is needed.
 * @param initOpt Init options for the component.
 * @param renderOptions Render options for the component.
 */
export function createComponent(Component: any, elm: HTMLElement, initOpt?: any, renderOptions?: IRenderOptions, formControl?: boolean) {
  let inst: any;
  const children: any[] = [];
  const allChildren: any[] = [];
  const slotElms: any = {};
  const renderOpt = renderOptions || {};
  const replaceNode: HTMLElement = renderOpt.renderToParent ? (elm.parentNode as HTMLElement) : elm;
  const renderTo: HTMLElement = replaceNode.parentNode as HTMLElement;
  const childrenNode: HTMLElement = renderOpt.useOwnChildren ? elm : replaceNode;
  const elmClass = elm.getAttribute('class');
  const value = (elm as any).value;

  const opt = {
    className: replaceNode.getAttribute('class'),
    ...elm.dataset,
    ...initOpt,
    ref: (c: any) => {
      inst = c;
    },
  };

  if (renderOpt.readProps) {
    renderOpt.readProps.forEach((prop: string) => {
      const v = (elm as any)[prop];
      if (v !== UNDEFINED) {
        opt[prop] = v;
      }
    });
  }

  if (renderOpt.readAttrs) {
    renderOpt.readAttrs.forEach((prop: string) => {
      const v = elm.getAttribute(prop);
      if (v !== null) {
        opt[prop] = v;
      }
    });
  }

  const slots = renderOpt.slots;
  if (slots) {
    for (const key of Object.keys(slots)) {
      const slot = slots[key];
      const slotElm = replaceNode.querySelector('[mbsc-' + slot + ']');
      if (slotElm) {
        slotElms[key] = slotElm;
        slotElm.parentNode!.removeChild(slotElm);
        // Create a virtual node placeholder element
        opt[key] = createElement('span', { className: 'mbsc-slot-' + slot });
      }
    }
  }

  if (renderOpt.hasChildren) {
    // Remove existing children
    forEach(childrenNode.childNodes, (child: any) => {
      if (child !== elm && child.nodeType !== 8 && (child.nodeType !== 3 || (child.nodeType === 3 && /\S/.test(child.nodeValue)))) {
        children.push(child);
      }
      allChildren.push(child);
    });
    forEach(children, (child: any) => {
      childrenNode.removeChild(child);
    });
    if (children.length) {
      opt.hasChildren = true;
    }
  }

  // Generate an id for the element, if there's none
  if (!elm.id) {
    elm.id = 'mbsc-control-' + guid++;
  }

  if (renderOpt.before) {
    renderOpt.before(elm, opt, children);
  }

  // Render the element
  render(createElement(Component as any, opt), renderTo, replaceNode);

  if (elmClass && renderOpt.renderToParent) {
    elm.classList.add(
      ...elmClass
        .replace(/^\s+|\s+$/g, '')
        .replace(/\s+|^\s|\s$/g, ' ')
        .split(' '),
    );
  }

  if (renderOpt.hasChildren) {
    const selector = '.' + renderOpt.parentClass;
    const placeholder = matches(replaceNode, selector) ? replaceNode : replaceNode.querySelector(selector);
    // Add back existing children
    if (placeholder) {
      forEach(children, (child: any) => {
        placeholder.appendChild(child);
      });
    }
  }

  if (renderOpt.hasValue) {
    (elm as any).value = value;
  }

  if (slots) {
    for (const key of Object.keys(slotElms)) {
      const slot = slots[key];
      const slotElm = slotElms[key];
      const placeholders = replaceNode.querySelectorAll('.mbsc-slot-' + slot);
      forEach(placeholders, (placeholder: Element, i: number) => {
        const child = i > 0 ? slotElm.cloneNode(true) : slotElm;
        placeholder.appendChild(child);
      });
    }
  }

  // Create a destroy function
  inst.destroy = () => {
    const parent = replaceNode.parentNode!;
    const placeholder = doc!.createComment('');
    parent.insertBefore(placeholder, replaceNode);
    render(null, replaceNode);
    delete (elm as any).__mbscInst;
    delete (elm as any).__mbscFormInst;
    delete (replaceNode as any)._listeners;
    replaceNode.innerHTML = '';
    // Restore css class
    replaceNode.setAttribute('class', opt.className);
    // Put back the original element
    parent.replaceChild(replaceNode, placeholder);
    // Restore children and slots
    if (renderOpt.hasChildren) {
      // Add back existing children
      forEach(allChildren, (child: any) => {
        childrenNode.appendChild(child);
      });
    }
    // Restore css class on the element
    if (renderOpt.renderToParent) {
      elm.setAttribute('class', elmClass || '');
    }
  };

  // Store the instance on the element
  if (formControl) {
    if (!(elm as any).__mbscInst) {
      (elm as any).__mbscInst = inst;
    }
    (elm as any).__mbscFormInst = inst;
  } else {
    (elm as any).__mbscInst = inst;
  }
  return inst;
}

export function getInst<T>(elm: HTMLElement, formControl?: boolean): T {
  return formControl ? (elm as any).__mbscFormInst : (elm as any).__mbscInst;
}

export function registerComponent(Component: any) {
  components[Component._name] = Component;
}

/**
 * Will auto-init the registered components inside the provided element.
 * @param elm The element in which the components should be enhanced.
 */
export function enhance(elm: any, opt?: any) {
  if (elm) {
    for (const name of Object.keys(components)) {
      const Component = components[name];
      const selector = Component._selector;
      const renderOpt = Component._renderOpt;
      initComponents(elm, selector, Component, renderOpt, opt);
    }
  }
}
