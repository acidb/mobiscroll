import { NgModule } from '@angular/core';
import { MbscForDirective } from './mbsc-for.directive';
import { MbscIfDirective } from './mbsc-if.directive';

@NgModule({
  declarations: [MbscIfDirective, MbscForDirective],
  exports: [MbscIfDirective, MbscForDirective],
})
export class MbscStructuralDirectivesModule {}

