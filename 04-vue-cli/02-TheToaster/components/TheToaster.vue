<template>
  <ui-toasts>
    <ui-toast v-for="message in messages"
      :key="message.id"
      :message="message"
      :close-toast="closeToast"
      :class="[{
        'toast_success': message.type === $options.MessageType.SUCCESS,
        'toast_error': message.type === $options.MessageType.ERROR,
        'toast_warning': message.type === $options.MessageType.WARNING,
        'toast_info': message.type === $options.MessageType.INFO,
      }]"
    />
  </ui-toasts>
</template>

<script lang="ts">
import UiIcon from './UiIcon.vue';
import {defineComponent} from "vue";
import {nanoid} from "nanoid";
import UiToast from "./UiToast.vue";
import UiToasts from "./UiToasts.vue";

enum MessageType {
  SUCCESS = `SUCCESS`,
  ERROR = `ERROR`,
  INFO = `INFO`,
  WARNING = `WARNING`
}

enum IconName {
  SUCCESS = 'check-circle',
  INFO = 'check-circle',
  ERROR = 'alert-circle',
  WARNING = 'alert-circle'
}

export interface Message {
  id: string;
  text: string;
  timerId?: number;
  type: MessageType;
  icon: IconName;
}

interface Data {
  messages: Message[],
}

export default defineComponent({
  name: 'TheToaster',

  components: {UiToasts, UiToast, UiIcon },

  MessageType,

  IconName,

  data(): Data {
    return {
      messages: [],
    }
  },

  methods: {
    success(text: string, timeout: number) {
      const message: Message = this.getMessage(text, MessageType.SUCCESS);

      message.timerId = this.removeMessageWithTimeout(message.id, timeout);

      this.messages.push(message);
    },

    error(text: string, timeout: number) {
      const message: Message = this.getMessage(text, MessageType.ERROR);

      message.timerId = this.removeMessageWithTimeout(message.id, timeout);

      this.messages.push(message);
    },

    info(text: string, timeout: number) {
      const message: Message = this.getMessage(text, MessageType.INFO);

      message.timerId = this.removeMessageWithTimeout(message.id, timeout);

      this.messages.push(message);
    },

    warning(text: string, timeout: number) {
      const message: Message = this.getMessage(text, MessageType.WARNING);

      message.timerId = this.removeMessageWithTimeout(message.id, timeout);

      this.messages.push(message);
    },

    getMessage(text: string, type: MessageType): Message {
      return {id: nanoid(10), text: text, type, icon: IconName[type]}
    },

    closeToast(id: string) {
      const index = this.messages.findIndex((el) => el.id === id);

      if (index !== -1) {
        clearTimeout(this.messages[index].timerId);

        this.messages.splice(index, 1);
      }
    },

    removeMessageWithTimeout(id: string, timeout?: number): number {
      return setTimeout(() => {
        const index = this.messages.findIndex((el) => el.id === id);

        if (index !== -1) {
          this.messages.splice(index, 1);
        }
      }, timeout || 5000);
    }
  }
});
</script>

<style scoped>

</style>
