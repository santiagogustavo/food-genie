import { defineStore } from 'pinia';
import { LoadState } from '@/types/state';
import { getCurrentLocation } from '@/utils/geolocation';

type UserStore = {
  location: {
    latitude?: number;
    longitude?: number;
  };
  loadState: LoadState;
  error?: Error;
};

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserStore => ({
    location: {},
    loadState: LoadState.INIT,
    error: undefined,
  }),
  actions: {
    setLocation(location: GeolocationCoordinates) {
      this.location = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
    },
    setLoadState(state: LoadState) {
      this.loadState = state;
    },
    setError(error: Error) {
      this.error = error;
    },
    fetchCurrentLocation() {
      const userStore = useUserStore();

      userStore.setLoadState(LoadState.PENDING);
      return getCurrentLocation()
        .then(({ coords }: any) => {
          userStore.setLoadState(LoadState.RESOLVED);
          userStore.setLocation(coords);
          return coords;
        })
        .catch((error: Error) => {
          userStore.setLoadState(LoadState.REJECTED);
          userStore.setError(error);
          return error;
        });
    },
  },
  getters: {
    isLoading: state => state.loadState === LoadState.PENDING,
  },
});