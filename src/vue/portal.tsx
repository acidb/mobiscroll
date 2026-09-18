/** @jsxRuntime classic */
/** @jsx createElement */
import { defineComponent, Teleport } from 'vue';
import { createElement } from './renderer';

export const Portal = defineComponent({
  render() {
    return <Teleport to={this.context || 'body'}>{this.$slots.default && this.$slots.default()}</Teleport>;
  },
  props: {
    context: [String, Object],
  },
});
