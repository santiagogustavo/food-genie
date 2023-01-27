import { useUserStore } from '@/stores/user';
import { getTimestamp } from '@/utils/time';

import { GameRetry as Params } from '@/interfaces/analytics';

type Constructor = {
  deltaTime: Params['deltaTime'];
  result: Params['result'];
  retry: Params['retry'];
};

class GameRetry {
  name: string;
  params: Params;

  constructor({ deltaTime, result, retry }: Constructor) {
    const userId = useUserStore().id;
    const timestamp = getTimestamp();
    const abTest = useUserStore().abTest;

    this.name = 'GameRetry';
    this.params = {
      userId,
      timestamp,
      abTest,
      deltaTime,
      result,
      retry,
    };
  }
}

export default GameRetry;
