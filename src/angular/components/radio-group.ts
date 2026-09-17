import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { RadioGroupBase } from '../../core/components/radio/radio-group';
import { setRadio } from '../../core/shared/radio-helper';
import { FormControl } from '../form-control';
import { MbscRadioService } from '../shared/radio-service';

@FormControl
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '_groupClass',
  },
  providers: [MbscRadioService],
  selector: 'mbsc-radio-group',
  styleUrls: ['../../core/components/radio/radio.scss'],
  template: `<ng-content></ng-content>`,
})
export class MbscRadioGroup extends RadioGroupBase {
  @Input()
  public color?: string;

  @Input()
  public disabled?: string;

  @Input()
  public name?: string;

  @Input()
  public position?: 'start' | 'end';

  public _radioService!: MbscRadioService;

  protected _onValueChange(value: any) {
    this._radioService.value = value;
    setRadio(this._radioService.name, value);
  }

  protected _ctor() {
    this._radioService = this._injector.get(MbscRadioService);
  }

  protected _render(s: any) {
    super._render(s);
    const rs = this._radioService;
    rs.color = s.color;
    rs.disabled = s.disabled;
    rs.name = this._name;
    rs.value = this.value;
    rs.onChange = this._onChange;
    rs.position = s.position;
  }
}
