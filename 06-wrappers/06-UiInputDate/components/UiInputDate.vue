<template>
  <UiInput
    v-bind="$attrs"
    :model-value="formatDate(modelValue)"
    :type="type"
    :step="step"
    @input="handleInput($event)"
  >
    <template v-for="slotName in Object.keys($slots)" #[slotName]>
      <slot :name="slotName" />
    </template>
  </UiInput>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import type { PropType } from 'vue';
import UiInput from './UiInput.vue';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat)
dayjs.extend(utc)

type InputType = 'date' | 'time' | 'datetime-local'

export default defineComponent({
  name: 'UiInputDate',

  components: { UiInput },

  inheritAttrs: false,

  dayjs,

  props: {
    type: {
      type: String as PropType<InputType>,
      default: 'date',
    },
    modelValue: [Number, null, undefined] as PropType<number | null | undefined>,
    step: [String, Number] as PropType<string | number>
  },

  emits: ['update:modelValue'],

  methods: {
    formatDate(date: number | null | undefined): string | null {
      if (!date) {
        return null;
      }

      let formattedDate = null;

      if (this.type === 'date') {
        formattedDate = dayjs(date).utc().format('YYYY-MM-DD');
      }

      if (this.type === 'time') {
        formattedDate = dayjs(date).utc().format('HH:mm');
      }

      if (this.type === 'datetime-local') {
        formattedDate = dayjs(date).utc().format('YYYY-MM-DDTHH:mm')
      }

      return formattedDate;
    },

    handleInput($event: Event) {
      const target = $event.target as HTMLInputElement
      this.$emit('update:modelValue', target.value !== '' ? target.valueAsNumber : undefined);
    },
  }
});
</script>
