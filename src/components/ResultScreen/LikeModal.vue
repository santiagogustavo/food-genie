<template>
  <Modal>
    <div class="like-modal">
      <Grin class="like-modal__img" />
      <h3>{{ $t('game.likeModal.title') }}</h3>
      <br />
      <div class="like-modal__actions">
        <Button @click="handleClickOpen">{{ $t('game.likeModal.actions.open') }}</Button>
        <Button @click="handleClickRetry">{{ $t('game.likeModal.actions.retry') }}</Button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Grin from '@/components/Illustrations/Grin.vue';

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
.like-modal {
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
