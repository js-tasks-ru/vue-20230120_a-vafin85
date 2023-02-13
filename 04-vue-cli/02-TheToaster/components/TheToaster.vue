<template>
  <ui-toasts>
    <ui-toast v-for="toast in toasts"
      :key="toast.id"
      :toast="toast"
      @close="closeToast(toast.id)"
    />
  </ui-toasts>
</template>

<script lang="ts">
import UiIcon from './UiIcon.vue';
import {defineComponent} from "vue";
import {nanoid} from "nanoid";
import UiToast from "./UiToast.vue";
import UiToasts from "./UiToasts.vue";

export enum ToastType {
  SUCCESS = `SUCCESS`,
  ERROR = `ERROR`,
  INFO = `INFO`,
  WARNING = `WARNING`
}

export interface Toast {
  id: string;
  text: string;
  timerId?: number;
  type: ToastType;
}

interface CreateToast {
  text: string;
  timeout?: number;
  type: ToastType;
}

interface Data {
  toasts: Toast[],
}

export default defineComponent({
  name: 'TheToaster',

  components: {UiToasts, UiToast, UiIcon },

  data(): Data {
    return {
      toasts: [],
    }
  },

  methods: {
    success(text: string, timeout: number) {
      this.createToast({text, timeout, type: ToastType.SUCCESS});
    },

    error(text: string, timeout: number) {
      this.createToast({text, timeout, type: ToastType.ERROR});
    },

    info(text: string, timeout: number) {
      this.createToast({text, timeout,  type: ToastType.INFO});
    },

    warning(text: string, timeout: number) {
      this.createToast({text, timeout,  type: ToastType.WARNING});
    },

    createToast({text, timeout, type}: CreateToast) {
      const message: Toast = this.getMessage(text, type);

      message.timerId = this.removeToastWithTimeout(message.id, timeout);

      this.toasts.push(message);
    },

    getMessage(text: string, type: ToastType): Toast {
      return {id: nanoid(10), text: text, type}
    },

    closeToast(id: string) {
      const index = this.toasts.findIndex((el) => el.id === id);

      if (index !== -1) {
        clearTimeout(this.toasts[index].timerId);

        this.toasts.splice(index, 1);
      }
    },

    removeToastWithTimeout(id: string, timeout?: number): number {
      return setTimeout(() => {
        const index = this.toasts.findIndex((toast) => toast.id === id);

        if (index !== -1) {
          this.toasts.splice(index, 1);
        }
      }, timeout || 5000);
    }
  }
});
</script>

<style scoped>

</style>
