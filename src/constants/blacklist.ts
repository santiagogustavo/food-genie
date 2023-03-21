import { TYPE } from '@/constants/questions';

export const DRINK_TOKENS = ['bebida', 'adiciona'];

export const BLACKLIST = {
  [TYPE.MEAL]: ['doce', 'sobremesa', ...DRINK_TOKENS],
  [TYPE.DESSERT]: ['salgad', ...DRINK_TOKENS],
};

export const WHITELIST = {
  [TYPE.DESSERT]: ['doce', 'sobremesa'],
};
