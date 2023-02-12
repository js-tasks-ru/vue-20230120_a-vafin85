<template>
  <div :class="['calendar-view__cell', {
        'calendar-view__cell_inactive': day.isInactive
      }]" tabindex="0">
    <div class="calendar-view__cell-day">{{ day.day }}</div>
    <div class="calendar-view__cell-content">
      <a v-for="meetup in day.meetups"
        :key="meetup.id"
        :href="`/meetups/${meetup.id}`"
        class="calendar-event">{{
          meetup.title
        }}</a>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import type { PropType } from 'vue'
import type { Day } from './MeetupsCalendar.vue';

export default defineComponent({
  name: `CalendarDay`,

  props: {
    day: {
      type: Object as PropType<Day>,
      required: true,
    },
  },
});
</script>

<style scoped>
.calendar-view__cell {
  position: relative;
  height: auto;
  padding: 6px 8px;
  background-color: var(--white);
  color: var(--grey-8);
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  border-bottom: 1px solid var(--grey);
  border-left: 1px solid var(--grey);
  text-align: right;
}

.calendar-view__cell.calendar-view__cell_inactive {
  background-color: var(--grey-light);
}


.calendar-event {
  --max-lines: 2;
  --line-height: 16px;

  display: block;
  text-align: left;
  text-decoration: none;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px;
  font-weight: 600;
  line-height: var(--line-height);
  color: var(--white);
  padding: 4px 6px;
  border-radius: 2px;
  background-color: var(--blue);
  margin-top: 4px;
}

@media all and (max-width: 767px) {
  .calendar-view__cell:nth-child(5n + 1) {
    border-left: none;
  }
}

@media all and (min-width: 767px) {
  .calendar-view__cell {
    height: 144px;
  }

  .calendar-view__cell:nth-child(7n + 1) {
    border-left: none;
  }

  .calendar-event {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-height: calc(var(--max-lines) * var(--line-height) + 6px);
  }
}
</style>
