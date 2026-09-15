import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { StepperBase } from '../../core/components/stepper/stepper';
import { FormControl } from '../form-control';

let guid = 0;

@FormControl
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '_cssClass',
  },
  selector: 'mbsc-stepper',
  styleUrls: ['../../core/base.scss', '../../core/shared/form-controls/form-controls.scss', '../../core/components/stepper/stepper.scss'],
  template: `
    <label class="mbsc-stepper-content" [for]="id || _id">
      <span *mbscIf="s.label" [class]="'mbsc-form-control-label mbsc-stepper-label' + _theme + (_disabled ? ' mbsc-disabled' : '')">{{
        s.label
      }}</span>
      <span *mbscIf="s.description" [class]="'mbsc-description' + _theme + (_disabled ? ' mbsc-disabled' : '')">{{ s.description }}</span>
    </label>
    <div [class]="'mbsc-stepper-control mbsc-flex' + _theme + _rtl">
      <mbsc-button
        class="mbsc-stepper-minus mbsc-stepper-button"
        (click)="_onMinusClick()"
        [disabled]="_disabledMinus"
        [theme]="s.theme"
        [themeVariant]="s.themeVariant"
      >
        <span [class]="'mbsc-stepper-inner' + _theme">&ndash;</span>
      </mbsc-button>
      <input
        #input
        [attr.name]="name"
        [class]="'mbsc-stepper-input' + (_disabled ? ' mbsc-disabled' : '') + _theme"
        [disabled]="_disabled"
        [id]="id || _id"
        [max]="_max"
        [min]="_min"
        [readonly]="readonly"
        [step]="_step"
        type="number"
      />
      <mbsc-button
        class="mbsc-stepper-plus mbsc-stepper-button"
        (click)="_onPlusClick()"
        [disabled]="_disabledPlus"
        [theme]="s.theme"
        [themeVariant]="s.themeVariant"
      >
        <span [class]="'mbsc-stepper-inner' + _theme">+</span>
      </mbsc-button>
    </div>
  `,
})
export class MbscStepper extends StepperBase {
  @ViewChild('input', { static: false } as any)
  public vInput!: ElementRef;

  @Input()
  public color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';

  @Input()
  public defaultValue?: number;

  @Input()
  public description?: string;

  @Input()
  public disabled?: boolean;

  @Input()
  public id?: string;

  @Input()
  public inputPosition?: 'start' | 'end' | 'center';

  @Input()
  public label?: string;

  @Input()
  public min?: number;

  @Input()
  public max?: number;

  @Input()
  public name?: string;

  @Input()
  public readonly?: boolean;

  @Input()
  public step?: number;

  @Output()
  public onChange: EventEmitter<any> = new EventEmitter();

  public _id = 'mbsc-stepper-' + guid++;

  public _change(value: number) {
    this.value = value;
  }

  protected _mounted() {
    this._input = this.vInput.nativeElement;
    super._mounted();
  }
}
