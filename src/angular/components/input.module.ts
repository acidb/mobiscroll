import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputBase } from '../../core/components/input/input';
import { MbscStructuralDirectivesModule } from '../shared/structural-directives.module';
import { MbscDropdown } from './dropdown';
import { MbscIconModule } from './icon.module';
import { MbscInput } from './input';
import { MbscTextarea } from './textarea';

export { MbscDropdown, MbscInput, MbscTextarea };

// Types
export * from '../../core/components/input/input.types.public';

@NgModule({
  declarations: [InputBase, MbscDropdown, MbscInput, MbscTextarea],
  exports: [MbscDropdown, MbscInput, MbscTextarea],
  imports: [MbscStructuralDirectivesModule, FormsModule, MbscIconModule],
})
export class MbscInputModule {}
