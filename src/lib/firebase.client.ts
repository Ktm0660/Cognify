import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "0",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:0:web:demo"
};

function getFirebaseApp() {
  if (typeof window === "undefined") {
    // Avoid initializing during SSR; consumers should guard client-only usage.
    return null as unknown as ReturnType<typeof initializeApp>;
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const app = getFirebaseApp();
export const auth = app ? getAuth(app) : (null as any);
export const db   = app ? getFirestore(app) : (null as any);

// Export a Google provider for login pages expecting it.
export const googleProvider = app ? new GoogleAuthProvider() : (null as any);
