<template>
  <div class="cards-deck">
    <div class="cards-deck__stack">
      <TransitionGroup name="deck-slide">
        <CardsBack
          v-for="card in internalCardCount"
          :key="`card-${card}`"
          :name="`${card}`"
          :count="card"
          :offset="offset"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import CardsBack from '@/components/Cards/CardsBack.vue';

const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  count: {
    type: Number,
    default: 0,
  },
  offset: {
    type: Number,
    default: 8,
  },
});

const totalOffset = `${props.count * props.offset + 12}px`;

const internalCardCount = ref(0);

watch(
  () => props.count,
  next => {
    internalCardCount.value = next;
  }
);

onMounted(() => {
  internalCardCount.value = props.total;
});
</script>

<style lang="scss">
.deck-slide-enter-active,
.deck-slide-leave-active {
  transition: all 500ms $cards-slide-easing;
}

.deck-slide-enter-from,
.deck-slide-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.cards-deck {
  display: flex;
  justify-content: center;
  height: calc($cards-width + 16px);
  width: calc($cards-height + 16px);

  @include screen-s {
    transform: scale(0.8);
  }

  &__stack {
    position: relative;
    height: calc($cards-height + 16px);
    width: calc($cards-width + 16px);
    padding-left: v-bind('totalOffset');
    transform: rotateZ(-90deg) rotateY(-45deg);
  }
}
</style>
