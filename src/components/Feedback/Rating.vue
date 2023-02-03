<template>
  <div class="feedback-rating">
    <Star
      v-for="(star, index) in new Array(scale).fill(0)"
      :key="`star-${index}`"
      class="feedback-rating__star"
      :filled="isFilled(index)"
      :scored="isScored(index)"
      @click="handleClick(index)"
      @over="handleHoverEnter(index)"
      @leave="handleHoverLeave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Star from '@/components/Feedback/Star.vue';

const props = defineProps({
  score: {
    type: Number,
    default: -1,
  },
  scale: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(['rate']);

const hovered = ref(-1);

const isFilled = (index: number) =>
  hovered.value != -1 ? hovered.value > index : props.score >= index;

const isScored = (index: number) => hovered.value === -1 && props.score >= index;

const handleClick = (index: number) => {
  hovered.value = -1;
  emit('rate', index);
};

const handleHoverEnter = (index: number) => {
  hovered.value = index;
};

const handleHoverLeave = () => {
  hovered.value = -1;
};
</script>

<style lang="scss">
.feedback-rating {
  display: flex;
  align-items: center;

  &__star {
    margin: 2px;
  }
}
</style>
