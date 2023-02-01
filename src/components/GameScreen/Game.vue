<template>
  <div class="game">
    <Teller
      :has-answered-all-questions="hasResults"
      :card-deck-count="cardDeckCount"
      :teller-timeout="tellerTimeout"
    />
  </div>
  <ResultModal :open="isModalOpen" @close="handleCloseResultModal" />
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

const isModalOpen = ref(false);
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
  isModalOpen.value = false;
};

watch(
  () => hasResults.value,
  next => {
    if (!next) {
      return;
    }
    logGameEndEvent();
    setTimeout(() => {
      isModalOpen.value = true;
    }, tellerTimeout);
  }
);

onMounted(() => {
  logGameStartEvent();
  appStore.value.pushCurrentTimestamp();
});
</script>
