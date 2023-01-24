import { createApp, defineComponent } from './vendor/vue.esm-browser.js';

// Создайте Vue приложение
const App = defineComponent({
  name: `App`,
  data() {
    return {
      value1: 0,
      value2: 0,
      operand: null,
    };
  },

  computed: {
    result() {
      switch (this.operand) {
        case `sum`:
          return this.value1 + this.value2;
        case `subtract`:
          return this.value1 - this.value2;
        case `multiply`:
          return this.value1 * this.value2;
        case `divide`:
          return this.value1 / this.value2;
        default:
          return 0;
      }
    },
  },
});

const app = createApp(App);
app.mount('#app');
