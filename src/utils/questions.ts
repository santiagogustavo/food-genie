import { TYPE } from '@/constants/questions';
import { Question } from '@/types/questions';
import { useIfoodStore } from '@/stores/ifood';
import { getRandomFromArray, getRandomFromArrayDedup } from '@/utils/math';
import {
  filterCategoriesFromResults,
  getCategoryIdFromAction,
  getMerchantIdFromAction,
} from '@/utils/ifood';

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

  return Promise.resolve([
    { name: getCategoryIdFromAction(categoryA.action), label: categoryA?.title },
    { name: getCategoryIdFromAction(categoryB.action), label: categoryB?.title },
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

export const getFillingOrToppingQuestion = async (merchantId: string) => {
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
