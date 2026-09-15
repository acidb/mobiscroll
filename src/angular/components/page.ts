import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { PageBase } from '../../core/components/page/page';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '_cssClass',
  },
  selector: 'mbsc-page',
  styleUrls: ['../../core/components/page/page.scss'],
  template: `<ng-content></ng-content>`,
})
export class MbscPage extends PageBase {}
