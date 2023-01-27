import { useUserStore } from '@/stores/user';
import { getTimestamp } from '@/utils/time';

import { UserFeedback as Params } from '@/interfaces/analytics';

type Constructor = {
  deltaTime: Params['deltaTime'];
  satisfied: Params['satisfied'];
  feedbackOptIn: Params['feedbackOptIn'];
  likedExperience: Params['likedExperience'];
  likedQuestions: Params['likedQuestions'];
  likedInterface: Params['likedInterface'];
  score: Params['score'];
  message: Params['message'];
};

class UserFeedback {
  name: string;
  params: Params;

  constructor({
    deltaTime,
    satisfied,
    feedbackOptIn,
    likedExperience,
    likedQuestions,
    likedInterface,
    score,
    message,
  }: Constructor) {
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
      feedbackOptIn,
      likedExperience,
      likedQuestions,
      likedInterface,
      score,
      message,
    };
  }
}

export default UserFeedback;
