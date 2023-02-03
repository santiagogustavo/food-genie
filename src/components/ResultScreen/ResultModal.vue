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
      <div class="result-modal__actions">
        <Button @click="handleClickOpenIfood">{{ $t('game.resultModal.actions.open') }}</Button>
        <Button @click="handleClickRetry">{{ $t('game.resultModal.actions.retry') }}</Button>
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
import { RESULT_IFOOD } from '@/constants/urls';
import { useUserStore } from '@/stores/user';
import ApplicationClose from '@/services/analytics/events/ApplicationClose';
import { useFirebase } from '@/composables/firebase';
import { useAppStore } from '@/stores/app';
import { getDeltaTime } from '@/utils/time';
import GameRetry from '@/services/analytics/events/GameRetry';

const userStore = computed(() => useUserStore());
const result = computed(() => userStore.value.stringifiedResult);

const merchantId = computed(() => userStore.value.results.merchant?.name);
const itemId = computed(() => userStore.value.results.item?.name);

const emit = defineEmits(['close']);

const logApplicationCloseEvent = (destination: string) => {
  const deltaTime = getDeltaTime(useAppStore().timestamps[0]);
  const applicationCloseEvent = new ApplicationClose({ deltaTime, destination });
  useFirebase().log(applicationCloseEvent);
};

const logGameRetryEvent = () => {
  const deltaTime = getDeltaTime(useAppStore().latestTimestamp);
  const gameRetryEvent = new GameRetry({ deltaTime, result: result.value, retry: true });
  useFirebase().log(gameRetryEvent);
};

const handleClose = () => {
  emit('close');
};

const handleClickRetry = () => {
  logGameRetryEvent();
  userStore.value.resetAnswers();
  userStore.value.resetResults();
  handleClose();
};

const handleClickOpenIfood = () => {
  if (!merchantId.value || !itemId.value) {
    return;
  }
  const url = RESULT_IFOOD('city/merchant', merchantId.value, itemId.value);
  logApplicationCloseEvent(url);
  window.open(url);
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
