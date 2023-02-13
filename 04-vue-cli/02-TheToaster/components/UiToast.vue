<template>
  <div class="toast" :class="classType">
    <button type="button" class="toast__close" aria-label="Закрыть тост"
      @click.prevent="$emit(`close`)"></button>
    <ui-icon class="toast__icon" :icon="icon" />
    <span>{{ toast.text }}</span>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import type { PropType } from 'vue'
import UiIcon from "./UiIcon.vue";
import type {Toast} from "./TheToaster.vue";

const ToastClass = {
  SUCCESS: 'toast_success',
  ERROR: 'toast_error',
  WARNING: 'toast_warning',
  INFO: 'toast_info',
}

const IconName = {
  SUCCESS: 'check-circle',
  INFO: 'check-circle',
  ERROR: 'alert-circle',
  WARNING: 'alert-circle'
}

export default defineComponent({
  components: {UiIcon},

  props: {
    toast: {
      type: Object as PropType<Toast>,
      required: true,
    },
  },

  emits: ['close'],

  computed: {
    classType() {
      return ToastClass[this.toast.type];
    },

    icon() {
      return IconName[this.toast.type];
    }
  },
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
