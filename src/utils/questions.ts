import { TYPE } from '@/constants/questions';
import { Question } from '@/types/questions';
import { useIfoodStore } from '@/stores/ifood';
import { getRandomFromArray, getRandomFromArrayDedup } from '@/utils/math';
import {
  filterCategoriesFromResults,
  getCategoryIdFromAction,
  getMerchantIdFromAction,
  isDessertAlsoMeal,
} from '@/utils/ifood';
import { useUserStore } from '@/stores/user';

const defaultQuestion = [
  { name: 'a', label: 'A' },
  { name: 'b', label: 'B' },
];

export const getTypeQuestion = () =>
  Promise.resolve([
    { name: TYPE.MEAL, label: 'Refeição' },
    { name: TYPE.DESSERT, label: 'Sobremesa' },
  ]);

export const getCategoryQuestion = async (type: string) => {
  const categories = await useIfoodStore().fetchCategories();
  const data = filterCategoriesFromResults(categories, type);

  const categoryA = getRandomFromArray(data);
  const categoryB = getRandomFromArrayDedup(data, categoryA, 'id');

  const isAAlsoMeal = type === TYPE.DESSERT && isDessertAlsoMeal(categoryA.title);
  const isBAlsoMeal = type === TYPE.DESSERT && isDessertAlsoMeal(categoryB.title);
  const labelA = `${categoryA.title}${isAAlsoMeal ? ' Doce' : ''}`;
  const labelB = `${categoryB.title}${isBAlsoMeal ? ' Doce' : ''}`;

  return Promise.resolve([
    { name: getCategoryIdFromAction(categoryA.action), label: labelA },
    { name: getCategoryIdFromAction(categoryB.action), label: labelB },
  ]);
};

export const getBrandQuestion = async (categoryId: string) => {
  const brands = await useIfoodStore().fetchCategory(categoryId);

  const brandA = getRandomFromArray(brands);
  const brandB = getRandomFromArrayDedup(brands, brandA, 'id');

  return Promise.resolve([
    { name: getMerchantIdFromAction(brandA.action), label: brandA.name },
    { name: getMerchantIdFromAction(brandB.action), label: brandB.name },
  ]);
};

const fetchAndGetRandomMerchant = async (categoryId: string) => {
  const merchants = await useIfoodStore().fetchCategory(categoryId);
  const randomMerchant = getRandomFromArray(merchants);
  const merchantId = String(getMerchantIdFromAction(randomMerchant.action));
  useUserStore().setResultsMerchant({ name: merchantId, label: randomMerchant.name });
  return merchantId;
};

export const getFillingOrToppingQuestion = async (merchantOrCategoryId: string) => {
  const merchants = await useIfoodStore().merchants;
  let merchantId;

  if (!merchants?.length) {
    merchantId = await fetchAndGetRandomMerchant(merchantOrCategoryId);
  } else {
    merchantId = merchantOrCategoryId;
  }

  const catalog = await useIfoodStore().fetchMerchantCatalog(merchantId);

  const itemA = getRandomFromArray(catalog);
  const itemB = getRandomFromArrayDedup(catalog, itemA, 'id');

  return Promise.resolve([
    { name: itemA?.id, label: itemA?.description },
    { name: itemB?.id, label: itemB?.description },
  ]);
};

export const getCurrentQuestion = (question: Question, param: string) => {
  switch (question) {
    case Question.TYPE:
      return getTypeQuestion();
    case Question.CATEGORY:
      return getCategoryQuestion(param);
    case Question.BRAND:
      return getBrandQuestion(param);
    case Question.FILLING_OR_TOPPING:
      return getFillingOrToppingQuestion(param);
    default:
      return Promise.resolve(defaultQuestion);
  }
};
