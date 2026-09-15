import { ButtonBase, MbscButtonState } from '../../core/components/button/button';
import { template } from '../../core/components/button/button.common';
import { MbscButtonOptions } from '../../core/components/button/button.types.public';
import { baseProps, Bool, createComponent } from '../base';

export const MbscButton = createComponent<MbscButtonOptions>(ButtonBase, {
  methods: {
    _template(s: MbscButtonOptions, state: MbscButtonState, inst: ButtonBase) {
      return template(s, inst, this.$slots.default && this.$slots.default());
    },
  },
  props: {
    ...baseProps,
    ariaLabel: String,
    color: String,
    disabled: Bool,
    endIcon: String,
    endIconSrc: String,
    endIconSvg: String,
    icon: String,
    iconSrc: String,
    iconSvg: String,
    id: String,
    ripple: Bool,
    role: String,
    startIcon: String,
    startIconSrc: String,
    startIconSvg: String,
    tabIndex: Number,
    tag: String,
    type: String,
    variant: String,

    // Event handlers
    onClick: Function,
  },
});

// Types
export * from '../../core/components/button/button.types.public';

// Needed for the common templates
export { MbscButton as Button };
