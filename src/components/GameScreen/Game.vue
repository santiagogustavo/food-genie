<template>
  <div class="game">
    <Teller
      :has-answered-all-questions="hasResults"
      :card-deck-count="cardDeckCount"
      :teller-timeout="tellerTimeout"
    />
  </div>
  <ResultModal :open="isResultModalOpen" @close="handleCloseResultModal" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';

import ResultModal from '@/components/ResultScreen/ResultModal.vue';
import Teller from '@/components/Teller.vue';
import { getDeltaTime } from '@/utils/time';
import { useAppStore } from '@/stores/app';
import { useFirebase } from '@/composables/firebase';
import GameStart from '@/services/analytics/events/GameStart';
import GameEnd from '@/services/analytics/events/GameEnd';
import { useUserStore } from '@/stores/user';

const isResultModalOpen = ref(false);
const tellerTimeout = 1000;

const appStore = computed(() => useAppStore());
const userStore = computed(() => useUserStore());

const abTest = computed(() => userStore.value.abTest);
const cardDeckCount = computed(() => (abTest.value ? 4 : 3));

const hasResults = computed(() => userStore.value.hasResults);

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

const handleCloseResultModal = () => {
  isResultModalOpen.value = false;
};

const handleGameEnd = () => {
  logGameEndEvent();
  setTimeout(() => {
    isResultModalOpen.value = true;
  }, tellerTimeout);
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
