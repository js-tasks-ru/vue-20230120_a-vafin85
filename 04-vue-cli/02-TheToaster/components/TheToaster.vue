<template>
  <div class="toasts">
    <div v-for="message in messages" :key="message.text" :class="['toast', {
      'toast_success': message.type === $options.MessageType.SUCCESS,
      'toast_error': message.type === $options.MessageType.ERROR,
    }]">
      <ui-icon class="toast__icon" :icon="$options.IconName[message.type]" />
      <span>{{ message.text }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import UiIcon from './UiIcon.vue';
import {defineComponent} from "vue";
import {nanoid} from "nanoid";

enum MessageType {
  SUCCESS = `SUCCESS`,
  ERROR = `ERROR`
}

const IconName = {
  SUCCESS: 'check-circle',
  ERROR: 'alert-circle'
}

interface Message {
  id: string;
  text: string;
  type: MessageType;
}

interface Data {
  messages: Message[],
  id: number,
}

export default defineComponent({
  name: 'TheToaster',

  components: { UiIcon },

  MessageType,

  IconName,

  data(): Data {
    return {
      messages: [],
      id: 0,
    }
  },

  methods: {
    success(message: string) {
      const id = nanoid(10);
      this.messages.push({id, text: message, type: MessageType.SUCCESS});

      this.removeMessageWithTimeout(id);
    },

    error(message: string) {
      const id = nanoid(10);
      this.messages.push({id, text: message, type: MessageType.ERROR});

      this.removeMessageWithTimeout(id);
    },

    removeMessageWithTimeout(id: string) {
      setTimeout(() => {
        const index = this.messages.findIndex((el) => el.id === id);

        if (index !== -1) {
          this.messages.splice(index, 1);
        }
      }, 5000);
    }
  }
});
</script>

<style scoped>
.toasts {
  position: fixed;
  bottom: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  white-space: pre-wrap;
  z-index: 999;
}

@media all and (min-width: 992px) {
  .toasts {
    bottom: 72px;
    right: 112px;
  }
}

.toast {
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-size: 18px;
  line-height: 28px;
  width: auto;
}

.toast + .toast {
  margin-top: 20px;
}

.toast__icon {
  margin-right: 12px;
}

.toast.toast_success {
  color: var(--green);
}

.toast.toast_error {
  color: var(--red);
}
</style>
