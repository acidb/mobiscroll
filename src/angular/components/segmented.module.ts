import { NgModule } from '@angular/core';
import { SegmentedGroupBase } from '../../core/components/segmented/segmented-group';
import { SegmentedBase } from '../../core/components/segmented/segmented-item';
import { MbscStructuralDirectivesModule } from '../shared/structural-directives.module';
import { MbscButtonModule } from './button.module';
import { MbscSegmentedGroup } from './segmented-group';
import { MbscSegmented } from './segmented-item';

export { MbscSegmented, MbscSegmentedGroup };

// Types
export * from '../../core/components/segmented/segmented.types.public';

@NgModule({
  declarations: [SegmentedBase, SegmentedGroupBase, MbscSegmented, MbscSegmentedGroup],
  exports: [MbscSegmented, MbscSegmentedGroup],
  imports: [MbscStructuralDirectivesModule, MbscButtonModule],
})
export class MbscSegmentedModule {}
