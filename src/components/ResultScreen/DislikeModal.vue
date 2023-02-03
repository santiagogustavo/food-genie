<template>
  <Modal>
    <div class="dislike-modal">
      <Sad class="dislike-modal__img" />
      <h3>{{ $t('game.dislikeModal.title') }}</h3>
      <Feedback class="like-modal__feedback" />
      <div class="dislike-modal__actions">
        <Button @click="handleClickRetry">{{ $t('game.dislikeModal.actions.retry') }}</Button>
        <Button @click="handleClickOpen">{{ $t('game.dislikeModal.actions.open') }}</Button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Sad from '@/components/Illustrations/Sad.vue';
import Feedback from '@/components/Feedback/Feedback.vue';

import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';

const emit = defineEmits(['open', 'retry']);

const handleClickRetry = () => {
  emit('retry');
};

const handleClickOpen = () => {
  emit('open');
};
</script>

<style lang="scss">
.dislike-modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px;
  max-width: 400px;
  min-width: 400px;
  background-color: $color-black;
  color: $color-white;
  text-align: center;

  @include screen-s {
    min-width: initial;
    max-width: initial;
  }

  &__feedback {
    margin: 40px 0;
  }

  &__img {
    width: $modal-image-size;
    height: $modal-image-size;
    color: $color-yellow;
    margin: auto;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    button {
      margin: 8px;
    }
  }
}
</style>
