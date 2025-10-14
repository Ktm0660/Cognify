import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

export const readEnv = (key: string): string =>
  (process?.env?.[`NEXT_PUBLIC_${key}`] as string | undefined) ||
  (process?.env?.[`REACT_APP_${key}`] as string | undefined) ||
  "";

export const isConfigured = (): boolean =>
  Boolean(
    readEnv("FIREBASE_API_KEY") &&
      readEnv("FIREBASE_AUTH_DOMAIN") &&
      readEnv("FIREBASE_PROJECT_ID") &&
      readEnv("FIREBASE_APP_ID")
  );

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

  if (!isConfigured()) {
    throw new Error("Firebase configuration is incomplete.");
  }

  const cfg = {
    apiKey: readEnv("FIREBASE_API_KEY"),
    authDomain: readEnv("FIREBASE_AUTH_DOMAIN"),
    projectId: readEnv("FIREBASE_PROJECT_ID"),
    storageBucket: readEnv("FIREBASE_STORAGE_BUCKET") || undefined,
    messagingSenderId: readEnv("FIREBASE_MESSAGING_SENDER_ID") || undefined,
    appId: readEnv("FIREBASE_APP_ID"),
    measurementId: readEnv("FIREBASE_MEASUREMENT_ID") || undefined,
  } satisfies Parameters<typeof initializeApp>[0];

  app = initializeApp(cfg);
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
  } catch {
    return null;
  }
})();

export const db: Firestore | null = (() => {
  try {
    return getDbSafe();
  } catch {
    return null;
  }
})();

export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();

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
  } catch {
    return null;
  }
}
