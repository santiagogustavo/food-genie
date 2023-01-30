import axios from 'axios';

import { SEARCH } from '@/constants/urls';

const ifoodInstance = axios.create({
  baseURL: import.meta.env.VITE_GENIE_API,
  timeout: 15000,
});

type SearchQuery = {
  alias: string;
  size: number;
  latitude?: number;
  longitude?: number;
  term?: string;
  categories?: string;
  sort?: string;
};

export const postSearch = (query: SearchQuery) =>
  ifoodInstance.post(SEARCH, undefined, { params: { ...query, channel: 'IFOOD' } });
