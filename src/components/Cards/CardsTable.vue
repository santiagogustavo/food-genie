<template>
  <div class="cards-table">
    <Card
      v-for="(card, index) in cards"
      :key="`card-${index}`"
      :name="card.name"
      :rotation="generateRotation()"
    />
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/Cards/PlayingCard.vue';
import { getRandomInt } from '@/utils/math';

defineProps({
  cards: {
    type: Array<any>,
    default: () => [],
  },
});

const generateRotation = () => getRandomInt(-5, 5);
</script>

<style lang="scss">
.cards-table {
  position: relative;
  height: $cards-height;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  transform-origin: bottom center;
  transform: rotateX(15deg);

  & > .playing-card {
    margin: 16px;
    flex-grow: 0;
    flex-shrink: 0;
  }
}
</style>
