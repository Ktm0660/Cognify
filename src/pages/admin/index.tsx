import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  type Firestore,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { getFirebaseApp } from "@/firebase";
import { formatTimestamp } from "@/lib/format";

// TODO: Move ALLOWED_ADMIN_UIDS to environment configuration
const ALLOWED_ADMIN_UIDS = ["example-admin-uid"];

type SessionRow = {
  id: string;
  userId: string;
  startedAt: unknown;
  completedAt: unknown;
  overallAccuracy: number | null;
};

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
});

export default function AdminSessionsPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [sessions, setSessions] = React.useState<SessionRow[]>([]);

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
        console.error("[AdminSessions] auth init failed", err);
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
    if (!isAdmin || checkingAuth) {
      return;
    }

    let cancelled = false;

    const loadSessions = async (db: Firestore) => {
      setLoading(true);
      setError(null);
      try {
        const sessionsQuery = query(
          collection(db, "sessions"),
          orderBy("startedAt", "desc"),
          limit(50)
        );
        const snapshot = await getDocs(sessionsQuery);
        if (cancelled) return;

        const rows = snapshot.docs.map((docSnap: QueryDocumentSnapshot) => {
          const data = docSnap.data() as Record<string, unknown>;
          const summary =
            data?.summary && typeof data.summary === "object"
              ? (data.summary as { overallAccuracy?: unknown })
              : null;
          const overallAccuracy =
            summary && typeof summary.overallAccuracy === "number"
              ? summary.overallAccuracy
              : null;

          return {
            id: docSnap.id,
            userId:
              typeof data.userId === "string" && data.userId.trim().length > 0
                ? data.userId
                : "—",
            startedAt: data.startedAt ?? null,
            completedAt: data.completedAt ?? null,
            overallAccuracy,
          } satisfies SessionRow;
        });

        setSessions(rows);
      } catch (err) {
        console.error("[AdminSessions] failed to load sessions", err);
        if (!cancelled) {
          setError("Unable to load sessions. Please try again later.");
          setSessions([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    try {
      const app = getFirebaseApp();
      const db = getFirestore(app);
      void loadSessions(db);
    } catch (err) {
      console.error("[AdminSessions] firestore init failed", err);
      setError("Unable to connect to Firestore.");
      setLoading(false);
      setSessions([]);
    }

    return () => {
      cancelled = true;
    };
  }, [checkingAuth, isAdmin]);

  const content = (() => {
    if (checkingAuth || loading) {
      return (
        <div className="flex min-h-[200px] items-center justify-center text-sm text-slate-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <span className="ml-2">Loading…</span>
        </div>
      );
    }

    if (error) {
      return <p className="text-sm text-rose-600">{error}</p>;
    }

    if (!sessions.length) {
      return <p className="text-sm text-slate-500">No sessions found.</p>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Started</th>
              <th className="px-4 py-3">Completed</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Session ID</th>
              <th className="px-4 py-3">Overall Accuracy</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sessions.map((session) => (
              <tr key={session.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-600">
                  {formatTimestamp(session.startedAt)}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {formatTimestamp(session.completedAt)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">
                  {session.userId}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">
                  {session.id}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {session.overallAccuracy !== null
                    ? percentFormatter.format(session.overallAccuracy)
                    : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/session/${session.id}`}>
                    <Button
                      variant="secondary"
                      className="px-3 py-1 text-xs font-semibold"
                    >
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  })();

  return (
    <main className="bg-slate-50 min-h-screen py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Card className="p-6">
          <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Admin · Sessions</h1>
              <p className="text-sm text-slate-500">
                Latest 50 sessions for quick review.
              </p>
            </div>
          </div>
          <div className="mt-6">{content}</div>
        </Card>
      </div>
    </main>
  );
}
