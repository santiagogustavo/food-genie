<template>
  <Splash v-if="currentPage === 0" @start="handleStartGame" />
  <Game v-if="currentPage === 1" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { v4 } from 'uuid';
import queryString from 'query-string';

import Splash from '@/components/SplashScreen/Splash.vue';
import Game from '@/components/GameScreen/Game.vue';
import { useFirebase } from '@/composables/firebase';
import { useUserStore } from '@/stores/user';
import { getTimestamp } from '@/utils/time';
import ApplicationStart from '@/services/analytics/events/ApplicationStart';

const currentPage = ref(0);

const handleStartGame = () => {
  currentPage.value = 1;
};

onMounted(() => {
  useUserStore().setStartTime(getTimestamp());

  const userId = v4();
  useUserStore().setUserId(userId);
  useFirebase().setUserId(userId);

  const queryParams = queryString.parse(location.search);
  const origin = queryParams?.origin ? String(queryParams?.origin) : 'local';

  const applicationStartEvent = new ApplicationStart({ origin });
  useFirebase().log(applicationStartEvent);
});
</script>

<style lang="scss">
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
