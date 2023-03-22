<template>
  <div class="game">
    <Teller
      :has-answered-all-questions="hasResults"
      :card-deck-count="cardDeckCount"
      :teller-timeout="tellerTimeout"
    />
  </div>
  <ResultModal
    :open="isResultModalOpen"
    @close="handleCloseResultModal"
    @like="handleLikeDislike"
    @dislike="handleLikeDislike"
  />
  <LikeModal
    :open="isLikeDislikeModalOpen && satisfied"
    @open="handleOpenIfood"
    @retry="handleRetry"
  />
  <DislikeModal
    :open="isLikeDislikeModalOpen && !satisfied"
    @open="handleOpenIfood"
    @retry="handleRetry"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';

import ResultModal from '@/components/ResultScreen/ResultModal.vue';
import Teller from '@/components/Teller.vue';
import { getDeltaTime } from '@/utils/time';
import { useAppStore } from '@/stores/app';
import { useFirebase } from '@/composables/firebase';
import ApplicationClose from '@/services/analytics/events/ApplicationClose';
import GameStart from '@/services/analytics/events/GameStart';
import GameEnd from '@/services/analytics/events/GameEnd';
import GameRetry from '@/services/analytics/events/GameRetry';
import { useUserStore } from '@/stores/user';
import LikeModal from '@/components/ResultScreen/LikeModal.vue';
import DislikeModal from '@/components/ResultScreen/DislikeModal.vue';
import { RESULT_IFOOD } from '@/constants/urls';
import { useIfoodStore } from '@/stores/ifood';

const isResultModalOpen = ref(false);
const isLikeDislikeModalOpen = ref(false);

const tellerTimeout = 2500;

const appStore = computed(() => useAppStore());
const userStore = computed(() => useUserStore());

const abTest = computed(() => userStore.value.abTest);
const cardDeckCount = computed(() => (abTest.value ? 4 : 3));
const satisfied = computed(() => userStore.value.satisfied);
const hasResults = computed(() => userStore.value.hasResults);
const merchantId = computed(() => userStore.value.results.merchant?.name);
const itemId = computed(() => userStore.value.results.item?.name);
const result = computed(() => userStore.value.stringifiedResult);

const logApplicationCloseEvent = (destination: string) => {
  const deltaTime = getDeltaTime(useAppStore().timestamps[0]);
  const applicationCloseEvent = new ApplicationClose({ deltaTime, destination });
  useFirebase().log(applicationCloseEvent);
};

const logGameStartEvent = () => {
  const deltaTime = getDeltaTime(appStore.value.latestTimestamp);
  const gameStartEvent = new GameStart({
    deltaTime,
    cardDeckCount: cardDeckCount.value,
  });
  useFirebase().log(gameStartEvent);
};

const logGameEndEvent = () => {
  const deltaTime = getDeltaTime(appStore.value.gameStartTimestamp);
  const result = userStore.value.stringifiedResult;
  const gameEndEvent = new GameEnd({
    deltaTime,
    result,
  });
  useFirebase().log(gameEndEvent);
};

const logGameRetryEvent = () => {
  const deltaTime = getDeltaTime(useAppStore().latestTimestamp);
  const gameRetryEvent = new GameRetry({ deltaTime, result: result.value, error: false });
  useFirebase().log(gameRetryEvent);
};

const handleCloseResultModal = () => {
  isResultModalOpen.value = false;
};

const handleCloseLikeDislikeModal = () => {
  isLikeDislikeModalOpen.value = false;
};

const handleRetry = () => {
  logGameRetryEvent();
  userStore.value.resetAnswers();
  userStore.value.resetResults();
  handleCloseLikeDislikeModal();
};

const handleOpenIfood = () => {
  if (!merchantId.value || !itemId.value) {
    return;
  }
  const slug = String(useIfoodStore().getMerchantSlug(merchantId.value)) || 'city/merchant';
  const url = RESULT_IFOOD(slug, merchantId.value, itemId.value);
  logApplicationCloseEvent(url);
  window.open(url);
};

const handleGameEnd = () => {
  logGameEndEvent();
  setTimeout(() => {
    isResultModalOpen.value = true;
  }, tellerTimeout);
};

const handleLikeDislike = () => {
  isResultModalOpen.value = false;
  isLikeDislikeModalOpen.value = true;
};

watch(
  () => hasResults.value,
  next => {
    if (!next) {
      return;
    }
    handleGameEnd();
  }
);

onMounted(() => {
  if (hasResults.value) {
    handleGameEnd();
  }
  logGameStartEvent();
  appStore.value.pushCurrentTimestamp();
});
</script>
