import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MbscOptions } from '../core/commons';
import { MbscOptionsService } from './options.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: MbscOptionsService, useClass: MbscOptionsService }],
  selector: 'mbsc-options-provider',
  template: `<ng-content></ng-content>`,
})
export class MbscOptionsProviderComponent implements OnChanges {
  @Input()
  public options?: MbscOptions;

  constructor(private _opt: MbscOptionsService) {}

  public ngOnChanges(changes: SimpleChanges) {
    const key = 'options';
    const change = changes[key];
    if (change) {
      this._opt.setOptions(change.currentValue);
    }
  }
}
