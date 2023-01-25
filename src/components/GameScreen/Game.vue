<template>
  <div class="Game">
    <Teller />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Teller from '@/components/Teller.vue';
import { getDeltaTime } from '@/utils/time';
import { useUserStore } from '@/stores/user';

onMounted(() => {
  const startTime = useUserStore().startTime;
  console.log(getDeltaTime(startTime));
});
</script>
