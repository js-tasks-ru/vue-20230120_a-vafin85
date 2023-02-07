<template>
  <div class="toast">
    <button type="button" class="toast__close" aria-label="Закрыть тост"
      @click.prevent="closeToast(message.id)"></button>
    <ui-icon class="toast__icon" :icon="message.icon" />
    <span>{{ message.text }}</span>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import type { PropType } from 'vue'
import UiIcon from "./UiIcon.vue";
import type {Message} from "./TheToaster.vue";

export default defineComponent({
  components: {UiIcon},

  props: {
    message: Object as PropType<Message>,
    closeToast: Function as PropType<(id: string) => void>
  },

  emits: ['update:close'],
});
</script>

<style scoped>
.toast {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  align-items: center;
  padding: 16px 30px 16px 16px;
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

.toast.toast_info {
  color: var(--blue);
}

.toast.toast_warning {
  color: var(--yellow);
}

.toast.toast_error {
  color: var(--red);
}

.toast__close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 14px;
  height: 14px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
}

.toast__close:before,
.toast__close:after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 15px;
  height: 2px;
  background-color: var(--grey-3);
}

.toast__close:before {
  transform: translate(-50%) rotate(45deg);
}

.toast__close:after {
  transform: translate(-50%) rotate(-45deg);
}
</style>
