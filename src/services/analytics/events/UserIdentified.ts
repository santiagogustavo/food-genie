import { useUserStore } from '@/stores/user';
import { getTimestamp } from '@/utils/time';

import { UserIdentified as Params } from '@/interfaces/analytics';

type Constructor = {
  deltaTime: Params['deltaTime'];
  userName: Params['userName'];
  language: Params['language'];
  latitude: Params['latitude'];
  longitude: Params['longitude'];
};

class UserIdentified {
  name: string;
  params: Params;

  constructor({ deltaTime, userName, language, latitude, longitude }: Constructor) {
    const userId = useUserStore().id;
    const timestamp = getTimestamp();
    const abTest = useUserStore().abTest;

    this.name = 'UserIdentified';
    this.params = {
      userId,
      timestamp,
      abTest,
      deltaTime,
      userName,
      language,
      latitude,
      longitude,
    };
  }
}

export default UserIdentified;
