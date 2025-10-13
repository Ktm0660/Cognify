import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

export const readEnv = (key: string): string =>
  (typeof process !== "undefined" &&
    ((process.env[`NEXT_PUBLIC_${key}`] as string | undefined) ||
      (process.env[`REACT_APP_${key}`] as string | undefined))) ||
  "";

export const firebaseConfig = {
  apiKey: readEnv("FIREBASE_API_KEY"),
  authDomain: readEnv("FIREBASE_AUTH_DOMAIN"),
  projectId: readEnv("FIREBASE_PROJECT_ID"),
  storageBucket: readEnv("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: readEnv("FIREBASE_MESSAGING_SENDER_ID"),
  appId: readEnv("FIREBASE_APP_ID"),
  measurementId: readEnv("FIREBASE_MEASUREMENT_ID") || undefined,
};

export function isConfigured(): boolean {
  return !!(
    readEnv("FIREBASE_API_KEY") &&
    readEnv("FIREBASE_AUTH_DOMAIN") &&
    readEnv("FIREBASE_PROJECT_ID") &&
    readEnv("FIREBASE_APP_ID")
  );
}

const configured = isConfigured();

const existingApps = getApps();
const app: FirebaseApp | undefined =
  existingApps.length > 0
    ? existingApps[0]!
    : configured
    ? initializeApp(firebaseConfig)
    : undefined;

export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;
export const googleProvider: GoogleAuthProvider | null = app
  ? new GoogleAuthProvider()
  : null;

let analyticsPromise: Promise<Analytics | null> | null = null;

export async function initAnalytics(): Promise<Analytics | null> {
  if (!app || typeof window === "undefined") {
    return null;
  }

  if (!analyticsPromise) {
    analyticsPromise = (async () => {
      if (await isSupported()) {
        return getAnalytics(app);
      }
      return null;
    })();
  }

  return analyticsPromise;
}
