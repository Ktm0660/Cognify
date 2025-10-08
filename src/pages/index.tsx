import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";

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

export default function HomePage() {
  const howRef = useRef<HTMLDivElement | null>(null);
  const scrollToHow = () => howRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="home-landing">
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
function PrimaryLinkButton({ href, children, ariaLabel }: { href: string; children: React.ReactNode; ariaLabel?: string }) {
  return (
    <Link href={href} aria-label={ariaLabel} className="primary-button">
      {children}
    </Link>
  );
}

function SecondaryButton({ children, onClick, ariaLabel }: { children: React.ReactNode; onClick?: () => void; ariaLabel?: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className="secondary-button">
      {children}
    </button>
  );
}

function TraitPill({ label, isActive = false }: { label: string; isActive?: boolean }) {
  return <span className={`trait-pill${isActive ? " trait-pill--active" : ""}`}>{label}</span>;
}

/* ---------------- HERO ---------------- */
function Hero({ onHowClick }: { onHowClick: () => void }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__background" aria-hidden="true" />
      <div className="section-inner hero__content">
        <div className="hero__header">
          <span className="hero__badge">Cognify</span>
          <p className="hero__welcome">Welcome to the Thinking Games Lab</p>
          <h1 id="hero-title" className="hero__title">
            Play Smarter. Think Deeper.
          </h1>
          <p className="hero__subtitle">
            Challenge your mind with games that reveal how you think. Measure your skills. Train your brain. Watch yourself grow.
          </p>
          <div className="hero__actions">
            <PrimaryLinkButton href="/assess/mini" ariaLabel="Take the 3 minute assessment">
              Take the 3-Minute Assessment
            </PrimaryLinkButton>
            <SecondaryButton ariaLabel="Scroll to how it works" onClick={onHowClick}>
              How It Works
            </SecondaryButton>
          </div>
        </div>

        <div className="hero__traits" aria-label="Highlighted traits">
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
    <section className="how" aria-labelledby="how-heading">
      <div className="section-inner">
        <h2 id="how-heading" className="section-title">
          How It Works
        </h2>
        <p className="section-subtitle">Play quick games, discover your strengths, and follow missions to grow.</p>

        <div className="how__grid" role="list">
          {steps.map((step) => (
            <article key={step.title} className="how__card" role="listitem">
              <div className="how__icon" aria-hidden="true">
                {step.icon}
              </div>
              <h3 className="how__title">{step.title}</h3>
              <p className="how__description">{step.desc}</p>
            </article>
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
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  });
  return (
    <svg width="200" height="200" role="img" aria-label="Thinking Profile Radar">
      {[0.4, 0.6, 0.8, 1].map((g, i) => <circle key={i} cx={cx} cy={cy} r={R * g} fill="none" stroke="#e2e8f0" strokeDasharray="4 4" />)}
      {new Array(values.length).fill(0).map((_, i) => {
        const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + R * Math.cos(angle)} y2={cy + R * Math.sin(angle)} stroke="#e2e8f0" />;
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
    <section className="traits" aria-labelledby="traits-heading">
      <div className="section-inner">
        <h2 id="traits-heading" className="section-title">
          The Seven Traits
        </h2>
        <p className="section-subtitle">Seven skills that make thinking clear, creative, and adaptable.</p>

        <div className="traits__grid">
          <div className="traits__radar">
            <div className="radar">
              <RadarSvg values={mockValues} />
            </div>
          </div>

          <div className="traits__content">
            <ul className="traits__tabs" role="list">
              {TRAITS.map((trait) => (
                <li key={trait.id}>
                  <button
                    type="button"
                    className={`traits__tab${active === trait.id ? " traits__tab--active" : ""}`}
                    onClick={() => setActive(trait.id)}
                    aria-pressed={active === trait.id}
                    aria-label={`Show information about ${trait.label}`}
                  >
                    {trait.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="traits__card">
              <h3 className="traits__card-title">{activeTrait.label}</h3>
              <p className="traits__card-text">{activeTrait.blurb}</p>
              <div className="traits__card-actions">
                <PrimaryLinkButton href="/assess/mini" ariaLabel="Take 3-minute thinking test">
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
    <section className="games" aria-labelledby="games-heading">
      <div className="section-inner">
        <h2 id="games-heading" className="section-title">
          Inside the Games
        </h2>
        <p className="section-subtitle">Play fast, learn fast. Each game targets different thinking skills.</p>

        <div className="games__grid">
          {GAMES.map((game) => (
            <article key={game.id} className="games__card">
              <div className="games__visual" aria-hidden="true">
                Gameplay Preview
              </div>
              <h3 className="games__card-title">{game.name}</h3>
              <p className="games__card-text">{game.tagline}</p>
              <div className="games__traits">
                {game.traits.map((traitId) => {
                  const trait = TRAITS.find((t) => t.id === traitId)!;
                  return <TraitPill key={traitId} label={trait.label} />;
                })}
              </div>
              <div className="games__actions">
                <Link href="/assess/mini" className="secondary-button">
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
    <section className="growth" aria-labelledby="growth-heading">
      <div className="section-inner">
        <div className="growth__grid">
          <div className="growth__card">
            <h3 className="growth__card-title">Your Thinking Profile</h3>
            <p className="growth__card-text">Watch your scores rise as you master each trait.</p>
            <div className="growth__bars">
              {bars.map((bar) => (
                <div key={bar.id}>
                  <div className="growth__bar-header">
                    <span>{bar.label}</span>
                    <span>{bar.value}</span>
                  </div>
                  <div className="growth__bar-track">
                    <div className="growth__bar-fill" style={{ width: `${bar.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="growth__actions">
              <Link href="/assess/mini" className="secondary-button">
                View Full Dashboard
              </Link>
            </div>
          </div>

          <div className="growth__content">
            <h2 id="growth-heading" className="section-title">
              Your Growth Over Time
            </h2>
            <p className="section-subtitle">
              See how your Exploration score rises as you master curiosity. Every round makes your mind a little sharper.
              Personalized missions target your weakest traits so progress always feels within reach.
            </p>
            <div className="growth__buttons">
              <PrimaryLinkButton href="/assess/mini" ariaLabel="Start your journey">
                Start Your Journey
              </PrimaryLinkButton>
              <Link href="#traits-heading" className="secondary-button">
                See Example Insights
              </Link>
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
    <section className="why" aria-labelledby="why-heading">
      <div className="section-inner why__grid">
        <div className="why__content">
          <h2 id="why-heading" className="section-title">
            Why It Matters
          </h2>
          <p className="section-subtitle">
            Cognify turns cognitive science into play. Every game measures real thinking patterns—exploration, logic, adaptability,
            risk, cooperation, metacognition, and creativity—then gives you insights to grow.
          </p>
          <p className="section-subtitle">We believe critical thinking should be as fun as any video game—and just as rewarding.</p>
          <span className="why__badge">Backed by research. Designed for growth.</span>
        </div>
        <div className="why__card" aria-labelledby="why-card-title">
          <h3 id="why-card-title" className="why__card-title">
            What you’ll build
          </h3>
          <ul className="why__list">
            <li>Clarity in how you think</li>
            <li>Confidence under uncertainty</li>
            <li>Creative problem-solving</li>
            <li>Strategies for cooperation</li>
          </ul>
          <div className="why__actions">
            <Link href="#how-heading" className="secondary-button">
              Learn the Science
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CLOSING CTA ---------------- */
function ClosingCta() {
  return (
    <section className="cta" aria-labelledby="cta-heading">
      <div className="cta__background" aria-hidden="true" />
      <div className="section-inner cta__content">
        <h2 id="cta-heading" className="cta__title">
          Start your journey to smarter thinking
        </h2>
        <p className="cta__subtitle">Compete with friends, track your growth, and see how far your mind can go.</p>
        <div className="cta__actions">
          <PrimaryLinkButton href="/assess/mini" ariaLabel="Play now">
            Play Now
          </PrimaryLinkButton>
          <Link href="#traits-heading" className="cta__secondary">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
