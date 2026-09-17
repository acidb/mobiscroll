import { ChangeDetectionStrategy, Component, Directive, Input, ViewEncapsulation } from '@angular/core';
import { IconBase } from '../../core/components/icon/icon';

@Directive({ selector: '[mbsc-icon]' })
export class MbscCustomIcon {}

@Directive({ selector: '[mbsc-start-icon]' })
export class MbscCustomStartIcon {}

@Directive({ selector: '[mbsc-end-icon]' })
export class MbscCustomEndIcon {}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '_cssClass',
  },
  selector: 'mbsc-icon',
  styleUrls: ['../../core/components/icon/icon.scss'],
  template: `<ng-content></ng-content>`,
})
export class MbscIcon extends IconBase {
  @Input()
  public name?: string;

  @Input()
  public svg?: string;

  protected _updated() {
    // TODO: find a better solution for this... in template
    // [innerHTML] on host works, bu it will erase custom icon content as well
    // [outerHTML] inside a span element works on first render, after it starts throwing errors.
    // Adding an extra element also works, but it complicates the styling
    if (this.s.svg !== this._prevS.svg) {
      this._el.innerHTML = this.s.svg!;
    }
    super._updated();
  }
}
