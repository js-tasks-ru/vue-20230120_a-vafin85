<template>
  <component :is="tag" class="link"><slot /></component >
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

type TagType = `a` | `router-link` | `RouterLink`;

export default defineComponent({
  name: 'UiLink',

  props: {
    tag: {
      type: String as PropType<TagType>,
      default: `router-link`,
    }
  }
});
</script>

<style scoped>
.link {
  color: var(--blue);
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
