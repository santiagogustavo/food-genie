import queryString from 'query-string';
import { TYPE } from '@/constants/questions';
import { MEAL, DESSERT } from '@/data/foodTypes';
import { categories } from '@/data/filters';
import { BLACKLIST, WHITELIST } from '@/constants/blacklist';
import { useUserStore } from '@/stores/user';

export const getCategoryIdFromAction = (action: string) =>
  queryString.parse(action.replace('page?', '')).identifier;

export const getMerchantIdFromAction = (action: string) =>
  queryString.parse(action.replace('merchant?', '')).identifier;

export const getMerchantSlugFromAction = (action: string) =>
  queryString.parse(action.replace('merchant?', '')).slug;

export const getCategoryData = (id: string) => categories.find(category => category.id === id);

export const getCategoryDataFromLabel = (label: string) =>
  categories.find(category => category.label === label);

export const getSearchResultsFromPayload = (payload: any) => {
  if (!payload?.sections?.at(0)?.cards?.length) {
    return [];
  }
  if (payload.sections.at(0).cards.length > 1) {
    return payload.sections[0].cards.find((card: any) => card.cardType === 'MERCHANT_LIST_V2')?.data
      ?.contents;
  }
  return payload.sections[0].cards[0].data.contents;
};

export const getItemsFromCatalogPayload = (payload: any) => {
  if (!payload?.data?.menu?.length) {
    return [];
  }
  return payload.data.menu
    .map((menu: any) => {
      const subCatalog = menu.name;
      return menu.itens.map((item: any) => ({ ...item, subCatalog }));
    })
    .reduce((acc: any, cur: any) => [...acc, ...cur], []);
};

export const filterCategoriesFromResults = (results: any, type: string) => {
  const data = type === TYPE.MEAL ? MEAL : DESSERT;
  const categories = data.map(category => getCategoryData(category)?.label);
  return results.filter((result: any) => categories.includes(result.title));
};

export const isDessertAlsoMeal = (dessertLabel: string) => {
  const categories = MEAL.map(category => getCategoryData(category)?.label);
  return !!categories.find(meal => meal === dessertLabel);
};

export const getBrandsFromResults = (results: any) => results.map((result: any) => result.name);

export const getBrandIdFromName = (results: any, name: string) =>
  results.find((result: any) => result.name === name)?.id;

export const getMerchantFromId = (results: any, id: string) =>
  results.find((result: any) => result.id === id);

export const getMerchantFromItemId = (results: any, itemId: string) =>
  results.find((result: any) => !!result?.items?.find((item: any) => item.id === itemId));

export const filterItemsFromSubcategories = (items: any, type: string) => {
  const isSelectedCategoryAlsoMeal = useUserStore().answers[1].label.includes(' Doce');

  const filterByWhitelist = (itemCatalog: string, description: string) => {
    let valid = false;

    WHITELIST[type].find(allowed => {
      if (itemCatalog.includes(allowed) || description.includes(allowed)) {
        valid = true;
        return;
      }
    });

    return valid;
  };

  const filterByBlacklist = (itemCatalog: string, description: string) => {
    let valid = true;

    BLACKLIST[type].forEach(blocked => {
      if (itemCatalog.includes(blocked) || description.includes(blocked)) {
        valid = false;
      }
    });

    return valid;
  };

  const filteredItems = items.filter((item: any) => {
    const itemCatalog = item.subCatalog.toLowerCase();
    const description = item.description.toLowerCase();

    if (isSelectedCategoryAlsoMeal && WHITELIST[type]) {
      return filterByWhitelist(itemCatalog, description);
    } else {
      return filterByBlacklist(itemCatalog, description);
    }
  });

  return filteredItems;
};
