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
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: $color-white;
  background: radial-gradient($color-purple, $color-purple-dark);

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

a {
  font-weight: 500;
  color: $color-yellow;
  text-decoration: inherit;
  font-weight: bold;
}

a:hover {
  color: lighten($color-yellow, 30%);
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
