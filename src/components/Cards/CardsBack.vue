<template>
  <div class="cards-back">
    <img class="cards-back__img" :src="CardBackImage" />
  </div>
</template>

<script setup lang="ts">
import CardBackImage from '@/assets/images/card-back.png';

const props = defineProps({
  count: {
    type: Number,
    default: 0,
  },
  offset: {
    type: Number,
    default: 0,
  },
});

const translateY = `${props.count * props.offset}px`;
</script>

<style lang="scss">
.cards-back {
  pointer-events: none;
  position: absolute;
  height: $cards-height;
  width: $cards-width;
  padding: 8px;
  background: #fafafa;
  box-shadow: -8px 0px 16px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;

  transform: translateX(v-bind('translateY'));
  transition: transform 500ms $cards-slide-easing;

  &__img {
    background: #ffffa3;
    height: 100%;
    width: 100%;
  }
}
</style>
