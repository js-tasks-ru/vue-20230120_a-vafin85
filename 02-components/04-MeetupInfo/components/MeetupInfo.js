import { defineComponent } from '../vendor/vue.esm-browser.js';

export default defineComponent({
  name: 'MeetupInfo',

  props: {
    organizer: {
      type: String,
      require: true,
    },
    place : {
      type: String,
      require: true,
    },
    date: {
      type: Number,
      require: true,
    }
  },

  methods: {
    getFormattedDate(ms) {
      const dateOptions = {
        year: "numeric",
        day: "numeric",
        month: "long",
      };

      return new Date(ms).toLocaleDateString(navigator.language, dateOptions);
    },
    getISODate(ms) {
      return new Date(ms).toISOString().slice(0, 10);
    }
  },

  template: `
    <ul class="meetup-info">
      <li>
        <img class="icon meetup-info__icon" alt="icon" src="/assets/icons/icon-user.svg" />
        {{ organizer }}
      </li>
      <li>
        <img class="icon meetup-info__icon" alt="icon" src="/assets/icons/icon-map.svg" />
        {{ place }}
      </li>
      <li>
        <img class="icon meetup-info__icon" alt="icon" src="/assets/icons/icon-cal-lg.svg" />
        <time :datetime="\`\${getISODate(date)}\`">{{ getFormattedDate(date) }}</time>
      </li>
    </ul>`,
});
