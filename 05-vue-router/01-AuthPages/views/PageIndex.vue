<template>
  <UiContainer>
    <h2 class="title">IndexPage</h2>
    Для проверки: <RouterLink to="/login?from=/">/login?from=/</RouterLink>
  </UiContainer>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import UiContainer from '../components/UiContainer.vue';

export default defineComponent({
  name: 'PageIndex',

  components: { UiContainer },
});
</script>

<style></style>
