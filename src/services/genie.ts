import axios from 'axios';

import { CATEGORY_PAGE, MERCHANT_CATALOG, SEARCH, SEARCH_HOME } from '@/constants/urls';

const ifoodInstance = axios.create({
  baseURL: import.meta.env.VITE_GENIE_API,
  timeout: 15000,
});

type SearchQuery = {
  alias?: string;
  size?: number;
  latitude?: number;
  longitude?: number;
  term?: string;
  categories?: string;
  sort?: string;
  categoryId?: string;
  merchantId?: string;
};

export const postSearch = (query: SearchQuery) =>
  ifoodInstance.post(SEARCH, undefined, { params: { ...query, channel: 'IFOOD' } });

export const postSearchHome = (query: SearchQuery) =>
  ifoodInstance.post(SEARCH_HOME, undefined, { params: { ...query, channel: 'IFOOD' } });

export const postCategoryPage = (query: SearchQuery) =>
  ifoodInstance.post(CATEGORY_PAGE, undefined, { params: { ...query, channel: 'IFOOD' } });

export const postMerchantCatalog = (query: SearchQuery) =>
  ifoodInstance.post(MERCHANT_CATALOG, undefined, { params: { ...query, channel: 'IFOOD' } });
