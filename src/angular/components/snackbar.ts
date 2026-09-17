import { ChangeDetectionStrategy, Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { MbscPopupOptions } from '../../core/components/popup/popup.types.public';
import { MbscPopup } from './popup';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mbsc-snackbar',
  styleUrls: ['../../core/base.scss', '../../core/components/notifications/notifications.scss'],
  template: `
    <mbsc-popup #popup [options]="props">
      <div class="mbsc-snackbar-cont mbsc-toast-background mbsc-flex">
        <div class="mbsc-snackbar-message mbsc-flex-1-1">{{ message }}</div>
        <mbsc-button
          *mbscIf="button"
          class="mbsc-snackbar-button"
          [icon]="button.icon"
          [theme]="props.theme"
          [themeVariant]="props.themeVariant"
          variant="flat"
          (click)="onButtonClick()"
        >
          {{ button.text }}
        </mbsc-button>
      </div>
    </mbsc-popup>
  `,
})
export class MbscSnackbar {
  @ViewChild('popup', { static: false } as any)
  public popup!: MbscPopup;

  @Input()
  public button?: {
    action?: () => void;
    icon?: string;
    text?: string;
  };

  @Input()
  public message?: string;

  @Input()
  public props!: MbscPopupOptions;

  public onButtonClick() {
    this.popup.close();
    if (this.button && this.button.action) {
      this.button.action();
    }
  }
}
