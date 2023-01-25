import { useUserStore } from '@/stores/user';
import { getTimestamp } from '@/utils/time';

import { ApplicationStart as Params } from '@/interfaces/analytics';

type Constructor = {
  origin: Params['origin'];
};

class ApplicationStart {
  name: string;
  params: Params;

  constructor({ origin }: Constructor) {
    const userId = useUserStore().id ?? 'undefined';
    const timestamp = getTimestamp();

    this.name = 'ApplicationStart';
    this.params = {
      userId,
      timestamp,
      origin,
    };
  }
}

export default ApplicationStart;
