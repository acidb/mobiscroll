import { MbscStepperState, StepperBase } from '../../core/components/stepper/stepper';
import { template } from '../../core/components/stepper/stepper.common';
import { MbscStepperOptions } from '../../core/components/stepper/stepper.types.public';
import { baseProps, Bool, createComponent } from '../base';

// Types
export * from '../../core/components/stepper/stepper.types.public';

export const MbscStepper = createComponent<MbscStepperOptions>(StepperBase, {
  methods: {
    _init(inst: StepperBase) {
      inst._change = (checked: number) => {
        this.$emit('update:modelValue', checked);
      };
    },
    _template(s: MbscStepperOptions, state: MbscStepperState, inst: StepperBase) {
      return template(s, inst);
    },
  },
  props: {
    ...baseProps,
    color: String,
    defaultValue: Number,
    description: String,
    disabled: Bool,
    inputClass: String,
    inputPosition: String,
    label: String,
    max: Number,
    min: Number,
    modelValue: Number,
    step: Number,

    // Event handlers
    onChange: Function,
  },
});
