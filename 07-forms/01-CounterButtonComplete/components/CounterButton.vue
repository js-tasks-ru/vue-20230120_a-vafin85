<template>
  <button @click="handleClick">
    {{ count || localCount }}
  </button>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import type {PropType} from 'vue';

export default defineComponent({
  name: 'CounterButton',

  props: {
    count: {
      type: Number as PropType<number>,
      default: 0,
    }
  },

  emits: ['update:count'],

  data(): {localCount: number} {
    return {
      localCount: this.count,
    };
  },

  methods: {
    handleClick() {
      this.localCount++;
      this.$emit('update:count', this.localCount);
    }
  }
});
</script>

<style scoped>

</style>
