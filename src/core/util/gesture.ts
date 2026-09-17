import { doc, getCoord, getDocument, getWindow, listen, unlisten } from './dom';
import {
  BLUR,
  CHANGE,
  CONTEXTMENU,
  DOUBLE_CLICK,
  FOCUS,
  INPUT,
  KEY_DOWN,
  MOUSE_DOWN,
  MOUSE_ENTER,
  MOUSE_LEAVE,
  MOUSE_MOVE,
  MOUSE_UP,
  TOUCH_CANCEL,
  TOUCH_END,
  TOUCH_MOVE,
  TOUCH_START,
} from './events';

type WindowType = (Window & { __mbscFocusCount?: number; __mbscFocusVisible?: boolean }) | undefined;

export interface IGestureArgs {
  moved: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  deltaX: number;
  deltaY: number;
  domEvent: Event;
  isTouch: boolean;
  target: HTMLElement;
}

export interface IGestureOptions {
  keepFocus: boolean;
  prevDef: boolean;
  onRelease(): void;
  onPress(): void;
  onStart(ev: IGestureArgs): any;
  onMove(ev: IGestureArgs): void;
  onEnd(ev: IGestureArgs): void;
  onHoverIn(ev: any): void;
  onHoverOut(ev: any): void;
  onKeyDown(ev: any): void;
  onFocus(ev: any, isFocusVisible?: boolean): void;
  onBlur(ev?: any): void;
  onChange(ev: any): void;
  onInput(ev: any): void;
  onDoubleClick(ev: IGestureArgs): void;
}

/** @hidden */
function setFocusInvisible(ev: any) {
  const win: WindowType = getWindow(ev.target);
  win!.__mbscFocusVisible = false;
}

/** @hidden */
function setFocusVisible(ev: any) {
  const win: WindowType = getWindow(ev.target);
  win!.__mbscFocusVisible = true;
}

/** @hidden */
function addRipple(elm: HTMLElement, x: number, y: number): HTMLElement {
  const rect = elm.getBoundingClientRect();
  const left = x - rect.left;
  const top = y - rect.top;
  const width = Math.max(left, elm.offsetWidth - left);
  const height = Math.max(top, elm.offsetHeight - top);
  const size = 2 * Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
  const ripple = doc!.createElement('span');

  ripple.classList.add('mbsc-ripple');

  const style = ripple.style;

  style.backgroundColor = getComputedStyle(elm).color;
  style.width = size + 'px';
  style.height = size + 'px';
  style.top = y - rect.top - size / 2 + 'px';
  style.left = x - rect.left - size / 2 + 'px';

  elm.appendChild(ripple);

  setTimeout(() => {
    style.opacity = '.2';
    style.transform = 'scale(1)';
    style.transition = 'opacity linear .1s, transform cubic-bezier(0, 0, 0.2, 1) .4s';
  }, 30);

  return ripple;
}

/** @hidden */
function removeRipple(r: HTMLElement) {
  if (r) {
    setTimeout(() => {
      r.style.opacity = '0';
      r.style.transition = 'opacity linear .4s';
      setTimeout(() => {
        if (r && r.parentNode) {
          r.parentNode.removeChild(r);
        }
      }, 400);
    }, 200);
  }
}

/** @hidden */
export function gestureListener(elm: HTMLElement, options: Partial<IGestureOptions>) {
  const args: Partial<IGestureArgs> = {};
  const win: WindowType = getWindow(elm);
  const document = getDocument(elm);
  let active: boolean;
  let activeable: boolean;
  let activeTimer: any;
  let ripple: HTMLElement;
  let hasFocus: boolean;
  let hasHover: boolean;
  let hasRipple: boolean;
  let moved: boolean;
  let startX: number;
  let startY: number;
  let endX: number;
  let endY: number;
  let deltaX: number;
  let deltaY: number;
  let started: boolean;
  let wasTouched: boolean;

  function skipMouseEvent(ev: any) {
    if (ev.type === TOUCH_START) {
      wasTouched = true;
    } else if (wasTouched) {
      if (ev.type === MOUSE_DOWN) {
        wasTouched = false;
      }
      return true;
    }
    return false;
  }

  function activate() {
    if (hasRipple) {
      removeRipple(ripple);
      ripple = addRipple(elm, endX, endY);
    }
    options.onPress!();
    active = true;
  }

  function deactivate(r: HTMLElement, time?: number) {
    activeable = false;
    removeRipple(r);
    clearTimeout(activeTimer);
    activeTimer = setTimeout(() => {
      if (active) {
        options.onRelease!();
        active = false;
      }
    }, time);
  }

  function onStart(ev: any) {
    // Skip if mouse down event was fired after touch
    if (skipMouseEvent(ev)) {
      return;
    }

    // Skip mousedown event if right click
    if (ev.type === MOUSE_DOWN && (ev.button !== 0 || ev.ctrlKey)) {
      return;
    }

    startX = getCoord(ev, 'X');
    startY = getCoord(ev, 'Y');
    endX = startX;
    endY = startY;
    active = false;
    activeable = false;
    moved = false;
    started = true;

    args.moved = moved;
    args.startX = startX;
    args.startY = startY;
    args.endX = endX;
    args.endY = endY;
    args.deltaX = 0;
    args.deltaY = 0;
    args.domEvent = ev;
    args.isTouch = wasTouched;
    args.target = elm;

    removeRipple(ripple);

    if (options.onStart) {
      const ret = options.onStart(args as IGestureArgs);
      hasRipple = ret && ret.ripple;
    }

    if (options.onPress) {
      activeable = true;
      clearTimeout(activeTimer);
      activeTimer = setTimeout(activate, 50);
    }

    if (ev.type === MOUSE_DOWN) {
      listen(document, MOUSE_MOVE, onMove);
      listen(document, MOUSE_UP, onEnd);
    }
    listen(document, CONTEXTMENU, onContextMenu);
  }

  function onMove(ev: any) {
    if (!started) {
      return;
    }

    endX = getCoord(ev, 'X');
    endY = getCoord(ev, 'Y');
    deltaX = endX - startX;
    deltaY = endY - startY;

    if (!moved && (Math.abs(deltaX) > 9 || Math.abs(deltaY) > 9)) {
      moved = true;
      deactivate(ripple);
    }

    args.moved = moved;
    args.endX = endX;
    args.endY = endY;
    args.deltaX = deltaX;
    args.deltaY = deltaY;
    args.domEvent = ev;
    args.isTouch = ev.type === TOUCH_MOVE;

    if (options.onMove) {
      options.onMove(args as IGestureArgs);
    }
  }

  function onEnd(ev: any) {
    if (!started) {
      return;
    }

    if (activeable && !active) {
      clearTimeout(activeTimer);
      activeTimer = null;
      activate();
    }

    args.domEvent = ev;
    args.isTouch = ev.type === TOUCH_END;

    if (options.onEnd) {
      options.onEnd(args as IGestureArgs);
    }
    deactivate(ripple, 75);

    started = false;

    if (ev.type === MOUSE_UP) {
      unlisten(document, MOUSE_MOVE, onMove);
      unlisten(document, MOUSE_UP, onEnd);
    }
    unlisten(document, CONTEXTMENU, onContextMenu);
  }

  function onHoverIn(ev: any) {
    if (skipMouseEvent(ev)) {
      return;
    }
    hasHover = true;
    options.onHoverIn!(ev);
  }

  function onHoverOut(ev: any) {
    if (hasHover) {
      options.onHoverOut!(ev);
    }
    hasHover = false;
  }

  function onKeyDown(ev: any) {
    options.onKeyDown!(ev);
  }

  function onFocus(ev: any) {
    if (options.keepFocus || win!.__mbscFocusVisible) {
      hasFocus = true;
      options.onFocus!(ev, win!.__mbscFocusVisible);
    }
  }

  function onBlur(ev: any) {
    if (hasFocus) {
      options.onBlur!(ev);
    }
    hasFocus = false;
  }

  function onChange(ev: any) {
    options.onChange!(ev);
  }

  function onInput(ev: any) {
    options.onInput!(ev);
  }

  function onDoubleClick(ev: any) {
    args.domEvent = ev;
    if (!wasTouched) {
      options.onDoubleClick!(args as IGestureArgs);
    }
  }

  function onContextMenu(ev: any) {
    if (wasTouched) {
      ev.preventDefault();
    }
  }

  // Set up listeners

  listen(elm, MOUSE_DOWN, onStart);
  listen(elm, TOUCH_START, onStart, { passive: true });
  listen(elm, TOUCH_MOVE, onMove, { passive: false });
  listen(elm, TOUCH_END, onEnd);
  listen(elm, TOUCH_CANCEL, onEnd);

  if (options.onChange) {
    listen(elm, CHANGE, onChange);
  }

  if (options.onInput) {
    listen(elm, INPUT, onInput);
  }

  if (options.onHoverIn) {
    listen(elm, MOUSE_ENTER, onHoverIn);
  }

  if (options.onHoverOut) {
    listen(elm, MOUSE_LEAVE, onHoverOut);
  }

  if (options.onKeyDown) {
    listen(elm, KEY_DOWN, onKeyDown);
  }

  if (options.onFocus && win) {
    listen(elm, FOCUS, onFocus);
    if (!options.keepFocus) {
      let focusCount = win.__mbscFocusCount || 0;
      if (focusCount === 0) {
        listen(win, MOUSE_DOWN, setFocusInvisible, true);
        listen(win, KEY_DOWN, setFocusVisible, true);
      }
      win.__mbscFocusCount = ++focusCount;
    }
  }

  if (options.onBlur) {
    listen(elm, BLUR, onBlur);
  }

  if (options.onDoubleClick) {
    listen(elm, DOUBLE_CLICK, onDoubleClick);
  }

  return () => {
    if (activeTimer) {
      clearTimeout(activeTimer);
    }

    if (options.onFocus && win && !options.keepFocus) {
      let focusCount = win.__mbscFocusCount || 0;
      win.__mbscFocusCount = --focusCount;
      if (focusCount <= 0) {
        unlisten(win, MOUSE_DOWN, setFocusInvisible);
        unlisten(win, KEY_DOWN, setFocusVisible);
      }
    }

    unlisten(elm, INPUT, onInput);
    unlisten(elm, MOUSE_DOWN, onStart);
    unlisten(elm, TOUCH_START, onStart, { passive: true });
    unlisten(elm, TOUCH_MOVE, onMove, { passive: false });
    unlisten(elm, TOUCH_END, onEnd);
    unlisten(elm, TOUCH_CANCEL, onEnd);
    unlisten(document, MOUSE_MOVE, onMove);
    unlisten(document, MOUSE_UP, onEnd);
    unlisten(document, CONTEXTMENU, onContextMenu);

    unlisten(elm, CHANGE, onChange);
    unlisten(elm, MOUSE_ENTER, onHoverIn);
    unlisten(elm, MOUSE_LEAVE, onHoverOut);
    unlisten(elm, KEY_DOWN, onKeyDown);
    unlisten(elm, FOCUS, onFocus);
    unlisten(elm, BLUR, onBlur);
    unlisten(elm, DOUBLE_CLICK, onDoubleClick);
  };
}
