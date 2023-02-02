<template>
  <img
    class="crystal-ball"
    alt="Crystal ball icons created by Freepik - Flaticon"
    :src="CrystalBallImg"
  />
</template>

<script setup lang="ts">
import CrystalBallImg from '@/assets/images/crystal-ball.png';
</script>

<style lang="scss">
.crystal-ball {
  width: 150px;
  height: 150px;

  @include screen-s {
    width: 125px;
    height: 125px;
  }
}
</style>
