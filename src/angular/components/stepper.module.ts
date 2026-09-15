import { NgModule } from '@angular/core';
import { StepperBase } from '../../core/components/stepper/stepper';
import { MbscStructuralDirectivesModule } from '../shared/structural-directives.module';
import { MbscButtonModule } from './button.module';
import { MbscStepper } from './stepper';

export { MbscStepper };

// Types
export * from '../../core/components/stepper/stepper.types.public';

@NgModule({
  declarations: [StepperBase, MbscStepper],
  exports: [MbscStepper],
  imports: [MbscStructuralDirectivesModule, MbscButtonModule],
})
export class MbscStepperModule {}
