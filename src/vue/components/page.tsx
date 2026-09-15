import { PageBase } from '../../core/components/page/page';
import { template } from '../../core/components/page/page.common';
import { MbscPageOptions } from '../../core/components/page/page.types.public';
import { baseProps, createComponent } from '../base';

export const MbscPage = createComponent<MbscPageOptions>(PageBase, {
  methods: {
    _template(s: MbscPageOptions, state: void, inst: PageBase) {
      return template(s, inst, this.$slots.default && this.$slots.default());
    },
  },
  props: {
    ...baseProps,
    tag: String,
  },
});
