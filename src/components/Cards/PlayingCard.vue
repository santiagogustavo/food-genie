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
</script>

<style lang="scss">
.playing-card {
  position: relative;
  font-family: 'Card Characters';
  font-size: 24px;
  padding: 8px;
  background: #fafafa;
  border-radius: 8px;
  color: v-bind('color');

  transform-origin: bottom center;

  width: 150px;
  height: 242px;
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
