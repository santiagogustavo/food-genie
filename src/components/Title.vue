<template>
  <component :is="as" :class="className"><slot></slot></component>
</template>

<script setup lang="ts">
const props = defineProps({
  as: {
    type: String,
    default: 'h1',
    validator: (value: string) => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(value),
  },
});

const className = `title title--${props.as}`;
</script>

<style lang="scss">
.title {
  font-family: 'Alice in Wonderland';
  color: $color-yellow;
  text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);

  &--h1 {
    font-size: 64px;
  }
  &--h2 {
    font-size: 48px;
  }
}
</style>
