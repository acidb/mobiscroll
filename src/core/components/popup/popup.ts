import { Directive } from '@angular/core';
import { BaseComponent } from '../../base';
import {
  contains,
  doc as docu,
  forEach,
  getContext,
  getDocument,
  getScrollLeft,
  getScrollTop,
  getWindow,
  hasAnimation,
  listen,
  matches,
  setScrollLeft,
  setScrollTop,
  unlisten,
} from '../../util/dom';
import { CLICK, FOCUS_IN, KEY_DOWN, MOUSE_DOWN, MOUSE_UP, MOUSE_WHEEL, SCROLL, TOUCH_MOVE, WHEEL } from '../../util/events';
import { DOWN_ARROW, ENTER, ESC, SPACE, TAB, UP_ARROW } from '../../util/keys';
import { addPixel, constrain, isArray, isString, ngSetTimeout, UNDEFINED } from '../../util/misc';
import { isBrowser, majorVersion, userAgent } from '../../util/platform';
import { resizeObserver } from '../../util/resize-observer';
import {
  MbscPopupButton,
  MbscPopupCloseEvent,
  MbscPopupCloseEventSource,
  MbscPopupOpenEvent,
  MbscPopupOptions,
  MbscPopupPositionEvent,
  MbscPopupPredefinedButton,
} from './popup.types.public';

let activeModal: PopupBase | undefined;

const EDITABLE = 'input,select,textarea,button';
const ALLOW_ENTER = 'textarea,button,input[type="button"],input[type="submit"]';
const FOCUSABLE = EDITABLE + ',[tabindex="0"]';
const MAX_WIDTH = 600;

const KEY_CODES: { [key: string]: number } = {
  enter: ENTER,
  esc: ESC,
  space: SPACE,
};

const needsFixed = isBrowser && /(iphone|ipod)/i.test(userAgent) && majorVersion >= 7 && majorVersion < 15;

type IPopupContext = HTMLElement & { __mbscIOSLock?: number; __mbscModals?: number; __mbscScrollLeft?: number; __mbscScrollTop?: number };

export interface IPopupButton extends MbscPopupButton {
  handler: (event: any) => void;
}

/** @hidden */
export interface MbscPopupState {
  arrowPos?: { left?: string; top?: string };
  bubblePos?: 'top' | 'bottom' | 'left' | 'right';
  isLarge?: boolean;
  isOpen?: boolean;
  isReady?: boolean;
  /** Top position of the popup */
  modalTop?: number;
  /** Left position of the popup */
  modalLeft?: number;
  /** Show or hide the popup arrow in anchored mode */
  showArrow?: boolean;
  /** Viewport width */
  width?: number;
  /** Viewport height */
  height?: number;
}

/** @hidden */
export function processButtons(inst: any, buttons?: Array<IPopupButton | MbscPopupButton | string>): IPopupButton[] | undefined {
  const s = inst.s; // Needed for localization settings
  const processedButtons: IPopupButton[] = [];
  const predefinedButtons: Record<MbscPopupPredefinedButton, MbscPopupButton> = {
    cancel: {
      cssClass: 'mbsc-popup-button-close',
      name: 'cancel',
      text: s.cancelText,
    },
    close: {
      cssClass: 'mbsc-popup-button-close',
      name: 'close',
      text: s.closeText,
    },
    ok: {
      cssClass: 'mbsc-popup-button-primary',
      keyCode: ENTER,
      name: 'ok',
      text: s.okText,
    },
    set: {
      cssClass: 'mbsc-popup-button-primary',
      keyCode: ENTER,
      name: 'set',
      text: s.setText,
    },
  };

  if (buttons && buttons.length) {
    buttons.forEach((btn) => {
      const button = isString(btn) ? predefinedButtons[btn as MbscPopupPredefinedButton] || { text: btn } : btn;
      if (!button.handler || isString(button.handler)) {
        if (isString(button.handler)) {
          button.name = button.handler;
        }
        button.handler = (domEvent: any) => {
          inst._onButtonClick({ domEvent, button });
        };
      }
      processedButtons.push(button as IPopupButton);
    });
    return processedButtons;
  }
  return UNDEFINED;
}

function getPrevActive(modal: PopupBase, i = 0): PopupBase | undefined {
  const prevModal = modal._prevModal;
  if (prevModal && prevModal !== modal && i < 10) {
    if (prevModal.isVisible()) {
      return prevModal;
    }
    return getPrevActive(prevModal, i + 1);
  }
  return UNDEFINED;
}

/** @hidden */
@Directive({ selector: '[mbsc-popup-b]' })
export class PopupBase extends BaseComponent<MbscPopupOptions, MbscPopupState> {
  /** @hidden */
  public static defaults: MbscPopupOptions = {
    buttonVariant: 'flat',
    cancelText: 'Cancel',
    closeOnEsc: true,
    closeOnOverlayClick: true,
    closeText: 'Close',
    contentPadding: true,
    display: 'center',
    focusOnClose: true,
    focusOnOpen: true,
    focusTrap: true,
    maxWidth: MAX_WIDTH,
    okText: 'Ok',
    scrollLock: true,
    setActive: true,
    setText: 'Set',
    showArrow: true,
    showOverlay: true,
  };

  protected static _name = 'Popup';

  // These are public because of the angular template only
  // ---

  /** @hidden */
  public _active!: HTMLElement;
  /** @hidden */
  public _animation?: string;
  /** @hidden */
  public _buttons?: IPopupButton[];
  /** @hidden */
  public _ctx!: IPopupContext;
  /** @hidden */
  public _content!: HTMLElement;
  /** @hidden */
  public _flexButtons?: boolean;
  /** @hidden */
  public _hasContext?: boolean;
  /** @hidden */
  public _headerHTML?: string;
  /** @hidden */
  public _isClosing?: boolean;
  /** @hidden */
  public _isModal?: boolean;
  /** @hidden */
  public _isOpening?: boolean;
  /** @hidden */
  public _isOpen?: boolean;
  /** @hidden */
  public _isVisible?: boolean;
  /** @hidden */
  public _limitator?: HTMLElement;
  /** @hidden */
  public _limits?: any;
  /** @hidden */
  public _popup!: HTMLElement;
  /** @hidden */
  public _prevFocus?: HTMLElement;
  /** @hidden */
  public _prevModal?: PopupBase;
  /** @hidden */
  public _round?: boolean;
  /** @hidden */
  public _style?: any;
  /** @hidden */
  public _wrapper!: HTMLElement;

  protected _justClosed?: boolean;
  protected _justOpened?: boolean;

  private _contextChanged?: boolean;
  private _doc?: Document;
  private _hasWidth?: boolean;
  private _lastFocus = +new Date();
  private _lock?: boolean;
  private _maxHeight!: number;
  private _maxWidth!: number;
  private _needsLock?: boolean;
  private _observer: any;
  private _preventClose?: boolean;
  private _scrollCont!: IPopupContext | Window;
  private _shouldPosition?: boolean;
  private _target?: any;
  private _vpWidth!: number;
  private _vpHeight!: number;
  private _win?: Window;

  /** @hidden */
  public _setActive = (el: any) => {
    this._active = el;
  };

  /** @hidden */
  public _setContent = (el: any) => {
    this._content = el;
  };

  /** @hidden */
  public _setLimitator = (el: any) => {
    this._limitator = el;
  };

  /** @hidden */
  public _setPopup = (el: any) => {
    this._popup = el;
  };

  /** @hidden */
  public _setWrapper = (el: any) => {
    this._wrapper = el;
  };

  /** @hidden */
  public _onOverlayClick = () => {
    if (this._isOpen && this.s.closeOnOverlayClick && !this._preventClose) {
      this._close('overlay');
    }
  };

  /** @hidden */
  public _onDocClick = (ev: any) => {
    if (!this.s.showOverlay && ev.target !== this.s.focusElm && activeModal === this) {
      this._onOverlayClick();
    }
    this._preventClose = false;
  };

  /** @hidden */
  public _onMouseDown = (ev: any) => {
    if (!this.s.showOverlay) {
      this._target = ev.target;
    }
  };

  /** @hidden */
  public _onMouseUp = (ev: any) => {
    if (this._target && this._popup && this._popup.contains(this._target) && !this._popup.contains(ev.target)) {
      this._preventClose = true;
    }
    this._target = false;
  };

  /** @hidden */
  public _onPopupClick = () => {
    if (!this.s.showOverlay) {
      this._preventClose = true;
    }
  };

  /** @hidden */
  public _onAnimationEnd = (ev: any) => {
    if (ev.target === this._popup) {
      if (this._isClosing) {
        this._onClosed();
        this._isClosing = false;
        if (this.state.isReady) {
          this.setState({ isReady: false });
        } else {
          this.forceUpdate();
        }
      }
      if (this._isOpening) {
        this._onOpened();
        this._isOpening = false;
        this.forceUpdate();
      }
    }
  };

  /** @hidden */
  public _onButtonClick = ({ domEvent, button }: { domEvent: any; button: MbscPopupButton }) => {
    this._hook('onButtonClick', { domEvent, button });
    if (/cancel|close|ok|set/.test(button.name as string)) {
      this._close(button.name);
    }
  };

  /** @hidden */
  public _onFocus = (ev: any) => {
    const now = +new Date();
    // If an element outside of the modal is focused, put the focus back inside the modal
    // Last focus time is tracked, to avoid infinite loop for focus,
    // if there's another modal present on page, e.g. Ionic or Bootstrap
    // https://github.com/acidb/mobiscroll/issues/341
    if (
      activeModal === this &&
      ev.target.nodeType &&
      this._ctx.contains(ev.target) &&
      this._popup &&
      !this._popup.contains(ev.target) &&
      now - this._lastFocus > 100 &&
      ev.target !== this.s.focusElm
    ) {
      this._lastFocus = now;
      this._active.focus();
    }
  };

  /** @hidden */
  public _onKeyDown = (ev: any) => {
    const s = this.s;
    const keyCode = ev.keyCode;
    const focusElm = s.focusElm && !s.focusOnOpen ? s.focusElm : UNDEFINED;

    // Prevent scroll on Space key
    if ((keyCode === SPACE && !matches(ev.target, EDITABLE)) || (this._lock && (keyCode === UP_ARROW || keyCode === DOWN_ARROW))) {
      ev.preventDefault();
    }

    // Trap the focus inside the modal
    if (s.focusTrap && keyCode === TAB) {
      const all = this._popup.querySelectorAll(FOCUSABLE);
      const focusable: any[] = [];
      let end = -1;
      let target = 0;
      let current = -1;
      let targetElm: HTMLElement | undefined = UNDEFINED;

      // Filter truly focusable elements
      forEach(all, (elm: any) => {
        if (!elm.disabled && (elm.offsetHeight || elm.offsetWidth)) {
          focusable.push(elm);
          end++;
          // Save the index of the currently focused element
          if (elm === this._doc!.activeElement) {
            current = end;
          }
        }
      });

      // If shift is also pressed, means we're going backwards,
      // so we target the last focusable element if the current active is the first
      if (ev.shiftKey) {
        target = end;
        end = 0;
      }

      // If current active is first or last, move focus to last or first focusable element
      if (current === end) {
        targetElm = focusElm || focusable[target];
      } else if (ev.target === focusElm) {
        targetElm = focusable[target];
      }

      if (targetElm) {
        targetElm.focus();
        ev.preventDefault();
      }
    }
  };

  /** @hidden */
  public _onContentScroll = (ev: any) => {
    if (this._lock && (ev.type !== TOUCH_MOVE || ev.touches[0].touchType !== 'stylus')) {
      ev.preventDefault();
    }
  };

  /** @hidden */
  public _onScroll = (ev: any) => {
    const s = this.s;
    if (s.closeOnScroll) {
      this._close('scroll');
    } else if (this._hasContext || s.display === 'anchored') {
      this.position();
    }
  };

  /** @hidden */
  public _onWndKeyDown = (ev: any) => {
    const s = this.s;
    const keyCode = ev.keyCode;
    // The keyCode is not defined if Chrome triggers keydown when a field is autofilled
    if (activeModal === this && keyCode !== UNDEFINED) {
      this._hook('onKeyDown', { keyCode });
      if (s.closeOnEsc && keyCode === ESC) {
        this._close('esc');
      }
      if (keyCode === ENTER && matches(ev.target, ALLOW_ENTER) && !ev.shiftKey) {
        return;
      }
      if (this._buttons) {
        for (const button of this._buttons) {
          const buttonKeyCodes = isArray(button.keyCode) ? button.keyCode : [button.keyCode];
          for (const key of buttonKeyCodes) {
            if (!button.disabled && key !== UNDEFINED && (key === keyCode || KEY_CODES[key] === keyCode)) {
              button.handler(ev);
              return;
            }
          }
        }
      }
    }
  };

  /** @hidden */
  public _onResize = () => {
    const wrapper = this._wrapper;
    const hasContext = this._hasContext;

    if (!wrapper) {
      return;
    }

    this._vpWidth = Math.min(wrapper.clientWidth, hasContext ? Infinity : this._win!.innerWidth);
    this._vpHeight = Math.min(wrapper.clientHeight, hasContext ? Infinity : this._win!.innerHeight);
    this._maxWidth = this._limitator!.offsetWidth;
    this._maxHeight = this.s.maxHeight !== UNDEFINED || this._vpWidth < 768 || this._vpHeight < 650 ? this._limitator!.offsetHeight : 600;
    // TODO: this._round = this.s.touchUi === false || (this._popup.offsetWidth < this._vpWidth && this._vpWidth > this._maxWidth);
    this._round = true;

    const args: any = {
      isLarge: this._round,
      maxPopupHeight: this._maxHeight,
      maxPopupWidth: this._maxWidth,
      target: wrapper,
      windowHeight: this._vpHeight,
      windowWidth: this._vpWidth,
    };

    if (this._hook('onResize', args) !== false && !args.cancel) {
      this.position();
    }
  };

  // ---

  /**
   * Opens the component.
   *
   * @method javascript
   * @method jquery
   */
  public open() {
    if (!this._isOpen) {
      this.setState({
        isOpen: true,
      });
    }
  }

  /**
   * Closes the component.
   *
   * @method javascript
   * @method jquery
   */
  public close() {
    this._close();
  }

  /**
   * Returns if the component is opened or not.
   */
  public isVisible(): boolean {
    return !!this._isOpen;
  }

  /**
   * Recalculates the position of the component.
   */
  public position() {
    if (!this._isOpen) {
      return;
    }
    const s = this.s;
    const state = this.state;
    const wrapper = this._wrapper;
    const popup = this._popup!;
    const hasContext = this._hasContext;
    const isLarge = this._round;
    const anchor = s.anchor!;
    const anchorAlign = s.anchorAlign;
    const rtl = s.rtl;
    const scrollTop = getScrollTop(this._scrollCont);
    const scrollLeft = getScrollLeft(this._scrollCont);
    const viewportWidth = this._vpWidth;
    const viewportHeight = this._vpHeight;
    const maxWidth = this._maxWidth;
    const maxHeight = this._maxHeight;
    const popupWidth = Math.min(popup.offsetWidth, maxWidth);
    const popupHeight = Math.min(popup.offsetHeight, maxHeight);

    let showArrow = s.showArrow;

    this._lock = s.scrollLock! && this._content.scrollHeight <= this._content.clientHeight;

    if (hasContext) {
      wrapper.style.top = scrollTop + 'px';
      wrapper.style.left = scrollLeft + 'px';
    }

    const skip =
      this._hook<MbscPopupPositionEvent>('onPosition', {
        isLarge,
        maxPopupHeight: maxHeight,
        maxPopupWidth: maxWidth,
        target: this._wrapper,
        windowHeight: viewportHeight,
        windowWidth: viewportWidth,
      }) === false;

    if (s.display === 'anchored' && !skip) {
      let ctxLeft = 0;
      let ctxTop = 0;
      let left = constrain(state.modalLeft || 0, 8, viewportWidth - popupWidth - 8);
      let top = state.modalTop || 8;
      let bubblePos: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
      let arrowPos: { left?: string; top?: string } = {};
      const arrowHeight = showArrow ? 16 : 4;
      const arrowOffset = s.arrowOffset || 30;
      const anchorIsInput = anchor && matches(anchor, 'input,textarea');
      const fullWidth = wrapper.offsetWidth;
      const fullHeight = wrapper.offsetHeight;
      const widthOffset = (fullWidth - viewportWidth) / 2;
      const heightOffset = (fullHeight - viewportHeight) / 2;

      if (hasContext) {
        const ctxBox = this._ctx.getBoundingClientRect();
        ctxTop = ctxBox.top;
        ctxLeft = ctxBox.left;
      }

      // Check if anchor exists and it's inside the context
      if (anchor && contains(this._ctx, anchor)) {
        const box = anchor.getBoundingClientRect();
        const anchorTop = box.top - ctxTop;
        const anchorLeft = box.left - ctxLeft;
        const anchorWidth = anchor.offsetWidth;
        const anchorHeight = anchor.offsetHeight;

        if ((anchorAlign === 'start' && !rtl) || (anchorAlign === 'end' && rtl)) {
          // Position to the left of the anchor
          left = anchorLeft;
        } else if ((anchorAlign === 'end' && !rtl) || (anchorAlign === 'start' && rtl)) {
          // Position to the right of the anchor
          left = anchorLeft + anchorWidth - popupWidth;
        } else {
          // Position to the center of the anchor
          left = anchorLeft - (popupWidth - anchorWidth) / 2;
        }

        // Make sure to remain in the viewport
        left = constrain(left, 8, viewportWidth - popupWidth - 8);

        // By default position the popup to the bottom of the anchor
        top = anchorTop + anchorHeight + arrowHeight;
        arrowPos = {
          left: constrain(anchorLeft + anchorWidth / 2 - left - widthOffset, arrowOffset, popupWidth - arrowOffset) + 'px',
        };

        // If there's no space below
        if (top + popupHeight + arrowHeight > viewportHeight) {
          if (anchorTop - popupHeight - arrowHeight > 0) {
            // Check if above the anchor is enough space
            bubblePos = 'top';
            top = anchorTop - popupHeight - arrowHeight;
          } else if (!s.disableLeftRight) {
            const leftPos = anchorLeft - popupWidth - 8 > 0; // Check if there's space on the left
            const rightPos = anchorLeft + anchorWidth + popupWidth + 8 <= viewportWidth; // Check if there's space on the right

            // calculations are almost the same for the left and right position, so we group them together
            if (leftPos || rightPos) {
              top = constrain(anchorTop - (popupHeight - anchorHeight) / 2, 8, viewportHeight - popupHeight - 8);

              // Make sure it stays in the viewport
              if (top + popupHeight + 8 > viewportHeight) {
                // The top position can be negative because of the -16px spacing
                top = Math.max(viewportHeight - popupHeight - 8, 0);
              }

              arrowPos = {
                top: constrain(anchorTop + anchorHeight / 2 - top - heightOffset, arrowOffset, popupHeight - arrowOffset) + 'px',
              };

              bubblePos = leftPos ? 'left' : 'right';
              left = leftPos ? anchorLeft - popupWidth : anchorLeft + anchorWidth;
            }
          }
        }
      } else {
        showArrow = false;
      }

      if (bubblePos === 'top' || bubblePos === 'bottom') {
        const isOutOfViewport = top + popupHeight + arrowHeight > viewportHeight;
        if (isOutOfViewport) {
          // For input anchors positioned below don't lock the scroll if the popup is out of the viewport
          // The disableLeftRight option is used to determine if it's a picker (select or datepicker),
          // where we don't want this functionality
          if (anchorIsInput && bubblePos === 'bottom' && !s.disableLeftRight) {
            this._lock = false;
            this._ctx.style.minHeight = scrollTop + top + popupHeight + arrowHeight + 'px';
          } else {
            // Make sure it stays in the viewport
            // The top position can be negative because of the -16px spacing
            top = Math.max(viewportHeight - popupHeight - arrowHeight, 0);
            showArrow = false;
          }
        }
      }

      this.setState({
        arrowPos,
        bubblePos,
        height: viewportHeight,
        isLarge,
        isReady: true,
        modalLeft: left,
        modalTop: top,
        showArrow,
        width: viewportWidth,
      });
    } else {
      this.setState({
        height: viewportHeight,
        isLarge,
        isReady: true,
        showArrow,
        width: viewportWidth,
      });
    }
  }

  protected _render(s: MbscPopupOptions, state: MbscPopupState) {
    // 'bubble' is deprecated, renamed to 'anchored'
    if (s.display === 'bubble') {
      s.display = 'anchored';
    }

    const animation = s.animation;
    const display = s.display;
    const prevProps = this._prevS;
    const hasPos = display === 'anchored';
    const isModal = display !== 'inline';
    const isFullScreen = s.fullScreen && isModal;
    const isOpen = isModal ? (s.isOpen === UNDEFINED ? state.isOpen : s.isOpen) : false;

    if (
      isOpen &&
      (s.windowWidth !== prevProps.windowWidth ||
        s.display !== prevProps.display ||
        s.showArrow !== prevProps.showArrow ||
        s.touchUi !== prevProps.touchUi ||
        (s.anchor !== prevProps.anchor && s.display === 'anchored'))
    ) {
      this._shouldPosition = true;
    }

    this._limits = {
      maxHeight: addPixel(s.maxHeight),
      maxWidth: addPixel(s.maxWidth),
    };

    this._style = {
      height: isFullScreen ? '100%' : addPixel(s.height),
      left: hasPos && state.modalLeft ? state.modalLeft + 'px' : '',
      maxHeight: addPixel(this._maxHeight || s.maxHeight),
      maxWidth: addPixel(this._maxWidth || s.maxWidth),
      top: hasPos && state.modalTop ? state.modalTop + 'px' : '',
      width: isFullScreen ? '100%' : addPixel(s.width),
    };

    this._hasContext = s.context !== 'body' && s.context !== UNDEFINED;
    this._needsLock = needsFixed && !this._hasContext && display !== 'anchored' && s.scrollLock!;
    this._isModal = isModal;
    this._flexButtons = display === 'center'; // || (!this._touchUi && !isFullScreen && (display === 'top' || display === 'bottom'));

    if (animation !== UNDEFINED && animation !== true) {
      this._animation = isString(animation) ? animation : '';
    } else {
      switch (display) {
        case 'bottom':
          this._animation = 'slide-up';
          break;
        case 'top':
          this._animation = 'slide-down';
          break;
        default:
          this._animation = 'pop';
      }
    }

    if (s.buttons) {
      if (s.buttons !== prevProps.buttons || s.locale !== prevProps.locale) {
        this._buttons = processButtons(this, s.buttons);
      }
    } else {
      this._buttons = UNDEFINED;
    }

    if (s.context !== prevProps.context) {
      this._contextChanged = true;
    }

    // Will open
    if (isOpen && !this._isOpen) {
      this._onOpen();
    }

    // Will close
    if (!isOpen && this._isOpen) {
      this._onClose();
    }

    this._isOpen = isOpen!;
    this._isVisible = isOpen || this._isClosing!;
  }

  protected _updated() {
    const s = this.s;
    const wrapper = this._wrapper;

    if (docu && (this._contextChanged || !this._ctx)) {
      this._ctx = getContext(s.context, docu);
      this._contextChanged = false;
      // If we just got the context and at the same time the popup was opened,
      // we need an update for the Portal to render the content of the popup
      if (this._justOpened) {
        ngSetTimeout(this, () => {
          this.forceUpdate();
        });
        return;
      }
    }

    if (!wrapper) {
      return;
    }

    if (this._justOpened) {
      const ctx = this._ctx;
      const hasContext = this._hasContext;
      const doc = (this._doc = getDocument(wrapper)!);
      const win = (this._win = getWindow(wrapper)!);
      const activeElm = doc.activeElement as HTMLElement;

      // If we have responsive setting, we need to make sure to pass the width to the state,
      // and re-render so we have the correct calculated settings, which is based on the width.
      if (!this._hasWidth && s.responsive) {
        const viewportWidth = Math.min(wrapper.clientWidth, hasContext ? Infinity : win.innerWidth);
        const viewportHeight = Math.min(wrapper.clientHeight, hasContext ? Infinity : win.innerHeight);
        this._hasWidth = true;
        if (viewportWidth !== this.state.width || viewportHeight !== this.state.height) {
          ngSetTimeout(this, () => {
            this.setState({
              height: viewportHeight,
              width: viewportWidth,
            });
          });
          return;
        }
      }

      this._scrollCont = hasContext ? ctx : win;
      this._observer = resizeObserver(wrapper, this._onResize, this._zone);
      this._prevFocus = s.focusElm || activeElm;

      ctx.__mbscModals = (ctx.__mbscModals || 0) + 1;

      // Scroll locking
      if (this._needsLock) {
        if (!ctx.__mbscIOSLock) {
          const scrollTop = getScrollTop(this._scrollCont);
          const scrollLeft = getScrollLeft(this._scrollCont);
          ctx.style.left = -scrollLeft + 'px';
          ctx.style.top = -scrollTop + 'px';
          ctx.__mbscScrollLeft = scrollLeft;
          ctx.__mbscScrollTop = scrollTop;
          ctx.classList.add('mbsc-popup-open-ios');
          ctx.parentElement!.classList.add('mbsc-popup-open-ios');
        }
        ctx.__mbscIOSLock = (ctx.__mbscIOSLock || 0) + 1;
      }

      if (hasContext) {
        ctx.classList.add('mbsc-popup-ctx');
      }

      if (s.focusTrap) {
        listen(win, FOCUS_IN, this._onFocus);
      }

      if (s.focusElm && !s.focusOnOpen) {
        listen(s.focusElm, KEY_DOWN, this._onKeyDown);
      }

      listen(this._scrollCont, TOUCH_MOVE, this._onContentScroll, { passive: false });
      listen(this._scrollCont, WHEEL, this._onContentScroll, { passive: false });
      listen(this._scrollCont, MOUSE_WHEEL, this._onContentScroll, { passive: false });

      setTimeout(() => {
        if (s.focusOnOpen && activeElm) {
          // TODO investigate on this, maybe it hides the virtual keyboard?
          activeElm.blur();
        }

        if (!hasAnimation || !this._animation) {
          this._onOpened();
        }

        // Need to be inside setTimeout to prevent immediate close
        listen(doc, MOUSE_DOWN, this._onMouseDown);
        listen(doc, MOUSE_UP, this._onMouseUp);
        listen(doc, CLICK, this._onDocClick);
      });

      this._hook<MbscPopupOpenEvent>('onOpen', { target: this._wrapper });
    }
    if (this._shouldPosition) {
      ngSetTimeout(this, () => {
        this._onResize();
      });
    }
    this._justOpened = false;
    this._justClosed = false;
    this._shouldPosition = false;
  }

  protected _destroy() {
    if (this._isOpen) {
      this._onClosed();
      this._unlisten();
      if (activeModal === this) {
        activeModal = getPrevActive(this);
      }
    }
  }

  protected _onOpen() {
    if (hasAnimation && this._animation) {
      this._isOpening = true;
      this._isClosing = false;
    }
    this._justOpened = true;
    this._preventClose = false;
    if (this.s.setActive && activeModal !== this) {
      // Wait for the click to propagate,
      // because if another popup needs to be closed on doc click, we don't want to override
      // the activeModal variable.
      setTimeout(() => {
        this._prevModal = activeModal;
        activeModal = this;
      });
    }
  }

  protected _onClose() {
    // TODO: check if this is still needed
    // const activeElm = this._doc!.activeElement as HTMLElement;
    // if (activeElm) {
    // There's a weird issue on Safari, where the page scrolls up when
    // 1) A readonly input inside the popup has the focus
    // 2) The popup is closed by clicking on a `button` element (built in popup buttons, or a button in the popup content)
    // To prevent this, blur the active element when closing the popup.
    // setTimeout is needed to prevent to avoid the "Cannot flush updates when React is already rendering" error in React
    // setTimeout(() => {
    // activeElm.blur();
    // });
    // }
    if (hasAnimation && this._animation) {
      this._isClosing = true;
      this._isOpening = false;
    } else {
      setTimeout(() => {
        this._onClosed();
        this.setState({ isReady: false });
      });
    }
    this._hasWidth = false;
    this._unlisten();
  }

  protected _onOpened() {
    const s = this.s;

    if (s.focusOnOpen) {
      const activeElm = s.activeElm;
      const active = activeElm
        ? isString(activeElm)
          ? (this._popup.querySelector(activeElm) as HTMLElement) || this._active
          : activeElm
        : this._active;
      if (active && active.focus) {
        active.focus();
      }
    }

    listen(this._win, KEY_DOWN, this._onWndKeyDown);
    listen(this._scrollCont, SCROLL, this._onScroll);
  }

  protected _onClosed() {
    const ctx = this._ctx;
    const prevFocus = this._prevFocus;
    const shouldFocus = this.s.focusOnClose && prevFocus && prevFocus !== this._doc!.activeElement;

    ctx.style.minHeight = '';

    if (ctx.__mbscModals) {
      ctx.__mbscModals--;
    }

    this._justClosed = true;

    if (this._needsLock) {
      if (ctx.__mbscIOSLock) {
        ctx.__mbscIOSLock--;
      }
      if (!ctx.__mbscIOSLock) {
        ctx.classList.remove('mbsc-popup-open-ios');
        ctx.parentElement!.classList.remove('mbsc-popup-open-ios');
        ctx.style.left = '';
        ctx.style.top = '';
        setScrollLeft(this._scrollCont, ctx.__mbscScrollLeft || 0);
        setScrollTop(this._scrollCont, ctx.__mbscScrollTop || 0);
      }
    }

    if (this._hasContext && !ctx.__mbscModals) {
      ctx.classList.remove('mbsc-popup-ctx');
    }

    this._hook('onClosed', { focus: shouldFocus });

    if (shouldFocus) {
      prevFocus!.focus();
    }

    setTimeout(() => {
      if (activeModal === this) {
        activeModal = getPrevActive(this);
      }
    });
  }

  private _unlisten() {
    unlisten(this._win, KEY_DOWN, this._onWndKeyDown);
    unlisten(this._scrollCont, SCROLL, this._onScroll);

    unlisten(this._scrollCont, TOUCH_MOVE, this._onContentScroll, { passive: false });
    unlisten(this._scrollCont, WHEEL, this._onContentScroll, { passive: false });
    unlisten(this._scrollCont, MOUSE_WHEEL, this._onContentScroll, { passive: false });

    unlisten(this._doc, MOUSE_DOWN, this._onMouseDown);
    unlisten(this._doc, MOUSE_UP, this._onMouseUp);
    unlisten(this._doc, CLICK, this._onDocClick);

    if (this.s.focusTrap) {
      unlisten(this._win, FOCUS_IN, this._onFocus);
    }

    if (this.s.focusElm) {
      unlisten(this.s.focusElm, KEY_DOWN, this._onKeyDown);
    }

    if (this._observer) {
      this._observer.detach();
      this._observer = null;
    }
  }

  private _close(source?: MbscPopupCloseEventSource) {
    if (this._isOpen) {
      if (this.s.isOpen === UNDEFINED) {
        this.setState({
          isOpen: false,
        });
      }
      this._hook<MbscPopupCloseEvent>('onClose', { source });
    }
  }
}
