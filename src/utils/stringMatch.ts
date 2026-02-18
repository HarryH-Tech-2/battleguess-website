import { compareTwoStrings } from 'string-similarity';

export const normalizeAnswer = (answer: string): string => {
  return answer
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
};

export const checkAnswer = (
  userAnswer: string,
  acceptedAnswers: string[],
  threshold: number = 0.7
): boolean => {
  const normalized = normalizeAnswer(userAnswer);

  if (!normalized) return false;

  for (const accepted of acceptedAnswers) {
    const normalizedAccepted = normalizeAnswer(accepted);

    // Exact match
    if (normalized === normalizedAccepted) {
      return true;
    }

    // Check if user answer contains the accepted answer
    if (normalized.includes(normalizedAccepted) || normalizedAccepted.includes(normalized)) {
      return true;
    }

    // Fuzzy match using string similarity
    const similarity = compareTwoStrings(normalized, normalizedAccepted);
    if (similarity >= threshold) {
      return true;
    }
  }

  return false;
};

export const checkYearAnswer = (
  guess: number,
  actual: number,
  tolerance: number = 10
): boolean => {
  return Math.abs(guess - actual) <= tolerance;
};

export const checkLocationAnswer = (
  guess: string,
  actual: string,
  threshold: number = 0.6
): boolean => {
  const normalizedGuess = normalizeAnswer(guess);
  const normalizedActual = normalizeAnswer(actual);

  if (!normalizedGuess) return false;

  // Exact match
  if (normalizedGuess === normalizedActual) return true;

  // Contains match
  if (normalizedGuess.includes(normalizedActual) || normalizedActual.includes(normalizedGuess)) return true;

  // Fuzzy match
  const similarity = compareTwoStrings(normalizedGuess, normalizedActual);
  return similarity >= threshold;
};
