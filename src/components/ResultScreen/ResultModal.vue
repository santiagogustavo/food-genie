<template>
  <Modal>
    <div class="result-modal">
      <div class="result-modal__stars-container">
        <StarFilled class="result-modal__star-filled" />
        <StarOutlined class="result-modal__star-outlined" />
      </div>
      <h2 class="result-modal__result">
        {{ result }}
      </h2>
      <p>{{ $t('game.resultModal.message') }}</p>
      <div class="result-modal__actions">
        <Button @click="handleClickThumbsUp">
          <ThumbsUp />
        </Button>
        <Button @click="handleClickThumbsDown">
          <ThumbsDown />
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import StarFilled from '@/assets/svgs/StarFilled.vue';
import StarOutlined from '@/assets/svgs/StarOutlined.vue';
import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';
import { useUserStore } from '@/stores/user';
import UserSatisfaction from '@/services/analytics/events/UserSatisfaction';
import { useFirebase } from '@/composables/firebase';
import { useAppStore } from '@/stores/app';
import { getDeltaTime } from '@/utils/time';
import ThumbsUp from '@/components/Illustrations/ThumbsUp.vue';
import ThumbsDown from '@/components/Illustrations/ThumbsDown.vue';

const userStore = computed(() => useUserStore());
const result = computed(() => userStore.value.stringifiedResult);

const emit = defineEmits(['like', 'dislike']);

const logUserSatisfactionEvent = (satisfied: boolean) => {
  const deltaTime = getDeltaTime(useAppStore().latestTimestamp);
  const applicationCloseEvent = new UserSatisfaction({
    deltaTime,
    result: result.value,
    satisfied,
  });
  useFirebase().log(applicationCloseEvent);
};

const handleClickThumbsUp = () => {
  userStore.value.setUserSatisfied(true);
  logUserSatisfactionEvent(true);
  emit('like');
};

const handleClickThumbsDown = () => {
  userStore.value.setUserSatisfied(false);
  logUserSatisfactionEvent(false);
  emit('dislike');
};
</script>

<style lang="scss">
@keyframes star-spin {
  0% {
    transform: scale(0.7) rotate(0deg);
  }
  25% {
    transform: scale(1) rotate(90deg);
  }
  50% {
    transform: scale(0.7) rotate(180deg);
  }
  75% {
    transform: scale(1) rotate(270deg);
  }
  100% {
    transform: scale(0.7) rotate(360deg);
  }
}
.result-modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px;
  max-width: 400px;
  background-color: $color-black;
  color: $color-white;
  text-align: center;

  &__stars-container {
    position: relative;
    margin: auto;
    width: 128px;
    height: 128px;
  }

  &__star-filled,
  &__star-outlined {
    position: absolute;
    top: 0;
    left: 0;
    width: $modal-image-size;
    height: $modal-image-size;
  }

  &__star-filled {
    z-index: 2;
    color: $color-yellow;
    transform: scale(0.7);
  }

  &__star-outlined {
    z-index: 1;
    color: rgba(255, 255, 255, 0.15);
    animation: star-spin 5s linear infinite;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    button {
      margin: 8px;
    }
  }
}
</style>
