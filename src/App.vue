<template>
  <Splash v-if="currentPage === 0" @start="handleStartGame" />
  <Game v-if="currentPage === 1" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { v4 } from 'uuid';
import queryString from 'query-string';

import Splash from '@/components/SplashScreen/Splash.vue';
import Game from '@/components/GameScreen/Game.vue';
import { useFirebase } from '@/composables/firebase';
import { REMOTE_CONFIGS } from '@/constants/remoteConfigs';
import { useUserStore } from '@/stores/user';
import { getTimestamp } from '@/utils/time';
import ApplicationStart from '@/services/analytics/events/ApplicationStart';

const currentPage = ref(0);

const userStore = computed(() => useUserStore());
const firebase = computed(() => useFirebase());

const handleStartGame = () => {
  currentPage.value = 1;
};

onMounted(async () => {
  userStore.value.setStartTime(getTimestamp());

  const userId = v4();
  userStore.value.setUserId(userId);
  firebase.value.setUserId(userId);

  const abTest = await firebase.value.getBoolean(REMOTE_CONFIGS.BRANDS_AB);
  userStore.value.setAbTest(abTest);

  const queryParams = queryString.parse(location.search);
  const origin = queryParams?.origin ? String(queryParams?.origin) : 'local';

  const applicationStartEvent = new ApplicationStart({ origin });
  firebase.value.log(applicationStartEvent);
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
