<template>
  <div class="splash">
    <Title>Food Genie</Title>
    <TellerReaction reaction="Você parece perdido, gostaria de jogar um jogo?" />
    <Button class="splash__button" @click="handleClickStart">Jogar</Button>
  </div>
</template>

<script setup lang="ts">
import Title from '@/components/Title.vue';
import TellerReaction from '@/components/TellerReaction.vue';
import Button from '@/components/Button.vue';

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
