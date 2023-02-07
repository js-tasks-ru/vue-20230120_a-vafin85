<template>
  <the-toaster ref="toaster" />
  <p>
    <button type="button" @click="handleSuccessClick">Add Success Message</button>
    <button type="button" @click="handleErrorClick">Add Error Message</button>
    <button type="button" @click="handleWarningClick">Add Warning Message</button>
    <button type="button" @click="handleInfoClick">Add Info Message</button>
  </p>
</template>

<script>
import TheToaster from './components/TheToaster.vue';

export default {
  name: 'App',

  components: { TheToaster },

  methods: {
    handleSuccessClick() {
      this.$refs.toaster.success('Success ' + new Date().toLocaleTimeString());
    },

    handleErrorClick() {
      this.$refs.toaster.error('Error ' + new Date().toLocaleTimeString());
    },

    handleWarningClick() {
      this.$refs.toaster.warning('Warning ' + new Date().toLocaleTimeString());
    },

    handleInfoClick() {
      this.$refs.toaster.info('Info ' + new Date().toLocaleTimeString());
    },
  },
};
</script>
