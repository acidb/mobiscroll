import { Directive } from '@angular/core';
import { BaseComponent } from '../../base';
import { getSelectedIndex, setRadio } from '../../shared/radio-helper';
import { closest, forEach, getOffset } from '../../util/dom';
import { gestureListener } from '../../util/gesture';
import { UNDEFINED } from '../../util/misc';
import { MbscSegmentedGroupOptions } from './segmented.types.public';

let guid = 1;

export interface MbscSegmentedGroupState {
  dragging?: boolean;
}

/** @hidden */
@Directive({ selector: '[mbsc-sgr-b]' })
export class SegmentedGroupBase extends BaseComponent<MbscSegmentedGroupOptions, MbscSegmentedGroupState> {
  public static defaults: MbscSegmentedGroupOptions = {
    select: 'single',
  };

  protected static _name = 'SegmentedGroup';

  public _groupClass?: string;
  public _groupOpt!: MbscSegmentedGroupOptions;
  public _name!: string;

  private _unlisten?: null | (() => void);

  private _id = 'mbsc-segmented-group' + guid++;

  public _onChange = (ev: any, val: any) => {
    const s = this.s;
    let value = s.modelValue !== UNDEFINED ? s.modelValue : this.value;
    if (s.select === 'multiple') {
      if (value !== UNDEFINED) {
        value = value || [];
        const index = value.indexOf(val);
        if (index !== -1) {
          value.splice(index, 1);
        } else {
          value.push(val);
        }
        this.value = [...value];
      }
    } else {
      this.value = val;
    }
    this._change(this.value);
    if (s.onChange) {
      s.onChange(ev);
    }
  };

  public _change(value: any) {}

  protected _render(s: MbscSegmentedGroupOptions, state: MbscSegmentedGroupState) {
    this._name = s.name === UNDEFINED ? this._id : s.name;
    this._groupClass =
      'mbsc-segmented mbsc-flex ' +
      this._className +
      this._theme +
      this._rtl +
      (s.color ? ' mbsc-segmented-' + s.color : '') +
      (state.dragging ? ' mbsc-segmented-dragging' : '');

    this._groupOpt = {
      color: s.color,
      disabled: s.disabled,
      name: this._name,
      onChange: this._onChange,
      select: s.select,
      value: s.modelValue !== UNDEFINED ? s.modelValue : s.value,
    };
  }

  protected _updated() {
    // We need to setup the dragging based on the `drag` option (theme specific default), which can change
    if (this.s.drag && this.s.select !== 'multiple') {
      if (!this._unlisten) {
        this._setupDrag();
      }
    } else {
      this._cleanupDrag();
    }
  }

  protected _destroy() {
    this._cleanupDrag();
  }

  private _setupDrag() {
    let disabledArray: boolean[];
    let itemLefts: number[];
    let isDragging: boolean;
    let selectedIndex: number | undefined;
    let oldIndex: number | undefined;
    let name: string;

    this._unlisten = gestureListener(this._el, {
      onEnd: () => {
        if (isDragging && selectedIndex !== oldIndex && !disabledArray[selectedIndex!]) {
          const inputElement: HTMLInputElement = this._el.querySelectorAll('.mbsc-segmented-input')[selectedIndex!] as HTMLInputElement;
          inputElement.click();
        }
        isDragging = false;
        this.setState({ dragging: false });
      },
      onMove: (ev) => {
        if (isDragging) {
          let i = 0;
          let newIndex = 0;
          while (ev.endX > itemLefts[i] && i < itemLefts.length) {
            newIndex = i;
            i++;
          }
          newIndex = this.s.rtl ? itemLefts.length - newIndex - 1 : newIndex;
          if (newIndex !== selectedIndex && !disabledArray[newIndex]) {
            selectedIndex = newIndex;
            setRadio(name, UNDEFINED, selectedIndex);
          }
        }
      },
      onStart: (ev) => {
        // Go into dragging state - handle or not
        const item = closest(ev.domEvent.target as HTMLElement, '.mbsc-segmented-item', this._el);

        if (!item) {
          // Gesture was started outside of an item
          return;
        }

        const input = item.querySelector('.mbsc-segmented-input') as HTMLInputElement;
        const classList = input.classList;

        if (classList.contains('mbsc-selected')) {
          disabledArray = [];
          forEach(this._el.querySelectorAll('.mbsc-segmented-button'), (button: HTMLElement) => {
            disabledArray.push(button.classList.contains('mbsc-disabled'));
          });

          itemLefts = [];
          forEach(this._el.querySelectorAll('.mbsc-segmented-item'), (el: HTMLElement) => {
            if (this.s.rtl) {
              itemLefts.unshift(getOffset(el).left);
            } else {
              itemLefts.push(getOffset(el).left);
            }
          });

          name = input.name;
          selectedIndex = getSelectedIndex(name);
          oldIndex = selectedIndex;

          // We don't always have select multiple specified for the group,
          // so we additionally check if it's a radio input
          if (itemLefts.length && input.type === 'radio') {
            isDragging = true;
            this.setState({ dragging: true });
          }
        }
      },
    });
  }

  private _cleanupDrag() {
    if (this._unlisten) {
      this._unlisten();
      this._unlisten = null;
    }
  }
}
