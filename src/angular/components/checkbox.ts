import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { CheckboxBase } from '../../core/components/checkbox/checkbox';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '_cssClass',
  },
  selector: 'mbsc-checkbox',
  styleUrls: ['../../core/base.scss', '../../core/shared/form-controls/form-controls.scss', '../../core/components/checkbox/checkbox.scss'],
  template: `
    <input
      #input
      type="checkbox"
      class="mbsc-form-control-input mbsc-reset"
      (blur)="_onFormTouch($event)"
      (change)="_onChange($event)"
      [checked]="_checked"
      [disabled]="_disabled"
      [name]="name || ''"
    />
    <span [class]="_boxClass">
      <span [class]="'mbsc-checkbox-ring' + _theme"></span>
    </span>
    <span *mbscIf="s.label" [class]="'mbsc-form-control-label' + _theme + (_disabled ? ' mbsc-disabled' : '')">{{ s.label }}</span>
    <span *mbscIf="s.description" [class]="'mbsc-description' + _theme + (_disabled ? ' mbsc-disabled' : '')">{{ s.description }}</span>
    <ng-content></ng-content>
  `,
})
export class MbscCheckbox extends CheckboxBase {
  @ViewChild('input', { static: false } as any)
  public vInput!: ElementRef;

  @Input()
  public color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';

  @Input()
  public defaultChecked?: boolean;

  @Input()
  public description?: string;

  @Input()
  public disabled?: boolean;

  @Input()
  public inputStyle?: 'underline' | 'box' | 'outline';

  @Input()
  public label?: string;

  @Input()
  public name?: string;

  @Input()
  public position?: 'start' | 'end';

  private _check?: boolean;

  public get checked() {
    return this._check;
  }

  @Input()
  public set checked(val: any) {
    if (this._check !== val) {
      // TODO: workaround to reset original checked input, any better solution?
      this.props.checked = val;
      this._onFormChange(val);
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
    this.checked = val;
  }

  public _change(checked: boolean) {
    this.checked = checked;
  }

  protected _mounted() {
    this._input = this.vInput.nativeElement;
    super._mounted();
  }
}
