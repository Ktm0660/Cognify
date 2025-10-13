import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  type Auth,
  type GoogleAuthProvider,
} from "firebase/auth";
import { auth as firebaseAuth, googleProvider as firebaseGoogleProvider } from "@/firebase";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [authMissing, setAuthMissing] = useState(false);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [googleProvider, setGoogleProvider] = useState<GoogleAuthProvider | null>(null);
  useEffect(() => {
    const authInstance = firebaseAuth;
    const providerInstance = firebaseGoogleProvider;
    if (!authInstance || !providerInstance) {
      setAuthMissing(true);
    } else {
      setAuth(authInstance);
      setGoogleProvider(providerInstance);
    }
    setAuthReady(true);
  }, []);

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [err, setErr] = useState<string | null>(null);

  if (!authReady) return null;

  if (authMissing) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-slate-600">
            Firebase env vars are not set. Add them in Vercel & redeploy to enable login.
          </p>
        </div>
      </div>
    );
  }

  if (!auth || !googleProvider) return null;


  async function withGoogle() {
    setErr(null);
    if (!auth || !googleProvider) return;
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/assessment");
    } catch (error: any) {
      setErr(error?.message ?? "Sign-in failed");
    }
  }
  async function withEmail(event: React.FormEvent) {
    event.preventDefault();
    setErr(null);
    if (!auth) return;
    try {
      if (mode === "login") await signInWithEmailAndPassword(auth, email, pw);
      else await createUserWithEmailAndPassword(auth, email, pw);
      router.push("/assessment");
    } catch (error: any) {
      setErr(error?.message ?? "Auth failed");
    }
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-md px-4 py-12">
      <Card className="p-8">
        <h1 className="text-2xl font-bold">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-2 text-slate-600">Sign in to start your 3-minute snapshot.</p>

        <div className="mt-6 grid gap-3">
          <Button variant="gradient" onClick={withGoogle}>
            Continue with Google
          </Button>
          <div className="relative my-2 text-center text-sm text-slate-500">
            <span className="relative z-10 bg-white px-3">or</span>
            <div className="absolute left-0 right-0 top-1/2 -z-0 h-px bg-slate-200" />
          </div>
          <form className="grid gap-3" onSubmit={withEmail}>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              type="password"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Password"
              value={pw}
              onChange={(event) => setPw(event.target.value)}
            />
            <Button type="submit" variant="primary">
              {mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>
          <button
            className="justify-self-start text-sm text-indigo-600 hover:underline"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "New here? Create an account" : "Have an account? Sign in"}
          </button>
          {err && <p className="text-sm text-rose-600">{err}</p>}
        </div>
      </Card>
    </main>
  );
}
