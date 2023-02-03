<template>
  <Modal>
    <div class="about-modal">
      <TarotCard class="about-modal__tarot-card" />
      <h3>{{ $t('splash.aboutModal.title') }}</h3>
      <section class="about-modal__info">
        <Markdown :value="$t('splash.aboutModal.paragraph1')" />
        <Markdown :value="$t('splash.aboutModal.paragraph2')" />
        <Markdown :value="$t('splash.aboutModal.paragraph3')" />
      </section>
      <br />
      <Button @click="handleClickClose">{{ $t('splash.aboutModal.close') }}</Button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import TarotCard from '@/components/Illustrations/TarotCard.vue';
import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';
import Markdown from '@/components/Markdown.vue';

const emit = defineEmits(['close']);

const handleClickClose = () => {
  emit('close');
};
</script>

<style lang="scss">
.about-modal {
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

  &__info {
    max-height: 40vh;
    max-width: 100%;
    margin-bottom: 16px;
    overflow: auto;
    text-align: justify;
  }

  &__tarot-card {
    width: $modal-image-size;
    height: $modal-image-size;
    color: $color-yellow;
    margin: auto;
  }
}
</style>
