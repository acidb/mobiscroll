import { NgModule } from '@angular/core';
import { IconBase } from '../../core/components/icon/icon';
import { MbscStructuralDirectivesModule } from '../shared/structural-directives.module';
import { MbscCustomEndIcon, MbscCustomIcon, MbscCustomStartIcon, MbscIcon } from './icon';

export { MbscCustomEndIcon, MbscCustomIcon, MbscCustomStartIcon, MbscIcon };

@NgModule({
  declarations: [IconBase, MbscIcon, MbscCustomEndIcon, MbscCustomIcon, MbscCustomStartIcon],
  exports: [MbscIcon, MbscCustomEndIcon, MbscCustomIcon, MbscCustomStartIcon],
  imports: [MbscStructuralDirectivesModule],
})
export class MbscIconModule {}
