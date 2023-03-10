<script lang="ts">
import {isVNode, defineComponent} from 'vue';
import type {PropType, VNode} from 'vue';

export default defineComponent({
  name: 'VNode',

  props: {
    vnode: {
      type: [Object, Array] as PropType<VNode | VNode[]>,
      require: true,
      validator: (value: VNode | VNode[]) => (Array.isArray(value) ? value.every((item) => isVNode(item)) : isVNode(value)),
    },
  },

  render(): VNode | VNode[] | undefined {
    return Array.isArray(this.vnode) ? this.vnode.map((node) => node) : this.vnode;
  }
});
</script>
