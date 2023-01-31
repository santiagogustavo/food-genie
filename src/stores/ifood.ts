import { defineStore } from 'pinia';
import { ALIAS_SEARCH_HOME } from '@/constants/queries';
import { postCategoryPage, postMerchantCatalog, postSearchHome } from '@/services/genie';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { LoadState } from '@/types/state';
import { getItemsFromCatalogPayload, getSearchResultsFromPayload } from '@/utils/ifood';

type IfoodStore = {
  loadState: LoadState;
  categories?: any;
  merchants?: any;
  catalog?: any;
  error?: Error;
};

export const useIfoodStore = defineStore({
  id: 'ifood',
  state: (): IfoodStore => ({
    loadState: LoadState.INIT,
    categories: undefined,
    merchants: undefined,
    catalog: undefined,
    error: undefined,
  }),
  actions: {
    async handlePendingSearchResults() {
      const appStore = useAppStore();
      appStore.setLoadState(LoadState.PENDING);
      this.loadState = LoadState.PENDING;
    },
    handleResolveSearchResults(results: any, key: string) {
      const appStore = useAppStore();
      appStore.setLoadState(LoadState.RESOLVED);

      this.loadState = LoadState.RESOLVED;

      if (key === 'categories') {
        this.categories = results;
      } else if (key === 'merchants') {
        this.merchants = results;
      } else if (key === 'catalog') {
        this.catalog = results;
      }
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
        .then(({ data }) =>
          ifoodStore.handleResolveSearchResults(getSearchResultsFromPayload(data), 'categories')
        )
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
        .then(({ data }) =>
          ifoodStore.handleResolveSearchResults(getSearchResultsFromPayload(data), 'merchants')
        )
        .catch(error => ifoodStore.handleRejectSearchResults(error));
    },
    fetchMerchantCatalog(merchantId: string) {
      const ifoodStore = useIfoodStore();
      const userStore = useUserStore();
      const { latitude, longitude } = userStore.location;

      ifoodStore.handlePendingSearchResults();
      return postMerchantCatalog({
        merchantId,
        latitude,
        longitude,
      })
        .then(({ data }) =>
          ifoodStore.handleResolveSearchResults(getItemsFromCatalogPayload(data), 'catalog')
        )
        .catch(error => ifoodStore.handleRejectSearchResults(error));
    },
  },
  getters: {
    isLoading: state => state.loadState === LoadState.PENDING,
    hasResults: state => state.loadState === LoadState.RESOLVED,
  },
});
