<template>
  <div class="teller">
    <button @click="handleAddCard">VIRAR CARTA</button>
    <TellerReaction class="teller__reaction" :reaction="currentReaction" />
    <CardsDeck class="teller__deck" :count="deckCount" />
    <CardsTable class="teller__table" :cards="cards" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import TellerReaction from '@/components/TellerReaction.vue';
import CardsDeck from '@/components/Cards/CardsDeck.vue';
import CardsTable from '@/components/Cards/CardsTable.vue';

import { reactions } from '@/data/quotes';
import { getRandomInt } from '@/utils/math';

const deckCount = ref(4);
const tableCount = ref(0);
const currentReaction = ref('');
const latestReactions = ref(new Array<number>());

const cards = ref(new Array<any>());

const handleAddCard = () => {
  if (deckCount.value === 0) {
    return;
  }
  tableCount.value = tableCount.value + 1;
  deckCount.value = deckCount.value - 1;

  cards.value = [...cards.value, { name: String(tableCount.value) }];
};

watch(
  () => tableCount.value,
  () => {
    let randomIndex = -1;
    do {
      randomIndex = getRandomInt(0, reactions.length - 1);
    } while (latestReactions.value.includes(randomIndex));
    latestReactions.value = [...latestReactions.value, randomIndex];
    currentReaction.value = reactions[randomIndex];
  }
);
</script>

<style lang="scss">
.teller {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__reaction {
    margin-top: 16px;
  }

  &__table {
    margin-top: 64px;
  }
}
</style>
