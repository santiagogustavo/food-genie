<template>
  <Modal>
    <div class="question-modal">
      <Title class="question-modal__title" as="h2">Você prefere...?</Title>
      <div class="question-modal__alternatives">
        <button
          v-for="alternative in alternatives"
          :key="`alternative-${alternative.name}`"
          class="question-modal__button"
          @click="handleAnswer(alternative)"
        >
          {{ alternative.label }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/Modal.vue';
import Title from '@/components/Title.vue';

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
  }

  &__button {
    padding: 32px;
    margin: 16px;
    font-family: 'Alice in Wonderland';
    color: $color-yellow;
    font-size: 48px;
  }
}
</style>
