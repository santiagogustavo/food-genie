<template>
  <div class="Game">
    <Teller :card-deck-count="cardDeckCount" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import Teller from '@/components/Teller.vue';
import { getDeltaTime } from '@/utils/time';
import { useAppStore } from '@/stores/app';
import { useFirebase } from '@/composables/firebase';
import GameStart from '@/services/analytics/events/GameStart';
import { useUserStore } from '@/stores/user';

const appStore = computed(() => useAppStore());
const userStore = computed(() => useUserStore());

const abTest = computed(() => userStore.value.abTest);
const cardDeckCount = computed(() => (abTest.value ? 4 : 3));

const logGameStartEvent = () => {
  const deltaTime = getDeltaTime(appStore.value.latestTimestamp);
  const gameStartEvent = new GameStart({
    deltaTime,
    cardDeckCount: cardDeckCount.value,
  });
  useFirebase().log(gameStartEvent);
};

onMounted(() => {
  logGameStartEvent();
  appStore.value.pushCurrentTimestamp();
});
</script>
