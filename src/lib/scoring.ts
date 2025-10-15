import { QUESTIONS } from "@/data/questions";

export type ResponseDoc = {
  itemId: string;
  pillar: string;
  optionSelected: number;
  confidence: number;
};

export const PILLAR_LABELS = [
  "Clarity & Awareness",
  "Evidence & Evaluation",
  "Logic & Reasoning",
  "Decision & Problem Solving",
  "Reflection & Adaptation",
  "Dispositional Mindset",
] as const;

export type PillarKey = (typeof PILLAR_LABELS)[number];

export type PillarSummary = {
  nItems: number;
  nCorrect: number;
  accuracy: number;
};

export type ScoreSummary = {
  overallAccuracy: number;
  calibrationAbsError: number;
  pillars: Record<PillarKey, PillarSummary>;
};

const questionById = new Map(QUESTIONS.map((question) => [question.itemId, question]));

function clamp01(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
}

export function scoreSession(responses: ResponseDoc[]): ScoreSummary {
  const pillars: Record<PillarKey, PillarSummary> = PILLAR_LABELS.reduce(
    (acc, pillar) => {
      acc[pillar] = { nItems: 0, nCorrect: 0, accuracy: 0 };
      return acc;
    },
    {} as Record<PillarKey, PillarSummary>
  );

  let totalItems = 0;
  let totalCorrect = 0;
  let calibrationSum = 0;

  for (const response of responses) {
    const question = questionById.get(response.itemId);
    const correctIndex = question?.correctIndex ?? null;
    const isCorrect = correctIndex === null ? false : response.optionSelected === correctIndex;
    totalItems += 1;
    if (isCorrect) {
      totalCorrect += 1;
    }

    const confidenceFraction = clamp01((response.confidence ?? 0) / 100);
    calibrationSum += Math.abs(confidenceFraction - (isCorrect ? 1 : 0));

    const resolvedPillar = question?.pillar ?? response.pillar;
    const pillarLabel = PILLAR_LABELS.find((pillar) => pillar === resolvedPillar);

    if (!pillarLabel) {
      continue;
    }

    const pillarSummary = pillars[pillarLabel];

    pillarSummary.nItems += 1;
    if (isCorrect) {
      pillarSummary.nCorrect += 1;
    }
  }

  const calibrationAbsError = totalItems > 0 ? calibrationSum / totalItems : 0;
  const overallAccuracy = totalItems > 0 ? totalCorrect / totalItems : 0;

  for (const pillar of PILLAR_LABELS) {
    const summary = pillars[pillar];
    summary.accuracy = summary.nItems > 0 ? summary.nCorrect / summary.nItems : 0;
  }

  return { overallAccuracy, calibrationAbsError, pillars };
}
