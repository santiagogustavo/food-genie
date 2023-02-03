import { useUserStore } from '@/stores/user';
import { getTimestamp } from '@/utils/time';

import { UserFeedback as Params } from '@/interfaces/analytics';

type Constructor = {
  deltaTime: Params['deltaTime'];
  satisfied: Params['satisfied'];
  result: Params['result'];
  score: Params['score'];
};

class UserFeedback {
  name: string;
  params: Params;

  constructor({ deltaTime, satisfied, result, score }: Constructor) {
    const userId = useUserStore().id;
    const timestamp = getTimestamp();
    const abTest = useUserStore().abTest;

    this.name = 'UserFeedback';
    this.params = {
      userId,
      timestamp,
      abTest,
      deltaTime,
      satisfied,
      result,
      score,
    };
  }
}

export default UserFeedback;
