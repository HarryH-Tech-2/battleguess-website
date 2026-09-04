/**
 * Pure helpers for the daily-challenge API: input validation, percentile /
 * rank maths and the server-side streak. Kept free of I/O so they can be
 * unit-tested without a database.
 */

export const DAILY_BATTLE_COUNT = 5;
// calculateScore() caps a round at 300 (hard) + 100 streak bonus.
export const MAX_ROUND_SCORE = 400;
export const MAX_DAILY_SCORE = DAILY_BATTLE_COUNT * MAX_ROUND_SCORE;

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;
const ANON_ID_RE = /^[A-Za-z0-9_-]{8,64}$/;
const MARKS_RE = /^[WHL]{0,5}$/;
const MS_PER_DAY = 86_400_000;

export interface DailyResultInput {
  dateKey: string;
  anonId: string;
  score: number;
  correct: number;
  marks: string;
}

export type ValidationResult =
  | { ok: true; value: DailyResultInput }
  | { ok: false; error: string };

/**
 * Validate a client submission. The client's date key is its *local* date, so
 * we accept anything within two calendar days of the server's UTC date.
 */
export function validateDailyResult(body: unknown, nowUtc: Date = new Date()): ValidationResult {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Missing body' };
  const b = body as Record<string, unknown>;

  const dateKey = b.dateKey;
  if (typeof dateKey !== 'string' || !DATE_KEY_RE.test(dateKey) || Number.isNaN(Date.parse(dateKey))) {
    return { ok: false, error: 'Invalid dateKey' };
  }
  const todayUtc = nowUtc.toISOString().slice(0, 10);
  const drift = Math.abs(Date.parse(`${dateKey}T00:00:00Z`) - Date.parse(`${todayUtc}T00:00:00Z`)) / MS_PER_DAY;
  if (drift > 2) return { ok: false, error: 'dateKey out of range' };

  const anonId = b.anonId;
  if (typeof anonId !== 'string' || !ANON_ID_RE.test(anonId)) return { ok: false, error: 'Invalid anonId' };

  const score = b.score;
  if (!Number.isInteger(score) || (score as number) < 0 || (score as number) > MAX_DAILY_SCORE) {
    return { ok: false, error: 'Invalid score' };
  }

  const correct = b.correct;
  if (!Number.isInteger(correct) || (correct as number) < 0 || (correct as number) > DAILY_BATTLE_COUNT) {
    return { ok: false, error: 'Invalid correct count' };
  }

  const marks = typeof b.marks === 'string' ? b.marks : '';
  if (!MARKS_RE.test(marks)) return { ok: false, error: 'Invalid marks' };
  const wins = marks.split('').filter(c => c === 'W' || c === 'H').length;
  if (marks.length > 0 && wins !== correct) return { ok: false, error: 'marks do not match correct count' };

  return {
    ok: true,
    value: { dateKey, anonId, score: score as number, correct: correct as number, marks },
  };
}

/**
 * Share of *other* players the given score beats, as a whole percent.
 * `scores` is every player's score for the day including `mine`. Returns null
 * when there is nobody to compare against.
 */
export function computeBeatPercent(scores: readonly number[], mine: number): number | null {
  const others = scores.length - 1;
  if (others <= 0) return null;
  const beaten = scores.filter(s => s < mine).length;
  return Math.floor((beaten / others) * 100);
}

/** 1-based rank: one plus the number of players who scored strictly higher. */
export function computeRank(scores: readonly number[], mine: number): number {
  return 1 + scores.filter(s => s > mine).length;
}

export interface StreakRow {
  current_streak: number;
  longest_streak: number;
  last_played_date: string | null; // YYYY-MM-DD
}

/** Server-side twin of the client streak rule: consecutive days, idempotent per day. */
export function advanceStreakRow(row: StreakRow, dateKey: string): StreakRow {
  if (row.last_played_date === dateKey) return row;
  const continues =
    !!row.last_played_date &&
    Math.round((Date.parse(`${dateKey}T00:00:00Z`) - Date.parse(`${row.last_played_date}T00:00:00Z`)) / MS_PER_DAY) === 1;
  const current = continues ? row.current_streak + 1 : 1;
  return {
    current_streak: current,
    longest_streak: Math.max(current, row.longest_streak),
    last_played_date: dateKey,
  };
}

/** "Harry H." — enough to recognise yourself, not enough to dox a stranger. */
export function displayName(fullName: string | null | undefined): string {
  const parts = (fullName ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'Commander';
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}
