<template>
  <Modal>
    <div class="about-modal">
      <TarotCard class="about-modal__tarot-card" />
      <h3>Sobre o jogo</h3>
      <section class="about-modal__info">
        <p>
          <b>Food Genie</b> é um projeto de conclusão de curso para a pós-graduação em Data Science
          e Analytics. Desenvolvido por <b>Gustavo Santiago</b> e sua orientadora
          <b>Profª Ana Claudia Belfort</b>.
        </p>
        <p>
          A cartomante é uma pessoa que, supostamente, adivinha o futuro, o presente e o passado,
          através da interpretação de cartas de um baralho. Criamos nossa própria cartomante para
          este jogo de adivinhação, que tem como objetivo fazer perguntas rápidas de
          <b>A ou B</b> para ajudar pessoas que <b>não sabem ou estão indecisas</b> sobre qual
          comida pedir.
        </p>
        <p>
          Utilizando informações públicas da plataforma iFood, o sistema faz de 3 a 4 perguntas e
          propõe uma saborosa resposta ao final.
          <b>
            O jogador não tem limite de quantas vezes consultar a cartomante, e nenhuma resposta é a
            mais certa ou errada (apenas a resposta mais incisiva dentro daquela sequência de
            cartas).
          </b>
        </p>
      </section>
      <br />
      <Button @click="handleClickClose">Ok, entendi!</Button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import TarotCard from '@/components/Illustrations/TarotCard.vue';
import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';

const emit = defineEmits(['close']);

const handleClickClose = () => {
  emit('close');
};
</script>

<style lang="scss">
.about-modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px;
  max-width: 400px;
  background-color: $color-black;
  color: $color-white;
  text-align: center;

  @include screen-s {
    max-width: 100%;
  }

  &__info {
    max-height: 40vh;
    max-width: 100%;
    margin-bottom: 16px;
    overflow: auto;
    text-align: justify;
  }

  &__tarot-card {
    width: $modal-image-size;
    height: $modal-image-size;
    color: $color-yellow;
    margin: auto;
  }
}
</style>
