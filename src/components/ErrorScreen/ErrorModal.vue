<template>
  <Modal>
    <div class="error-modal">
      <FaceWithSpiralEyes class="error-modal__face" />
      <h3>Ops, parece que algo não funcionou!</h3>
      <p>
        Pode ser que os restaurantes não estejam abertos ou o item procurado não está disponível
      </p>
      <br />
      <button @click="handleClickRetry">Jogar de novo</button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import FaceWithSpiralEyes from '@/assets/svgs/FaceWithSpiralEyes.vue';

import Modal from '@/components/Modal.vue';
import { useUserStore } from '@/stores/user';
import { useAppStore } from '@/stores/app';

const userStore = computed(() => useUserStore());

const emit = defineEmits(['retry']);

const handleRetryGame = () => {
  emit('retry');
  useAppStore().setIsErrorModalOpen(false);
};

const handleClickRetry = () => {
  userStore.value.resetAnswers();
  userStore.value.resetResults();
  handleRetryGame();
};
</script>

<style lang="scss">
.error-modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px;
  max-width: 400px;
  background-color: $color-black;
  color: $color-white;
  text-align: center;

  @include screen-s {
    max-width: 100%;
  }

  &__face {
    width: $modal-image-size;
    height: $modal-image-size;
    color: $color-yellow;
    margin: auto;
  }
}
</style>
