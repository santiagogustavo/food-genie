import { TYPE } from '@/constants/questions';

export const BLACKLIST = {
  [TYPE.MEAL]: ['doce', 'bebida', 'sobremesa', 'adicional', 'ml', 'litros'],
  [TYPE.DESSERT]: ['salgado', 'carne', 'frango', 'salada', 'adicional'],
};
