import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PopupBase } from '../../core/components/popup/popup';
import { INgModuleType } from '../base';
import { MbscStructuralDirectivesModule } from '../shared/structural-directives.module';
import { MbscButtonModule } from './button.module';
import { MbscInputModule } from './input.module';
import { MbscPopup } from './popup';
import { MbscPrompt } from './prompt';
import { MbscSnackbar } from './snackbar';

export { MbscPopup, MbscPrompt, MbscSnackbar };
export * from '../../core/components/popup/popup.types.public';

@NgModule({
  declarations: [MbscPopup, MbscPrompt, MbscSnackbar, PopupBase],
  entryComponents: [MbscPopup, MbscSnackbar, MbscPrompt],
  exports: [MbscPopup, MbscPrompt, MbscSnackbar],
  imports: [CommonModule, MbscButtonModule, MbscInputModule, MbscStructuralDirectivesModule],
} as INgModuleType)
export class MbscPopupModule {}
