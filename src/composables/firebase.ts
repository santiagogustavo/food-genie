import { initializeApp } from '@firebase/app';
import { getAnalytics, logEvent, AnalyticsCallOptions } from '@firebase/analytics';

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
  const log = (eventName: string, eventParams?: any, options?: AnalyticsCallOptions) =>
    logEvent(analytics, eventName, eventParams, options);

  return { log };
};