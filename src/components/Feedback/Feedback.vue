<template>
  <div class="feedback">
    <b>{{ $t('app.feedback') }}</b>
    <Rating :score="score" @rate="handleRate" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import Rating from '@/components/Feedback/Rating.vue';
import UserFeedback from '@/services/analytics/events/UserFeedback';
import { getDeltaTime } from '@/utils/time';
import { useAppStore } from '@/stores/app';
import { useFirebase } from '@/composables/firebase';

const userStore = computed(() => useUserStore());
const score = computed(() => userStore.value.score);

const logUserFeedbackEvent = (score: number) => {
  const deltaTime = getDeltaTime(useAppStore().latestTimestamp);
  const result = userStore.value.stringifiedResult;
  const satisfied = userStore.value.satisfied;

  const userFeedbackEvent = new UserFeedback({ deltaTime, satisfied, result, score });
  useFirebase().log(userFeedbackEvent);
};

const handleRate = (score: number) => {
  logUserFeedbackEvent(score);
  userStore.value.setScore(score);
};
</script>

<style lang="scss">
.feedback {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
