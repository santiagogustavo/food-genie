import { defineStore } from 'pinia';
import { ALIAS_SEARCH_HOME, ALIAS_SEARCH_ITEMS } from '@/constants/queries';
import {
  postCategoryPage,
  postMerchantCatalog,
  postSearch,
  postSearchHome,
} from '@/services/genie';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { LoadState } from '@/types/state';
import { getItemsFromCatalogPayload, getSearchResultsFromPayload } from '@/utils/ifood';
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
    async handlePendingSearchResults() {
      const appStore = useAppStore();
      appStore.setLoadState(LoadState.PENDING);
      this.loadState = LoadState.PENDING;
    },
    handleResolveSearchResults(data: any) {
      const results = getSearchResultsFromPayload(data);

      const appStore = useAppStore();
      appStore.setLoadState(LoadState.RESOLVED);

      this.loadState = LoadState.RESOLVED;
      this.results = results;
      return Promise.resolve(results);
    },
    handleRejectSearchResults(error: any) {
      const appStore = useAppStore();
      appStore.setLoadState(LoadState.REJECTED);
      this.loadState = LoadState.REJECTED;
      this.error = error;
      throw error;
    },
    fetchCategories() {
      const ifoodStore = useIfoodStore();
      const userStore = useUserStore();
      const { latitude, longitude } = userStore.location;

      ifoodStore.handlePendingSearchResults();
      return postSearchHome({
        alias: ALIAS_SEARCH_HOME,
        latitude,
        longitude,
        size: 20,
      })
        .then(({ data }) => ifoodStore.handleResolveSearchResults(data))
        .catch(error => ifoodStore.handleRejectSearchResults(error));
    },
    fetchCategory(categoryId: string) {
      const ifoodStore = useIfoodStore();
      const userStore = useUserStore();
      const { latitude, longitude } = userStore.location;

      ifoodStore.handlePendingSearchResults();
      return postCategoryPage({
        categoryId,
        latitude,
        longitude,
      })
        .then(({ data }) => ifoodStore.handleResolveSearchResults(data))
        .catch(error => ifoodStore.handleRejectSearchResults(error));
    },
    fetchMerchantCatalog(merchantId: string) {
      const ifoodStore = useIfoodStore();
      const userStore = useUserStore();
      const { latitude, longitude } = userStore.location;

      // ifoodStore.handlePendingSearchResults();
      return postMerchantCatalog({
        merchantId,
        latitude,
        longitude,
      })
        .then(({ data }) => Promise.resolve(getItemsFromCatalogPayload(data)))
        .catch(error => ifoodStore.handleRejectSearchResults(error));
    },
    fetchResults() {
      const ifoodStore = useIfoodStore();
      const userStore = useUserStore();
      const { latitude, longitude } = userStore.location;
      const answers = userStore.answers;

      const isDessertAlsoMeal =
        answers[0]?.name === TYPE.DESSERT && !!MEAL.find(meal => meal === answers[1]?.name);
      const term = isDessertAlsoMeal ? `${answers[1]?.label} doce` : answers[1]?.label;
      const categories = answers[1]?.name;

      if (!categories) {
        return Promise.reject();
      }

      ifoodStore.handlePendingSearchResults();
      return postSearch({
        alias: ALIAS_SEARCH_ITEMS,
        latitude,
        longitude,
        term,
        categories,
        size: 20,
      })
        .then(({ data }) => ifoodStore.handleResolveSearchResults(data))
        .catch(error => ifoodStore.handleRejectSearchResults(error));
    },
  },
  getters: {
    isLoading: state => state.loadState === LoadState.PENDING,
    hasResults: state => state.loadState === LoadState.RESOLVED,
  },
});
