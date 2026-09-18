import { NgModule } from '@angular/core';
import { MbscStructuralDirectivesModule } from '../shared/structural-directives.module';
import { MbscButtonModule } from './button.module';
import { MbscCheckboxModule } from './checkbox.module';
import { MbscInputModule } from './input.module';
import { MbscNotificationsModule } from './notifications';
import { MbscPageModule } from './page.module';
import { MbscRadioModule } from './radio.module';
import { MbscSegmentedModule } from './segmented.module';
import { MbscStepperModule } from './stepper.module';
import { MbscSwitchModule } from './switch.module';

export * from './button.module';
export * from './checkbox.module';
export * from './icon.module';
export * from './input.module';
export * from './page.module';
export * from './radio.module';
export * from './segmented.module';
export * from './stepper.module';
export * from './switch.module';
export * from './notifications';

@NgModule({
  exports: [
    MbscButtonModule,
    MbscCheckboxModule,
    MbscInputModule,
    MbscPageModule,
    MbscRadioModule,
    MbscSegmentedModule,
    MbscStepperModule,
    MbscSwitchModule,
    MbscNotificationsModule,
  ],
  imports: [
    MbscStructuralDirectivesModule,
    MbscButtonModule,
    MbscCheckboxModule,
    MbscInputModule,
    MbscPageModule,
    MbscRadioModule,
    MbscSegmentedModule,
    MbscStepperModule,
    MbscSwitchModule,
  ],
})
export class MbscFormsModule {}
