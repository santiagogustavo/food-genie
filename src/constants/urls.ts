// page: number
// size: number
export const ORDERS = '/v4/customers/me/orders?page={page}&size={size}';

// alias: CMS_RESULTS_MERCHANTS, CMS_RESULTS_ONE_PAGE
// latitude: number
// longitude: number
// term: string
// size: number
// categories: string (categories from filter)
export const SEARCH = '/search';

// alias: CMS_SEARCH_HOME
// latitude: number
// longitude: number
// channel: IFOOD
// size: number
export const SEARCH_HOME = '/search/home';

// categoryId: string
// latitude: number
// longitude: number
// channel: IFOOD
export const CATEGORY_PAGE = '/category';

// merchantId: string
// latitude: number
// longitude: number
export const MERCHANT_CATALOG = '/merchant';

export const RESULT_IFOOD = (slug: string, merchantId: string, itemId: string) =>
  `${import.meta.env.VITE_IFOOD_URL}/${slug}/${merchantId}?prato=${itemId}`;
