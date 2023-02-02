<template>
  <img
    class="tarot-card"
    alt="Tarot card icons created by Freepik - Flaticon"
    :src="TarotCardImg"
  />
</template>

<script setup lang="ts">
import TarotCardImg from '@/assets/images/tarot-card.png';
</script>

<style lang="scss">
.tarot-card {
  width: 50px;
  height: 50px;
}
</style>
