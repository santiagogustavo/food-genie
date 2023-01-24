<template>
  <div class="search-bar">
    <input type="text" @input="handleOnInput" />
    <button :disabled="isButtonDisabled" @click="handleOnSearch">Pesquisar</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ALIAS_SEARCH_ITEMS } from '@/constants/queries';
import { postSearch } from '@/services/genie';
import { useUserStore } from '@/stores/user';
import { getSearchResultsFromPayload } from '@/utils/ifood';
import { useFirebase } from '@/composables/firebase';

const query = ref('');
const userStore = computed(() => useUserStore());

const isButtonDisabled = computed(
  () => !userStore.value.location.latitude || !userStore.value.location.longitude
);

const handleOnInput = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    query.value = event.target.value;
  }
};

const handleOnSearch = () => {
  const { latitude, longitude } = userStore.value.location;
  postSearch({ alias: ALIAS_SEARCH_ITEMS, latitude, longitude, term: query.value, size: 20 })
    .then(({ data }) => {
      useFirebase().log('search_food', { latitude, longitude, term: query.value, success: true });
      console.log(getSearchResultsFromPayload(data));
    })
    .catch(error => {
      console.error(error);
    });
};
</script>

<style lang="scss">
.search-bar {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
