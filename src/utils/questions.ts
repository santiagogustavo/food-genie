import { TYPE } from '@/constants/questions';
import { MEAL, DESSERT } from '@/data/foodTypes';
import { categories } from '@/data/filters';
import { Question } from '@/types/questions';
import { getRandomInt } from '@/utils/math';

const getCategoryData = (id: string) => categories.find(category => category.id === id);

export const getTypeQuestion = () => [
  { name: TYPE.MEAL, label: 'Refeição' },
  { name: TYPE.DESSERT, label: 'Sobremesa' },
];

export const getCategoryQuestion = (type: string) => {
  const data = type === TYPE.MEAL ? MEAL : DESSERT;
  const categoryAId = data[getRandomInt(0, data.length - 1)];
  let categoryBId;
  do {
    categoryBId = data[getRandomInt(0, data.length - 1)];
  } while (categoryBId === categoryAId);

  const categoryA = getCategoryData(categoryAId);
  const categoryB = getCategoryData(categoryBId);
  return [
    { name: categoryA?.id, label: categoryA?.label },
    { name: categoryB?.id, label: categoryB?.label },
  ];
};

export const getCurrentQuestion = (question: Question, param: string) => {
  switch (question) {
    case Question.TYPE:
      return getTypeQuestion();
    case Question.CATEGORY:
      return getCategoryQuestion(param);
    default:
      return [
        { name: 'a', label: 'A' },
        { name: 'b', label: 'B' },
      ];
  }
};
