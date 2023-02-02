<template>
  <div class="teller">
    <TellerReaction class="teller__reaction" :reaction="currentReaction" />
    <CardsDeck class="teller__deck" :total="cardDeckCount" :count="deckCount" />
    <CardsTable class="teller__table" :cards="cards" />
  </div>
  <QuestionModal
    :alternatives="questionAlternatives"
    :open="canOpenModal"
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
  hasAnsweredAllQuestions: {
    type: Boolean,
    default: false,
  },
  cardDeckCount: {
    type: Number,
    required: true,
  },
  tellerTimeout: {
    type: Number,
    required: true,
  },
});

const appStore = computed(() => useAppStore());
const userStore = computed(() => useUserStore());

const isModalOpen = ref(false);
const canOpenModal = computed(
  () =>
    isModalOpen.value &&
    !!questionAlternatives.value &&
    !appStore.value.isLoading &&
    !appStore.value.isErrorModalOpen
);
const answers = computed(() => userStore.value.answers);
const tableCount = computed(() => answers.value.length);
const deckCount = computed(() => props.cardDeckCount - tableCount.value);

const currentQuestion = computed(() => {
  switch (tableCount.value) {
    case 0:
      return Question.TYPE;
    case 1:
      return Question.CATEGORY;
    case 2:
      return props.cardDeckCount === 3 ? Question.FILLING_OR_TOPPING : Question.BRAND;
    case 3:
      return Question.FILLING_OR_TOPPING;
    default:
      return Question.TYPE;
  }
});
const questionAlternatives = ref();

const currentReaction = ref('');
const latestReactions = ref(new Array<number>());

const cards = computed(() =>
  answers.value.map((answer: Option, index: number) => ({
    name: String(index + 1),
    label: answer.label,
  }))
);

const logAnswerEvent = (optionChosen: string) => {
  const latestTimestamp = appStore.value.latestTimestamp;
  const deltaTime = getDeltaTime(latestTimestamp);
  const cardNumber = answers.value.length + 1;
  const optionA = questionAlternatives?.value[0]?.label || '';
  const optionB = questionAlternatives?.value[1]?.label || '';
  const userAnswerEvent = new UserAnswer({ deltaTime, cardNumber, optionA, optionB, optionChosen });
  useFirebase().log(userAnswerEvent);
};

const handleAskQuestion = () => {
  isModalOpen.value = true;
};

const setCurrentResults = (option: Option) => {
  if (currentQuestion.value === Question.TYPE) {
    userStore.value.setResultsType(option.name);
  } else if (currentQuestion.value === Question.BRAND) {
    userStore.value.setResultsMerchant(option);
  } else if (currentQuestion.value === Question.FILLING_OR_TOPPING) {
    userStore.value.setResultsItem(option);
  }
};

const handleAnswerQuestion = (option: Option) => {
  isModalOpen.value = false;
  logAnswerEvent(option.label);
  setCurrentResults(option);
  appStore.value.pushCurrentTimestamp();
  userStore.value.pushLatestAnswer(option);
};

const handleResetGame = () => {
  latestReactions.value = [];
  currentReaction.value = '';
};

watch(
  () => answers.value.length,
  next => {
    if (next) {
      return;
    }
    handleResetGame();
  }
);

watch(
  () => props.hasAnsweredAllQuestions,
  next => {
    if (next) {
      return;
    }
    handleResetGame();
  }
);

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
    if (!next || props.hasAnsweredAllQuestions) {
      return;
    }
    setTimeout(() => {
      handleAskQuestion();
    }, props.tellerTimeout);
  }
);

watch(
  () => currentQuestion.value,
  async next => {
    const nextAlternatives = await getCurrentQuestion(next, userStore.value.latestAnswer?.name);
    if (!nextAlternatives) {
      return;
    }

    questionAlternatives.value = nextAlternatives;

    if (questionAlternatives.value[0]?.name === questionAlternatives?.value[1]?.name) {
      handleAnswerQuestion(questionAlternatives.value[0]);
    }
  }
);

onMounted(async () => {
  if (props.hasAnsweredAllQuestions) {
    return;
  }

  handleResetGame();
  questionAlternatives.value = await getCurrentQuestion(
    currentQuestion.value,
    userStore.value.latestAnswer?.name
  );
  setTimeout(() => {
    handleAskQuestion();
  }, props.tellerTimeout);
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
