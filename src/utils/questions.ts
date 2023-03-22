import { t } from '@/i18n';
import { TYPE } from '@/constants/questions';
import { Question } from '@/types/questions';
import { useIfoodStore } from '@/stores/ifood';
import { getRandomFromArray, getRandomFromArrayDedup } from '@/utils/math';
import {
  filterCategoriesFromResults,
  filterItemsFromSubcategories,
  getCategoryIdFromAction,
  getMerchantIdFromAction,
  isDessertAlsoMeal,
} from '@/utils/ifood';
import { useUserStore } from '@/stores/user';
import { useAppStore } from '@/stores/app';

const defaultQuestion = [
  { name: 'a', label: 'A' },
  { name: 'b', label: 'B' },
];

export const getTypeQuestion = () =>
  Promise.resolve([
    { name: TYPE.MEAL, label: t('game.questions.type.meal') },
    { name: TYPE.DESSERT, label: t('game.questions.type.dessert') },
  ]);

export const getCategoryQuestion = async (type: string) => {
  try {
    const categories = await useIfoodStore().fetchCategories();
    const data = filterCategoriesFromResults(categories, type);

    if (!data.length) {
      throw new Error();
    }

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
  } catch {
    useAppStore().setIsErrorModalOpen(true);
  }
};

export const getBrandQuestion = async (categoryId: string) => {
  try {
    const brands = await useIfoodStore().fetchCategory(categoryId);

    if (!brands.length) {
      throw new Error();
    }

    const brandA = getRandomFromArray(brands);
    const brandB = getRandomFromArrayDedup(brands, brandA, 'id');

    return Promise.resolve([
      { name: getMerchantIdFromAction(brandA.action), label: brandA.name },
      { name: getMerchantIdFromAction(brandB.action), label: brandB.name },
    ]);
  } catch {
    useAppStore().setIsErrorModalOpen(true);
  }
};

const fetchAndGetRandomMerchant = async (categoryId: string) => {
  const merchants = await useIfoodStore().fetchCategory(categoryId);
  const randomMerchant = getRandomFromArray(merchants);
  const merchantId = String(getMerchantIdFromAction(randomMerchant.action));
  useUserStore().setResultsMerchant({
    name: merchantId,
    label: randomMerchant.name,
    question: Question.BRAND,
  });
  return merchantId;
};

export const getFillingOrToppingQuestion = async (categoryId: string) => {
  try {
    let merchantId = useUserStore().results.merchant?.name;

    if (!merchantId) {
      merchantId = await fetchAndGetRandomMerchant(categoryId);
    }

    let catalog = await useIfoodStore().fetchMerchantCatalog(merchantId);
    if (!catalog.length) {
      throw new Error();
    }

    const type = useUserStore().results.type || TYPE.MEAL;
    catalog = filterItemsFromSubcategories(catalog, type);

    const itemA = getRandomFromArray(catalog);
    const itemB = getRandomFromArrayDedup(catalog, itemA, 'id');

    return Promise.resolve([
      { name: itemA?.id, label: `${itemA?.subCatalog} - ${itemA?.description}` },
      { name: itemB?.id, label: `${itemB?.subCatalog} - ${itemB?.description}` },
    ]);
  } catch {
    useAppStore().setIsErrorModalOpen(true);
  }
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
