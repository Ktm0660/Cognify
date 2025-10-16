import { Metadata } from "next";
import {
  buildRecommendations,
  calcEmergencyMonths,
  calcSavingsProgress,
  normalizeTo100,
  scoreToBand,
} from "@/lib/health";

type AssessmentInputs = {
  dti?: number | null;
  monthlyExpenses?: number | null;
  emergencyFund?: number | null;
  creditUtilization?: number | null;
};

export const metadata: Metadata = {
  title: "Financial Health Assessment",
};

const mockSavingsEntries: Array<{ current?: number | null; target?: number | null }> = [];

function computeAssessment({
  dti,
  monthlyExpenses,
  emergencyFund,
  creditUtilization,
}: AssessmentInputs) {
  // ensure primitives are numbers (null -> 0)
  const n = (v: number | null | undefined) => v ?? 0;
  const emerg = calcEmergencyMonths({ monthlyExpenses, emergencyFund });
  const savings = calcSavingsProgress(mockSavingsEntries); // v1 simple

  const score = normalizeTo100(
    n(dti),
    n(emerg),
    n(savings),
    n(creditUtilization)
  );

  const band = scoreToBand(score);
  const recs = buildRecommendations(
    n(dti),
    n(emerg),
    n(savings),
    n(creditUtilization)
  );

  return { score, band, recs };
}

export default function AssessPage() {
  const { score, band, recs } = computeAssessment({
    dti: null,
    monthlyExpenses: null,
    emergencyFund: null,
    creditUtilization: null,
  });

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 py-10">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Financial Health Assessment</h1>
        <p className="text-slate-600">
          This placeholder page demonstrates the normalized scoring helpers.
        </p>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-medium text-slate-900">Results snapshot</h2>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-slate-100 bg-slate-50 p-4">
            <dt className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Overall score
            </dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-900">
              {score.toFixed(1)} / 100
            </dd>
          </div>
          <div className="rounded-md border border-slate-100 bg-slate-50 p-4">
            <dt className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Health band
            </dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-900">{band}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium text-slate-900">Recommendations</h2>
        <ul className="space-y-2">
          {recs.map((rec, index) => (
            <li
              key={index}
              className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
            >
              {rec}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
