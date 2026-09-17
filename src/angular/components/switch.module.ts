import { NgModule } from '@angular/core';
import { SwitchBase } from '../../core/components/switch/switch';
import { MbscStructuralDirectivesModule } from '../shared/structural-directives.module';
import { MbscSwitch } from './switch';

export { MbscSwitch };

// Types
export * from '../../core/components/switch/switch.types.public';

@NgModule({
  declarations: [SwitchBase, MbscSwitch],
  exports: [MbscSwitch],
  imports: [MbscStructuralDirectivesModule],
})
export class MbscSwitchModule {}
