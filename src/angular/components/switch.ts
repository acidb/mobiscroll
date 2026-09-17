import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { SwitchBase } from '../../core/components/switch/switch';

let guid = 0;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '_cssClass',
  },
  selector: 'mbsc-switch',
  styleUrls: ['../../core/base.scss', '../../core/shared/form-controls/form-controls.scss', '../../core/components/switch/switch.scss'],
  template: `
    <label *mbscIf="s.label" [for]="id || _id" [class]="'mbsc-form-control-label' + _theme + (_disabled ? ' mbsc-disabled' : '')"
      >{{ s.label }}
      <span *mbscIf="s.description" [class]="'mbsc-description' + _theme + (_disabled ? ' mbsc-disabled' : '')">{{ s.description }}</span>
    </label>

    <input
      #input
      type="checkbox"
      class="mbsc-form-control-input mbsc-reset"
      [id]="id || _id"
      [checked]="_checked"
      [disabled]="_disabled"
      [readonly]="readonly"
    />

    <span [class]="_handleContClass" #handleCont>
      <span [class]="_handleClass" #handle></span>
    </span>

    <ng-content></ng-content>
  `,
})
export class MbscSwitch extends SwitchBase {
  @ViewChild('input', { static: false } as any)
  public vInput!: ElementRef;

  @ViewChild('handle', { static: false } as any)
  public vHandle!: ElementRef;

  @ViewChild('handleCont', { static: false } as any)
  public vHandleCont!: ElementRef;

  @Input()
  public color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';

  @Input()
  public description?: string;

  @Input()
  public disabled?: boolean;

  @Input()
  public id?: string;

  @Input()
  public label?: string;

  @Input()
  public position?: 'start' | 'end';

  @Input()
  public readonly?: boolean;

  public _id = 'mbsc-switch-' + guid++;
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
    this._handle = this.vHandle.nativeElement;
    this._handleCont = this.vHandleCont.nativeElement;
    super._mounted();
  }
}
