import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import RadarSix from "@/components/RadarSix";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { getFirebaseApp } from "@/firebase";
import {
  PILLAR_LABELS,
  type PillarKey,
  type PillarSummary,
  type ScoreSummary,
} from "@/lib/scoring";

export const dynamic = "force-dynamic";

type LoadedSummary = ScoreSummary & {
  pillars: Record<PillarKey, PillarSummary>;
};

function normalizeSummary(summary: ScoreSummary | null | undefined): LoadedSummary | null {
  if (!summary) {
    return null;
  }

  const normalizedPillars = PILLAR_LABELS.reduce(
    (acc, pillar) => {
      const entry = summary.pillars?.[pillar];
      acc[pillar] = {
        nItems: entry?.nItems ?? 0,
        nCorrect: entry?.nCorrect ?? 0,
        accuracy: entry?.accuracy ?? 0,
      };
      return acc;
    },
    {} as Record<PillarKey, PillarSummary>
  );

  return {
    overallAccuracy: typeof summary.overallAccuracy === "number" ? summary.overallAccuracy : 0,
    calibrationAbsError:
      typeof summary.calibrationAbsError === "number" ? summary.calibrationAbsError : 0,
    pillars: normalizedPillars,
  };
}

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
});

const calibrationFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

export default function AssessmentDonePage() {
  const router = useRouter();
  const { sid } = router.query;

  const [loading, setLoading] = React.useState(true);
  const [summary, setSummary] = React.useState<LoadedSummary | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const sessionId = Array.isArray(sid) ? sid[0] : sid;
    if (!sessionId) {
      setLoading(false);
      setError("Session not found.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const app = getFirebaseApp();
        const db = getFirestore(app);
        const snapshot = await getDoc(doc(db, "sessions", sessionId));

        if (!snapshot.exists()) {
          if (!cancelled) {
            setSummary(null);
            setError("We couldn’t find your results yet.");
          }
          return;
        }

        const data = snapshot.data();
        const normalized = normalizeSummary(data?.summary as ScoreSummary | null | undefined);

        if (!cancelled) {
          if (normalized) {
            setSummary(normalized);
            setError(null);
          } else {
            setSummary(null);
            setError("Results are still processing. Please check back soon.");
          }
        }
      } catch (err) {
        console.error("[AssessmentDone] failed to load session", err);
        if (!cancelled) {
          setSummary(null);
          setError("We couldn’t load your results. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, sid]);

  const strongest = React.useMemo(() => {
    if (!summary) return null;
    const entries = PILLAR_LABELS.map((label) => ({
      label,
      accuracy: summary.pillars[label].accuracy,
    })).sort((a, b) => b.accuracy - a.accuracy);
    return entries[0] ?? null;
  }, [summary]);

  const improvement = React.useMemo(() => {
    if (!summary) return null;
    const entries = PILLAR_LABELS.map((label) => ({
      label,
      accuracy: summary.pillars[label].accuracy,
    })).sort((a, b) => a.accuracy - b.accuracy);
    return entries[0] ?? null;
  }, [summary]);

  const content = (() => {
    if (loading) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-slate-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p>Loading results…</p>
        </div>
      );
    }

    if (error && !summary) {
      return (
        <div className="space-y-4 text-center">
          <p className="text-base text-slate-600">{error}</p>
          <div className="flex justify-center">
            <Link href="/">
              <Button variant="secondary">Back to Home</Button>
            </Link>
          </div>
        </div>
      );
    }

    if (!summary) {
      return null;
    }

    const values = PILLAR_LABELS.map((label) => ({
      label,
      value: summary.pillars[label].accuracy,
    }));

    return (
      <>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Your Thinking Profile
        </h2>
        <div className="mt-4 text-5xl font-bold text-slate-900">
          {percentFormatter.format(summary.overallAccuracy)}
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Overall accuracy · Calibration gap {calibrationFormatter.format(summary.calibrationAbsError)}
        </p>
        <div className="mt-10 flex justify-center">
          <RadarSix values={values} />
        </div>
        <div className="mt-8 space-y-3 text-left text-sm text-slate-600">
          {strongest ? (
            <p>
              <span className="font-semibold text-slate-900">Strongest:</span> {strongest.label} at {percentFormatter.format(strongest.accuracy)} accuracy.
            </p>
          ) : null}
          {improvement ? (
            <p>
              <span className="font-semibold text-slate-900">Next to improve:</span> {improvement.label} at {percentFormatter.format(improvement.accuracy)} accuracy.
            </p>
          ) : null}
        </div>
        <div className="mt-10 flex justify-center">
          <Link href="/">
            <Button variant="gradient">Back to Home</Button>
          </Link>
        </div>
      </>
    );
  })();

  return (
    <main className="bg-slate-50">
      <div className="mx-auto min-h-[70vh] max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Card className="p-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Your Thinking Profile</h1>
          <div className="mt-6">{content}</div>
        </Card>
      </div>
    </main>
  );
}
