import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// –– Firebase env resolver (literal access; works in Next + CRA) ––
const FIREBASE_ENV = {
  FIREBASE_API_KEY:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    process.env.REACT_APP_FIREBASE_API_KEY ||
    "",
  FIREBASE_AUTH_DOMAIN:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    "",
  FIREBASE_PROJECT_ID:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.REACT_APP_FIREBASE_PROJECT_ID ||
    "",
  FIREBASE_STORAGE_BUCKET:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    "",
  FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ||
    "",
  FIREBASE_APP_ID:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    process.env.REACT_APP_FIREBASE_APP_ID ||
    "",
  FIREBASE_MEASUREMENT_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID ||
    "",
} as const;

export const getFirebaseEnv = () => FIREBASE_ENV;
export const isConfigured = () =>
  !!(
    FIREBASE_ENV.FIREBASE_API_KEY &&
    FIREBASE_ENV.FIREBASE_AUTH_DOMAIN &&
    FIREBASE_ENV.FIREBASE_PROJECT_ID &&
    FIREBASE_ENV.FIREBASE_APP_ID
  );

export const readEnv = (key: keyof typeof FIREBASE_ENV | string): string =>
  FIREBASE_ENV[key as keyof typeof FIREBASE_ENV] || "";

export async function diagnoseFirebase(): Promise<{
  ok: boolean;
  presence: Record<
    | "FIREBASE_API_KEY"
    | "FIREBASE_AUTH_DOMAIN"
    | "FIREBASE_PROJECT_ID"
    | "FIREBASE_APP_ID",
    boolean
  >;
  errorCode: string | null;
  errorMessage: string | null;
}> {
  const env = getFirebaseEnv();
  const presence = {
    FIREBASE_API_KEY: !!env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: !!env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: !!env.FIREBASE_PROJECT_ID,
    FIREBASE_APP_ID: !!env.FIREBASE_APP_ID,
  } as const;

  try {
    const app = getFirebaseApp();
    getAuth(app);
    getFirestore(app);

    return {
      ok: true,
      presence,
      errorCode: null,
      errorMessage: null,
    };
  } catch (error) {
    const err = error as { message?: string; code?: string } | null;
    const message =
      (err && typeof err.message === "string" && err.message) ||
      (err && typeof err.code === "string" && err.code) ||
      String(error ?? "Unknown error");
    const code = err && typeof err?.code === "string" ? err.code : null;

    return {
      ok: false,
      presence,
      errorCode: code,
      errorMessage: message,
    };
  }
}

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

  const env = getFirebaseEnv();
  app = initializeApp({
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET || undefined,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID || undefined,
    appId: env.FIREBASE_APP_ID,
    measurementId: env.FIREBASE_MEASUREMENT_ID || undefined,
  });

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
