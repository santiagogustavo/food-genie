import { useUserStore } from '@/stores/user';
import { getTimestamp } from '@/utils/time';

import { UserSatisfaction as Params } from '@/interfaces/analytics';

type Constructor = {
  deltaTime: Params['deltaTime'];
  satisfied: Params['satisfied'];
  result: Params['result'];
};

class UserSatisfaction {
  name: string;
  params: Params;

  constructor({ deltaTime, satisfied, result }: Constructor) {
    const userId = useUserStore().id;
    const timestamp = getTimestamp();
    const abTest = useUserStore().abTest;

    this.name = 'UserSatisfaction';
    this.params = {
      userId,
      timestamp,
      abTest,
      deltaTime,
      satisfied,
      result,
    };
  }
}

export default UserSatisfaction;
