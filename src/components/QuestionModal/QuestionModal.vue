<template>
  <Modal>
    <div class="question-modal">
      <Title class="question-modal__title" as="h2">{{ $t('game.questionModal.title') }}</Title>
      <div class="question-modal__alternatives">
        <Button
          v-for="alternative in alternatives"
          :key="`alternative-${alternative.name}`"
          class="question-modal__button"
          @click="handleAnswer(alternative)"
        >
          {{ alternative.label }}
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/Modal.vue';
import Title from '@/components/Title.vue';
import Button from '@/components/Button.vue';

defineProps({
  alternatives: {
    type: Array<any>,
    required: true,
  },
});

const emit = defineEmits(['answer']);

const handleAnswer = (option: any) => {
  emit('answer', option);
};
</script>

<style lang="scss">
.question-modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 32px;

  background: $color-purple;
  color: $color-white;

  &__title {
    text-align: center;
    white-space: nowrap;
  }

  &__alternatives {
    display: flex;
    justify-content: center;

    @include screen-s {
      flex-direction: column;
      align-items: center;
    }
  }

  &__button {
    width: 100%;
    padding: 32px;
    margin: 16px;
    font-family: 'Card Characters';
    color: $color-yellow;
    font-size: 32px;
    background-color: $color-gray-darkest !important;

    @include screen-s {
      font-size: 24px;
    }
  }
}
</style>
