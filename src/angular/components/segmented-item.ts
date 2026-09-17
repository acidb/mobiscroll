import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { SegmentedBase } from '../../core/components/segmented/segmented-item';
import { MbscRadioService } from '../shared/radio-service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '_cssClass',
  },
  selector: 'mbsc-segmented',
  template: `
    <label class="mbsc-segmented-label">
      <div
        #box
        [class]="
          'mbsc-segmented-selectbox' + _theme + (_animate ? ' mbsc-segmented-selectbox-animate' : '') + (_checked ? ' mbsc-selected' : '')
        "
      >
        <div
          [class]="
            'mbsc-segmented-selectbox-inner' +
            (_index === _selectedIndex || _checked ? ' mbsc-segmented-selectbox-inner-visible' : '') +
            (_checked ? ' mbsc-selected' : '') +
            _theme
          "
        ></div>
      </div>
      <input
        #input
        [attr.aria-labelledby]="_id"
        [class]="'mbsc-segmented-input mbsc-reset' + _theme + (_checked ? ' mbsc-selected' : '')"
        [checked]="_checked"
        [disabled]="_disabled"
        [name]="_isMultiple ? (s.name === undefined ? '' : s.name) : _name"
        [type]="_isMultiple ? 'checkbox' : 'radio'"
        [value]="_value"
      />
      <mbsc-button
        aria-hidden="true"
        [ariaLabel]="s.ariaLabel"
        [class]="'mbsc-segmented-button' + (_checked ? ' mbsc-selected' : '') + (state.hasFocus ? ' mbsc-focus' : '')"
        [color]="_color"
        [disabled]="_disabled"
        [endIcon]="s.endIcon"
        [endIconSrc]="s.endIconSrc"
        [endIconSvg]="s.endIconSvg"
        [hidden]="true"
        [icon]="s.icon"
        [iconSrc]="s.iconSrc"
        [iconSvg]="s.iconSvg"
        [id]="_id"
        [ripple]="s.ripple"
        [rtl]="s.rtl"
        role="none"
        [startIcon]="s.startIcon"
        [startIconSrc]="s.startIconSrc"
        [startIconSvg]="s.startIconSvg"
        [theme]="s.theme"
        [themeVariant]="s.themeVariant"
      >
        <ng-content></ng-content>
      </mbsc-button>
    </label>
  `,
})
export class MbscSegmented extends SegmentedBase {
  @ViewChild('input', { static: false } as any)
  public vInput!: ElementRef;

  @ViewChild('box', { static: false } as any)
  public vBox!: ElementRef;

  @Input()
  public ariaLabel?: string;

  @Input()
  public color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';

  @Input()
  public disabled?: boolean;

  @Input()
  public endIcon?: string;

  @Input()
  public endIconSrc?: string;

  @Input()
  public endIconSvg?: string;

  @Input()
  public icon?: string;

  @Input()
  public iconSvg?: string;

  @Input()
  public iconSrc?: string;

  @Input()
  public id?: string;

  @Input()
  public name?: string;

  @Input()
  public ripple?: boolean;

  @Input()
  public startIcon?: string;

  @Input()
  public startIconSrc?: string;

  @Input()
  public startIconSvg?: string;

  @Input()
  public select?: 'single' | 'multiple';

  @Output()
  public checkedChange = new EventEmitter<any>();

  public _radioService!: MbscRadioService | null;

  private _check?: boolean;

  public get checked() {
    return this._check;
  }

  @Input()
  public set checked(val: any) {
    const rs = this._radioService;
    if (this._check !== val) {
      if (this._isMultiple) {
        this._onFormChange(val);
      } else if (val) {
        if (rs) {
          rs.value = this.value;
        }
        this._onFormChange(this.value);
      }
      // TODO: workaround to reset original checked input, any better solution?
      this.props.checked = val;
      this._check = val;
      this.setState({ selected: val });
    }
  }

  public registerOnChange(fn: any) {
    this._onFormChange = fn;
  }

  public registerOnTouched(fn: any) {
    this._onFormTouch = fn;
  }

  public setDisabledState(disabled: boolean) {
    this.setState({ disabled });
  }

  public writeValue(val: any) {
    this.checked = this._isMultiple ? val : this.value === val;
  }

  public _change(checked: boolean) {
    this.checked = checked;
  }

  protected _ctor() {
    let rs: MbscRadioService | null;
    this._radioService = rs = this._injector.get(MbscRadioService, null);
    const select = (rs && rs.select) || this.select;
    // _isMultiple is needed early, because writeValue will run before init and render
    this._isMultiple = select === 'multiple';
  }

  protected _render(s: any, state: any) {
    this._groupOptions(this._radioService || {});
    super._render(s, state);
  }

  protected _mounted() {
    this._el = this.vInput.nativeElement;
    this._box = this.vBox.nativeElement;
    super._mounted();
  }
}
