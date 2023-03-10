<template>
  <div class="splash">
    <FortuneTeller class="animation--floating" />
    <Title>{{ $t('splash.title') }}</Title>
    <TellerReaction :reaction="$t('splash.teller')" />
    <div class="splash__actions">
      <Button class="splash__button" @click="handleClickStart">
        {{ $t('splash.actions.start') }}
      </Button>
      <Button class="splash__button" @click="handleClickAbout">
        {{ $t('splash.actions.about') }}
      </Button>
    </div>
  </div>
  <AboutModal :open="isModalOpen" @close="handleCloseModal" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Title from '@/components/Title.vue';
import TellerReaction from '@/components/TellerReaction.vue';
import Button from '@/components/Button.vue';
import FortuneTeller from '@/components/Illustrations/FortuneTeller.vue';
import AboutModal from '@/components/SplashScreen/AboutModal.vue';
import ApplicationClickAbout from '@/services/analytics/events/ApplicationClickAbout';
import ApplicationCloseAbout from '@/services/analytics/events/ApplicationCloseAbout';
import { useFirebase } from '@/composables/firebase';
import { useAppStore } from '@/stores/app';
import ApplicationClickStart from '@/services/analytics/events/ApplicationClickStart';

const emit = defineEmits(['start']);

const isModalOpen = ref(false);

const logApplicationClickAboutEvent = () => {
  const applicationClickAboutEvent = new ApplicationClickAbout();
  useFirebase().log(applicationClickAboutEvent);
};

const logApplicationCloseAboutEvent = () => {
  const applicationCloseAboutEvent = new ApplicationCloseAbout();
  useFirebase().log(applicationCloseAboutEvent);
};

const logApplicationClickStartEvent = () => {
  const applicationClickStartEvent = new ApplicationClickStart();
  useFirebase().log(applicationClickStartEvent);
};

const handleClickStart = () => {
  emit('start');
  logApplicationClickStartEvent();
  useAppStore().pushCurrentTimestamp();
};

const handleClickAbout = () => {
  isModalOpen.value = true;
  logApplicationClickAboutEvent();
  useAppStore().pushCurrentTimestamp();
};

const handleCloseModal = () => {
  isModalOpen.value = false;
  logApplicationCloseAboutEvent();
  useAppStore().pushCurrentTimestamp();
};
</script>

<style lang="scss">
.splash {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;

  &__actions {
    margin-top: 32px;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  &__button {
    flex: 1;
    margin-top: 16px;
  }
}
</style>
