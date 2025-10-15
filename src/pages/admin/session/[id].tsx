import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { getFirebaseApp } from "@/firebase";
import { formatTimestamp } from "@/lib/format";
import {
  PILLAR_LABELS,
  type PillarKey,
  type PillarSummary,
  type ScoreSummary,
} from "@/lib/scoring";

// TODO: Move ALLOWED_ADMIN_UIDS to environment configuration
const ALLOWED_ADMIN_UIDS = ["example-admin-uid"];

type LoadedSummary = {
  overallAccuracy: number | null;
  calibrationAbsError: number | null;
  pillars: Record<PillarKey, PillarSummary>;
};

type SessionDetails = {
  id: string;
  userId: string;
  startedAt: unknown;
  completedAt: unknown;
  summary: LoadedSummary | null;
};

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
});

const calibrationFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

function normalizeSummary(summary: unknown): LoadedSummary | null {
  if (!summary || typeof summary !== "object") {
    return null;
  }

  const cast = summary as ScoreSummary | null;
  if (!cast) {
    return null;
  }

  const pillars = PILLAR_LABELS.reduce((acc, key) => {
    const entry = cast.pillars?.[key];
    acc[key] = {
      nItems: entry?.nItems ?? 0,
      nCorrect: entry?.nCorrect ?? 0,
      accuracy: entry?.accuracy ?? 0,
    } satisfies PillarSummary;
    return acc;
  }, {} as LoadedSummary["pillars"]);

  return {
    overallAccuracy:
      typeof cast.overallAccuracy === "number" ? cast.overallAccuracy : null,
    calibrationAbsError:
      typeof cast.calibrationAbsError === "number"
        ? cast.calibrationAbsError
        : null,
    pillars,
  };
}

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value === "object" && value !== null) {
    const maybe = value as { seconds?: number; toDate?: () => Date };
    if (typeof maybe.toDate === "function") {
      try {
        const result = maybe.toDate();
        if (result instanceof Date && !Number.isNaN(result.getTime())) {
          return result;
        }
      } catch {
        // ignore
      }
    }
    if (typeof maybe.seconds === "number") {
      return new Date(maybe.seconds * 1000);
    }
  }

  return null;
}

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export default function AdminSessionDetailPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [session, setSession] = React.useState<SessionDetails | null>(null);
  const [downloading, setDownloading] = React.useState(false);

  React.useEffect(() => {
    let redirected = false;
    let unsubscribe: (() => void) | null = null;

    (async () => {
      try {
        const app = getFirebaseApp();
        const auth = getAuth(app);
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          const allowed = !!(
            currentUser && ALLOWED_ADMIN_UIDS.includes(currentUser.uid)
          );
          setIsAdmin(allowed);
          setCheckingAuth(false);
          if (!allowed && !redirected) {
            redirected = true;
            router.replace("/");
          }
        });
      } catch (err) {
        console.error("[AdminSession] auth init failed", err);
        setCheckingAuth(false);
        setIsAdmin(false);
        if (!redirected) {
          redirected = true;
          router.replace("/");
        }
      }
    })();

    return () => {
      redirected = true;
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [router]);

  React.useEffect(() => {
    if (!router.isReady || checkingAuth || !isAdmin) {
      return;
    }

    const sessionIdParam = router.query.id;
    const sessionId = Array.isArray(sessionIdParam)
      ? sessionIdParam[0]
      : sessionIdParam;

    if (!sessionId) {
      setError("Session not found.");
      setLoading(false);
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
            setError("Session not found.");
            setSession(null);
          }
          return;
        }

        const data = snapshot.data() as Record<string, unknown>;
        const summary = normalizeSummary(data?.summary);

        if (!cancelled) {
          setSession({
            id: snapshot.id,
            userId:
              typeof data.userId === "string" && data.userId.trim().length > 0
                ? data.userId
                : "—",
            startedAt: data.startedAt ?? null,
            completedAt: data.completedAt ?? null,
            summary,
          });
          setError(null);
        }
      } catch (err) {
        console.error("[AdminSession] failed to load session", err);
        if (!cancelled) {
          setError("Unable to load session.");
          setSession(null);
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
  }, [checkingAuth, isAdmin, router.isReady, router.query.id]);

  const handleDownload = React.useCallback(async () => {
    if (!router.isReady) {
      return;
    }
    const sessionIdParam = router.query.id;
    const sessionId = Array.isArray(sessionIdParam)
      ? sessionIdParam[0]
      : sessionIdParam;

    if (!sessionId) {
      return;
    }

    try {
      setError(null);
      setDownloading(true);
      const app = getFirebaseApp();
      const db = getFirestore(app);
      const responsesQuery = query(
        collection(db, "responses"),
        where("sessionId", "==", sessionId),
        orderBy("questionIndex", "asc")
      );
      const snapshot = await getDocs(responsesQuery);

      const headers = [
        "userId",
        "sessionId",
        "itemId",
        "pillar",
        "optionSelected",
        "correct",
        "startedAt",
        "submittedAt",
        "rtMs",
        "confidence",
        "questionIndex",
      ];

      const rows = snapshot.docs.map((docSnap: QueryDocumentSnapshot) => {
        const data = docSnap.data() as Record<string, unknown>;
        const startedAtIso = toDate(data.startedAt)?.toISOString() ?? "";
        const submittedAtIso = toDate(data.submittedAt)?.toISOString() ?? "";

        const rawRow = [
          data.userId ?? "",
          data.sessionId ?? "",
          data.itemId ?? "",
          data.pillar ?? "",
          data.optionSelected ?? "",
          typeof data.correct === "boolean" ? data.correct : "",
          startedAtIso,
          submittedAtIso,
          typeof data.rtMs === "number" ? data.rtMs : "",
          typeof data.confidence === "number" ? data.confidence : "",
          typeof data.questionIndex === "number" ? data.questionIndex : "",
        ];

        return rawRow.map(escapeCsvValue).join(",");
      });

      const csv = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `session-${sessionId}-responses.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[AdminSession] failed to export responses", err);
      setError("Unable to export responses.");
    } finally {
      setDownloading(false);
    }
  }, [router.isReady, router.query.id]);

  const summaryContent = (() => {
    if (!session?.summary) {
      return <p className="text-sm text-slate-500">Summary not available.</p>;
    }

    const { summary } = session;

    return (
      <div className="space-y-4">
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Overview
          </div>
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase text-slate-500">
                Overall Accuracy
              </div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">
                {summary.overallAccuracy !== null
                  ? percentFormatter.format(summary.overallAccuracy)
                  : "—"}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase text-slate-500">
                Calibration Gap
              </div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">
                {summary.calibrationAbsError !== null
                  ? calibrationFormatter.format(summary.calibrationAbsError)
                  : "—"}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Pillars
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Pillar</th>
                  <th className="px-4 py-3">Correct</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PILLAR_LABELS.map((pillar) => {
                  const entry = summary.pillars[pillar];
                  return (
                    <tr key={pillar}>
                      <td className="px-4 py-3 text-slate-600">{pillar}</td>
                      <td className="px-4 py-3 text-slate-600">{entry.nCorrect}</td>
                      <td className="px-4 py-3 text-slate-600">{entry.nItems}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {percentFormatter.format(entry.accuracy)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  })();

  const headerContent = (
    <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Session {session?.id ?? ""}
        </h1>
        <p className="text-sm text-slate-500">
          User: <span className="font-mono text-xs">{session?.userId ?? "—"}</span>
        </p>
        <p className="text-xs text-slate-400">
          Started: {formatTimestamp(session?.startedAt)} · Completed: {formatTimestamp(session?.completedAt)}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/admin">
          <Button variant="secondary" className="px-3 py-1 text-xs font-semibold">
            Back to Sessions
          </Button>
        </Link>
        <Button
          onClick={handleDownload}
          loading={downloading}
          disabled={downloading}
          className="px-3 py-1 text-xs font-semibold"
        >
          Download Responses (CSV)
        </Button>
      </div>
    </div>
  );

  const bodyContent = (() => {
    if (checkingAuth || loading) {
      return (
        <div className="flex min-h-[200px] items-center justify-center text-sm text-slate-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <span className="ml-2">Loading…</span>
        </div>
      );
    }

    if (error && !session) {
      return <p className="text-sm text-rose-600">{error}</p>;
    }

    return summaryContent;
  })();

  return (
    <main className="bg-slate-50 min-h-screen py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Card className="p-6">
          {headerContent}
          {error && session ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          ) : null}
          <div className="mt-6">{bodyContent}</div>
        </Card>
      </div>
    </main>
  );
}
