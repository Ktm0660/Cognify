import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

type FirebaseConfig = {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
};

const env = (key: string): string | undefined =>
  process.env[`NEXT_PUBLIC_${key}`] || process.env[`REACT_APP_${key}`] || undefined;

const firebaseConfig: FirebaseConfig = {
  apiKey: env("FIREBASE_API_KEY"),
  authDomain: env("FIREBASE_AUTH_DOMAIN"),
  projectId: env("FIREBASE_PROJECT_ID"),
  storageBucket: env("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: env("FIREBASE_MESSAGING_SENDER_ID"),
  appId: env("FIREBASE_APP_ID"),
  measurementId: env("FIREBASE_MEASUREMENT_ID") || undefined,
};

function canInitialize(
  config: FirebaseConfig,
): config is Required<Omit<FirebaseConfig, "measurementId">> & { measurementId?: string } {
  const requiredKeys: (keyof FirebaseConfig)[] = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];

  return requiredKeys.every((key) => {
    const value = config[key];
    return typeof value === "string" && value.length > 0;
  });
}

let app: FirebaseApp | null = null;

if (canInitialize(firebaseConfig)) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;
export const googleProvider: GoogleAuthProvider | null = app ? new GoogleAuthProvider() : null;

export async function initAnalytics() {
  if (typeof window === "undefined" || !app) return null;
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
}

export { env };
