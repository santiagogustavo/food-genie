<template>
  <LoadingScreen :loading="isLoading && !isErrorModalOpen" />
  <Splash v-if="currentPage === 0" @start="handleAskUser" />
  <User v-if="currentPage === 1" @start="handleStartGame" />
  <Game v-if="currentPage === 2" />
  <ErrorModal :open="isErrorModalOpen" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { v4 } from 'uuid';
import queryString from 'query-string';

import Splash from '@/components/SplashScreen/Splash.vue';
import User from '@/components/UserScreen/User.vue';
import Game from '@/components/GameScreen/Game.vue';
import LoadingScreen from '@/components/LoadingScreen/Loading.vue';
import { useFirebase } from '@/composables/firebase';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import ApplicationStart from '@/services/analytics/events/ApplicationStart';
import { getRandomArbitrary } from '@/utils/math';
import UserIdentified from '@/services/analytics/events/UserIdentified';
import { getDeltaTime } from '@/utils/time';
import ErrorModal from '@/components/ErrorScreen/ErrorModal.vue';

const appStore = computed(() => useAppStore());
const userStore = computed(() => useUserStore());
const firebase = computed(() => useFirebase());

const isErrorModalOpen = computed(() => appStore.value.isErrorModalOpen);

const currentPage = ref(0);
const isLoading = computed(() => appStore.value.isLoading);

const generateUserId = () => {
  const userId = v4();
  userStore.value.setUserId(userId);
  firebase.value.setUserId(userId);
};

const generateUserProperties = () => {
  const randomSeed = getRandomArbitrary(0, 1);
  const properties = { abTest: randomSeed <= 0.5 };
  userStore.value.setAbTest(properties.abTest);
  firebase.value.setUserProperties(properties);
};

const logUserIdentifiedEvent = () => {
  const deltaTime = getDeltaTime(appStore.value.latestTimestamp);
  const userName = userStore.value.name;
  const { latitude, longitude } = userStore.value.location;
  const userIdentifiedEvent = new UserIdentified({
    deltaTime,
    userName,
    latitude: Number(latitude),
    longitude: Number(longitude),
  });
  firebase.value.log(userIdentifiedEvent);
};

const logApplicationStartEvent = () => {
  const queryParams = queryString.parse(location.search);
  const origin = queryParams?.origin ? String(queryParams?.origin) : 'local';

  const applicationStartEvent = new ApplicationStart({ origin });
  firebase.value.log(applicationStartEvent);
};

const handleAskUser = () => {
  currentPage.value = 1;
};

const handleStartGame = () => {
  logUserIdentifiedEvent();
  currentPage.value = 2;
};

onMounted(async () => {
  appStore.value.pushCurrentTimestamp();
  generateUserId();
  generateUserProperties();
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
