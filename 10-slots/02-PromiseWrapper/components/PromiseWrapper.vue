<template>
  <slot :name="currentSlot.name" v-bind="currentSlot.data" />
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import type {PropType} from 'vue';

type PromiseStatus = 'pending' | 'fulfilled' | 'rejected';

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

interface DataInterface {
  promiseStatus: PromiseStatus;
  error: unknown | null,
  result: MeetupInterface | null,
}

export default defineComponent({
  name: 'PromiseWrapper',

  props: {
    promise: {
      type: Promise as PropType<Promise<MeetupInterface>>,
      required: true,
    },
  },

  data(): DataInterface {
    return {
      promiseStatus: 'pending',
      error: null,
      result: null,
    }
  },

  computed: {
    currentSlot() {
      return {
        name: this.promiseStatus,
        data: {
          result: this.result,
          error: this.error,
        },
      };
    },
  },

  watch: {
    promise: {
      immediate: true,
      handler() {
        this.promiseStatus = 'pending';

        this.promise
          .then((data) => {
            this.result = data;
            this.promiseStatus = 'fulfilled';
          })
          .catch((error) => {
            this.error = error;
            this.promiseStatus = 'rejected';
          })
      }
    }
  },
});
</script>
