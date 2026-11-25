export type ScoreTier = "low" | "spark" | "promising" | "soulmate";

export type ValidationErrorKey =
  | "empty_a"
  | "empty_b"
  | "too_long_a"
  | "too_long_b"
  | "no_letters_a"
  | "no_letters_b";

export interface ClassicBreakdown {
  phrase: string;
  distinctChars: string[];
  initialCounts: number[];
  reductionSteps: number[][];
}

export interface CalculationResult {
  nameA: string;
  nameB: string;
  score: number;
  tier: ScoreTier;
  breakdown: ClassicBreakdown;
}

export const MAX_NAME_LENGTH = 50;

export function sanitizeDisplayName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function extractLetters(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

export type ValidationResult =
  | {
      valid: true;
      nameA: string;
      nameB: string;
      lettersA: string;
      lettersB: string;
    }
  | {
      valid: false;
      errorKey: ValidationErrorKey;
    };

export function validateNames(rawA: string, rawB: string): ValidationResult {
  const nameA = sanitizeDisplayName(rawA);
  const nameB = sanitizeDisplayName(rawB);

  if (!nameA) return { valid: false, errorKey: "empty_a" };
  if (!nameB) return { valid: false, errorKey: "empty_b" };
  if (nameA.length > MAX_NAME_LENGTH) {
    return { valid: false, errorKey: "too_long_a" };
  }
  if (nameB.length > MAX_NAME_LENGTH) {
    return { valid: false, errorKey: "too_long_b" };
  }

  const lettersA = extractLetters(nameA);
  const lettersB = extractLetters(nameB);

  if (!lettersA) return { valid: false, errorKey: "no_letters_a" };
  if (!lettersB) return { valid: false, errorKey: "no_letters_b" };

  return { valid: true, nameA, nameB, lettersA, lettersB };
}

export function getScoreTier(score: number): ScoreTier {
  if (score >= 80) return "soulmate";
  if (score >= 60) return "promising";
  if (score >= 30) return "spark";
  return "low";
}

function sortSymmetricPair(a: string, b: string): [string, string] {
  return a <= b ? [a, b] : [b, a];
}

function splitDigits(num: number): number[] {
  if (num < 10) return [num];
  return String(num)
    .split("")
    .map((d) => Number(d));
}

export function calculateClassic(rawA: string, rawB: string): CalculationResult {
  const nameA = sanitizeDisplayName(rawA);
  const nameB = sanitizeDisplayName(rawB);
  const [first, second] = sortSymmetricPair(
    extractLetters(nameA),
    extractLetters(nameB),
  );

  const phrase = `${first}loves${second}`;
  const countsMap = new Map<string, number>();
  const distinctChars: string[] = [];

  for (const ch of phrase) {
    const prev = countsMap.get(ch);
    if (prev === undefined) {
      distinctChars.push(ch);
      countsMap.set(ch, 1);
    } else {
      countsMap.set(ch, prev + 1);
    }
  }

  const initialCounts = distinctChars.flatMap((ch) =>
    splitDigits(countsMap.get(ch) ?? 0),
  );
  const reductionSteps: number[][] = [initialCounts];

  let current = initialCounts;
  let guard = 0;

  while (current.length > 2 && guard < 50) {
    if (
      current.length === 3 &&
      current[0] === 1 &&
      current[1] === 0 &&
      current[2] === 0
    ) {
      break;
    }

    const next: number[] = [];
    const half = Math.floor(current.length / 2);

    for (let i = 0; i < half; i += 1) {
      const sum = current[i] + current[current.length - 1 - i];
      next.push(...splitDigits(sum));
    }

    if (current.length % 2 === 1) {
      next.push(current[half]);
    }

    current = next;
    reductionSteps.push(current);
    guard += 1;
  }

  let score: number;
  if (
    current.length === 3 &&
    current[0] === 1 &&
    current[1] === 0 &&
    current[2] === 0
  ) {
    score = 100;
  } else if (current.length >= 2) {
    score = Math.min(100, current[0] * 10 + current[1]);
  } else {
    score = Math.min(100, (current[0] ?? 0) * 10);
  }

  return {
    nameA,
    nameB,
    score,
    tier: getScoreTier(score),
    breakdown: {
      phrase,
      distinctChars,
      initialCounts,
      reductionSteps,
    },
  };
}
