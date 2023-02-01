<template>
  <div class="user">
    <div class="user__disclaimer">
      <h2>Primeiro, precisamos te perguntar...</h2>
      <div class="user__row">
        <h4 class="user__row__label">Seu nome:</h4>
        <TextField
          class="user__row__input"
          placeholder="Digite aqui"
          :value="userName"
          @change="handleInputName"
          @input="handleInputName"
        />
      </div>
      <div class="user__row">
        <h4 class="user__row__label">Sua localização:</h4>
        <button class="user__row__input" @click="handleOpenLocationModal">
          <MapPin class="user__pin--small" />
        </button>
      </div>
      <p>Não se preocupe, <b>seus dados pessoais não serão armazenados!</b></p>
    </div>
    <button :disabled="!canStartGame" @click="handleClickStart()">Ok, tudo pronto!</button>
  </div>
  <LocationModal :open="isModalOpen" @located="handleLocated" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import LocationModal from '@/components/UserScreen/LocationModal.vue';
import TextField from '@/components/TextField.vue';
import MapPin from '@/assets/svgs/MapPin.vue';
import { useUserStore } from '@/stores/user';

const userStore = computed(() => useUserStore());

const emit = defineEmits(['start']);

const isModalOpen = ref(false);
const userName = ref('');
const userLocation = ref();

const canStartGame = computed(() => !!userName.value && !!userLocation.value);

const handleInputName = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    userName.value = event.target.value;
  }
};

const handleLocated = (location: any) => {
  userLocation.value = location;
  isModalOpen.value = false;
};

const handleClickStart = () => {
  userStore.value.setName(userName.value);
  emit('start');
};

const handleOpenLocationModal = () => {
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
