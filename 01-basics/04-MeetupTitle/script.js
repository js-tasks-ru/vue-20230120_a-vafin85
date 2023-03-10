import { createApp, defineComponent } from './vendor/vue.esm-browser.js';

const API_URL = 'https://course-vue.javascript.ru/api';

function fetchMeetupById(meetupId) {
  return fetch(`${API_URL}/meetups/${meetupId}`).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return response.json().then((error) => {
        throw error;
      });
    }
  });
}

// Требуется создать Vue приложение
const App = defineComponent({
  name: `App`,
  data() {
    return {
      meetupId: null,
      title: null,
    };
  },
  watch: {
    async meetupId() {
      const { title } = await fetchMeetupById(this.meetupId);
      this.title = title;
    },
  },
});

const app = createApp(App);
app.mount('#app');
