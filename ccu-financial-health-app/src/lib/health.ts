// helper to clamp values
const clamp0to100 = (n: number) => Math.max(0, Math.min(100, n));

// Coerce anything nullish to 0
const toNum = (n: number | null | undefined): number => n ?? 0;

/**
 * Normalize either a single score or multiple component scores to 0–100.
 * - If given one value: coerce nullish to 0, then clamp to [0,100].
 * - If given multiple values: coerce/clamp each and return their average.
 */
export function normalizeTo100(value: number | null | undefined): number;
export function normalizeTo100(
  ...values: Array<number | null | undefined>
): number;
export function normalizeTo100(
  ...args: Array<number | null | undefined>
): number {
  if (args.length === 0) return 0;
  if (args.length === 1) return clamp0to100(toNum(args[0]));

  const sum = args
    .map((v) => clamp0to100(toNum(v)))
    .reduce((a, b) => a + b, 0);

  return sum / args.length;
}

export function calcEmergencyMonths(args: {
  monthlyExpenses?: number | null;
  emergencyFund?: number | null;
}): number {
  const expenses = args.monthlyExpenses ?? 0;
  const fund = args.emergencyFund ?? 0;
  if (expenses <= 0) return 0;
  return fund / expenses;
}

export function calcSavingsProgress(
  _entries: Array<{ current?: number | null; target?: number | null }>
): number {
  // Placeholder implementation for structure completeness.
  return 0;
}

export function scoreToBand(score: number): string {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "fair";
  return "needs-improvement";
}

export function buildRecommendations(
  ...values: Array<number | null | undefined>
): string[] {
  const normalized = values.map((v) => clamp0to100(toNum(v)));
  if (normalized.every((v) => v >= 80)) {
    return ["Keep up the great work maintaining your financial health!"];
  }

  return normalized.map((value, index) => {
    if (value >= 60) {
      return `Area ${index + 1}: Solid footing—continue reinforcing these habits.`;
    }
    if (value >= 40) {
      return `Area ${index + 1}: Moderate performance—consider incremental improvements.`;
    }
    return `Area ${index + 1}: Immediate attention recommended to strengthen this metric.`;
  });
}
