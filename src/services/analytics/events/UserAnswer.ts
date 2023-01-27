import { useUserStore } from '@/stores/user';
import { getTimestamp } from '@/utils/time';

import { UserAnswer as Params } from '@/interfaces/analytics';

type Constructor = {
  deltaTime: Params['deltaTime'];
  cardNumber: Params['cardNumber'];
  optionA: Params['optionA'];
  optionB: Params['optionB'];
  optionChosen: Params['optionChosen'];
};

class UserAnswer {
  name: string;
  params: Params;

  constructor({ deltaTime, cardNumber, optionA, optionB, optionChosen }: Constructor) {
    const userId = useUserStore().id;
    const timestamp = getTimestamp();
    const abTest = useUserStore().abTest;

    this.name = 'UserAnswer';
    this.params = {
      userId,
      timestamp,
      abTest,
      deltaTime,
      cardNumber,
      optionA,
      optionB,
      optionChosen,
    };
  }
}

export default UserAnswer;
