import { useUserStore } from '@/stores/user';
import { getDeltaTime, getTimestamp } from '@/utils/time';

import { CommonDelta as Params } from '@/interfaces/analytics';
import { useAppStore } from '@/stores/app';

class UserCloseMap {
  name: string;
  params: Params;

  constructor() {
    const userId = useUserStore().id;
    const timestamp = getTimestamp();

    const latestTimestamp = useAppStore().latestTimestamp;
    const deltaTime = getDeltaTime(latestTimestamp);

    this.name = 'UserCloseMap';
    this.params = {
      userId,
      timestamp,
      deltaTime,
    };
  }
}

export default UserCloseMap;
