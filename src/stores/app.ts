import { defineStore } from 'pinia';
import { LoadState } from '@/types/state';
import { getTimestamp } from '@/utils/time';
import { useUserStore } from '@/stores/user';

type AppStore = {
  loadState: LoadState;
  timestamps: Array<string>;
  error?: Error;
  isErrorModalOpen: boolean;
};
export const useAppStore = defineStore({
  id: 'app',
  state: (): AppStore => ({
    loadState: LoadState.INIT,
    timestamps: [],
    isErrorModalOpen: false,
  }),
  actions: {
    setLoadState(loadState: LoadState) {
      this.loadState = loadState;
    },
    setIsErrorModalOpen(isErrorModalOpen: boolean) {
      this.isErrorModalOpen = isErrorModalOpen;
    },
    pushCurrentTimestamp() {
      this.timestamps = [...this.timestamps, getTimestamp()];
    },
  },
  getters: {
    isLoading: state => state.loadState === LoadState.PENDING,
    latestTimestamp: state => state.timestamps[state.timestamps.length - 1],
    gameStartTimestamp: state => {
      const answerCount = useUserStore().answers.length;
      return state.timestamps[state.timestamps.length - answerCount - 1];
    },
  },
});
