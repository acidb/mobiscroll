import { UNDEFINED } from '../core/util/misc';

export { Fragment, h as createElement, render } from 'vue';

export const enhance: any = UNDEFINED;
export const isPreact = false;
export const isVue = true;
export const ON_ANIMATION_END = 'onAnimationend';
export const ON_CONTEXT_MENU = 'onContextmenu';
export const ON_DOUBLE_CLICK = 'onDblclick';
export const ON_KEY_DOWN = 'onKeydown';
export const ON_MOUSE_DOWN = 'onMousedown';
export const ON_MOUSE_ENTER = 'onMouseenter';
export const ON_MOUSE_LEAVE = 'onMouseleave';
export const ON_MOUSE_MOVE = 'onMousemove';

export function createContext(ctx?: any): any {}

export function unmountComponentAtNode(elm?: any) {}
