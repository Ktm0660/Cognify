import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { saveAssessment, type Trait, type TraitScores } from "../../lib/assess/store";

import "../../styles/assessment.css";

type Item = {
  id: string;
  trait: Trait;
  prompt: string;
  note?: string;
  options: { id: string; label: string }[];
  correctId: string;
  askConfidence?: boolean;
};

const ITEMS: Item[] = [
  { id: "E1", trait: "exploration", prompt: "You can peek inside 2 mystery boxes before choosing 1 to keep. Which plan learns the most before deciding?",
    note: "Exploration = gather diverse info before committing.",
    options: [
      { id: "a", label: "Open the same box twice to be sure it’s good." },
      { id: "b", label: "Open two different boxes, then choose." },
      { id: "c", label: "Open the first box, keep it immediately." },
      { id: "d", label: "Don’t open any; pick at random to save time." },
    ], correctId: "b" },
  { id: "L1", trait: "logic", prompt: "All red stones are heavy. This stone is red. Therefore, this stone is heavy. Is the argument logically valid?",
    options: [{ id: "a", label: "Valid" }, { id: "b", label: "Invalid" }], correctId: "a", askConfidence: true },
  { id: "A1", trait: "adaptability", prompt: "A number pattern was: +2, +2, +2… Suddenly it shows 2, 4, 7. What should you do next?",
    note: "Adaptability = detect change and update strategy.",
    options: [
      { id: "a", label: "Keep adding +2; the change is noise." },
      { id: "b", label: "Test a new rule (e.g., +2, then +3), and see if it fits." },
      { id: "c", label: "Restart from 0; assume everything is wrong." },
      { id: "d", label: "Stop; wait for a hint before proceeding." },
    ], correctId: "b" },
  { id: "R1", trait: "risk", prompt: "Choose the better option: A) $35 for sure, or B) 40% chance of $100, otherwise $0.",
    note: "Risk & Reward = choose higher expected value when indifferent to risk.",
    options: [{ id: "a", label: "A) $35 for sure" }, { id: "b", label: "B) 40% chance of $100" }], correctId: "b", askConfidence: true },
  { id: "C1", trait: "cooperation", prompt:
    "You and another player choose secretly: Cooperate or Defect. If you both cooperate, you both get 3. If you cooperate and they defect, you get 0 (they get 5). If you defect and they cooperate, you get 5 (they get 0). If you both defect, you both get 1. What do you choose?",
    note: "Cooperation = preference for mutual win under uncertainty.",
    options: [{ id: "a", label: "Cooperate" }, { id: "b", label: "Defect" }], correctId: "a" },
  { id: "M1", trait: "metacognition", prompt: "You’re only ~50% sure about a difficult answer and have 30 seconds left. What’s the best next step?",
    options: [
      { id: "a", label: "Lock your first instinct quickly to save time." },
      { id: "b", label: "Pause and test one assumption that could falsify your choice." },
      { id: "c", label: "Randomly change to a new answer; fresh guesses help." },
      { id: "d", label: "Skip thinking; increase confidence to avoid doubt." },
    ], correctId: "b" },
  { id: "Cr1", trait: "creativity", prompt:
    "You have a balloon and a magnet. A metal key lies at the bottom of a narrow gap you can’t reach. Which plan is most promising?",
    note: "Creativity = novel + workable under constraints.",
    options: [
      { id: "a", label: "Pop the balloon loudly to shake the key up the gap." },
      { id: "b", label: "Rub the balloon to build static, try to lift or shift the key upward." },
      { id: "c", label: "Use the magnet to push the key deeper (maybe it bounces back)." },
      { id: "d", label: "Abandon the key; it’s impossible." },
    ], correctId: "b" },
];

type Answer = { itemId: string; choiceId: string; confidence?: number };
const LABEL: Record<Trait, string> = {
  exploration: "Exploration", logic: "Logic & Reasoning", adaptability: "Adaptability",
  risk: "Risk & Reward", cooperation: "Cooperation", metacognition: "Metacognition", creativity: "Creativity",
};

function clamp01(n: number) { return Math.max(0, Math.min(1, n)); }

function scoreAssessment(ans: Answer[]): TraitScores {
  const base: TraitScores = { exploration:0, logic:0, adaptability:0, risk:0, cooperation:0, metacognition:0, creativity:0 };
  for (const a of ans) {
    const it = ITEMS.find(x=>x.id===a.itemId)!;
    const correct = a.choiceId === it.correctId ? 1 : 0;
    base[it.trait] = Math.max(base[it.trait], correct);
  }
  for (const a of ans) {
    const it = ITEMS.find(x=>x.id===a.itemId)!;
    if (!it.askConfidence || a.confidence==null) continue;
    const correct = a.choiceId === it.correctId;
    const high = a.confidence >= 4, low = a.confidence <= 2;
    const calibrated = (correct && high) || (!correct && low);
    if (calibrated) base[it.trait] = clamp01(base[it.trait] + 0.1);
  }
  return {
    exploration: Math.round(base.exploration*100),
    logic: Math.round(base.logic*100),
    adaptability: Math.round(base.adaptability*100),
    risk: Math.round(base.risk*100),
    cooperation: Math.round(base.cooperation*100),
    metacognition: Math.round(base.metacognition*100),
    creativity: Math.round(base.creativity*100),
  };
}

export default function MiniAssessmentPage() {
  const router = useRouter();
  const [i,setI]=useState(0);
  const [answers,setAnswers]=useState<Answer[]>([]);
  const [saving,setSaving]=useState(false);
  const item = useMemo(()=>ITEMS[i], [i]);
  const pct = Math.round((i/ITEMS.length)*100);

  function submitChoice(choiceId:string){
    setAnswers(prev=>{
      const next=[...prev,{itemId:item.id, choiceId}];
      advance(next);
      return next;
    });
  }
  function submitConfidence(conf:number){
    setAnswers(prev=>{
      const copy=[...prev];
      const idx=copy.findIndex(a=>a.itemId===item.id);
      if(idx>=0) copy[idx]={...copy[idx], confidence: conf};
      advance(copy);
      return copy;
    });
  }
  function advance(nextAnswers:Answer[]){
    if(i<ITEMS.length-1){ setI(i+1); }
    else{
      setSaving(true);
      const scores=scoreAssessment(nextAnswers);
      saveAssessment(scores);
      setTimeout(()=>router.push("/"), 300);
    }
  }

  if (saving) {
    return (
      <main className="assessment-shell">
        <div className="assessment-shell__inner">
          <section className="assessment-card assessment-card--saving" aria-live="polite">
            <h2 className="assessment-title">Saving your Thinking Snapshot…</h2>
            <p className="assessment-subtitle">Redirecting you back home in a moment.</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="assessment-shell">
      <div className="assessment-shell__inner">
        <div className="assessment-progress" aria-label="Progress">
          <div className="assessment-progress__track">
            <div className="assessment-progress__bar" style={{ width: `${pct}%` }} />
          </div>
          <span className="assessment-progress__label">{pct}% complete</span>
        </div>

        <section className="assessment-card" aria-labelledby="assessment-question-title">
          <header className="assessment-card__header">
            <span className="assessment-pill">{LABEL[item.trait]}</span>
            <h2 id="assessment-question-title" className="assessment-title">
              Question {i + 1} of {ITEMS.length}
            </h2>
          </header>

          <p className="assessment-prompt">{item.prompt}</p>
          {item.note && <p className="assessment-note">{item.note}</p>}

          <div className="assessment-options" role="list">
            {item.options.map((op, idx) => (
              <button
                key={op.id}
                type="button"
                onClick={() => submitChoice(op.id)}
                className="assessment-option"
              >
                <span className="assessment-option__index" aria-hidden="true">
                  {(idx + 10).toString(36).toUpperCase()}
                </span>
                <span className="assessment-option__label">{op.label}</span>
              </button>
            ))}
          </div>

          {item.askConfidence && <ConfidenceCapture onPick={submitConfidence} />}
        </section>
      </div>
    </main>
  );
}

function ConfidenceCapture({ onPick }: { onPick:(c:number)=>void }){
  const [val,setVal]=useState(3);
  return (
    <div className="assessment-confidence">
      <p className="assessment-confidence__title">How confident are you? (1–5)</p>
      <div className="assessment-confidence__slider">
        <input
          type="range"
          min={1}
          max={5}
          value={val}
          onChange={e=>setVal(Number(e.target.value))}
          aria-label="Confidence from 1 to 5"
        />
      </div>
      <div className="assessment-confidence__footer">
        <span className="assessment-confidence__value">Confidence: {val}/5</span>
        <button type="button" className="assessment-confidence__submit" onClick={()=>onPick(val)}>
          Submit confidence
        </button>
      </div>
    </div>
  );
}
