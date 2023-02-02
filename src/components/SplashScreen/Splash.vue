<template>
  <div class="splash">
    <FortuneTeller class="animation--floating" />
    <Title>Food Genie</Title>
    <TellerReaction reaction="Você parece perdido e com fome... gostaria de jogar um jogo?" />
    <div class="splash__actions">
      <Button class="splash__button" @click="handleClickStart">Jogar agora</Button>
      <Button class="splash__button" @click="handleClickAbout">Sobre o jogo</Button>
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

const emit = defineEmits(['start']);

const isModalOpen = ref(false);

const handleClickStart = () => {
  emit('start');
};

const handleClickAbout = () => {
  isModalOpen.value = true;
};

const handleCloseModal = () => {
  isModalOpen.value = false;
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
