<template>
  <Modal>
    <div class="location-modal">
      <MapPin class="location-modal__pin" />
      <h3>{{ $t('user.locationModal.title') }}</h3>
      <Markdown
        v-if="hasError"
        class="location-modal__error"
        :value="$t('user.locationModal.error')"
      />
      <br />
      <Button @click="handleFetchLocation">{{ $t('user.locationModal.locate') }}</Button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import MapPin from '@/assets/svgs/MapPin.vue';

import Modal from '@/components/Modal.vue';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { LoadState } from '@/types/state';
import Button from '@/components/Button.vue';
import Markdown from '@/components/Markdown.vue';

const appStore = computed(() => useAppStore());
const userStore = computed(() => useUserStore());
const hasError = ref(false);

const emit = defineEmits(['located']);

const handleLocated = (location: any) => {
  emit('located', location);
};

const handleFetchLocation = async () => {
  hasError.value = false;
  appStore.value.setLoadState(LoadState.PENDING);
  userStore.value
    .fetchCurrentLocation()
    .then((location: any) => {
      appStore.value.setLoadState(LoadState.RESOLVED);
      handleLocated(location);
    })
    .catch(() => {
      appStore.value.setLoadState(LoadState.REJECTED);
      hasError.value = true;
    });
};
</script>

<style lang="scss">
.location-modal {
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

  &__pin {
    width: $modal-image-size;
    height: $modal-image-size;
    color: $color-yellow;
    margin: auto;
  }

  &__error {
    color: $color-card-red;
  }
}
</style>
