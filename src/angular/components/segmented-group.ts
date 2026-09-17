import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { MbscSegmentedGroupState, SegmentedGroupBase } from '../../core/components/segmented/segmented-group';
import { MbscSegmentedGroupOptions } from '../../core/components/segmented/segmented.types.public';
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
  selector: 'mbsc-segmented-group',
  styleUrls: ['../../core/components/segmented/segmented.scss'],
  template: `<ng-content></ng-content>`,
})
export class MbscSegmentedGroup extends SegmentedGroupBase {
  @Input()
  public color?: string;

  @Input()
  public disabled?: string;

  @Input()
  public name?: string;

  @Input()
  public select?: 'single' | 'multiple';

  public _radioService!: MbscRadioService;

  protected _onValueChange(value: any) {
    this._radioService.value = value;
    setRadio(this._radioService.name, value);
  }

  protected _ctor() {
    this._radioService = this._injector.get(MbscRadioService);
  }

  protected _render(s: MbscSegmentedGroupOptions, state: MbscSegmentedGroupState) {
    super._render(s, state);
    const rs = this._radioService;
    rs.color = s.color;
    rs.disabled = s.disabled;
    rs.name = this._name;
    rs.select = s.select;
    rs.value = this.value;
    rs.onChange = this._onChange;
  }
}
