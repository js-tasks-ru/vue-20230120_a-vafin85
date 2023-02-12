<template>
  <div class="calendar-view">
    <div class="calendar-view__controls">
      <div class="calendar-view__controls-inner">
        <button class="calendar-view__control-left" type="button" aria-label="Previous month"
          @click="setMonth($options.ChangeMonthType.PREV)"></button>
        <div class="calendar-view__date">{{ currentDateTitle }}</div>
        <button class="calendar-view__control-right" type="button" aria-label="Next month" @click="setMonth($options.ChangeMonthType.NEXT)"></button>
      </div>
    </div>

    <div class="calendar-view__grid">
      <div v-for="day in days" :key="day.id" :class="['calendar-view__cell', {
        'calendar-view__cell_inactive': day.isInactive
      }]" tabindex="0">
        <div class="calendar-view__cell-day">{{ day.day }}</div>
        <div class="calendar-view__cell-content"></div>
      </div>
<!--      <div class="calendar-view__cell" tabindex="0">-->
<!--        <div class="calendar-view__cell-day">12</div>-->
<!--        <div class="calendar-view__cell-content">-->
<!--          <a href="/meetups/1" class="calendar-event">Meetup 1</a>-->
<!--          <a href="/meetups/2" class="calendar-event">Meetup 2</a>-->
<!--        </div>-->
<!--      </div>-->
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

dayjs.extend(weekday);
dayjs.locale(`ru`);

const DAYS_IN_WEEK = 7;

enum ChangeMonthType {
  NEXT,
  PREV
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

interface Day {
  id: string,
  day: number,
  date: Date,
  isInactive?: boolean
}

export default defineComponent({
  name: 'MeetupsCalendar',

  DAYS_IN_WEEK,

  ChangeMonthType,

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
    }
  },

  methods: {
    setMonth(type: ChangeMonthType): void {
      switch(type) {
        case ChangeMonthType.NEXT:
          this.currentDate = dayjs(this.currentDate).month(dayjs(this.currentDate).month() + 1).toDate();
          break;
        case ChangeMonthType.PREV:
          this.currentDate = dayjs(this.currentDate).month(dayjs(this.currentDate).month() - 1).toDate();
          break;
      }
    },

    setDays(days: Day[]): void {
      const daysInMonth = dayjs(this.currentDate).daysInMonth();

      let day = 1;
      while(day <= daysInMonth) {
        const date = dayjs(dayjs(this.currentDate).date(day)).toDate();

        days.push(
          {
            id: nanoid(10),
            day: day++,
            date,
          }
        )
      }
    },

    setDaysBefore(): Day[] {
      const beforeDays: Day[] = [];

      const daysBefore = dayjs(this.currentDate).startOf('month').weekday();
      const lastDay = dayjs(this.currentDate).month(dayjs(this.currentDate).month() - 1).daysInMonth();

      let day = lastDay - daysBefore + 1;

      while(day <= lastDay) {
        const date = dayjs(dayjs(this.currentDate)
          .month(dayjs(this.currentDate).month() - 1)
          .date(day)
        ).toDate();

        beforeDays.push(
          {
            id: nanoid(10),
            date,
            day: day++,
            isInactive: true,
          }
        )
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
          const date = dayjs(dayjs(this.currentDate)
            .month(dayjs(this.currentDate).month() + 1)
            .date(day)
          ).toDate();

          afterDays.push(
            {
              id: nanoid(10),
              day: day++,
              isInactive: true,
              date,
            }
          )
        }
      }

      return afterDays;
    }
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

@media all and (max-width: 767px) {
  .calendar-view__cell:nth-child(5n + 1) {
    border-left: none;
  }
}

@media all and (min-width: 767px) {
  .calendar-view__grid {
    grid-template-columns: repeat(7, 1fr);
  }

  .calendar-view__cell {
    height: 144px;
  }

  .calendar-view__cell:nth-child(7n + 1) {
    border-left: none;
  }
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

@media all and (min-width: 767px) {
  .calendar-event {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-height: calc(var(--max-lines) * var(--line-height) + 6px);
  }
}
</style>
