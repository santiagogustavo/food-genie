import { defineStore } from 'pinia';
import { ALIAS_SEARCH_ITEMS, SORT_RATING } from '@/constants/queries';
import { postSearch } from '@/services/genie';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { LoadState } from '@/types/state';
import { getSearchResultsFromPayload } from '@/utils/ifood';
import { TYPE } from '@/constants/questions';
import { MEAL } from '@/data/foodTypes';

type IfoodStore = {
  loadState: LoadState;
  results?: any;
  error?: Error;
};

export const useIfoodStore = defineStore({
  id: 'ifood',
  state: (): IfoodStore => ({
    loadState: LoadState.INIT,
    results: undefined,
    error: undefined,
  }),
  actions: {
    fetchResults() {
      const appStore = useAppStore();
      const userStore = useUserStore();
      const { latitude, longitude } = userStore.location;
      const answers = userStore.answers;

      const isDessertAlsoMeal =
        answers[0]?.name === TYPE.DESSERT && !!MEAL.find(meal => meal === answers[1]?.name);
      const term = isDessertAlsoMeal ? `${answers[1]?.label} doce` : answers[1]?.label;
      const categories = answers[1]?.name;
      const sort = SORT_RATING;

      if (!categories) {
        return Promise.reject();
      }

      appStore.setLoadState(LoadState.PENDING);
      this.loadState = LoadState.PENDING;
      return postSearch({
        alias: ALIAS_SEARCH_ITEMS,
        latitude,
        longitude,
        term,
        categories,
        sort,
        size: 20,
      })
        .then(({ data }) => {
          const results = getSearchResultsFromPayload(data);
          appStore.setLoadState(LoadState.RESOLVED);
          this.loadState = LoadState.RESOLVED;
          this.results = results;
          return Promise.resolve(results);
        })
        .catch(error => {
          appStore.setLoadState(LoadState.REJECTED);
          this.loadState = LoadState.REJECTED;
          this.error = error;
          throw error;
        });
    },
  },
  getters: {
    isLoading: state => state.loadState === LoadState.PENDING,
    hasResults: state => state.loadState === LoadState.RESOLVED,
  },
});
