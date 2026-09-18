import { SegmentedGroup as SegmentedGroupComp } from '../../core/components/segmented/segmented-group.common';
import { Segmented as SegmentedComp } from '../../core/components/segmented/segmented-item.common';
import { groupRenderOptions, renderOptions } from '../../preact/components/segmented';

export class Segmented extends SegmentedComp {
  public static _fname = 'segmented';
  public static _selector = '[mbsc-segmented]';
  public static _renderOpt = renderOptions;
}

export class SegmentedGroup extends SegmentedGroupComp {
  public static _fname = 'segmentedGroup';
  public static _selector = '[mbsc-segmented-group]';
  public static _renderOpt = groupRenderOptions;
}

// Types
export * from '../../core/components/segmented/segmented.types.public';
