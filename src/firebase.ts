import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

export const readEnv = (key: string): string =>
  process?.env?.[`NEXT_PUBLIC_${key}`] ||
  process?.env?.[`REACT_APP_${key}`] ||
  "";

export const firebaseConfig = {
  apiKey: readEnv("FIREBASE_API_KEY"),
  authDomain: readEnv("FIREBASE_AUTH_DOMAIN"),
  projectId: readEnv("FIREBASE_PROJECT_ID"),
  storageBucket: readEnv("FIREBASE_STORAGE_BUCKET") || undefined,
  messagingSenderId: readEnv("FIREBASE_MESSAGING_SENDER_ID") || undefined,
  appId: readEnv("FIREBASE_APP_ID"),
  measurementId: readEnv("FIREBASE_MEASUREMENT_ID") || undefined,
};

let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (app) {
    return app;
  }

  const existing = getApps();
  if (existing.length) {
    app = existing[0]!;
    return app;
  }

  app = initializeApp(firebaseConfig);
  return app;
}

export function getAuthSafe(): Auth {
  return getAuth(getFirebaseApp());
}

export function getDbSafe(): Firestore {
  return getFirestore(getFirebaseApp());
}

export const auth: Auth | null = (() => {
  try {
    return getAuthSafe();
  } catch (error) {
    return null;
  }
})();

export const db: Firestore | null = (() => {
  try {
    return getDbSafe();
  } catch (error) {
    return null;
  }
})();

export const googleProvider: GoogleAuthProvider | null = (() => {
  try {
    getFirebaseApp();
    return new GoogleAuthProvider();
  } catch (error) {
    return null;
  }
})();

let analyticsPromise: Promise<Analytics | null> | null = null;

export async function initAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const firebaseApp = getFirebaseApp();
    if (!analyticsPromise) {
      analyticsPromise = (async () => {
        if (await isSupported()) {
          return getAnalytics(firebaseApp);
        }
        return null;
      })();
    }
    return analyticsPromise;
  } catch (error) {
    return null;
  }
}
