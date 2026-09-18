import { NgModule } from '@angular/core';
import { ButtonBase } from '../../core/components/button/button';
import { MbscStructuralDirectivesModule } from '../shared/structural-directives.module';
import { MbscButton } from './button';
import { MbscIconModule } from './icon.module';

export { MbscButton };

// Types
export * from '../../core/components/button/button.types.public';

@NgModule({
  declarations: [ButtonBase, MbscButton],
  exports: [MbscButton],
  imports: [MbscStructuralDirectivesModule, MbscIconModule],
})
export class MbscButtonModule {}
