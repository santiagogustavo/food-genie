import { useUserStore } from '@/stores/user';
import { getTimestamp } from '@/utils/time';

import { ApplicationClose as Params } from '@/interfaces/analytics';

type Constructor = {
  deltaTime: Params['deltaTime'];
  destination: Params['destination'];
};

class ApplicationClose {
  name: string;
  params: Params;

  constructor({ deltaTime, destination }: Constructor) {
    const userId = useUserStore().id;
    const timestamp = getTimestamp();

    this.name = 'ApplicationClose';
    this.params = {
      userId,
      timestamp,
      deltaTime,
      destination,
    };
  }
}

export default ApplicationClose;
