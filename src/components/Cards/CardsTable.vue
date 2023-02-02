<template>
  <div class="cards-table">
    <Card
      v-for="(card, index) in cards"
      :key="`card-${index}`"
      :name="card.name"
      :rotation="generateRotation()"
    >
      {{ card.label }}
    </Card>
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

  @include screen-s {
    transform: scale(0.9);
  }

  & > .playing-card {
    margin: 16px;
    flex-grow: 0;
    flex-shrink: 0;
  }
}
</style>
