import { defineStore } from 'pinia';
import { LoadState } from '@/types/state';
import { getCurrentLocation } from '@/utils/geolocation';
import { Option } from '@/types/questions';

type UserStore = {
  id: string;
  abTest: boolean;
  location: {
    latitude?: number;
    longitude?: number;
  };
  answers: Array<Option>;
  loadState: LoadState;
  error?: Error;
};

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserStore => ({
    id: 'undefined',
    abTest: false,
    location: {},
    answers: [],
    loadState: LoadState.INIT,
    error: undefined,
  }),
  actions: {
    setUserId(userId: string) {
      this.id = userId;
    },
    setAbTest(abTest: boolean) {
      this.abTest = abTest;
    },
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
    pushLatestAnswer(answer: Option) {
      this.answers = [...this.answers, answer];
    },
    resetAnswers() {
      this.answers = [];
    },
  },
  getters: {
    isLoading: state => state.loadState === LoadState.PENDING,
    latestAnswer: state => state.answers[state.answers.length - 1],
  },
});
