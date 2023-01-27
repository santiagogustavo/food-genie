<template>
  <div class="splash">
    <Title>Food Genie</Title>
    <TellerReaction reaction="Você parece perdido, gostaria de jogar um jogo?" />
    <button class="splash__button" @click="handleClickStart">Jogar</button>
  </div>
</template>

<script setup lang="ts">
import Title from '@/components/Title.vue';
import TellerReaction from '@/components/TellerReaction.vue';

const emit = defineEmits(['start']);

const handleClickStart = () => {
  emit('start');
};
</script>

<style lang="scss">
.splash {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;

  &__button {
    margin-top: 16px;
  }
}
</style>
