<script setup lang="ts">
import { ref } from 'vue';

import SearchBar from '@/components/SearchBar.vue';
import Card from '@/components/Cards/PlayingCard.vue';
import CardsDeck from '@/components/Cards/CardsDeck.vue';
import CardsTable from '@/components/Cards/CardsTable.vue';
import { useUserStore } from '@/stores/user';
import { useFirebase } from '@/composables/firebase';

useUserStore().fetchCurrentLocation();
useFirebase().log('hello');

const deckCount = ref(4);
const tableCount = ref(0);

const handleAddCard = () => {
  if (deckCount.value === 0) {
    return;
  }
  tableCount.value = tableCount.value + 1;
  deckCount.value = deckCount.value - 1;
};
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <SearchBar />
  <button @click="handleAddCard">ADD</button>
  <div class="app-center">
    <CardsDeck :count="deckCount" />
    <CardsTable>
      <Card v-for="card in tableCount" :key="`card-${card}`" :name="`${card}`" />
    </CardsTable>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.app-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
