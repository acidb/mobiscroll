import { InputBase, MbscInputState } from '../../core/components/input/input';
import { template } from '../../core/components/input/input.common';
import { MbscInputOptions } from '../../core/components/input/input.types.public';
import { UNDEFINED } from '../../core/util/misc';
import { baseProps, Bool, createComponent } from '../base';

function getDefinition(name: string, tag: string) {
  return {
    // Disable fallthrough attributes as they need to be added to the input instead of the root element
    inheritAttrs: false,
    methods: {
      _init(inst: InputBase) {
        (inst as any)._name = name;
        inst._tag = tag;
        inst._change = (value: any) => {
          this.$emit('update:modelValue', value);
        };
      },
      _template(s: MbscInputOptions, state: MbscInputState, inst: InputBase) {
        return template(s, state, inst, this.$slots.default && this.$slots.default(), this.$attrs);
      },
    },
    props: {
      ...baseProps,
      autoComplete: String,
      clearIcon: String,
      defaultValue: String,
      disabled: Bool,
      dropdown: Bool,
      dropdownIcon: String,
      endIcon: String,
      endIconSrc: String,
      endIconSvg: String,
      error: Bool,
      errorMessage: String,
      hideIcon: String,
      hideIconSvg: String,
      inputClass: String,
      inputStyle: String,
      label: String,
      labelStyle: String,
      modelValue: [String, Number],
      notch: Bool,
      passwordToggle: Bool,
      pickerMap: Object,
      pickerValue: UNDEFINED,
      placeholder: String,
      readOnly: Bool,
      ripple: Bool,
      rows: Number,
      showIcon: String,
      showIconSvg: String,
      startIcon: String,
      startIconSrc: String,
      startIconSvg: String,
      tags: Bool,
      type: String,

      // Event handlers
      onChange: Function,
      onInput: Function,
    },
  };
}

export const MbscInput = createComponent<MbscInputOptions>(InputBase, getDefinition('Input', 'input'));
export const MbscDropdown = createComponent<MbscInputOptions>(InputBase, getDefinition('Dropdown', 'select'));
export const MbscTextarea = createComponent<MbscInputOptions>(InputBase, getDefinition('Textarea', 'textarea'));

// Types
export * from '../../core/components/input/input.types.public';

// Needed for the common templates
export { MbscInput as Input };
