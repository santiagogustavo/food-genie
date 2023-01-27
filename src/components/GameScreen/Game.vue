<template>
  <div class="Game">
    <Teller />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Teller from '@/components/Teller.vue';
import { getDeltaTime } from '@/utils/time';
import { useAppStore } from '@/stores/app';

onMounted(() => {
  const startTime = useAppStore().latestTimestamp;
  console.log(getDeltaTime(startTime));
});
</script>
