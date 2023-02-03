import { defineStore } from 'pinia';
import { LoadState } from '@/types/state';
import { getCurrentLocation } from '@/utils/geolocation';
import { Option } from '@/types/questions';

type UserStore = {
  id: string;
  abTest: boolean;
  name: string;
  location: {
    latitude?: number;
    longitude?: number;
  };
  answers: Array<Option>;
  results: {
    type?: string;
    merchant?: Option;
    item?: Option;
  };
  satisfied: boolean;
  score: number;
  loadState: LoadState;
  error?: Error;
};

const hasResults = (state: any) => !!state.results.merchant && !!state.results.item;

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserStore => ({
    id: 'undefined',
    abTest: false,
    name: '',
    location: {},
    answers: [],
    results: {
      type: undefined,
      merchant: undefined,
      item: undefined,
    },
    satisfied: false,
    score: -1,
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
    setName(name: string) {
      this.name = name;
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
    setResultsType(type: string) {
      this.results.type = type;
    },
    setResultsMerchant(merchant: Option) {
      this.results.merchant = merchant;
    },
    setResultsItem(item: Option) {
      this.results.item = item;
    },
    setUserSatisfied(satisfied: boolean) {
      this.satisfied = satisfied;
    },
    setScore(score: number) {
      this.score = score;
    },
    fetchCurrentLocation() {
      const userStore = useUserStore();

      userStore.setLoadState(LoadState.PENDING);
      return getCurrentLocation()
        .then(({ coords }: any) => {
          userStore.setLoadState(LoadState.RESOLVED);
          userStore.setLocation(coords);
          return Promise.resolve(coords);
        })
        .catch((error: Error) => {
          userStore.setLoadState(LoadState.REJECTED);
          userStore.setError(error);
          throw error;
        });
    },
    pushLatestAnswer(answer: Option) {
      this.answers = [...this.answers, answer];
    },
    resetAnswers() {
      this.answers = [];
    },
    resetResults() {
      this.results = {
        type: undefined,
        merchant: undefined,
        item: undefined,
      };
    },
  },
  getters: {
    isLoading: state => state.loadState === LoadState.PENDING,
    latestAnswer: state => state.answers[state.answers.length - 1],
    hasResults: state => hasResults(state),
    stringifiedResult: state =>
      hasResults(state) ? `${state.results.merchant?.label} - ${state.results.item?.label}` : '',
  },
});
