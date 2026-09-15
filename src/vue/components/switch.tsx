import { MbscSwitchState, SwitchBase } from '../../core/components/switch/switch';
import { template } from '../../core/components/switch/switch.common';
import { MbscSwitchOptions } from '../../core/components/switch/switch.types.public';
import { baseProps, Bool, createComponent } from '../base';

// Types
export * from '../../core/components/switch/switch.types.public';

export const MbscSwitch = createComponent<MbscSwitchOptions>(SwitchBase, {
  methods: {
    _init(inst: SwitchBase) {
      inst._change = (checked: boolean) => {
        this.$emit('update:modelValue', checked);
      };
    },
    _template(s: MbscSwitchOptions, state: MbscSwitchState, inst: SwitchBase) {
      return template(s, inst, this.$slots.default && this.$slots.default());
    },
  },
  props: {
    ...baseProps,
    color: String,
    defaultChecked: Bool,
    description: String,
    disabled: Bool,
    inputStyle: String,
    label: String,
    modelValue: Bool,
    position: String,

    // Event handlers
    onChange: Function,
  },
});
