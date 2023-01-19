<template>
  <Teleport to="body">
    <Transition name="slide-fade">
      <div v-if="open" class="modal">
        <div class="modal__dim"></div>
        <div class="modal__card">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss">
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 200ms ease;

  .modal__card {
    transition: transform 200ms ease;
  }
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;

  .modal__card {
    transform: translateY(50%);
  }
}

.modal {
  position: absolute;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  &__dim {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }

  &__card {
    z-index: 999;
    background: $color-white;
    color: $color-black;
    border-radius: 8px;
    padding: 8px;
    box-shadow: 0px 4px 8px 4px rgba(0, 0, 0, 0.5);
  }
}
</style>
