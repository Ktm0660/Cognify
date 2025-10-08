/**
 * Compatibility shim for Firebase imports.
 * Re-exports SSR-safe app/auth/db and googleProvider so existing pages like login.js work.
 */
import { app, auth, db, googleProvider } from "./lib/firebase.client";

export { app, auth, db, googleProvider };
