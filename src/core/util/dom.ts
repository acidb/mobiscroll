import { isString, round, UNDEFINED } from './misc';
import { isBrowser } from './platform';

/**
 * Generic DOM functions.
 */

export const doc = isBrowser ? document : UNDEFINED;
export const win = isBrowser ? window : UNDEFINED;

const elem = doc && doc.createElement('div').style;
const canvas = doc && doc.createElement('canvas');
const ctx: any = canvas && canvas.getContext && canvas.getContext('2d', { willReadFrequently: true });
const textColors: any = {};

export const raf: any = (win && win.requestAnimationFrame) || ((func: any) => setTimeout(func, 20));

export const rafc: any =
  (win && win.cancelAnimationFrame) ||
  ((id: any) => {
    clearTimeout(id);
  });

export const hasAnimation = elem && elem.animationName !== UNDEFINED;

/**
 * @hidden
 * @param el
 * @param event
 * @param handler
 */
export function listen(el: EventTarget | null | undefined, event: string, handler: EventListener, opt?: any) {
  if (el) {
    el.addEventListener(event, handler, opt);
  }
}

/**
 * @hidden
 * @param el
 * @param event
 * @param handler
 */
export function unlisten(el: EventTarget | null | undefined, event: string, handler: EventListener, opt?: any) {
  if (el) {
    el.removeEventListener(event, handler, opt);
  }
}

/**
 * @hidden
 * @param el
 */
export function getDocument(el: HTMLElement): Document | undefined {
  if (!isBrowser) {
    return UNDEFINED;
  }
  return el && el.ownerDocument ? el.ownerDocument : doc;
}

/**
 * Returns the X or Y coordinate from a touch or mouse event.
 * @hidden
 * @param ev
 * @param axis
 * @param page
 * @returns
 */
export function getCoord(ev: any, axis: 'X' | 'Y', page?: boolean): number {
  const prop = (page ? 'page' : 'client') + axis;

  // Multi touch support
  if (ev.targetTouches && ev.targetTouches[0]) {
    return ev.targetTouches[0][prop];
  }

  if (ev.changedTouches && ev.changedTouches[0]) {
    return ev.changedTouches[0][prop];
  }

  return ev[prop];
}

export function getDimension(el: HTMLElement, property: string): number {
  return parseFloat((getComputedStyle(el) as any)[property] || '0');
}

export function getContext(context: HTMLElement | string | undefined, docu: Document): HTMLElement {
  let contextElm = isString(context) ? (docu.querySelector(context) as HTMLElement) : context;
  if (!contextElm) {
    contextElm = docu.body;
  }
  return contextElm;
}

export function getScrollLeft(el: any) {
  return el.scrollLeft !== UNDEFINED ? el.scrollLeft : el.pageXOffset;
}

export function getScrollTop(el: any) {
  return el.scrollTop !== UNDEFINED ? el.scrollTop : el.pageYOffset;
}

export function setScrollLeft(el: HTMLElement | Window, val: number) {
  if (el.scrollTo) {
    el.scrollTo(val, (el as Window).scrollY);
  } else {
    (el as HTMLElement).scrollLeft = val;
  }
}

export function setScrollTop(el: HTMLElement | Window, val: number) {
  if (el.scrollTo) {
    el.scrollTo((el as Window).scrollX, val);
  } else {
    (el as HTMLElement).scrollTop = val;
  }
}

/**
 * @hidden
 * @param el
 */
export function getWindow(el: HTMLElement): Window | undefined {
  if (!isBrowser) {
    return UNDEFINED;
  }
  return el && el.ownerDocument && el.ownerDocument.defaultView ? el.ownerDocument.defaultView : win;
}

/**
 * @hidden
 * @param el
 * @param vertical
 */
export function getPosition(el: HTMLElement, vertical?: boolean) {
  const style: any = getComputedStyle(el);
  const matrix = style.transform.split(')')[0].split(', ');
  const px = vertical ? matrix[13] || matrix[5] : matrix[12] || matrix[4];

  return +px || 0;
}

/**
 * Calculates the text color to be used with a given color (black or white)
 * @hidden
 * @param color
 */
export function getTextColor(color?: string): string {
  if (!ctx || !color) {
    return '#000';
  }

  // Cache calculated text colors, because it is slow
  if (textColors[color]) {
    return textColors[color];
  }

  // Use canvas element, since it does not require DOM append
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);

  const img = ctx.getImageData(0, 0, 1, 1);
  const rgb = img ? img.data : [0, 0, 0];
  const delta = +rgb[0] * 0.299 + +rgb[1] * 0.587 + +rgb[2] * 0.114;
  const textColor = delta < 130 ? '#fff' : '#000';

  textColors[color] = textColor;

  return textColor;
}

/**
 * Scrolls a container to the given position
 * @hidden
 * @param elm Element to scroll
 * @param toX Position to scroll horizontally to
 * @param toY Position to scroll vertically to
 * @param animate If true, scroll will be animated
 * @param rtl Rtl
 * @param callback Callback when scroll position is reached
 */
export function smoothScroll(
  elm: HTMLElement,
  toX?: number,
  toY?: number,
  animate?: boolean,
  rtl?: boolean,
  callback?: () => void,
): (newX?: number, newY?: number) => void {
  function scrollStep() {
    const elapsed = Math.min(1, (+new Date() - startTime) / 468);
    const eased = 0.5 * (1 - Math.cos(Math.PI * elapsed));
    const currentX = round(fromX + (targetX - fromX) * eased);
    const currentY = round(fromY + (targetY - fromY) * eased);

    elm.scrollLeft = currentX;
    elm.scrollTop = currentY;

    if (currentX !== targetX || currentY !== targetY) {
      raf(() => {
        scrollStep();
      });
    } else if (callback) {
      running = false;
      callback();
    }
  }

  const startTime = +new Date();
  const fromX = round(elm.scrollLeft);
  const fromY = round(elm.scrollTop);
  let targetX = toX === UNDEFINED ? fromX : Math.max(0, round(toX)) * (rtl ? -1 : 1);
  let targetY = toY === UNDEFINED ? fromY : Math.max(0, round(toY));
  let running: boolean;

  if (animate) {
    running = true;
    scrollStep();
  } else {
    elm.scrollLeft = targetX;
    elm.scrollTop = targetY;
    if (callback) {
      callback();
    }
  }

  return (newX?: number, newY?: number) => {
    targetX = newX === UNDEFINED ? targetX : Math.max(0, round(newX)) * (rtl ? -1 : 1);
    targetY = newY === UNDEFINED ? targetY : Math.max(0, round(newY));
    if (!animate || !running) {
      elm.scrollLeft = targetX;
      elm.scrollTop = targetY;
    }
  };
}

/**
 * Convert html text to plain text
 * @hidden
 * @param htmlString
 */
export function htmlToText(htmlString?: string): string {
  if (doc && htmlString) {
    const tempElm = doc.createElement('div');
    tempElm.innerHTML = htmlString;
    return tempElm.textContent!.trim();
  }
  return htmlString || '';
}

/**
 * Gets the offset of a HTML element relative to the window
 * @param el The HTML element
 */
export function getOffset(el: HTMLElement): { left: number; top: number } {
  const bRect = el.getBoundingClientRect();
  const ret = {
    left: bRect.left,
    top: bRect.top,
  };
  const window = getWindow(el);
  if (window !== UNDEFINED) {
    ret.top += getScrollTop(window);
    ret.left += getScrollLeft(window);
  }
  return ret;
}

/**
 * Checks if an HTML element matches the given selector
 * @param elm
 * @param selector
 */
export function matches(elm: HTMLElement, selector: string) {
  const matchesSelector = elm && elm.matches;
  return matchesSelector && matchesSelector.call(elm, selector);
}

/**
 * Returns the closest parent element matching the selector
 * @param elm The starting element
 * @param selector The selector string
 * @param context Only look within the context element
 */
export function closest(elm: HTMLElement, selector: string, context?: HTMLElement): HTMLElement | null {
  while (elm && !matches(elm, selector)) {
    if (elm === context || elm.nodeType === elm.DOCUMENT_NODE) {
      return null;
    }
    elm = elm.parentNode as HTMLElement;
  }
  return elm;
}

/**
 * Checks if a DOM node contains another DOM node, like the built in `contains` method,
 * but it works for element inside shadow DOM as well.
 * @param container Container to check.
 * @param elm The element to check.
 */
export function contains(container: Node, elm: Node) {
  let currentElm = elm;
  while (currentElm && currentElm.parentNode) {
    if (currentElm.parentNode === container) {
      return true;
    } else {
      currentElm = currentElm.parentNode;
    }
    if (currentElm instanceof DocumentFragment) {
      currentElm = (currentElm as any).host;
    }
  }
  return false;
}

/**
 * Triggers an event on a HTML element
 * NOTE: React messes with the event listeners, so triggering an event with
 * this method will not be picked up with a react way listener (ex. `<input onChange={handler} />`),
 * instead will require to be listened manually
 * @param elm The target HTML element, the event will triggered on
 * @param name The name of the event
 * @param data Additional event data
 */
export function trigger(elm: HTMLElement, name: string, data?: any) {
  let evt: any;
  try {
    evt = new CustomEvent(name, {
      bubbles: true,
      cancelable: true,
      detail: data,
    });
  } catch (e) {
    evt = document.createEvent('Event');
    evt.initEvent(name, true, true);
    evt.detail = data;
  }
  elm.dispatchEvent(evt);
}

export function forEach(items: any, func: (item: any, index: number) => void) {
  for (let i = 0; i < items.length; i++) {
    func(items[i], i);
  }
}
