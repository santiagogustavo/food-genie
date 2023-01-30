<template>
  <LoadingScreen :loading="isLoading" />
  <Splash v-if="currentPage === 0" @start="handleStartGame" />
  <Game v-if="currentPage === 1" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { v4 } from 'uuid';
import queryString from 'query-string';

import Splash from '@/components/SplashScreen/Splash.vue';
import Game from '@/components/GameScreen/Game.vue';
import LoadingScreen from '@/components/LoadingScreen/Loading.vue';
import { useFirebase } from '@/composables/firebase';
import { REMOTE_CONFIGS } from '@/constants/remoteConfigs';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import ApplicationStart from '@/services/analytics/events/ApplicationStart';
import { LoadState } from '@/types/state';

const appStore = computed(() => useAppStore());
const userStore = computed(() => useUserStore());
const firebase = computed(() => useFirebase());

const currentPage = ref(0);
const isLoading = computed(() => appStore.value.isLoading);

const handleStartGame = () => {
  currentPage.value = 1;
};

const generateUserId = () => {
  const userId = v4();
  userStore.value.setUserId(userId);
  firebase.value.setUserId(userId);
};

const fetchAbTest = async () => {
  appStore.value.setLoadState(LoadState.PENDING);
  const abTest = await firebase.value.getBoolean(REMOTE_CONFIGS.BRANDS_AB);
  userStore.value.setAbTest(abTest);
  appStore.value.setLoadState(LoadState.RESOLVED);
};

const logApplicationStartEvent = () => {
  const queryParams = queryString.parse(location.search);
  const origin = queryParams?.origin ? String(queryParams?.origin) : 'local';

  const applicationStartEvent = new ApplicationStart({ origin });
  firebase.value.log(applicationStartEvent);
};

onMounted(async () => {
  userStore.value.fetchCurrentLocation();
  appStore.value.pushCurrentTimestamp();
  generateUserId();
  await fetchAbTest();
  logApplicationStartEvent();
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
