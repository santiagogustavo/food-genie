import { useUserStore } from '@/stores/user';
import { getTimestamp } from '@/utils/time';

import { GameStart as Params } from '@/interfaces/analytics';

type Constructor = {
  deltaTime: Params['deltaTime'];
  cardDeckCount: Params['cardDeckCount'];
};

class GameStart {
  name: string;
  params: Params;

  constructor({ deltaTime, cardDeckCount }: Constructor) {
    const userId = useUserStore().id;
    const timestamp = getTimestamp();
    const abTest = useUserStore().abTest;

    this.name = 'GameStart';
    this.params = {
      userId,
      timestamp,
      abTest,
      deltaTime,
      cardDeckCount,
    };
  }
}

export default GameStart;
