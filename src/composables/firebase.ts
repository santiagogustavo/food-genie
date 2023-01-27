import { initializeApp } from '@firebase/app';
import {
  getAnalytics,
  setUserId as fbSetUserId,
  logEvent,
  AnalyticsCallOptions,
} from '@firebase/analytics';
import { fetchAndActivate, getRemoteConfig, getValue } from '@firebase/remote-config';
import { AnalyticsEvent } from '@/types/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const useFirebase = () => {
  const analytics = getAnalytics(app);
  const remoteConfig = getRemoteConfig(app);
  remoteConfig.settings.minimumFetchIntervalMillis = 0;

  const log = (event: AnalyticsEvent, options?: AnalyticsCallOptions) =>
    logEvent(analytics, event.name, event.params, options);

  const setUserId = (userId: string, options?: AnalyticsCallOptions) =>
    fbSetUserId(analytics, userId, options);

  const getBoolean = async (name: string) =>
    await fetchAndActivate(remoteConfig).then(() => getValue(remoteConfig, name).asBoolean());

  return { log, setUserId, getBoolean };
};
