import { CheckboxBase, MbscCheckboxState } from '../../core/components/checkbox/checkbox';
import { template } from '../../core/components/checkbox/checkbox.common';
import { MbscCheckboxOptions } from '../../core/components/checkbox/checkbox.types.public';
import { baseProps, Bool, createComponent } from '../base';

// Types
export * from '../../core/components/checkbox/checkbox.types.public';

export const MbscCheckbox = createComponent<MbscCheckboxOptions>(CheckboxBase, {
  methods: {
    _init(inst: CheckboxBase) {
      inst._change = (checked: boolean) => {
        this.$emit('update:modelValue', checked);
      };
    },
    _template(s: MbscCheckboxOptions, state: MbscCheckboxState, inst: CheckboxBase) {
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
