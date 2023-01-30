import { TYPE } from '@/constants/questions';
import { MEAL, DESSERT } from '@/data/foodTypes';
import { categories } from '@/data/filters';
import { Question } from '@/types/questions';
import { useIfoodStore } from '@/stores/ifood';
import { getRandomInt } from '@/utils/math';
import { getBrandIdFromName, getBrandsFromResults, getMerchantFromId } from '@/utils/ifood';

const defaultQuestion = [
  { name: 'a', label: 'A' },
  { name: 'b', label: 'B' },
];

const getCategoryData = (id: string) => categories.find(category => category.id === id);

export const getTypeQuestion = () =>
  Promise.resolve([
    { name: TYPE.MEAL, label: 'Refeição' },
    { name: TYPE.DESSERT, label: 'Sobremesa' },
  ]);

export const getCategoryQuestion = (type: string) => {
  const data = type === TYPE.MEAL ? MEAL : DESSERT;
  const categoryAId = data[getRandomInt(0, data.length - 1)];
  let categoryBId;
  do {
    categoryBId = data[getRandomInt(0, data.length - 1)];
  } while (categoryBId === categoryAId);

  const categoryA = getCategoryData(categoryAId);
  const categoryB = getCategoryData(categoryBId);
  return Promise.resolve([
    { name: categoryA?.id, label: categoryA?.label },
    { name: categoryB?.id, label: categoryB?.label },
  ]);
};

export const getBrandQuestion = async () => {
  const results = await useIfoodStore().fetchResults();
  const brands = getBrandsFromResults(results);
  const brandAName = brands[getRandomInt(0, brands.length - 1)];
  let brandBName;
  do {
    brandBName = brands[getRandomInt(0, brands.length - 1)];
  } while (brandBName === brandAName);
  const brandAId = getBrandIdFromName(results, brandAName);
  const brandBId = getBrandIdFromName(results, brandBName);

  return Promise.resolve([
    { name: brandAId, label: brandAName },
    { name: brandBId, label: brandBName },
  ]);
};

export const getFillingOrToppingQuestion = async (merchantId: string) => {
  let results = useIfoodStore().results;
  if (!results) {
    results = await useIfoodStore().fetchResults();
  }

  const merchantA = merchantId
    ? getMerchantFromId(results, merchantId)
    : results[getRandomInt(0, results.length - 1)];
  let merchantB = merchantId ? merchantA : undefined;
  if (!merchantId) {
    do {
      merchantB = results[getRandomInt(0, results.length - 1)];
    } while (merchantB.name === merchantA.name);
  }

  const itemA = merchantA.items[getRandomInt(0, merchantA.items.length - 1)];
  let itemB;
  do {
    itemB = merchantB.items[getRandomInt(0, merchantB.items.length - 1)];
  } while (itemB.name === itemA.name);

  return Promise.resolve([
    { name: itemA?.id, label: itemA?.name },
    { name: itemB?.id, label: itemB?.name },
  ]);
};

export const getCurrentQuestion = (question: Question, param: string) => {
  switch (question) {
    case Question.TYPE:
      return getTypeQuestion();
    case Question.CATEGORY:
      return getCategoryQuestion(param);
    case Question.BRAND:
      return getBrandQuestion();
    case Question.FILLING_OR_TOPPING:
      return getFillingOrToppingQuestion(param);
    default:
      return Promise.resolve(defaultQuestion);
  }
};
