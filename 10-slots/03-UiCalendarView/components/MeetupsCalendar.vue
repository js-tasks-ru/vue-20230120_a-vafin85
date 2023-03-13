<template>
  <UiCalendarView>
    <template #info="{ dayData }">
      <template v-for="meetup in updatedMeetups" :key="meetup.id">
        <UiCalendarEvent
          v-if="meetup.day === dayData.day && meetup.month === dayData.month"
          tag="a"
          :href="`/meetups/${meetup.id}`"
        >
          {{ meetup.title }}
        </UiCalendarEvent>
      </template>
    </template>
  </UiCalendarView>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import type {PropType} from 'vue';
import UiCalendarView from './UiCalendarView.vue';
import UiCalendarEvent from './UiCalendarEvent.vue';

interface Meetup {
  id: number,
  date: Date,
  title: string,
  __dateForDebug: string,
}

interface FixedMeetup extends Meetup{
  day: number,
  month: number,
}

export default defineComponent({
  name: 'MeetupsCalendar',

  components: {
    UiCalendarEvent,
    UiCalendarView,
  },

  props: {
    meetups: {
      type: Array as PropType<Meetup[]>,
      required: true,
    },
  },

  computed: {
    updatedMeetups(): FixedMeetup[] {
      const result: FixedMeetup[] = [];
      for (const meetup of this.meetups) {
        result.push({
          ...meetup,
          day: new Date(meetup.date).getDate(),
          month: new Date(meetup.date).getMonth() + 1,
        })
      }
      return result;
    },
  }
});
</script>

<style scoped></style>
