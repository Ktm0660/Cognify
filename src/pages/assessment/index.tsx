import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged, type User } from "firebase/auth";
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
import ConfidenceSlider from "@/components/assessment/ConfidenceSlider";
import { useItemTimer } from "@/components/assessment/useItemTimer";
import { QUESTIONS } from "@/data/questions";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase.client";
import { cn } from "@/lib/cn";

const OPTION_PREFIX = ["A", "B", "C", "D"];

export default function AssessmentPage() {
  const router = useRouter();
  const [clientReady, setClientReady] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [authMissing, setAuthMissing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [creatingSession, setCreatingSession] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(50);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setClientReady(true);
  }, []);

  useEffect(() => {
    if (!clientReady) return;

    const authInstance = getFirebaseAuth();
    const dbInstance = getFirebaseDb();

    if (!authInstance || !dbInstance) {
      setAuthMissing(true);
      setAuthLoaded(true);
      return;
    }

    setDb(dbInstance);

    const unsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setAuthLoaded(true);
        router.replace("/login");
        return;
      }

      setUser(firebaseUser);
      setAuthLoaded(true);
    });

    return () => {
      unsubscribe();
    };
  }, [clientReady, router]);

  const itemIds = useMemo(() => QUESTIONS.map((item) => item.itemId), []);

  const startSession = useCallback(async () => {
    if (!user || !db) return;

    setCreatingSession(true);
    setSessionError(null);
    setSubmitError(null);
    setCurrentIndex(0);
    setSelectedOption(null);
    setConfidence(50);

    try {
      const sessionRef = await addDoc(collection(db, "sessions"), {
        userId: user.uid,
        startedAt: serverTimestamp(),
        version: "v0.1",
        itemIds,
      });
      setSessionId(sessionRef.id);
    } catch (error) {
      console.error(error);
      setSessionError("We couldn't start the assessment. Please try again.");
    } finally {
      setCreatingSession(false);
    }
  }, [db, itemIds, user]);

  useEffect(() => {
    if (!user || !db || sessionId || creatingSession || sessionError) return;
    void startSession();
  }, [user, db, sessionId, creatingSession, sessionError, startSession]);

  const timer = useItemTimer(currentIndex);
  const elapsedSeconds = Math.floor(timer.elapsedMs / 1000);
  const currentQuestion = QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === QUESTIONS.length - 1;
  const canSubmit = selectedOption !== null && !submitting && !!sessionId;

  async function handleSubmit() {
    if (!sessionId || !db || !user || selectedOption === null) return;

    setSubmitting(true);
    setSubmitError(null);

    const question = currentQuestion;
    const startedAt = timer.startedAt;
    const submittedAt = new Date();
    const rtMs = Math.max(0, Math.round(submittedAt.getTime() - startedAt.getTime()));

    try {
      await addDoc(collection(db, "responses"), {
        userId: user.uid,
        sessionId,
        itemId: question.itemId,
        pillar: question.pillar,
        optionSelected: selectedOption,
        correct: selectedOption === question.correctIndex,
        startedAt,
        submittedAt,
        rtMs,
        confidence,
        questionIndex: currentIndex,
      });

      if (isLastQuestion) {
        await updateDoc(doc(db, "sessions", sessionId), {
          completedAt: serverTimestamp(),
        });
        await router.push("/assessment/done");
        return;
      }

      setSelectedOption(null);
      setConfidence(50);
      setCurrentIndex((index) => index + 1);
    } catch (error) {
      console.error(error);
      setSubmitError("We couldn't save your response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!clientReady || !authLoaded) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50 px-4 py-12 text-slate-600">
        <p>Loading assessment…</p>
      </main>
    );
  }

  if (authMissing) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50 px-4 py-12">
        <Card className="max-w-md p-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Assessment unavailable</h1>
          <p className="mt-3 text-slate-600">
            Firebase environment variables are missing. Add them to enable the assessment experience.
          </p>
        </Card>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50 px-4 py-12 text-slate-600">
        <p>Redirecting to login…</p>
      </main>
    );
  }

  if (sessionError) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50 px-4 py-12">
        <Card className="max-w-md p-8 space-y-4 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Assessment</h1>
          <p className="text-slate-600">{sessionError}</p>
          <Button onClick={startSession} disabled={creatingSession} loading={creatingSession}>
            Try again
          </Button>
        </Card>
      </main>
    );
  }

  if (!sessionId) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50 px-4 py-12 text-slate-600">
        <p>Setting up your assessment…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Card className="p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <span className="font-medium text-indigo-600">{currentQuestion.pillar}</span>
            <span>Question {currentIndex + 1} of {QUESTIONS.length}</span>
          </div>

          <h1 className="mt-4 text-2xl font-semibold text-slate-900">{currentQuestion.stem}</h1>

          <div className="mt-6 grid gap-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={option}
                type="button"
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition",
                  selectedOption === index
                    ? "border-indigo-500 bg-indigo-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
                onClick={() => setSelectedOption(index)}
                disabled={submitting}
              >
                <span className="mt-0.5 text-sm font-semibold text-indigo-600">
                  {OPTION_PREFIX[index]}
                </span>
                <span className="text-sm text-slate-700">{option}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
            <span>Estimated: ~{currentQuestion.estTimeSec}s</span>
            <span>Time: {elapsedSeconds}s</span>
          </div>

          <div className="mt-6">
            <ConfidenceSlider value={confidence} onChange={setConfidence} disabled={submitting} />
          </div>

          {submitError && <p className="mt-4 text-sm text-rose-600">{submitError}</p>}

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSubmit} disabled={!canSubmit} loading={submitting}>
              {isLastQuestion ? "Finish Assessment" : "Next Question"}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
