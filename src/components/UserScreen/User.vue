<template>
  <div class="user">
    <Bibliomancy class="animation--floating" />
    <div class="user__disclaimer">
      <h2>{{ $t('user.title') }}</h2>
      <div class="user__row">
        <h4 class="user__row__label">{{ $t('user.forms.name') }}</h4>
        <TextField
          class="user__row__input"
          :placeholder="$t('user.forms.namePlaceholder')"
          :value="userName"
          @change="handleInputName"
          @input="handleInputName"
        />
      </div>
      <div class="user__row">
        <h4 class="user__row__label">{{ $t('user.forms.location') }}</h4>
        <Button class="user__row__input" @click="handleOpenLocationModal">
          <MapPin class="user__pin--small" />
        </Button>
      </div>
      <Markdown :value="$t('user.disclaimer')" />
    </div>
    <Button :disabled="!canStartGame" @click="handleClickStart">{{ $t('user.start') }}</Button>
  </div>
  <LocationModal :open="isModalOpen" @located="handleLocated" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import LocationModal from '@/components/UserScreen/LocationModal.vue';
import TextField from '@/components/TextField.vue';
import MapPin from '@/assets/svgs/MapPin.vue';
import { useUserStore } from '@/stores/user';
import Button from '@/components/Button.vue';
import UserIdentified from '@/services/analytics/events/UserIdentified';
import UserClickMap from '@/services/analytics/events/UserClickMap';
import UserCloseMap from '@/services/analytics/events/UserCloseMap';
import { getDeltaTime } from '@/utils/time';
import Bibliomancy from '@/components/Illustrations/Bibliomancy.vue';
import { useAppStore } from '@/stores/app';
import { useFirebase } from '@/composables/firebase';
import Markdown from '@/components/Markdown.vue';

const userStore = computed(() => useUserStore());

const emit = defineEmits(['start']);

const isModalOpen = ref(false);
const userName = ref('');
const userLocation = ref();

const canStartGame = computed(() => !!userName.value && !!userLocation.value);

const logUserIdentifiedEvent = () => {
  const deltaTime = getDeltaTime(useAppStore().latestTimestamp);
  const userName = userStore.value.name;
  const { latitude, longitude } = userStore.value.location;
  const userIdentifiedEvent = new UserIdentified({
    deltaTime,
    userName,
    latitude: Number(latitude),
    longitude: Number(longitude),
  });
  useFirebase().log(userIdentifiedEvent);
};

const logUserClickMapEvent = () => {
  const userClickMapEvent = new UserClickMap();
  useFirebase().log(userClickMapEvent);
};

const logUserCloseMapEvent = () => {
  const userCloseMapEvent = new UserCloseMap();
  useFirebase().log(userCloseMapEvent);
};

const handleInputName = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    userName.value = event.target.value;
  }
};

const handleLocated = (location: any) => {
  logUserCloseMapEvent();
  userLocation.value = location;
  isModalOpen.value = false;
};

const handleClickStart = () => {
  userStore.value.setName(userName.value);
  logUserIdentifiedEvent();
  emit('start');
};

const handleOpenLocationModal = () => {
  logUserClickMapEvent();
  isModalOpen.value = true;
};
</script>

<style lang="scss">
.user {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 16px;
  color: $color-white;

  &__pin--small {
    height: 1rem;
    width: 1rem;
    color: $color-white;
  }

  &__row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem 0rem;

    @include screen-s {
      flex-direction: column;
    }

    &__label {
      margin: 0rem 1rem;
    }
  }
}
</style>
