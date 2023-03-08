<script lang="ts">
import {compile, defineComponent, h} from 'vue';
import type { PropType, DefineComponent, CreateComponentPublicInstance, VNode } from 'vue';

export default defineComponent({
  name: 'TemplateRenderer',

  props: {
    template: {
      type: String as PropType<string>,
      required: true,
    },

    bindings: {
      type: Object as PropType<Record<string, string | unknown>>,
      default: () => ({}),
    },

    components: {
      type: [Object, Array] as PropType<Record<string, CreateComponentPublicInstance>>,
      default: () => [],
    },
  },

  computed: {
    renderFunction() {
      return compile(this.template);
    },

    componentFromTemplate(): DefineComponent {
      return defineComponent({
        name: 'TemplateComponent',
        components: this.components,
        props: ['bindings'],
        render: this.renderFunction,
      });
    },
  },

  render(): VNode {
    return h(this.componentFromTemplate, { bindings: this.bindings });
  },
});
</script>
