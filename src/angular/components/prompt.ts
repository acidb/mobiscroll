import { ChangeDetectionStrategy, Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { MbscPopupOptions } from '../../core/components/popup/popup.types.public';
import { MbscPopup } from './popup';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mbsc-prompt',
  styleUrls: ['../../core/base.scss', '../../core/components/notifications/notifications.scss'],
  template: `
    <mbsc-popup #popup [options]="props">
      <div class="mbsc-alert-content">
        <h2 *mbscIf="title" class="mbsc-alert-title">{{ title }}</h2>
        <p class="mbsc-alert-message">{{ message || '' }}</p>
        <div class="mbsc-form-group-inset">
          <mbsc-input
            class="mbsc-prompt-input"
            [label]="label"
            [placeholder]="placeholder || ''"
            [theme]="props.theme"
            [themeVariant]="props.themeVariant"
            [type]="inputType"
            [(value)]="value"
          ></mbsc-input>
        </div>
      </div>
    </mbsc-popup>
  `,
})
export class MbscPrompt {
  @ViewChild('popup', { static: false } as any)
  public popup!: MbscPopup;

  @Input()
  public inputType?: string;

  @Input()
  public label?: string;

  @Input()
  public message?: string;

  @Input()
  public placeholder?: string;

  @Input()
  public title?: string;

  @Input()
  public props!: MbscPopupOptions;

  @Input()
  public value = '';
}
