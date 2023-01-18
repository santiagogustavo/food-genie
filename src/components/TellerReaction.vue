<template>
  <div class="teller-reaction">
    <div v-if="currentReaction" class="teller-reaction__text">{{ currentReaction }}</div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';

const props = defineProps({
  reaction: {
    type: String,
    default: '',
  },
});

const currentReaction = ref(props.reaction);

watch(
  () => props.reaction,
  next => {
    currentReaction.value = '';
    setTimeout(() => {
      currentReaction.value = next;
    }, 50);
  }
);
</script>

<style lang="scss">
@keyframes chat {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.teller-reaction {
  min-height: 25px;

  &__text {
    color: #ffee58;
    animation: chat 200ms ease;
  }
}
</style>
