import { SegmentedGroup as SegmentedGroupComp } from '../../core/components/segmented/segmented-group.common';
import { Segmented as SegmentedComp } from '../../core/components/segmented/segmented-item.common';
import { MbscSegmentedOptions } from '../../core/components/segmented/segmented.types.public';
import { groupRenderOptions, renderOptions } from '../../preact/components/segmented';
import { createComponentFactory } from '../base';

export class Segmented extends SegmentedComp {
  public static _selector = '[mbsc-segmented]';
  public static _renderOpt = renderOptions;
}

export class SegmentedGroup extends SegmentedGroupComp {
  public static _selector = '[mbsc-segmented-group]';
  public static _renderOpt = groupRenderOptions;
}

export const segmented = /*#__PURE__*/ createComponentFactory<MbscSegmentedOptions, Segmented>(Segmented, renderOptions);

// Types
export * from '../../core/components/segmented/segmented.types.public';
