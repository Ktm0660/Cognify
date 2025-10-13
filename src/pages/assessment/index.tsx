import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged, type Auth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
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
import {
  getAuthSafe,
  getDbSafe,
  getFirebaseApp,
  readEnv,
} from "../../firebase";

const missingFirebaseMessage = "Firebase isn’t configured. Add environment variables to enable the assessment.";

const TOTAL_QUESTIONS = QUESTIONS.length;

export default function AssessmentPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [firebaseReady, setFirebaseReady] = useState<boolean | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authInstance, setAuthInstance] = useState<Auth | null>(null);
  const [dbInstance, setDbInstance] = useState<Firestore | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(50);
  const [submitting, setSubmitting] = useState(false);

  const { elapsedMs, reset, startedAt } = useItemTimer();
  const firebaseEnvStatus = useMemo(
    () =>
      [
        "FIREBASE_API_KEY",
        "FIREBASE_AUTH_DOMAIN",
        "FIREBASE_PROJECT_ID",
        "FIREBASE_APP_ID",
      ].map((key) => ({
        key,
        present: Boolean(readEnv(key)),
      })),
    []
  );

  useEffect(() => {
    let cancelled = false;

    try {
      const app = getFirebaseApp();
      if (!app) {
        throw new Error("Firebase app not available");
      }
      const auth = getAuthSafe();
      const database = getDbSafe();
      if (!cancelled) {
        setAuthInstance(auth);
        setDbInstance(database);
        setFirebaseReady(true);
        setError(null);
      }
    } catch (err) {
      console.error(err);
      if (!cancelled) {
        setFirebaseReady(false);
        setError((prev) => prev ?? missingFirebaseMessage);
        setAuthChecked(true);
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!authInstance) {
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
  }, [authInstance, router]);

  useEffect(() => {
    if (firebaseReady === false) {
      return;
    }

    if (!dbInstance) {
      setError((prev) => prev ?? missingFirebaseMessage);
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
  }, [dbInstance, firebaseReady, sessionId, userId]);

  useEffect(() => {
    reset();
    setSelectedOption(null);
    setConfidence(50);
  }, [currentIndex, reset]);

  const currentQuestion = useMemo(() => QUESTIONS[currentIndex] ?? null, [currentIndex]);

  const handleOptionSelect = useCallback((optionIndex: number) => {
    setSelectedOption(optionIndex);
  }, []);

  const handleSubmit = useCallback(async () => {
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

  if (firebaseReady === null || !authChecked || !userId) {
    return null;
  }

  if (!sessionId || !currentQuestion) {
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
      {process.env.NODE_ENV !== "production" && (
        <div className="mx-auto max-w-3xl px-4 pb-6 text-center text-xs text-slate-500">
          <span className="font-medium">Firebase env:</span>{" "}
          {firebaseEnvStatus.map(({ key, present }, index) => (
            <span key={key}>
              {index > 0 && " · "}
              {present ? "✅" : "❌"} {key.replace("FIREBASE_", "")}
            </span>
          ))}
        </div>
      )}
    </main>
  );
}
