import { TYPE } from '@/constants/questions';

export const DRINK_TOKENS = ['adiciona', 'ml', 'litro', '2l', '1.5l', '1,5l', '1l'];

export const BLACKLIST = {
  [TYPE.MEAL]: ['doce', 'bebida', 'sobremesa', 'chocolate', ...DRINK_TOKENS],
  [TYPE.DESSERT]: ['salgad', 'carne', 'frango', 'salada', 'bacon', ...DRINK_TOKENS],
};
