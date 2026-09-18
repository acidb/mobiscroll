import { IconBase, MbscIconOptions } from '../../core/components/icon/icon';
import { template } from '../../core/components/icon/icon.common';
import { baseProps, createComponent } from '../base';

export const MbscIcon = createComponent<MbscIconOptions>(IconBase, {
  methods: {
    _template(s: MbscIconOptions, state: void, inst: IconBase) {
      return template(s, inst);
    },
  },
  props: {
    ...baseProps,
    name: String,
    svg: String,
  },
});

// Needed for the common templates
export { MbscIcon as Icon };
