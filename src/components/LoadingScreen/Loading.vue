<template>
  <Transition name="fade">
    <div v-if="loading" class="loading-screen">
      <Spinner />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import Spinner from '@/components/Spinner.vue';

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: all 250ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loading-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
