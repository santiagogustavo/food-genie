<template>
  <Splash v-if="currentPage === 0" @start="handleStartGame" />
  <Game v-if="currentPage === 1" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { v4 } from 'uuid';

import { useUserStore } from '@/stores/user';
import { useFirebase } from '@/composables/firebase';
import Splash from '@/components/SplashScreen/Splash.vue';
import Game from '@/components/GameScreen/Game.vue';

const currentPage = ref(0);

const handleStartGame = () => {
  currentPage.value = 1;
};

onMounted(() => {
  const userId = v4();
  useUserStore().setUserId(userId);
  useFirebase().setUserId(userId);
  useFirebase().log('hello');
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
