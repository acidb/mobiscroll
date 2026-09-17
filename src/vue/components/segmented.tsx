import { SegmentedGroupBase } from '../../core/components/segmented/segmented-group';
import { template as groupTemplate } from '../../core/components/segmented/segmented-group.common';
import { MbscSegmentedState, SegmentedBase } from '../../core/components/segmented/segmented-item';
import { template } from '../../core/components/segmented/segmented-item.common';
import { MbscSegmentedGroupOptions, MbscSegmentedOptions } from '../../core/components/segmented/segmented.types.public';
import { UNDEFINED } from '../../core/util/misc';
import { baseProps, Bool, createComponent } from '../base';

// Types
export * from '../../core/components/segmented/segmented.types.public';

export const MbscSegmentedGroup = createComponent<MbscSegmentedGroupOptions>(SegmentedGroupBase, {
  methods: {
    _init(inst: SegmentedBase) {
      inst._change = (value: any) => {
        this.$emit('update:modelValue', value);
      };
    },
    _template(s: MbscSegmentedGroupOptions, state: MbscSegmentedState, inst: SegmentedGroupBase) {
      this.groupOpt.opt = inst._groupOpt;
      return groupTemplate(s, inst, this.$slots.default && this.$slots.default());
    },
  },
  data() {
    return {
      groupOpt: { opt: {} },
    };
  },
  provide() {
    return {
      segmentedGroupOpt: this.groupOpt,
    };
  },
  props: {
    ...baseProps,
    color: String,
    disabled: Bool,
    drag: Bool,
    modelValue: UNDEFINED,
    name: String,
    select: String,
    value: UNDEFINED,

    // Event handlers
    onChange: Function,
  },
});

export const MbscSegmented = createComponent<MbscSegmentedOptions>(SegmentedBase, {
  inject: {
    groupOpt: {
      default: { opt: {} },
      from: 'segmentedGroupOpt',
    },
  },
  methods: {
    _init(inst: SegmentedBase) {
      inst._change = (checked: boolean) => {
        if (checked) {
          this.$emit('update:modelValue', inst._value);
        }
      };
    },
    _template(s: MbscSegmentedOptions, state: MbscSegmentedState, inst: SegmentedBase) {
      return template(s, state, inst, this.$slots.default && this.$slots.default(), this.groupOpt.opt);
    },
  },
  props: {
    ...baseProps,
    defaultChecked: Bool,
    endIcon: String,
    endIconSrc: String,
    endIconSvg: String,
    icon: String,
    iconSrc: String,
    iconSvg: String,
    inputClass: String,
    modelValue: UNDEFINED,
    name: String,
    select: String,
    startIcon: String,
    startIconSrc: String,
    startIconSvg: String,
    value: UNDEFINED,

    // Event handlers
    onChange: Function,
  },
});

// Needed for common templates
export { MbscSegmentedGroup as SegmentedGroup };
export { MbscSegmented as Segmented };
