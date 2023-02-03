<template>
  <Modal>
    <div class="error-modal">
      <FaceWithSpiralEyes class="error-modal__face" />
      <h3>{{ $t('app.errorModal.title') }}</h3>
      <p>
        {{ $t('app.errorModal.message') }}
      </p>
      <br />
      <Button @click="handleClickRetry">{{ $t('app.errorModal.retry') }}</Button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import FaceWithSpiralEyes from '@/assets/svgs/FaceWithSpiralEyes.vue';

import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';
import { useUserStore } from '@/stores/user';
import { useAppStore } from '@/stores/app';
import { getDeltaTime } from '@/utils/time';
import GameRetry from '@/services/analytics/events/GameRetry';
import { useFirebase } from '@/composables/firebase';

const userStore = computed(() => useUserStore());

const emit = defineEmits(['retry']);

const logGameRetryEvent = () => {
  const deltaTime = getDeltaTime(useAppStore().latestTimestamp);
  const gameRetryEvent = new GameRetry({ deltaTime, error: true });
  useFirebase().log(gameRetryEvent);
};

const handleRetryGame = () => {
  logGameRetryEvent();
  useAppStore().setIsErrorModalOpen(false);
  emit('retry');
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
