import { useUserStore } from '@/stores/user';
import { getTimestamp } from '@/utils/time';

import { GameRetry as Params } from '@/interfaces/analytics';

type Constructor = {
  deltaTime: Params['deltaTime'];
  result?: Params['result'];
  error: Params['error'];
};

class GameRetry {
  name: string;
  params: Params;

  constructor({ deltaTime, result, error }: Constructor) {
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
      error,
    };
  }
}

export default GameRetry;
