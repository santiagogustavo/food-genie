<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue';
import Teller from '@/components/Teller.vue';

import { useUserStore } from '@/stores/user';
import { useFirebase } from '@/composables/firebase';

useUserStore().fetchCurrentLocation();
useFirebase().log('hello');
</script>

<template>
  <SearchBar />
  <Teller />
</template>

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
