/**
 * Compatibility shim for Firebase imports.
 * Uses the SSR-safe client initializer and re-exports app/auth/db for existing JS files.
 * This file intentionally stays in JS so existing pages that import it continue to work.
 */
import { app, auth, db } from "./lib/firebase.client";

export { app, auth, db };
