<template>
  <SearchBar />
  <Splash v-if="currentPage === 0" @start="handleStartGame" />
  <Game v-if="currentPage === 1" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useUserStore } from '@/stores/user';
import { useFirebase } from '@/composables/firebase';
import Splash from '@/components/SplashScreen/Splash.vue';
import Game from '@/components/GameScreen/Game.vue';
import SearchBar from '@/components/SearchBar.vue';

useUserStore().fetchCurrentLocation();
useFirebase().log('hello');

const currentPage = ref(0);

const handleStartGame = () => {
  currentPage.value = 1;
};
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
