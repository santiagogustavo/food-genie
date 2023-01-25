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
} from '@/interfaces/analytics';

export type AnalyticsEvent = {
  name: string;
  params:
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
