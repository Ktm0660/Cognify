export type Trait =
  | "exploration"
  | "logic"
  | "adaptability"
  | "risk"
  | "cooperation"
  | "metacognition"
  | "creativity";

export type TraitScores = Record<Trait, number>;

const STORAGE_KEY = "cognify.assessment.latest";

export function saveAssessment(scores: TraitScores) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ scores, savedAt: new Date().toISOString() })
    );
  } catch {}
}

export function loadAssessment():
  | { scores: TraitScores; savedAt: string }
  | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function hasAssessment(): boolean {
  return !!loadAssessment();
}
