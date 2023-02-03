<template>
  <StarFilled
    v-if="filled"
    :class="className"
    @click="handleClick"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
  />
  <StarOutlined v-else :class="className" @click="handleClick" @mouseover="handleMouseOver" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import StarFilled from '@/assets/svgs/StarFilled.vue';
import StarOutlined from '@/assets/svgs/StarOutlined.vue';
import classNames from 'classnames';

const props = defineProps({
  scored: {
    type: Boolean,
    default: false,
  },
  filled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click', 'over', 'leave']);
const className = computed(() =>
  classNames('feedback-star', {
    'feedback-star--scored': props.scored,
  })
);

const hover = ref(false);
const filled = computed(() => props.filled || hover.value);

const handleClick = () => {
  emit('click');
};

const handleMouseOver = () => {
  hover.value = true;
  emit('over');
};

const handleMouseLeave = () => {
  hover.value = false;
  emit('leave');
};
</script>

<style lang="scss">
.feedback-star {
  display: block;
  cursor: pointer;
  height: 32px;
  width: 32px;
  color: $color-white;

  &:hover {
    transform: scale(1.3);
  }

  &--scored {
    color: $color-yellow;
  }
}
</style>
