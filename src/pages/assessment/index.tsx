export const dynamic = "force-dynamic";

import * as React from "react";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged, type Auth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  updateDoc,
  type Firestore,
} from "firebase/firestore";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ConfidenceSlider from "@/components/ConfidenceSlider";
import { useItemTimer } from "@/components/useItemTimer";
import { cn } from "@/lib/cn";
import { QUESTIONS } from "@/data/questions";
import { diagnoseFirebase, getFirebaseApp, readEnv } from "../../firebase";

const missingFirebaseMessage = "Firebase isn’t configured. Add environment variables to enable the assessment.";

const ASSESSMENT_ENABLED =
  (process?.env?.NEXT_PUBLIC_ASSESSMENT_ENABLED ?? "true") === "true";

type DiagnoseResult = Awaited<ReturnType<typeof diagnoseFirebase>>;

function useFirebaseReady(): {
  loading: boolean;
  ok: boolean;
  diag: DiagnoseResult | null;
} {
  const [state, setState] = React.useState<{
    loading: boolean;
    ok: boolean;
    diag: DiagnoseResult | null;
  }>({ loading: true, ok: false, diag: null });

  React.useEffect(() => {
    let cancelled = false;

    if (!ASSESSMENT_ENABLED) {
      const presence = {
        FIREBASE_API_KEY: !!readEnv("FIREBASE_API_KEY"),
        FIREBASE_AUTH_DOMAIN: !!readEnv("FIREBASE_AUTH_DOMAIN"),
        FIREBASE_PROJECT_ID: !!readEnv("FIREBASE_PROJECT_ID"),
        FIREBASE_APP_ID: !!readEnv("FIREBASE_APP_ID"),
      } as DiagnoseResult["presence"];

      setState({
        loading: false,
        ok: false,
        diag: {
          ok: false,
          errorCode: "disabled",
          errorMessage:
            "Assessment disabled via NEXT_PUBLIC_ASSESSMENT_ENABLED = false",
          presence,
        },
      });
      return;
    }

    (async () => {
      const diag = await diagnoseFirebase();
      if (!cancelled) {
        setState({ loading: false, ok: diag.ok, diag });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

const TOTAL_QUESTIONS = QUESTIONS.length;

export default function AssessmentPage() {
  const router = useRouter();
  const { loading, ok, diag } = useFirebaseReady();
  const [authInstance, setAuthInstance] = React.useState<Auth | null>(null);
  const [dbInstance, setDbInstance] = React.useState<Firestore | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [authChecked, setAuthChecked] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [confidence, setConfidence] = React.useState(50);
  const [submitting, setSubmitting] = React.useState(false);

  const { elapsedMs, reset, startedAt } = useItemTimer();

  React.useEffect(() => {
    if (loading) {
      return;
    }

    if (!ok) {
      setAuthInstance(null);
      setDbInstance(null);
      setUserId(null);
      setSessionId(null);
      setError((prev) => prev ?? missingFirebaseMessage);
      setAuthChecked(true);
      return;
    }

    try {
      const app = getFirebaseApp();
      const authClient = getAuth(app);
      const dbClient = getFirestore(app);

      setAuthInstance(authClient);
      setDbInstance(dbClient);
      setError(null);
      setAuthChecked(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError((prev) => prev ?? missingFirebaseMessage);
      setAuthInstance(null);
      setDbInstance(null);
      setAuthChecked(true);
      if (typeof window !== "undefined") {
        console.error("[Assessment] Firebase init failed:", errorMessage);
      }
    }
  }, [loading, ok]);

  React.useEffect(() => {
    if (loading || !ok || !authInstance) {
      return;
    }

    const unsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/login");
      } else {
        setUserId(firebaseUser.uid);
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [authInstance, loading, ok, router]);

  React.useEffect(() => {
    if (!ok || !dbInstance) {
      if (!ok) {
        setError((prev) => prev ?? missingFirebaseMessage);
      }
      return;
    }
    if (!userId || sessionId) return;

    (async () => {
      try {
        const sessionRef = await addDoc(collection(dbInstance, "sessions"), {
          userId,
          startedAt: serverTimestamp(),
          version: "v0.1",
          itemIds: QUESTIONS.map((question) => question.itemId),
        });
        setSessionId(sessionRef.id);
      } catch (err) {
        console.error(err);
        setError("We couldn’t start the assessment. Please try again later.");
      }
    })();
  }, [dbInstance, ok, sessionId, userId]);

  React.useEffect(() => {
    reset();
    setSelectedOption(null);
    setConfidence(50);
  }, [currentIndex, reset]);

  const currentQuestion = React.useMemo(
    () => QUESTIONS[currentIndex] ?? null,
    [currentIndex]
  );

  const handleOptionSelect = React.useCallback((optionIndex: number) => {
    setSelectedOption(optionIndex);
  }, []);

  const handleSubmit = React.useCallback(async () => {
    if (
      selectedOption === null ||
      !currentQuestion ||
      !userId ||
      !sessionId ||
      !dbInstance ||
      submitting
    ) {
      if (!dbInstance) {
        setError((prev) => prev ?? missingFirebaseMessage);
      }
      return;
    }

    setSubmitting(true);
    const submittedAt = new Date();
    const startedAtDate = new Date(startedAt);
    const rtMs = submittedAt.getTime() - startedAtDate.getTime();

    try {
      await addDoc(collection(dbInstance, "responses"), {
        userId,
        sessionId,
        itemId: currentQuestion.itemId,
        pillar: currentQuestion.pillar,
        optionSelected: selectedOption,
        correct: selectedOption === currentQuestion.correctIndex,
        startedAt: startedAtDate,
        submittedAt,
        rtMs,
        confidence,
        questionIndex: currentIndex,
      });

      const isLast = currentIndex === TOTAL_QUESTIONS - 1;

      if (isLast) {
        await updateDoc(doc(dbInstance, "sessions", sessionId), {
          completedAt: serverTimestamp(),
        });
        router.push("/assessment/done");
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
      setError("We couldn’t save your response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [
    confidence,
    currentIndex,
    currentQuestion,
    dbInstance,
    router,
    selectedOption,
    sessionId,
    startedAt,
    submitting,
    userId,
  ]);

  if (loading) {
    return null;
  }

  if (!ok) {
    const core = [
      "FIREBASE_API_KEY",
      "FIREBASE_AUTH_DOMAIN",
      "FIREBASE_PROJECT_ID",
      "FIREBASE_APP_ID",
    ] as const;
    const present = (key: (typeof core)[number]) => (readEnv(key) ? "✅" : "❌");
    const hint = (() => {
      const message = diag?.errorMessage || "";
      if (message.includes("auth/unauthorized-domain")) {
        return "Firebase Auth: add your Vercel domain(s) in Authentication → Settings → Authorized domains.";
      }
      if (message.includes("permission-denied")) {
        return "Firestore rules may block writes. For dev, allow auth users in Firestore rules and Publish.";
      }
      if (message.includes("No Firebase App")) {
        return "Client envs likely missing. Ensure NEXT_PUBLIC_FIREBASE_ are set in Vercel (Preview + Production) and redeploy.";
      }
      return null;
    })();

    return (
      <main className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-12">
        <Card className="w-full p-8">
          <h1 className="text-2xl font-semibold text-slate-900">Assessment unavailable</h1>
          <p className="mt-3 text-slate-600">{error ?? missingFirebaseMessage}</p>
          <p className="mt-3 text-xs text-slate-500">
            Diagnostics (no secrets):
            <br />
            Error: {String(diag?.errorCode || "n/a")} — {String(diag?.errorMessage || "unknown")}
            <br />
            Core env presence: {core.map((k) => `${k}:${present(k)}`).join("  ")}
            {process.env.NODE_ENV !== "production" && hint ? (
              <>
                <br />
                Hint: {hint}
              </>
            ) : null}
          </p>
        </Card>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-12">
        <Card className="w-full p-8">
          <h1 className="text-2xl font-semibold text-slate-900">Assessment unavailable</h1>
          <p className="mt-3 text-slate-600">{error}</p>
        </Card>
      </main>
    );
  }

  if (!authChecked || !userId) {
    return null;
  }

  if (!dbInstance || !sessionId || !currentQuestion) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-12">
        <Card className="w-full p-8 text-center">
          <p className="text-slate-600">Preparing your assessment…</p>
        </Card>
      </main>
    );
  }

  const timeSeconds = Math.round(elapsedMs / 1000);
  const isLastQuestion = currentIndex === TOTAL_QUESTIONS - 1;

  return (
    <main className="bg-slate-50">
      <div className="mx-auto min-h-[70vh] max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <span>
              Question {currentIndex + 1} of {TOTAL_QUESTIONS}
            </span>
            <span>Time: {timeSeconds}s</span>
          </div>

          <div className="mt-6 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              {currentQuestion.pillar}
            </span>
            <h1 className="text-2xl font-bold text-slate-900">{currentQuestion.stem}</h1>
          </div>

          <div className="mt-8 grid gap-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleOptionSelect(index)}
                  className={cn(
                    "w-full rounded-2xl border px-4 py-3 text-left transition",
                    "hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400",
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 text-slate-900"
                      : "border-slate-200 bg-white text-slate-700"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-sm font-semibold text-indigo-600">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-sm leading-relaxed">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <ConfidenceSlider value={confidence} onChange={setConfidence} />
          </div>

          <div className="mt-10 flex justify-end">
            <Button
              variant="gradient"
              disabled={selectedOption === null || submitting}
              loading={submitting}
              onClick={handleSubmit}
            >
              {isLastQuestion ? "Finish" : "Next"}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
