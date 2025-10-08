import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import "../styles/home.css";

const TRAITS = [
  { id: "exploration", label: "Exploration", blurb: "Try new ideas and chase curiosity." },
  { id: "logic", label: "Logic & Reasoning", blurb: "Build conclusions that fit the facts." },
  { id: "adaptability", label: "Adaptability", blurb: "Change your strategy when rules change." },
  { id: "risk", label: "Risk & Reward", blurb: "Make smarter decisions under pressure." },
  { id: "cooperation", label: "Cooperation", blurb: "Use trust and strategy for win–wins." },
  { id: "metacognition", label: "Metacognition", blurb: "See how your mind works—then improve it." },
  { id: "creativity", label: "Creativity", blurb: "Turn imagination into solutions." }
];

const GAMES = [
  {
    id: "pattern",
    name: "Pattern Game",
    tagline: "Test before you guess.",
    traits: ["exploration", "logic", "metacognition"],
    route: "/game"
  },
  {
    id: "ice-cream",
    name: "Ice Cream Battle",
    tagline: "Trust, betray, or outplay.",
    traits: ["cooperation", "risk", "metacognition"],
    route: "/icecreamgame"
  },
  {
    id: "booty",
    name: "Split the Booty",
    tagline: "Plan, adapt, and outthink.",
    traits: ["logic", "adaptability", "creativity"],
    route: "/bootygame"
  }
];

export default function Home() {
  const navigate = useNavigate();
  const howRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const scrollToHow = () => {
    if (howRef.current) {
      howRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePlayNow = () => navigate("/game");

  return (
    <main className="home-landing">
      <Hero
        onHowClick={scrollToHow}
        onPlayClick={handlePlayNow}
        userName={user?.displayName || (user ? "Thinker" : null)}
      />
      <div ref={howRef}>
        <HowItWorks />
      </div>
      <SevenTraits onStartTest={handlePlayNow} />
      <GamesShowcase onPlay={(route) => navigate(route)} />
      <GrowthSection onStartJourney={handlePlayNow} onViewDashboard={() => navigate("/analysis")} />
      <WhyItMatters onLearnScience={() => navigate("/learn/fallacies")} />
      <ClosingCta onPlayNow={handlePlayNow} onLearnMore={() => navigate("/analysis")} />
    </main>
  );
}

function PrimaryButton({
  children,
  onClick,
  ariaLabel
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="primary-button"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  ariaLabel
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="secondary-button"
    >
      {children}
    </button>
  );
}

function TraitPill({ label, active = false }) {
  return <span className={`trait-pill${active ? " trait-pill--active" : ""}`}>{label}</span>;
}

function Hero({ onHowClick, onPlayClick, userName }) {
  return (
    <section className="hero">
      <div className="hero__background" aria-hidden="true" />
      <div className="section-inner hero__content">
        <header className="hero__header">
          <div className="hero__badge">Cognify</div>
          <h1 className="hero__title">Play Smarter. Think Deeper.</h1>
          <p className="hero__subtitle">
            Challenge your mind with games that reveal how you think. Measure your skills. Train your brain. Watch yourself
            grow.
          </p>
          {userName && <p className="hero__welcome">Welcome back, {userName}.</p>}
          <div className="hero__actions">
            <PrimaryButton ariaLabel="Play Now" onClick={onPlayClick}>
              Play Now
            </PrimaryButton>
            <SecondaryButton ariaLabel="How It Works" onClick={onHowClick}>
              How It Works
            </SecondaryButton>
          </div>
        </header>
        <div className="hero__traits">
          {TRAITS.slice(0, 5).map((t) => (
            <TraitPill key={t.id} label={t.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { title: "Play", desc: "Fun, fast challenges built on real cognitive science.", icon: "🎮" },
    { title: "Discover", desc: "See your Thinking Profile grow across seven skills.", icon: "🧭" },
    { title: "Improve", desc: "Get tailored missions to strengthen how you think.", icon: "⚡" }
  ];
  return (
    <section className="how" aria-labelledby="how-heading">
      <div className="section-inner">
        <h2 id="how-heading" className="section-title">
          How It Works
        </h2>
        <p className="section-subtitle">Play quick games, discover your strengths, and follow missions to grow.</p>
        <div className="how__grid">
          {steps.map((s) => (
            <div key={s.title} className="how__card">
              <div className="how__icon" aria-hidden="true">
                {s.icon}
              </div>
              <h3 className="how__title">{s.title}</h3>
              <p className="how__description">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RadarSvg({ values }) {
  const R = 80;
  const cx = 100;
  const cy = 100;
  const points = values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
    const r = R * (0.2 + 0.8 * v);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${x},${y}`;
  });
  return (
    <svg width="200" height="200" role="img" aria-label="Thinking Profile Radar" className="radar">
      {[0.4, 0.6, 0.8, 1].map((g, i) => (
        <circle key={i} cx={cx} cy={cy} r={R * g} fill="none" stroke="#e2e8f0" strokeDasharray="4 4" />
      ))}
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

function SevenTraits({ onStartTest }) {
  const [active, setActive] = useState(TRAITS[0].id);
  const activeTrait = useMemo(() => TRAITS.find((t) => t.id === active), [active]);
  const mockValues = [0.65, 0.55, 0.48, 0.6, 0.42, 0.58, 0.45];

  if (!activeTrait) {
    return null;
  }

  return (
    <section className="traits" aria-labelledby="traits-heading">
      <div className="section-inner">
        <h2 id="traits-heading" className="section-title">
          The Seven Traits
        </h2>
        <p className="section-subtitle">Seven skills that make thinking clear, creative, and adaptable.</p>

        <div className="traits__grid">
          <div className="traits__radar">
            <RadarSvg values={mockValues} />
          </div>

          <div className="traits__content">
            <ul className="traits__tabs">
              {TRAITS.map((t) => (
                <li key={t.id}>
                  <button
                    className={`traits__tab${active === t.id ? " traits__tab--active" : ""}`}
                    onClick={() => setActive(t.id)}
                    aria-label={`Select ${t.label}`}
                    type="button"
                  >
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="traits__card">
              <h3 className="traits__card-title">{activeTrait.label}</h3>
              <p className="traits__card-text">{activeTrait.blurb}</p>
              <div className="traits__card-actions">
                <PrimaryButton ariaLabel="Take 3-minute test" onClick={onStartTest}>
                  Take the 3-Minute Thinking Test
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GamesShowcase({ onPlay }) {
  return (
    <section className="games" aria-labelledby="games-heading">
      <div className="section-inner">
        <h2 id="games-heading" className="section-title">
          Inside the Games
        </h2>
        <p className="section-subtitle">Play fast, learn fast. Each game targets different thinking skills.</p>

        <div className="games__grid">
          {GAMES.map((g) => (
            <article key={g.id} className="games__card">
              <div className="games__visual" aria-hidden="true">
                <span className="games__visual-text">Gameplay Preview</span>
              </div>
              <h3 className="games__card-title">{g.name}</h3>
              <p className="games__card-text">{g.tagline}</p>
              <div className="games__traits">
                {g.traits.map((tId) => {
                  const t = TRAITS.find((x) => x.id === tId);
                  return t ? <TraitPill key={tId} label={t.label} /> : null;
                })}
              </div>
              <div className="games__actions">
                <SecondaryButton ariaLabel={`Play ${g.name}`} onClick={() => onPlay(g.route)}>
                  Play Now
                </SecondaryButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GrowthSection({ onStartJourney, onViewDashboard }) {
  const bars = [
    { id: "exploration", label: "Exploration", value: 62 },
    { id: "logic", label: "Logic", value: 55 },
    { id: "adaptability", label: "Adaptability", value: 48 },
    { id: "risk", label: "Risk & Reward", value: 60 },
    { id: "metacognition", label: "Metacognition", value: 58 }
  ];
  return (
    <section className="growth">
      <div className="section-inner growth__grid">
        <div className="growth__card">
          <h3 className="growth__card-title">Your Thinking Profile</h3>
          <p className="growth__card-text">Watch your scores rise as you master each trait.</p>
          <div className="growth__bars">
            {bars.map((b) => (
              <div key={b.id} className="growth__bar">
                <div className="growth__bar-header">
                  <span className="growth__bar-label">{b.label}</span>
                  <span className="growth__bar-value">{b.value}</span>
                </div>
                <div className="growth__bar-track">
                  <div className="growth__bar-fill" style={{ width: `${b.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="growth__actions">
            <SecondaryButton ariaLabel="View full dashboard" onClick={onViewDashboard}>
              View Full Dashboard
            </SecondaryButton>
          </div>
        </div>

        <div className="growth__content">
          <h2 className="section-title">Your Growth Over Time</h2>
          <p className="section-subtitle">
            See how your Exploration score rises as you master curiosity. Every round makes your mind a little sharper.
            Personalized missions target your weakest traits so progress always feels within reach.
          </p>
          <div className="growth__buttons">
            <PrimaryButton ariaLabel="Start your journey" onClick={onStartJourney}>
              Start Your Journey
            </PrimaryButton>
            <SecondaryButton ariaLabel="See example insights" onClick={onViewDashboard}>
              See Example Insights
            </SecondaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyItMatters({ onLearnScience }) {
  return (
    <section className="why" aria-labelledby="why-heading">
      <div className="section-inner why__grid">
        <div className="why__content">
          <h2 id="why-heading" className="section-title">
            Why It Matters
          </h2>
          <p className="section-subtitle">
            Cognify turns cognitive science into play. Every game measures real thinking patterns—exploration, logic,
            adaptability, risk, cooperation, metacognition, and creativity—then gives you insights to grow.
          </p>
          <p className="section-subtitle">
            We believe critical thinking should be as fun as any video game—and just as rewarding.
          </p>
          <div className="why__badge">Backed by research. Designed for growth.</div>
        </div>
        <div className="why__card">
          <h3 className="why__card-title">What you’ll build</h3>
          <ul className="why__list">
            <li>Clarity in how you think</li>
            <li>Confidence under uncertainty</li>
            <li>Creative problem-solving</li>
            <li>Strategies for cooperation</li>
          </ul>
          <div className="why__actions">
            <SecondaryButton ariaLabel="Learn more science" onClick={onLearnScience}>
              Learn the Science
            </SecondaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClosingCta({ onPlayNow, onLearnMore }) {
  return (
    <section className="cta">
      <div className="cta__background" aria-hidden="true" />
      <div className="section-inner cta__content">
        <h2 className="cta__title">Start your journey to smarter thinking</h2>
        <p className="cta__subtitle">
          Compete with friends, track your growth, and see how far your mind can go.
        </p>
        <div className="cta__actions">
          <PrimaryButton ariaLabel="Play now" onClick={onPlayNow}>
            Play Now
          </PrimaryButton>
          <button aria-label="Learn more" className="cta__secondary" onClick={onLearnMore}>
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
