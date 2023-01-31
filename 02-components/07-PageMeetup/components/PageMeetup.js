import { defineComponent } from '../vendor/vue.esm-browser.js';
import UiContainer from './UiContainer.js';
import UiAlert from './UiAlert.js';
import MeetupView from "../../06-MeetupView/components/MeetupView";
import { fetchMeetupById } from '../meetupService.js';

export default defineComponent({
  name: 'PageMeetup',

  components: {
    MeetupView,
    UiAlert,
    UiContainer,
  },

  props: {
    meetupId: {
      type: Number,
      require: true,
    }
  },

  data() {
    return {
      meetup: undefined,
      isLoading: false,
      isError: false,
      errorMessage: ``,
    }
  },

  watch: {
    meetupId() {
      this.fetchMeetup();
    }
  },

  mounted() {
    this.fetchMeetup();
  },

  methods: {
    reset() {
      if (this.isError) {
        this.isError = false;
        this.errorMessage = ``;
      }

      this.meetup = undefined;
    },
    async fetchMeetup() {
      this.isLoading = true;

      this.reset();

      try {
        this.meetup = await fetchMeetupById(this.meetupId);
      } catch(e) {
        this.isError = true;
        this.errorMessage = e.toString().slice(7);
      } finally {
        this.isLoading = false;
      }
    }
  },

  template: `
    <div class="page-meetup">
      <MeetupView v-if="meetup" :meetup="meetup" />

      <UiContainer v-if="isLoading">
        <UiAlert>Загрузка...</UiAlert>
      </UiContainer>

      <UiContainer v-if="isError">
        <UiAlert>{{ errorMessage }}</UiAlert>
      </UiContainer>
    </div>`,
});
