import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { saveAssessment, type Trait, type TraitScores } from "@/lib/assess/store";

/** ---- CONFIG: 7 items, one per trait ---- */
type Item = {
  id: string;
  trait: Trait;
  prompt: string;
  note?: string;
  options: { id: string; label: string }[];
  correctId: string;
  askConfidence?: boolean; // adds confidence slider (1–5)
};

const ITEMS: Item[] = [
  {
    id: "E1",
    trait: "exploration",
    prompt:
      "You can peek inside 2 mystery boxes before choosing 1 to keep. Which plan learns the most before deciding?",
    note: "Exploration = gather diverse info before committing.",
    options: [
      { id: "a", label: "Open the same box twice to be sure it’s good." },
      { id: "b", label: "Open two different boxes, then choose." },
      { id: "c", label: "Open the first box, keep it immediately." },
      { id: "d", label: "Don’t open any; pick at random to save time." },
    ],
    correctId: "b",
  },
  {
    id: "L1",
    trait: "logic",
    prompt:
      "All red stones are heavy. This stone is red. Therefore, this stone is heavy. Is the argument logically valid?",
    options: [
      { id: "a", label: "Valid" },
      { id: "b", label: "Invalid" },
    ],
    correctId: "a",
    askConfidence: true,
  },
  {
    id: "A1",
    trait: "adaptability",
    prompt:
      "A number pattern was: +2, +2, +2… Suddenly it shows 2, 4, 7. What should you do next?",
    note: "Adaptability = detect change and update strategy.",
    options: [
      { id: "a", label: "Keep adding +2; the change is noise." },
      { id: "b", label: "Test a new rule (e.g., +2, then +3), and see if it fits." },
      { id: "c", label: "Restart from 0; assume everything is wrong." },
      { id: "d", label: "Stop; wait for a hint before proceeding." },
    ],
    correctId: "b",
  },
  {
    id: "R1",
    trait: "risk",
    prompt:
      "Choose the better option: A) $35 for sure, or B) 40% chance of $100, otherwise $0.",
    note: "Risk & Reward = choose higher expected value when indifferent to risk.",
    options: [
      { id: "a", label: "A) $35 for sure" },
      { id: "b", label: "B) 40% chance of $100" },
    ],
    correctId: "b", // EV(B)=40 vs EV(A)=35
    askConfidence: true,
  },
  {
    id: "C1",
    trait: "cooperation",
    prompt:
      "You and another player choose secretly: Cooperate or Defect. If you both cooperate, you both get 3. If you cooperate and they defect, you get 0 (they get 5). If you defect and they cooperate, you get 5 (they get 0). If you both defect, you both get 1. What do you choose?",
    note: "Cooperation = preference for mutual win under uncertainty.",
    options: [
      { id: "a", label: "Cooperate" },
      { id: "b", label: "Defect" },
    ],
    correctId: "a",
  },
  {
    id: "M1",
    trait: "metacognition",
    prompt:
      "You’re only ~50% sure about a difficult answer and have 30 seconds left. What’s the best next step?",
    options: [
      { id: "a", label: "Lock your first instinct quickly to save time." },
      {
        id: "b",
        label: "Pause and test one assumption that could falsify your choice.",
      },
      { id: "c", label: "Randomly change to a new answer; fresh guesses help." },
      { id: "d", label: "Skip thinking; increase confidence to avoid doubt." },
    ],
    correctId: "b",
  },
  {
    id: "Cr1",
    trait: "creativity",
    prompt:
      "You have a balloon and a magnet. A metal key lies at the bottom of a narrow gap you can’t reach. Which plan is most promising?",
    note: "Creativity = novel + workable under constraints.",
    options: [
      { id: "a", label: "Pop the balloon loudly to shake the key up the gap." },
      {
        id: "b",
        label:
          "Rub the balloon to build static, try to lift or shift the key upward.",
      },
      {
        id: "c",
        label:
          "Use the magnet to push the key deeper (maybe it bounces back).",
      },
      { id: "d", label: "Abandon the key; it’s impossible." },
    ],
    correctId: "b",
  },
];

/** ---- SCORING ---- */
type Answer = { itemId: string; choiceId: string; confidence?: number };

const TRAIT_LABEL: Record<Trait, string> = {
  exploration: "Exploration",
  logic: "Logic & Reasoning",
  adaptability: "Adaptability",
  risk: "Risk & Reward",
  cooperation: "Cooperation",
  metacognition: "Metacognition",
  creativity: "Creativity",
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function scoreAssessment(ans: Answer[]): TraitScores {
  const base: TraitScores = {
    exploration: 0,
    logic: 0,
    adaptability: 0,
    risk: 0,
    cooperation: 0,
    metacognition: 0,
    creativity: 0,
  };

  // correctness
  for (const a of ans) {
    const item = ITEMS.find((it) => it.id === a.itemId)!;
    const correct = a.choiceId === item.correctId ? 1 : 0;
    base[item.trait] = Math.max(base[item.trait], correct);
  }

  // confidence calibration where requested
  for (const a of ans) {
    const item = ITEMS.find((it) => it.id === a.itemId)!;
    if (!item.askConfidence || a.confidence == null) continue;
    const correct = a.choiceId === item.correctId;
    const high = a.confidence >= 4;
    const low = a.confidence <= 2;
    const calibrated = (correct && high) || (!correct && low);
    if (calibrated) base[item.trait] = clamp01(base[item.trait] + 0.1);
  }

  return {
    exploration: Math.round(base.exploration * 100),
    logic: Math.round(base.logic * 100),
    adaptability: Math.round(base.adaptability * 100),
    risk: Math.round(base.risk * 100),
    cooperation: Math.round(base.cooperation * 100),
    metacognition: Math.round(base.metacognition * 100),
    creativity: Math.round(base.creativity * 100),
  };
}

/** ---- PAGE ---- */
export default function MiniAssessmentPage() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [saving, setSaving] = useState(false);

  const item = useMemo(() => ITEMS[i], [i]);
  const pct = Math.round(((i) / ITEMS.length) * 100);

  function submitChoice(choiceId: string) {
    setAnswers((prev) => [...prev, { itemId: item.id, choiceId }]);
    if (!item.askConfidence) advance();
  }

  function submitConfidence(conf: number) {
    setAnswers((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((a) => a.itemId === item.id);
      if (idx >= 0) copy[idx] = { ...copy[idx], confidence: conf };
      return copy;
    });
    advance();
  }

  function advance() {
    if (i < ITEMS.length - 1) setI(i + 1);
    else {
      setSaving(true);
      const scores = scoreAssessment(answers);
      saveAssessment(scores);
      setTimeout(() => router.push("/"), 350);
    }
  }

  if (saving) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            Saving your Thinking Snapshot…
          </h2>
          <p className="mt-2 text-slate-600">Redirecting to home.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Progress */}
        <div aria-label="Progress" className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-indigo-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Card */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <header>
            <h1 className="text-2xl font-bold text-slate-900">
              {TRAIT_LABEL[item.trait]} <span className="font-normal">• Question</span>
            </h1>
            <p className="mt-3 text-slate-700 leading-relaxed">{item.prompt}</p>
            {item.note && (
              <p className="mt-2 text-sm text-slate-500">{item.note}</p>
            )}
          </header>

          <div className="mt-6 grid gap-3">
            {item.options.map((op) => {
              const picked = answers.find((a) => a.itemId === item.id && a.choiceId === op.id);
              return (
                <button
                  key={op.id}
                  onClick={() => submitChoice(op.id)}
                  className={`w-full text-left rounded-lg border px-4 py-3 transition
                    ${picked
                      ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"}`}
                >
                  {op.label}
                </button>
              );
            })}
          </div>

          {item.askConfidence && (
            <ConfidenceCapture onPick={submitConfidence} />
          )}
        </section>

        <footer className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>Question {i + 1} of {ITEMS.length}</span>
          <span>{pct}%</span>
        </footer>
      </div>
    </main>
  );
}

function ConfidenceCapture({ onPick }: { onPick: (c: number) => void }) {
  const [val, setVal] = useState(3);
  return (
    <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-4">
      <p className="text-sm text-slate-600">How confident are you? (1–5)</p>
      <input
        type="range"
        min={1}
        max={5}
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-full mt-2"
      />
      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs text-slate-500">Confidence: {val}/5</span>
        <button
          className="ml-auto rounded-md border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50"
          onClick={() => onPick(val)}
        >
          Submit with confidence
        </button>
      </div>
    </div>
  );
}
