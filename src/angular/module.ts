import { NgModule } from '@angular/core';
import { MbscBaseModule } from './base.module';
import { MbscFormsModule } from './components/forms.module';
import { MbscIconModule } from './components/icon.module';
import { MbscPopupModule } from './components/popup.module';
import { MbscOptionsModule } from './options.module';

@NgModule({
  exports: [MbscFormsModule, MbscIconModule, MbscOptionsModule, MbscPopupModule],
  imports: [MbscBaseModule, MbscFormsModule, MbscIconModule, MbscOptionsModule, MbscPopupModule],
})
export class MbscModule {}
