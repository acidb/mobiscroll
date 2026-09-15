import { NgModule } from '@angular/core';
import { CheckboxBase } from '../../core/components/checkbox/checkbox';
import { MbscStructuralDirectivesModule } from '../shared/structural-directives.module';
import { MbscCheckbox } from './checkbox';

export { MbscCheckbox };

// Types
export * from '../../core/components/checkbox/checkbox.types.public';

@NgModule({
  declarations: [CheckboxBase, MbscCheckbox],
  exports: [MbscCheckbox],
  imports: [MbscStructuralDirectivesModule],
})
export class MbscCheckboxModule {}
