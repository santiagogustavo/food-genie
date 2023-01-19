<template>
  <div class="teller">
    <button v-if="!deckCount" @click="handleResetGame">Jogar de novo</button>
    <TellerReaction class="teller__reaction" :reaction="currentReaction" />
    <CardsDeck class="teller__deck" :count="deckCount" />
    <CardsTable class="teller__table" :cards="cards" />
  </div>
  <QuestionModal
    :alternatives="questionAlternatives"
    :open="isModalOpen"
    @answer="handleAnswerQuestion"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import TellerReaction from '@/components/TellerReaction.vue';
import CardsDeck from '@/components/Cards/CardsDeck.vue';
import CardsTable from '@/components/Cards/CardsTable.vue';
import QuestionModal from '@/components/QuestionModal/QuestionModal.vue';

import { reactions } from '@/data/quotes';
import { getRandomInt } from '@/utils/math';

const isModalOpen = ref(false);
const questionAlternatives = ref([
  { name: 'refeição', label: 'A' },
  { name: 'sobremesa', label: 'B' },
]);

const deckCount = ref(0);
const tableCount = ref(0);
const currentReaction = ref('');
const latestReactions = ref(new Array<number>());

const cards = ref(new Array<any>());

const handleAddCard = (option: any) => {
  if (deckCount.value === 0) {
    return;
  }
  tableCount.value = tableCount.value + 1;
  deckCount.value = deckCount.value - 1;

  cards.value = [...cards.value, { name: String(tableCount.value), label: option.label }];
};

const handleAskQuestion = () => {
  isModalOpen.value = true;
};

const handleAnswerQuestion = (option: any) => {
  isModalOpen.value = false;
  handleAddCard(option);
};

const handleResetGame = () => {
  deckCount.value = 4;
  tableCount.value = 0;
  cards.value = [];
  latestReactions.value = [];
  currentReaction.value = '';
};

watch(
  () => tableCount.value,
  next => {
    if (!next) {
      return;
    }
    let randomIndex = -1;
    do {
      randomIndex = getRandomInt(0, reactions.length - 1);
    } while (latestReactions.value.includes(randomIndex));
    latestReactions.value = [...latestReactions.value, randomIndex];
    currentReaction.value = reactions[randomIndex];
  }
);

watch(
  () => deckCount.value,
  next => {
    if (!next) {
      return;
    }
    setTimeout(() => {
      handleAskQuestion();
    }, 1000);
  }
);

onMounted(() => {
  handleResetGame();
});
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
