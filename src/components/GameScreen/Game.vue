<template>
  <div class="game">
    <div v-if="hasResults" class="game__actions">
      <button @click="handleClickOpenIfood">Abrir resultado</button>
      <button @click="handleClickRetry">Jogar de novo</button>
    </div>
    <Teller :has-answered-all-questions="hasResults" :card-deck-count="cardDeckCount" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch } from 'vue';

import Teller from '@/components/Teller.vue';
import { getDeltaTime } from '@/utils/time';
import { useAppStore } from '@/stores/app';
import { useFirebase } from '@/composables/firebase';
import GameStart from '@/services/analytics/events/GameStart';
import GameEnd from '@/services/analytics/events/GameEnd';
import { useUserStore } from '@/stores/user';
import { RESULT_IFOOD } from '@/constants/urls';

const appStore = computed(() => useAppStore());
const userStore = computed(() => useUserStore());

const abTest = computed(() => userStore.value.abTest);
const cardDeckCount = computed(() => (abTest.value ? 4 : 3));

const hasResults = computed(() => userStore.value.hasResults);

const merchantId = computed(() => userStore.value.results.merchant?.name);
const itemId = computed(() => userStore.value.results.item?.name);

const logGameStartEvent = () => {
  const deltaTime = getDeltaTime(appStore.value.latestTimestamp);
  const gameStartEvent = new GameStart({
    deltaTime,
    cardDeckCount: cardDeckCount.value,
  });
  useFirebase().log(gameStartEvent);
};

const logGameEndEvent = () => {
  const deltaTime = getDeltaTime(
    appStore.value.timestamps[appStore.value.timestamps.length - cardDeckCount.value - 1]
  );
  const result = userStore.value.stringifiedResult;
  const gameEndEvent = new GameEnd({
    deltaTime,
    result,
  });
  useFirebase().log(gameEndEvent);
};

const handleClickOpenIfood = () => {
  if (!merchantId.value || !itemId.value) {
    return;
  }
  const slug = 'city/merchant';
  window.open(RESULT_IFOOD(slug, merchantId.value, itemId.value));
};

const handleClickRetry = () => {
  userStore.value.resetAnswers();
  userStore.value.resetResults();
};

watch(
  () => hasResults.value,
  next => {
    if (!next) {
      return;
    }
    logGameEndEvent();
  }
);

onMounted(() => {
  logGameStartEvent();
  appStore.value.pushCurrentTimestamp();
});
</script>

<style lang="scss">
.game {
  &__actions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    button {
      flex: 1;
      max-width: 300px;
    }
  }
}
</style>
