import { defineStore } from 'pinia';

export const useIfoodStore = defineStore({
  id: 'ifood',
  state: () => ({
    searchResults: [],
  }),
});
