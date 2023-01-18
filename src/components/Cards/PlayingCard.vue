<template>
  <div class="playing-card">
    <div class="playing-card__name">
      <span>{{ cardName }}</span>
      <span>{{ SUITS[suit] }}</span>
    </div>
    <div class="playing-card__content">
      <slot></slot>
    </div>
    <div class="playing-card__name--reverse">
      <span>{{ cardName }}</span>
      <span>{{ SUITS[suit] }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRandomInt } from '@/utils/math';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  rotation: {
    type: Number,
    default: 0,
  },
});

const SUITS: { [key: string]: string } = {
  diamond: '[',
  club: ']',
  heart: '{',
  spade: '}',
};

const COLORS = {
  black: '#313131',
  red: '#ff1744',
};

const suit = Object.keys(SUITS).at(getRandomInt(0, 4)) ?? Object.keys(SUITS)[0];
const color = Object.keys(COLORS).at(getRandomInt(0, 2)) ?? COLORS.red;
const cardName = props.name.charAt(0);
const rotation = `${props.rotation}deg`;
const offset = `${Math.abs(props.rotation) * 2}px`;
</script>

<style lang="scss">
@keyframes slide-card {
  0% {
    transform: rotate(0deg) translateY(100px);
    opacity: 0;
  }
  100% {
    transform: rotate(v-bind('rotation')) translateY(v-bind('offset'));
    opacity: 1;
  }
}

.playing-card {
  position: relative;
  font-family: 'Card Characters';
  font-size: 24px;
  padding: 8px;
  background: #fafafa;
  box-shadow: 0px 8px 16px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  color: v-bind('color');
  animation: slide-card 500ms $cards-slide-easing forwards;

  transform-origin: bottom center;

  width: $cards-width;
  height: $cards-height;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__name,
  &__name--reverse {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: fit-content;
    text-align: center;
  }

  &__name {
    left: 8px;
    top: 8px;
  }
  &__name--reverse {
    right: 8px;
    bottom: 8px;
    transform: rotate(180deg);
  }
}
</style>
