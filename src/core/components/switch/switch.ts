import { Directive } from '@angular/core';
import { BaseComponent } from '../../base';
import { getOffset, listen, unlisten } from '../../util/dom';
import { CLICK, TOUCH_MOVE } from '../../util/events';
import { gestureListener } from '../../util/gesture';
import { emptyOrTrue, UNDEFINED } from '../../util/misc';
import { MbscSwitchOptions } from './switch.types.public';

/** @hidden */
export interface MbscSwitchState {
  checked?: boolean;
  disabled?: boolean;
  hasFocus?: boolean;
  hasHover?: boolean;
  isActive?: boolean;
  dragging?: boolean;
}

/** @hidden
 * The number of pixels the cursor needs to move in a gesture for not taken as a click.
 * If the cursors moves more than this between a mouse/touch down and up gesture, it is not considered a click.
 */
const CLICK_MOVE_THRESHOLD = 3;
/** @hidden
 * The number of milliseconds to pass between a mouse/touch down and up for not taken as a click.
 * If more time is passed between the down and up event, the gesture is not considered a click.
 */
const CLICK_HOLD_THRESHOLD = 300;

/** @hidden */
@Directive({ selector: '[mbsc-sw-b]' })
export class SwitchBase extends BaseComponent<MbscSwitchOptions, MbscSwitchState> {
  public static defaults: MbscSwitchOptions = {
    position: 'end',
  };

  protected static _name = 'Switch';

  public _checked!: boolean;
  public _cssClass?: string;
  public _disabled?: boolean;
  public _input!: HTMLInputElement;
  public _handle!: HTMLSpanElement;
  public _handleCont!: HTMLSpanElement;
  public _handleContClass?: string;
  public _handleClass?: string;
  public _handleLeft!: number;

  private _unlisten?: () => void;
  private _inputUnlisten?: () => void;
  private _trackUnlisten?: () => void;

  public _onChange = (ev: any) => {
    const s = this.s;
    const checked = ev.target.checked;
    // Prevent propagating click to label, otherwise space key won't work
    ev.stopPropagation();
    // Uncontrolled
    if (s.checked === UNDEFINED) {
      this._checked = checked;
      this.setState({ checked });
    }
    this._change(checked);

    if (s.onChange) {
      s.onChange(ev);
    }
  };

  public _setInput = (input: any) => {
    this._input = input;
  };

  public _setHandleCont = (span: any) => {
    this._handleCont = span;
  };

  public _setHandle = (span: any) => {
    this._handle = span;
  };

  /**
   * The click events default behavior on labels are to also trigger a change event.
   * We need to disable this behavior because we trigger the change events manually to be consistent.
   *
   * The main reason for this is that on touch devices when there is a drag, there is no click triggered,
   * but when there's only a tap, there's also a click, so that would result in multiple change events
   * that would cancel out each other.
   */
  public _onLabelClick = (ev: any) => {
    ev.preventDefault();
  };

  public _change(checked: boolean) {}

  /**
   * Sets the handle position
   * @param left The left position of the handle element in percent
   */
  protected _setHandleLeft(left: number) {
    this._handle.style.left = left + '%';
  }

  protected _mounted() {
    // Holds the handle container width. Used for performance improvement purposes.
    // This way it's queried only in every gesture start instead of in every move gesture
    let handleContWidth: number;

    // Holds the handle container left coordinate. Used for performance improvement purposes.
    // This way it's queried only in every gesture start instead of in every move gesture
    let handleContLeft: number;

    // Timestamp set at the start of each gesture.
    // Used for measuring the duration of the gesture.
    let gestureStart: number;

    let isHandle: boolean;
    let isNativeScroll: boolean;

    // The change event needs to be listened manually, because react messes with the onChange listening
    // and doesn't picks up the triggered events
    listen(this._input, CLICK, this._onChange);

    // Setup gesture listener for focus states
    this._inputUnlisten = gestureListener(this._input, {
      onBlur: () => {
        this.setState({ hasFocus: false });
      },
      onFocus: () => {
        if (!this._disabled) {
          this.setState({ hasFocus: true });
        }
      },
    });

    this._trackUnlisten = gestureListener(this._handleCont, {
      onHoverIn: () => {
        if (!this.s.disabled) {
          this.setState({ hasHover: true });
        }
      },
      onHoverOut: () => {
        this.setState({ hasHover: false });
      },
    });

    // Setup gesture listener for handle interactions and active state
    this._unlisten = gestureListener(this._el, {
      onEnd: (ev) => {
        if (!this._disabled && !isNativeScroll) {
          if (isHandle) {
            // Calculate new checked state
            const noMovement = Math.abs(ev.deltaX) < CLICK_MOVE_THRESHOLD && Math.abs(ev.deltaY) < CLICK_MOVE_THRESHOLD;
            const longHold = +new Date() - gestureStart > CLICK_HOLD_THRESHOLD;
            const newChecked = noMovement && !longHold ? !this._checked : this._handleLeft >= 50;
            // If the drag results in a different checked state we trigger a change event
            if (newChecked !== this._checked) {
              setTimeout(() => {
                this._input.click();
                this._change(newChecked);
              });
            }
            isHandle = false;
          }
          this.setState({ dragging: false, isActive: false });
        }
      },
      onMove: (ev) => {
        const domEvent = ev.domEvent;

        let dragging = this.state.dragging;
        if (!this._disabled && !isNativeScroll && isHandle && handleContWidth) {
          if (Math.abs(ev.deltaX) > 5) {
            dragging = true;
            this.setState({ dragging: true });
          }

          if (dragging) {
            // Prevent native scroll
            if (domEvent.cancelable) {
              domEvent.preventDefault();
            }
            // Where the gesture starts
            const offset = ((ev.startX - handleContLeft) / handleContWidth) * 100;
            // Handle can be bigger than the container, so offset needs to be adjusted
            const cappedOffset = Math.max(Math.min(offset, 100), 0);
            const left = cappedOffset + (ev.deltaX / handleContWidth) * 100;
            const capped = Math.max(Math.min(left, 100), 0);
            // 1. use this instead of the state, not to trigger re-render
            // for performance reasons setting the style property directly is better
            // 2. the _handleLeft property will keep track of the handle position while dragging
            this._handleLeft = capped;
            this._setHandleLeft(capped);
          }
        }
        // Remove active state on native scroll
        if (!dragging && !isNativeScroll && Math.abs(ev.deltaY) > 7 && domEvent.type === TOUCH_MOVE) {
          isNativeScroll = true;
          this.setState({ isActive: false });
        }
      },
      onStart: (ev) => {
        if (!this._disabled) {
          isNativeScroll = false;
          handleContWidth = this._handleCont.clientWidth;
          handleContLeft = getOffset(this._handleCont).left;
          // Timestamp for measuring the gesture duration
          gestureStart = +new Date();
          // Check if gesture was started on the handle
          if (ev.domEvent.target === this._handleCont || this._handleCont.contains(ev.domEvent.target as HTMLElement)) {
            isHandle = true;
          }
          this.setState({ isActive: true });
        }
      },
    });

    // Set the initial left position to the handle
    this._setHandleLeft(this._handleLeft);
  }

  protected _render(s: MbscSwitchOptions, state: MbscSwitchState) {
    const disabled = s.disabled === UNDEFINED ? state.disabled! : emptyOrTrue(s.disabled);
    const position = s.position === 'start' ? (s.rtl ? 'right' : 'left') : s.rtl ? 'left' : 'right';
    const colorClass = s.color !== UNDEFINED ? ' mbsc-switch-' + s.color : '';
    const modelValue = s.modelValue !== UNDEFINED ? s.modelValue : s.checked;

    this._disabled = disabled;
    this._checked =
      modelValue !== UNDEFINED
        ? emptyOrTrue(modelValue) // Controlled
        : state.checked === UNDEFINED
        ? emptyOrTrue(s.defaultChecked)
        : state.checked; // Uncontrolled

    this._cssClass =
      'mbsc-switch mbsc-form-control-wrapper mbsc-font ' +
      this._className +
      this._theme +
      this._rtl +
      this._hb +
      ' mbsc-switch-' +
      position +
      (disabled ? ' mbsc-disabled' : '');

    if (!state.dragging) {
      const hl = this._checked ? 100 : 0;
      if (hl !== this._handleLeft && this._handle) {
        this._setHandleLeft(hl);
      }
      this._handleLeft = hl;
    }

    this._handleContClass =
      'mbsc-switch-track mbsc-switch-track-' +
      position +
      this._theme +
      colorClass +
      (this._checked ? ' mbsc-checked' : '') +
      (disabled ? ' mbsc-disabled' : '') +
      (state.hasFocus ? ' mbsc-focus' : '') +
      (state.hasHover ? ' mbsc-hover' : '') +
      (state.isActive ? ' mbsc-active' : '');

    this._handleClass =
      'mbsc-switch-handle' +
      this._theme +
      colorClass +
      (state.dragging ? '' : ' mbsc-switch-handle-animate') +
      (this._checked ? ' mbsc-checked' : '') +
      (disabled ? ' mbsc-disabled' : '') +
      (state.hasFocus ? ' mbsc-focus' : '') +
      (state.hasHover ? ' mbsc-hover' : '') +
      (state.isActive ? ' mbsc-active' : '');
  }

  protected _destroy() {
    unlisten(this._input, CLICK, this._onChange);
    if (this._unlisten) {
      this._unlisten();
    }
    if (this._inputUnlisten) {
      this._inputUnlisten();
    }
    if (this._trackUnlisten) {
      this._trackUnlisten();
    }
  }
}
