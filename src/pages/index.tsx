import React, { useRef } from "react";
import Link from "next/link";

const TRAITS = [
  { id: "exploration", label: "Exploration", blurb: "Try new ideas and chase curiosity." },
  { id: "logic", label: "Logic & Reasoning", blurb: "Build conclusions that fit the facts." },
  { id: "adaptability", label: "Adaptability", blurb: "Change strategy when rules change." },
  { id: "risk", label: "Risk & Reward", blurb: "Make smart decisions under pressure." },
  { id: "cooperation", label: "Cooperation", blurb: "Use trust and strategy for win–wins." },
  { id: "metacognition", label: "Metacognition", blurb: "See how your mind works—then improve it." },
  { id: "creativity", label: "Creativity", blurb: "Turn imagination into solutions." },
];

export default function HomePage() {
  const howRef = useRef<HTMLDivElement | null>(null);
  const scrollToHow = () => howRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="relative pb-16 pt-20 bg-hero">
        <div className="mx-auto max-w-6xl px-4">
          <header className="text-center">
            <div className="mx-auto inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-xs font-semibold text-indigo-700 mb-6">
              COGNIFY
            </div>
            <p className="text-sm text-slate-600">Welcome to the Thinking Games Lab</p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
                Play Smarter. Think Deeper.
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
              Challenge your mind with games that reveal how you think. Measure your skills. Train your brain. Watch yourself grow.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/assess/mini"
                className="inline-flex items-center justify-center rounded-md px-6 py-3 text-white font-semibold shadow-soft
                           bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-orange-400 hover:brightness-110 transition"
              >
                Take the 3-Minute Assessment
              </Link>
              <button
                onClick={scrollToHow}
                className="inline-flex items-center justify-center rounded-md border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                How It Works
              </button>
            </div>
          </header>

          <div className="mt-10 flex justify-center flex-wrap gap-2 opacity-90">
            {TRAITS.slice(0, 5).map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border bg-white text-slate-700 border-slate-300"
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section ref={howRef} className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold">How It Works</h2>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Play", text: "Fun, fast challenges built on real cognitive science.", icon: "🎮" },
              { title: "Discover", text: "See your Thinking Profile grow across seven skills.", icon: "🔎" },
              { title: "Improve", text: "Get tailored missions to strengthen how you think.", icon: "⚡" },
              { title: "Track", text: "Benchmark your progress and celebrate wins.", icon: "📈" },
            ].map((c) => (
              <div key={c.title} className="card p-6">
                <div className="text-2xl">{c.icon}</div>
                <h3 className="mt-3 font-semibold">{c.title}</h3>
                <p className="mt-1 text-slate-600 text-sm">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEVEN TRAITS */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold">The Seven Traits</h2>
          <p className="mt-2 text-slate-600">Seven skills that make thinking clear, creative, and adaptable.</p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRAITS.map((t) => (
              <div key={t.id} className="card p-5">
                <h3 className="font-semibold">{t.label}</h3>
                <p className="mt-1 text-sm text-slate-600">{t.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="card p-8 text-center">
            <h2 className="text-xl font-bold">Ready to get your Thinking Snapshot?</h2>
            <p className="mt-2 text-slate-600">Three minutes. Seven skills. Instant insight.</p>
            <div className="mt-6">
              <Link
                href="/assess/mini"
                className="inline-flex items-center justify-center rounded-md px-6 py-3 text-white font-semibold shadow-soft
                           bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-orange-400 hover:brightness-110 transition"
              >
                Start the Mini Assessment
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
