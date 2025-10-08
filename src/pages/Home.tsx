// @ts-nocheck
import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ---------------- DATA ---------------- */
const TRAITS = [
  { id: "exploration", label: "Exploration", blurb: "Try new ideas and chase curiosity." },
  { id: "logic", label: "Logic & Reasoning", blurb: "Build conclusions that fit the facts." },
  { id: "adaptability", label: "Adaptability", blurb: "Change your strategy when rules change." },
  { id: "risk", label: "Risk & Reward", blurb: "Make smarter decisions under pressure." },
  { id: "cooperation", label: "Cooperation", blurb: "Use trust and strategy for win–wins." },
  { id: "metacognition", label: "Metacognition", blurb: "See how your mind works—then improve it." },
  { id: "creativity", label: "Creativity", blurb: "Turn imagination into solutions." },
];

const GAMES = [
  { id: "pattern", name: "Pattern Game", tagline: "Test before you guess.", traits: ["exploration", "logic", "metacognition"] },
  { id: "ice-cream", name: "Ice Cream Battle", tagline: "Trust, betray, or outplay.", traits: ["cooperation", "risk", "metacognition"] },
  { id: "towers", name: "Towers", tagline: "Plan, adapt, and outthink.", traits: ["logic", "adaptability", "creativity"] },
];

/* ---------------- PAGE ---------------- */
export default function Home() {
  const howRef = useRef<HTMLDivElement | null>(null);
  const scrollToHow = () => howRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="bg-white text-slate-900">
      <Hero onHowClick={scrollToHow} />
      <div ref={howRef}>
        <HowItWorks />
      </div>
      <SevenTraits />
      <GamesShowcase />
      <GrowthSection />
      <WhyItMatters />
      <ClosingCta />
    </main>
  );
}

/* ---------------- UI PRIMITIVES ---------------- */
function PrimaryLinkButton({ to, children, ariaLabel }: { to: string; children: React.ReactNode; ariaLabel?: string }) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 transition"
    >
      {children}
    </Link>
  );
}

function SecondaryButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-3 text-slate-700 font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 transition"
    >
      {children}
    </button>
  );
}

function TraitPill({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2 border transition ${
        active
          ? "bg-indigo-50 text-indigo-700 border-indigo-300"
          : "bg-white text-slate-700 border-slate-300 hover:border-indigo-300"
      }`}
    >
      {label}
    </span>
  );
}

/* ---------------- HERO ---------------- */
function Hero({ onHowClick }: { onHowClick: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-white to-white"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-20">
        <header className="text-center">
          <div className="mx-auto inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-xs font-semibold text-indigo-700 mb-6">
            Cognify
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Play Smarter. Think Deeper.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            Challenge your mind with games that reveal how you think. Measure your skills. Train your brain. Watch yourself grow.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            {/* Your existing “Play Now” can go to /app or similar */}
            <PrimaryLinkButton to="/assess/mini" ariaLabel="Take the Assessment">
              Take the 3-Minute Assessment
            </PrimaryLinkButton>
            <button
              aria-label="How It Works"
              onClick={onHowClick}
              className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-3 text-slate-700 font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 transition"
            >
              How It Works
            </button>
          </div>
        </header>

        {/* subtle floating trait pills */}
        <div className="mt-14 flex justify-center flex-wrap gap-3 opacity-80">
          {TRAITS.slice(0, 5).map((t) => (
            <TraitPill key={t.id} label={t.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- HOW IT WORKS ---------------- */
function HowItWorks() {
  const steps = [
    { title: "Play", desc: "Fun, fast challenges built on real cognitive science.", icon: "🎮" },
    { title: "Discover", desc: "See your Thinking Profile grow across seven skills.", icon: "🧭" },
    { title: "Improve", desc: "Get tailored missions to strengthen how you think.", icon: "⚡" },
  ];
  return (
    <section className="py-20 bg-white" aria-labelledby="how-heading">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <h2 id="how-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">How It Works</h2>
        <p className="mt-3 text-center text-slate-600 max-w-2xl mx-auto">Play quick games, discover your strengths, and follow missions to grow.</p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition hover:-translate-y-0.5">
              <div className="text-3xl" aria-hidden="true">{s.icon}</div>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- RADAR PLACEHOLDER ---------------- */
function RadarSvg({ values }: { values: number[] }) {
  const R = 80, cx = 100, cy = 100;
  const points = values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
    const r = R * (0.2 + 0.8 * v);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${x},${y}`;
  });
  return (
    <svg width="200" height="200" role="img" aria-label="Thinking Profile Radar">
      {[0.4, 0.6, 0.8, 1].map((g, i) => <circle key={i} cx={cx} cy={cy} r={R * g} fill="none" stroke="#e2e8f0" strokeDasharray="4 4" />)}
      {new Array(values.length).fill(0).map((_, i) => {
        const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
        const x2 = cx + R * Math.cos(angle);
        const y2 = cy + R * Math.sin(angle);
        return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke="#e2e8f0" />;
      })}
      <polygon points={points.join(" ")} fill="#6366F170" stroke="#6366F1" strokeWidth="2" />
    </svg>
  );
}

/* ---------------- SEVEN TRAITS ---------------- */
function SevenTraits() {
  const [active, setActive] = useState(TRAITS[0].id);
  const activeTrait = useMemo(() => TRAITS.find((t) => t.id === active)!, [active]);
  const mockValues = [0.65, 0.55, 0.48, 0.6, 0.42, 0.58, 0.45];

  return (
    <section className="py-20 bg-slate-50" aria-labelledby="traits-heading">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <h2 id="traits-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">The Seven Traits</h2>
        <p className="mt-3 text-center text-slate-600 max-w-2xl mx-auto">Seven skills that make thinking clear, creative, and adaptable.</p>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="flex items-center justify-center">
            <RadarSvg values={mockValues} />
          </div>

          <div>
            <ul className="flex flex-wrap gap-2 mb-4" role="list">
              {TRAITS.map((t) => (
                <li key={t.id}>
                  <button
                    className={`rounded-full px-3 py-1 text-sm font-medium border transition ${
                      active === t.id ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:border-indigo-300"
                    }`}
                    onClick={() => setActive(t.id)}
                    aria-label={`Select ${t.label}`}
                  >
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold">{activeTrait.label}</h3>
              <p className="mt-2 text-slate-600">{activeTrait.blurb}</p>
              <div className="mt-4">
                <PrimaryLinkButton to="/assess/mini" ariaLabel="Take 3-minute test">
                  Take the 3-Minute Thinking Test
                </PrimaryLinkButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- GAMES SHOWCASE ---------------- */
function GamesShowcase() {
  return (
    <section className="py-20 bg-white" aria-labelledby="games-heading">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <h2 id="games-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">Inside the Games</h2>
        <p className="mt-3 text-center text-slate-600 max-w-2xl mx-auto">Play fast, learn fast. Each game targets different thinking skills.</p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {GAMES.map((g) => (
            <article key={g.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition hover:-translate-y-0.5">
              <div className="h-32 rounded-lg bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 flex items-center justify-center text-slate-500">
                <span className="text-sm">Gameplay Preview</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{g.name}</h3>
              <p className="text-slate-600">{g.tagline}</p>
              <div className="mt-3">
                {g.traits.map((tId) => {
                  const t = TRAITS.find((x) => x.id === tId)!;
                  return <TraitPill key={tId} label={t.label} />;
                })}
              </div>
              <div className="mt-4">
                <Link to="/assess/mini" className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-3 text-slate-700 font-semibold hover:bg-slate-50 transition">
                  Play Demo
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- GROWTH SECTION ---------------- */
function GrowthSection() {
  const bars = [
    { id: "exploration", label: "Exploration", value: 62 },
    { id: "logic", label: "Logic", value: 55 },
    { id: "adaptability", label: "Adaptability", value: 48 },
    { id: "risk", label: "Risk & Reward", value: 60 },
    { id: "metacognition", label: "Metacognition", value: 58 },
  ];
  return (
    <section className="py-20 bg-slate-50">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Your Thinking Profile</h3>
            <p className="mt-1 text-slate-600">Watch your scores rise as you master each trait.</p>
            <div className="mt-5 space-y-3">
              {bars.map((b) => (
                <div key={b.id}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{b.label}</span>
                    <span className="text-slate-500">{b.value}</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${b.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link to="/assess/mini" className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-3 text-slate-700 font-semibold hover:bg-slate-50 transition">
                View Full Dashboard
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Your Growth Over Time</h2>
            <p className="mt-3 text-slate-600">
              See how your Exploration score rises as you master curiosity. Every round makes your mind a little sharper.
              Personalized missions target your weakest traits so progress always feels within reach.
            </p>
            <div className="mt-5 flex gap-3">
              <Link to="/assess/mini" className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-indigo-500 transition">
                Start Your Journey
              </Link>
              <a href="#traits-heading" className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-3 text-slate-700 font-semibold hover:bg-slate-50 transition">
                See Example Insights
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHY IT MATTERS ---------------- */
function WhyItMatters() {
  return (
    <section className="py-20 bg-white" aria-labelledby="why-heading">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 id="why-heading" className="text-2xl sm:text-3xl font-bold text-slate-900">Why It Matters</h2>
          <p className="mt-3 text-slate-600">
            Cognify turns cognitive science into play. Every game measures real thinking patterns—exploration, logic, adaptability,
            risk, cooperation, metacognition, and creativity—then gives you insights to grow.
          </p>
          <p className="mt-3 text-slate-600">We believe critical thinking should be as fun as any video game—and just as rewarding.</p>
          <div className="mt-4 inline-block rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            Backed by research. Designed for growth.
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-8 shadow-sm">
          <h3 className="text-lg font-semibold">What you’ll build</h3>
          <ul className="mt-3 list-disc pl-5 text-slate-600 space-y-1">
            <li>Clarity in how you think</li>
            <li>Confidence under uncertainty</li>
            <li>Creative problem-solving</li>
            <li>Strategies for cooperation</li>
          </ul>
          <div className="mt-6">
            <a href="#how-heading" className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-3 text-slate-700 font-semibold hover:bg-slate-50 transition">
              Learn the Science
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CLOSING CTA ---------------- */
function ClosingCta() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500" aria-hidden="true" />
      <div className="relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-white">Start your journey to smarter thinking</h2>
        <p className="mt-3 text-indigo-100 max-w-2xl mx-auto">
          Compete with friends, track your growth, and see how far your mind can go.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <PrimaryLinkButton to="/assess/mini" ariaLabel="Play now">Play Now</PrimaryLinkButton>
          <a
            aria-label="Learn more"
            href="#traits-heading"
            className="inline-flex items-center justify-center rounded-md bg-white/10 px-5 py-3 text-white font-semibold ring-1 ring-white/30 hover:bg-white/20 transition"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
