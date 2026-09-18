import { NgModule } from '@angular/core';
import { PageBase } from '../../core/components/page/page';
import { MbscStructuralDirectivesModule } from '../shared/structural-directives.module';
import { MbscPage } from './page';

export { MbscPage };
export * from '../../core/components/page/page.types.public';

@NgModule({
  declarations: [MbscPage, PageBase],
  exports: [MbscPage],
  imports: [MbscStructuralDirectivesModule],
})
export class MbscPageModule {}
