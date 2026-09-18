import { NgModule } from '@angular/core';
import { RadioBase } from '../../core/components/radio/radio';
import { RadioGroupBase } from '../../core/components/radio/radio-group';
import { MbscStructuralDirectivesModule } from '../shared/structural-directives.module';
import { MbscRadio } from './radio';
import { MbscRadioGroup } from './radio-group';

export { MbscRadio, MbscRadioGroup };

// Types
export * from '../../core/components/radio/radio.types.public';

@NgModule({
  declarations: [RadioBase, RadioGroupBase, MbscRadio, MbscRadioGroup],
  exports: [MbscRadio, MbscRadioGroup],
  imports: [MbscStructuralDirectivesModule],
})
export class MbscRadioModule {}
