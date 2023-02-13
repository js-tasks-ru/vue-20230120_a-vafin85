<template>
  <div class="calendar-view">
    <div class="calendar-view__controls">
      <div class="calendar-view__controls-inner">
        <button class="calendar-view__control-left" type="button" aria-label="Previous month"
          @click="setCurrentMonth($options.MonthType.PREV)"></button>
        <div class="calendar-view__date">{{ currentDateTitle }}</div>
        <button class="calendar-view__control-right" type="button" aria-label="Next month"
          @click="setCurrentMonth($options.MonthType.NEXT)"></button>
      </div>
    </div>

    <div class="calendar-view__grid">
      <calendar-day v-for="day in days" :key="day.id" :day="day" />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import type { PropType } from 'vue'
import dayjs from "dayjs";
import "dayjs/locale/ru";
import weekday from 'dayjs/plugin/weekday';
import {nanoid} from "nanoid";
import CalendarDay from "./CalendarDay.vue";

dayjs.extend(weekday);
dayjs.locale(`ru`);

const DAYS_IN_WEEK = 7;

const DATE_FORMAT = 'YYYY-MM-DD';

enum MonthType {
  NEXT,
  PREV
}

enum DateType {
  CURRENT_MONTH,
  NEXT_MONTH,
  PREV_MONTH
}

interface Meetup {
  id: number,
  date: Date,
  title: string,
  __dateForDebug: string,
}

interface Data {
  currentDate: Date,
}

export interface Day {
  id: string,
  day: number,
  meetups?: Meetup[],
  isInactive?: boolean
}

export default defineComponent({
  name: 'MeetupsCalendar',

  components: {CalendarDay},

  MonthType,

  props: {
    meetups: {
      type: Array as PropType<Meetup[]>,
      required: true,
    },
  },

  data(): Data {
    return {
      currentDate: new Date(),
    }
  },

  computed: {
    currentDateTitle(): string {
      return this.currentDate.toLocaleDateString(navigator.language, {
        month: 'long',
        year: 'numeric',
      });
    },

    days(): Day[] {
      let days: Day[] = [...this.setDaysBefore()];

      this.setDays(days);

      return [...days, ...this.setDaysAfter()];
    },

    filteredMeetups(): Map<string, Meetup[]> {
      const filteredMeetups = new Map();

      this.meetups.forEach((meetup) => {
        const date = dayjs(meetup.date).format(DATE_FORMAT);

        if (filteredMeetups.has(date)) {
          filteredMeetups.get(date).push(meetup);
        } else {
          filteredMeetups.set(date, [meetup]);
        }
      });

      return filteredMeetups;
    }
  },

  methods: {
    getDate(type: DateType, day: number): Date {
      switch(type) {
        case DateType.NEXT_MONTH:
          return dayjs(this.currentDate).month(dayjs(this.currentDate).month() - 1).date(day).toDate();
        case DateType.PREV_MONTH:
          return dayjs(this.currentDate).month(dayjs(this.currentDate).month() + 1).date(day).toDate();
        case DateType.CURRENT_MONTH:
          return dayjs(this.currentDate).date(day).toDate();
      }
    },

    getMonth(type: MonthType): Date {
      switch(type) {
        case MonthType.NEXT:
          return dayjs(this.currentDate).month(dayjs(this.currentDate).month() + 1).toDate();
        case MonthType.PREV:
          return dayjs(this.currentDate).month(dayjs(this.currentDate).month() - 1).toDate();
      }
    },

    setCurrentMonth(type: MonthType): void {
      this.currentDate = this.getMonth(type);
    },

    setDays(days: Day[]): void {
      const daysInMonth = dayjs(this.currentDate).daysInMonth();

      let day = 1;
      while(day <= daysInMonth) {
        const date = this.getDate(DateType.CURRENT_MONTH, day);
        this.addDayToCalendar(days, day++, date);
      }
    },

    addDayToCalendar(days: Day[], day: number, date: Date, isInactive?: boolean): void {
      days.push(
        {
          id: nanoid(10),
          meetups: this.filteredMeetups.get(dayjs(date).format(DATE_FORMAT)),
          day: day,
          isInactive,
        }
      )
    },

    setDaysBefore(): Day[] {
      const beforeDays: Day[] = [];

      const daysBefore = dayjs(this.currentDate).startOf('month').weekday();
      const lastDay = dayjs(this.currentDate).month(dayjs(this.currentDate).month() - 1).daysInMonth();

      let day = lastDay - daysBefore + 1;

      while(day <= lastDay) {
        const date = this.getDate(DateType.PREV_MONTH, day);

        this.addDayToCalendar(beforeDays, day++, date, true);
      }

      return beforeDays;
    },

    setDaysAfter(): Day[] {
      const afterDays: Day[] = [];

      const weekDay = dayjs(this.currentDate).endOf('month').weekday();
      const daysAfter = DAYS_IN_WEEK - weekDay - 1;

      if (daysAfter <= DAYS_IN_WEEK) {
        let day = 1;

        while(day <= daysAfter) {
          const date = this.getDate(DateType.NEXT_MONTH, day);
          this.addDayToCalendar(afterDays, day++, date, true);
        }
      }

      return afterDays;
    },
  }
});
</script>

<style scoped>
.calendar-view {
}

.calendar-view__controls {
  text-align: center;
  font-weight: 700;
  font-size: 24px;
  line-height: 1;
  color: var(--blue);
  background-color: var(--blue-extra);
  padding: 24px;
  display: flex;
  justify-content: center;
}

.calendar-view__controls-inner {
  max-width: 325px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  text-transform: capitalize;
}

.calendar-view__controls-inner button {
  border: none;
  padding: 0;
}

.calendar-view__control-left,
.calendar-view__control-right {
  width: 30px;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s all;
  background: url('@/assets/icons/icon-pill-active.svg') left center no-repeat;
  background-size: cover;
}

.calendar-view__control-left:hover,
.calendar-view__control-right:hover {
  opacity: 0.8;
}

.calendar-view__control-right {
  transform: rotate(180deg);
}

.calendar-view__grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
}

.calendar-view__grid {
  border: 1px solid var(--grey);
  border-bottom: none;
}

@media all and (min-width: 767px) {
  .calendar-view__grid {
    grid-template-columns: repeat(7, 1fr);
  }
}
</style>
