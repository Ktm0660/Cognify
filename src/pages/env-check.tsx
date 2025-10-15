import * as React from "react";
import { getFirebaseEnv } from "../firebase";

const KEYS = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
  "FIREBASE_MEASUREMENT_ID",
] as const satisfies readonly (keyof ReturnType<typeof getFirebaseEnv>)[];

const EnvCheckPage: React.FC = () => {
  const env = getFirebaseEnv();
  const present = (key: (typeof KEYS)[number]): boolean => !!env[key];
  const coreKeys = [
    "FIREBASE_API_KEY",
    "FIREBASE_AUTH_DOMAIN",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_APP_ID",
  ] as const;
  const coreReady = coreKeys.every((key) => present(key));

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">Firebase environment check</h1>
      <p className="mt-3 text-slate-600">
        This diagnostic page verifies whether the expected Firebase environment variables are present.
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead>
            <tr>
              <th className="py-3 pr-8 font-semibold text-slate-700">Key</th>
              <th className="py-3 font-semibold text-slate-700">Present?</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {KEYS.map((key) => (
              <tr key={key}>
                <td className="py-3 pr-8 font-mono text-slate-600">{key}</td>
                <td className="py-3 text-slate-900">
                  {present(key) ? "✅ present" : "❌ missing"}
                </td>
              </tr>
            ))}
            <tr>
              <td className="py-3 pr-8 font-mono text-slate-600">CORE READY?</td>
              <td className="py-3 text-slate-900">{coreReady ? "✅ present" : "❌ missing"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default EnvCheckPage;
