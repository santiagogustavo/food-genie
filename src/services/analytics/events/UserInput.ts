import { useUserStore } from '@/stores/user';
import { getTimestamp } from '@/utils/time';

import { UserInput as Params } from '@/interfaces/analytics';

type Constructor = {
  deltaTime: Params['deltaTime'];
  input: Params['input'];
};

class UserInput {
  name: string;
  params: Params;

  constructor({ deltaTime, input }: Constructor) {
    const userId = useUserStore().id;
    const timestamp = getTimestamp();
    const abTest = useUserStore().abTest;

    this.name = 'UserInput';
    this.params = {
      userId,
      timestamp,
      abTest,
      deltaTime,
      input,
    };
  }
}

export default UserInput;
