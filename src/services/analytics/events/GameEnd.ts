import { useUserStore } from '@/stores/user';
import { getTimestamp } from '@/utils/time';

import { GameEnd as Params } from '@/interfaces/analytics';

type Constructor = {
  deltaTime: Params['deltaTime'];
  result: Params['result'];
};

class GameEnd {
  name: string;
  params: Params;

  constructor({ deltaTime, result }: Constructor) {
    const userId = useUserStore().id;
    const timestamp = getTimestamp();
    const abTest = useUserStore().abTest;

    this.name = 'GameEnd';
    this.params = {
      userId,
      timestamp,
      abTest,
      deltaTime,
      result,
    };
  }
}

export default GameEnd;
