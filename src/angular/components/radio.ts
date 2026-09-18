import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { RadioBase } from '../../core/components/radio/radio';
import { MbscRadioService } from '../shared/radio-service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '_cssClass',
  },
  selector: 'mbsc-radio',
  styleUrls: ['../../core/shared/form-controls/form-controls.scss', '../../core/components/radio/radio.scss'],
  template: `
    <input
      #input
      type="radio"
      class="mbsc-form-control-input mbsc-reset"
      (blur)="_onFormTouch($event)"
      (change)="_onChange($event)"
      [checked]="_checked"
      [disabled]="_disabled"
      [name]="_name"
      [value]="_value"
    />
    <span [class]="_boxClass">
      <span class="mbsc-radio-ring"></span>
    </span>
    <span *mbscIf="s.label" [class]="'mbsc-form-control-label' + _theme + (_disabled ? ' mbsc-disabled' : '')">{{ s.label }}</span>
    <span *mbscIf="s.description" [class]="'mbsc-description' + _theme + (_disabled ? ' mbsc-disabled' : '')">{{ s.description }}</span>
    <ng-content></ng-content>
  `,
})
export class MbscRadio extends RadioBase {
  @ViewChild('input', { static: false } as any)
  public vInput!: ElementRef;

  @Input()
  public color?: string;

  @Input()
  public description?: string;

  @Input()
  public disabled?: boolean;

  @Input()
  public id?: string;

  @Input()
  public label?: string;

  @Input()
  public name?: string;

  @Input()
  public position?: 'start' | 'end';

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
      if (val) {
        if (rs) {
          rs.value = this.value;
        }
        this._onFormChange(this.value);
      }
      // TODO: workaround to reset original checked input, any better solution?
      this.props.checked = val;
      this._check = val;
      this.setState({ checked: val });
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
    this.checked = this.value === val;
  }

  public _change(checked: boolean) {
    this.checked = checked;
  }

  protected _ctor() {
    this._radioService = this._injector.get(MbscRadioService, null);
  }

  protected _mounted() {
    this._input = this.vInput.nativeElement;
    super._mounted();
  }

  protected _render(s: any, state: any) {
    this._groupOptions(this._radioService || {});
    super._render(s, state);
  }
}
