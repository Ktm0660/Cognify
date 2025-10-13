import React from "react";

import { isConfigured, readEnv } from "../firebase";

const FIREBASE_KEYS = [
  "API_KEY",
  "AUTH_DOMAIN",
  "PROJECT_ID",
  "STORAGE_BUCKET",
  "MESSAGING_SENDER_ID",
  "APP_ID",
  "MEASUREMENT_ID",
] as const;

const EnvCheckPage: React.FC = () => {
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
            {FIREBASE_KEYS.map((key) => {
              const envKey = `FIREBASE_${key}`;
              const present = Boolean(readEnv(envKey));

              return (
                <tr key={key}>
                  <td className="py-3 pr-8 font-mono text-slate-600">{envKey}</td>
                  <td className="py-3 text-slate-900">{present ? "✅" : "❌"}</td>
                </tr>
              );
            })}
            <tr>
              <td className="py-3 pr-8 font-mono text-slate-600">ASSESSMENT READY?</td>
              <td className="py-3 text-slate-900">{isConfigured() ? "✅" : "❌"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default EnvCheckPage;
