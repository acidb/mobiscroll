import { MbscRadioState, RadioBase } from '../../core/components/radio/radio';
import { RadioGroupBase } from '../../core/components/radio/radio-group';
import { template as groupTemplate } from '../../core/components/radio/radio-group.common';
import { template } from '../../core/components/radio/radio.common';
import { MbscRadioGroupOptions, MbscRadioOptions } from '../../core/components/radio/radio.types.public';
import { UNDEFINED } from '../../core/util/misc';
import { baseProps, Bool, createComponent } from '../base';

// Types
export * from '../../core/components/radio/radio.types.public';

export const MbscRadioGroup = createComponent<MbscRadioGroupOptions>(RadioGroupBase, {
  methods: {
    _init(inst: RadioBase) {
      inst._change = (value: any) => {
        this.$emit('update:modelValue', value);
      };
    },
    _template(s: MbscRadioGroupOptions, state: MbscRadioState, inst: RadioGroupBase) {
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
      radioGroupOpt: this.groupOpt,
    };
  },
  props: {
    ...baseProps,
    color: String,
    disabled: Bool,
    modelValue: UNDEFINED,
    name: String,
    position: String,
    value: String,

    // Event handlers
    onChange: Function,
  },
});

export const MbscRadio = createComponent<MbscRadioOptions>(RadioBase, {
  inject: {
    groupOpt: {
      default: { opt: {} },
      from: 'radioGroupOpt',
    },
  },
  methods: {
    _init(inst: RadioBase) {
      inst._change = (checked: boolean) => {
        if (checked) {
          this.$emit('update:modelValue', inst._value);
        }
      };
    },
    _template(s: MbscRadioOptions, state: MbscRadioState, inst: RadioBase) {
      return template(s, inst, this.$slots.default && this.$slots.default(), this.groupOpt.opt);
    },
  },
  props: {
    ...baseProps,
    color: String,
    defaultChecked: Bool,
    description: String,
    disabled: Bool,
    label: String,
    modelValue: UNDEFINED,
    name: String,
    position: String,
    value: String,

    // Event handlers
    onChange: Function,
  },
});
