<template>
  <img
    class="fortune-teller"
    alt="Crystal ball icons created by Freepik - Flaticon"
    :src="FortuneTellerImg"
  />
</template>

<script setup lang="ts">
import FortuneTellerImg from '@/assets/images/fortune-teller.png';
</script>

<style lang="scss">
.fortune-teller {
  width: 200px;
  height: 200px;
}
</style>
