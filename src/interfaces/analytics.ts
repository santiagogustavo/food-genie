export interface Common {
  userId: string;
  timestamp: string;
}

export interface CommonDelta extends Common {
  deltaTime: number;
}

export interface CommonAb extends CommonDelta {
  abTest: boolean;
}

/* APPLICATION RELATED */

export interface ApplicationStart extends Common {
  origin: string;
}

export interface ApplicationClose extends CommonDelta {
  destination: string;
}

/* GAME RELATED */

export interface GameStart extends CommonAb {
  cardDeckCount: number;
}

export interface GameEnd extends CommonAb {
  result: string;
}

export interface GameRetry extends CommonAb {
  result: string;
  retry: boolean;
}

/* USER RELATED */

export interface UserIdentified extends CommonAb {
  userName: string;
  language?: string;
  latitude: number;
  longitude: number;
}

export interface UserAnswer extends CommonAb {
  cardNumber: number;
  optionA: string;
  optionB: string;
  optionChosen: string;
}

export interface UserSatisfaction extends CommonAb {
  satisfied: boolean;
}

export interface UserFeedback extends CommonAb {
  satisfied: boolean;
  feedbackOptIn: boolean;
  /* Optional if user opts out */
  likedExperience?: boolean;
  likedQuestions?: boolean;
  likedInterface?: boolean;
  score?: number;
  message?: string;
}

export interface UserInput extends CommonAb {
  input: string;
}
