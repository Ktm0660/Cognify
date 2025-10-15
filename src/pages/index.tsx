import React, { useRef } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Pill from "@/components/ui/Pill";

const TRAITS = [
  {
    id: "clarity-awareness",
    label: "Clarity & Awareness",
    blurb: "Spot assumptions, framing, and bias before they steer you.",
  },
  {
    id: "evidence-evaluation",
    label: "Evidence & Evaluation",
    blurb: "Weigh sources, effect sizes, and uncertainty like a pro.",
  },
  {
    id: "logic-reasoning",
    label: "Logic & Reasoning",
    blurb: "Build conclusions that actually follow from the facts.",
  },
  {
    id: "decision-problem-solving",
    label: "Decision & Problem Solving",
    blurb: "Make trade-offs with expected value and simple rules for action.",
  },
  {
    id: "reflection-adaptation",
    label: "Reflection & Adaptation",
    blurb: "Update with feedback, calibrate confidence, improve next time.",
  },
  {
    id: "dispositional-mindset",
    label: "Dispositional Mindset",
    blurb: "Practice curiosity, humility, and fair-minded debate.",
  },
];

export default function HomePage() {
  const howRef = useRef<HTMLDivElement>(null);

  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="relative bg-[radial-gradient(1000px_600px_at_50%_-100px,theme(colors.indigo.100),white,white)]">
        <div className="relative mx-auto max-w-screen-xl px-4 py-20 sm:px-6 lg:px-8">
          <header className="text-center">
            <div className="mx-auto mb-6 inline-block rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              COGNIFY
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              <span className="block">
                Play Smarter.{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">Think Deeper.</span>
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Challenge your mind with quick games that reveal how you think. Measure six core skills. Train your brain. Watch yourself grow.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/assessment">
                <Button variant="gradient">Take the Assessment</Button>
              </Link>
              <Button variant="secondary" onClick={() => howRef.current?.scrollIntoView({ behavior: "smooth" })}>
                How It Works
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-3 opacity-90">
              {TRAITS.slice(0, 6).map((trait) => (
                <Pill key={trait.id}>{trait.label}</Pill>
              ))}
            </div>
          </header>
        </div>
      </section>

      <section ref={howRef} className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">How It Works</h2>
        <p className="mt-2 text-center text-slate-600">Play quick games, discover your strengths, and follow missions to grow.</p>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <h3 className="font-semibold">🎮 Play</h3>
            <p className="mt-2 text-slate-600">Fun, fast challenges grounded in cognitive science.</p>
          </Card>
          <Card>
            <h3 className="font-semibold">🔎 Discover</h3>
            <p className="mt-2 text-slate-600">See your Thinking Profile across six core skills.</p>
          </Card>
          <Card>
            <h3 className="font-semibold">⚡ Improve</h3>
            <p className="mt-2 text-slate-600">Follow tailored missions to level up how you think.</p>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-screen-xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">The Six Core Skills</h2>
        <p className="mt-2 text-center text-slate-600">Six skills that make thinking clear, accurate, and adaptable.</p>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TRAITS.map((trait) => (
            <Card key={trait.id} className="hover:border-indigo-200">
              <h3 className="font-semibold">{trait.label}</h3>
              <p className="mt-2 text-slate-600">{trait.blurb}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/assess/mini">
            <Button variant="gradient">Start the Assessment</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
