import { getApps, getApp, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Init only on the client. During SSR/build this returns null,
 * so pages don't crash if env vars are missing.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // If no apiKey, skip init; caller should handle null.
  if (!config.apiKey) return null;

  return getApps().length ? getApp() : initializeApp(config);
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
}

export function getFirebaseProvider(): GoogleAuthProvider | null {
  if (typeof window === "undefined") return null;
  return new GoogleAuthProvider();
}

export function getFirebaseDb(): Firestore | null {
  const app = getFirebaseApp();
  return app ? getFirestore(app) : null;
}
