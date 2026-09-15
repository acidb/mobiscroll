import { Directive } from '@angular/core';
import { BaseComponent } from '../../base';
import { getSelectedIndex, setRadio, setSelectedIndex, subscribeRadio, unsubscribeRadio } from '../../shared/radio-helper';
import { closest, listen, unlisten } from '../../util/dom';
import { CLICK } from '../../util/events';
import { gestureListener } from '../../util/gesture';
import { emptyOrTrue, isArray, UNDEFINED } from '../../util/misc';
import { MbscSegmentedGroupOptions, MbscSegmentedOptions } from './segmented.types.public';

let guid = 1;

/** @hidden */
export interface MbscSegmentedState {
  disabled?: boolean;
  selected?: boolean;
  hasFocus?: boolean;
}

/** @hidden */
@Directive({ selector: '[mbsc-seg-b]' })
export class SegmentedBase extends BaseComponent<MbscSegmentedOptions, MbscSegmentedState> {
  public static defaults: MbscSegmentedOptions = {
    select: 'single',
  };

  protected static _name = 'Segmented';

  public _box?: HTMLElement | null;
  public _checked!: boolean;
  public _color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  public _cssClass?: string;
  public _disabled?: boolean;
  public _id?: string;
  public _isMultiple?: boolean;
  public _index?: number;
  public _name!: string;
  public _selectedIndex?: number;
  public _value?: any;
  public _animate?: boolean;

  public _onGroupChange?: (ev: any, value: any) => void;

  private _unsubscribe?: number;
  private _unlisten?: () => void;

  public _onChange = (ev: any) => {
    const s = this.s;
    const checked = ev.target.checked;

    if (checked === this._checked) {
      return;
    }

    this._change(checked); // Needed for Angular

    // Notify group
    if (this._onGroupChange) {
      this._onGroupChange(ev, this._value);
    }

    this._toggle(checked);

    if (s.onChange) {
      s.onChange(ev);
    }
  };

  public _onValueChange = (value: any) => {
    const s = this.s;
    const selected = this._isMultiple ? isArray(value) && value.indexOf(this._value) !== -1 : value === this._value;
    // Uncontrolled
    if (s.checked === UNDEFINED && selected !== this.state.selected) {
      this.setState({ selected });
    } else {
      // Force update to handle index change
      this.forceUpdate();
    }
    this._change(selected);
  };

  public _setBox = (box: any) => {
    this._box = box;
  };

  public _change(checked: boolean) {}

  public _groupOptions({ color, disabled, name, onChange, select, value }: MbscSegmentedGroupOptions) {
    // The group options received above are optional. In case of jQuery / JS they won't be present,
    // because we render the group and items separately, without context between them.
    // Group options have higher priority, if present.
    const s = this.s;
    const state = this.state;
    const prevChecked = this._checked;
    const modelValue = s.modelValue !== UNDEFINED ? s.modelValue === s.value : s.checked;
    const checked =
      modelValue !== UNDEFINED
        ? emptyOrTrue(modelValue) // Controlled
        : state.selected === UNDEFINED
        ? emptyOrTrue(s.defaultChecked)
        : state.selected; // Uncontrolled

    this._id = s.id === UNDEFINED ? this._id || 'mbsc-segmented-' + guid++ : s.id;
    this._value = s.value === UNDEFINED ? this._id : s.value;
    this._onGroupChange = onChange;
    this._isMultiple = (select || s.select) === 'multiple';
    this._name = name === UNDEFINED ? s.name! : name;
    this._disabled =
      disabled === UNDEFINED ? (s.disabled === UNDEFINED ? state.disabled! : emptyOrTrue(s.disabled)) : emptyOrTrue(disabled);
    this._color = color === UNDEFINED ? s.color : color;
    this._checked = value === UNDEFINED ? checked : this._isMultiple ? value && value.indexOf(this._value) !== -1 : value === this._value;

    if (!this._isMultiple && !prevChecked && this._checked) {
      setTimeout(() => {
        // It's possible that the checked state is modified with a subsequent render,
        // so we check again, otherwise we end up with an infinite loop
        if (this._checked) {
          setRadio(this._name, this._value, this._index);
        }
      });
    }

    this._selectedIndex = getSelectedIndex(this._name);
    this._cssClass =
      'mbsc-segmented-item ' +
      this._className +
      this._theme +
      this._rtl +
      (this._checked ? ' mbsc-segmented-item-checked' : '') +
      (state.hasFocus ? ' mbsc-focus' : '') +
      (this._index === this._selectedIndex ||
      (this._index === UNDEFINED && this._checked) || // We do not have an index yet, but we know it's checked (on first render)
      (this._isMultiple && this._checked)
        ? ' mbsc-segmented-item-selected'
        : '');
  }

  protected _toggle(checked: boolean) {
    // Update state of uncontrolled component
    if (this.s.checked === UNDEFINED) {
      this.setState({ selected: checked });
    }
    // The setRadio is now moved in the _render, to also handle programmatic changes
    // if (!this._isMultiple) {
    //   setRadio(this._name, this._value, this._index);
    // }
  }

  protected _mounted() {
    // The click event needs to be listened manually, because react messes with the onChange listening
    // and doesn't pick up the programmatically triggered events
    listen(this._el, CLICK, this._onChange);
    this._unlisten = gestureListener(this._el, {
      onBlur: () => {
        this.setState({ hasFocus: false });
      },
      onFocus: () => {
        this.setState({ hasFocus: true });
      },
    });
  }

  protected _updated() {
    // Subscribe to radio changes if not yet subscribed
    if (this._name && !this._unsubscribe) {
      this._unsubscribe = subscribeRadio(this._name, this._onValueChange);
    }
    if (!this._isMultiple) {
      // Find the index and selected index.
      // We're using the document and getting the siblings by name, because the group is not available in jQuery / JS.
      // TODO: this is not very nice, think of a better solution.
      const cont = closest(this._el, '.mbsc-segmented');
      let index = -1;
      let selectedIndex = -1;
      if (cont) {
        const items = cont.querySelectorAll('.mbsc-segmented-input[name="' + this._name + '"]');
        for (let i = 0; i < items.length; i++) {
          if (items[i] === this._el) {
            index = i;
          }
          if ((items[i] as HTMLInputElement).checked) {
            selectedIndex = i;
          }
        }
      }

      if (this._index !== index && selectedIndex !== -1) {
        setSelectedIndex(this._name, selectedIndex);
      }

      if (this._selectedIndex !== -1) {
        this._box!.style.transform = 'translateX(' + (this.s.rtl ? -1 : 1) * (this._selectedIndex! - index) * 100 + '%)';
        this._animate = true;
      }

      if (index !== -1) {
        this._index = index;
      }
    }
  }

  protected _destroy() {
    unlisten(this._el, CLICK, this._onChange);
    if (this._unsubscribe) {
      unsubscribeRadio(this._name, this._unsubscribe);
      this._unsubscribe = UNDEFINED;
    }
    if (this._unlisten) {
      this._unlisten();
    }
  }
}
