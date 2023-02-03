<template>
  <img
    class="thumbs-down"
    alt="Thumbs down icons created by Freepik - Flaticon"
    :src="ThumbsDownImg"
  />
</template>

<script setup lang="ts">
import ThumbsDownImg from '@/assets/images/thumbs-down.png';
</script>

<style lang="scss">
.thumbs-down {
  width: 42px;
  height: 42px;
}
</style>
