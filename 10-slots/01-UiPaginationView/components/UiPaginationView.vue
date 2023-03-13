<template>
  <div class="pagination-container">
    <template  v-for="item in pageMeetups" :key="item">
      <slot :item="item" />
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import type {PropType} from 'vue';

interface MeetupInterface {
  id: number,
  title: string,
  description: string,
  imageId: number,
  image: string,
  date: number,
  organizer: string,
  place: string,
  agenda: AgendaInterface[],
}

interface AgendaInterface {
  "id": number,
  "startsAt": string,
  "endsAt": string,
  "type": string,
  "title": string,
  "description": string | null,
  "speaker": string | null,
  "language": string | null
}

export default defineComponent({
  name: 'UiPaginationView',

  props: {
    page: {
      type: Number as PropType<number>,
      required: true,
      validator: (value: number) => value > 0,
    },

    perPage: {
      type: Number as PropType<number>,
      required: true,
      validator: (value: number) => value > 0,
    },

    items: {
      type: Array as PropType<MeetupInterface[]>,
      required: true,
    },
  },

  computed: {
    pageMeetups(): MeetupInterface[] {
      const endItemIndex = this.page * this.perPage;
      const startItemIndex = endItemIndex - this.perPage;
      return this.items.slice(startItemIndex, endItemIndex);
    }
  }
});
</script>

<style></style>
