<template>
  <div class="teller">
    <button v-if="!deckCount" @click="handleClickRetry">Jogar de novo</button>
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
import { ref, watch, computed, onMounted } from 'vue';
import TellerReaction from '@/components/TellerReaction.vue';
import CardsDeck from '@/components/Cards/CardsDeck.vue';
import CardsTable from '@/components/Cards/CardsTable.vue';
import QuestionModal from '@/components/QuestionModal/QuestionModal.vue';
import { useFirebase } from '@/composables/firebase';

import { reactions } from '@/data/quotes';
import { getRandomInt } from '@/utils/math';
import UserAnswer from '@/services/analytics/events/UserAnswer';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { Question, Option } from '@/types/questions';
import { getDeltaTime } from '@/utils/time';
import { getCurrentQuestion } from '@/utils/questions';

const props = defineProps({
  cardDeckCount: {
    type: Number,
    required: true,
  },
});

const appStore = computed(() => useAppStore());
const userStore = computed(() => useUserStore());

const isModalOpen = ref(false);
const deckCount = ref(0);
const tableCount = ref(0);

const currentQuestion = computed(() => {
  switch (tableCount.value) {
    case 0:
      return Question.TYPE;
    case 1:
      return Question.CATEGORY;
    case 2:
      return props.cardDeckCount === 3 ? Question.FILLING_OR_TOPPING : Question.BRAND;
    case 4:
      return Question.FILLING_OR_TOPPING;
    default:
      return Question.TYPE;
  }
});
const questionAlternatives = computed(() =>
  getCurrentQuestion(currentQuestion.value, userStore.value.latestAnswer?.name)
);

const currentReaction = ref('');
const latestReactions = ref(new Array<number>());

const cards = ref(new Array<any>());

const logAnswerEvent = (optionChosen: string) => {
  const latestTimestamp = appStore.value.latestTimestamp;
  const deltaTime = getDeltaTime(latestTimestamp);
  const cardNumber = cards.value.length + 1;
  const optionA = questionAlternatives.value[0].label || '';
  const optionB = questionAlternatives.value[1].label || '';
  const userAnswerEvent = new UserAnswer({ deltaTime, cardNumber, optionA, optionB, optionChosen });
  useFirebase().log(userAnswerEvent);
};

const handleAddCard = (option: Option) => {
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

const handleAnswerQuestion = (option: Option) => {
  isModalOpen.value = false;
  logAnswerEvent(option.label);
  handleAddCard(option);
  appStore.value.pushCurrentTimestamp();
  userStore.value.pushLatestAnswer(option);
};

const handleResetGame = () => {
  deckCount.value = props.cardDeckCount;
  tableCount.value = 0;
  cards.value = [];
  latestReactions.value = [];
  currentReaction.value = '';
};

const handleClickRetry = () => {
  handleResetGame();
  userStore.value.resetAnswers();
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
