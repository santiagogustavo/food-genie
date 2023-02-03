import {
  ApplicationStart,
  ApplicationClose,
  GameStart,
  GameEnd,
  GameRetry,
  UserIdentified,
  UserAnswer,
  UserSatisfaction,
  UserFeedback,
  UserInput,
  Common,
  CommonAb,
  CommonDelta,
} from '@/interfaces/analytics';

export type AnalyticsEvent = {
  name: string;
  params:
    | Common
    | CommonDelta
    | CommonAb
    | ApplicationStart
    | ApplicationClose
    | GameStart
    | GameEnd
    | GameRetry
    | UserIdentified
    | UserAnswer
    | UserSatisfaction
    | UserFeedback
    | UserInput;
};
