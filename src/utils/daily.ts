/**
 * Pure helpers for the Daily Challenge: day numbering, the completion streak,
 * the emoji result grid and the share text. No React, no storage, no network,
 * so everything here is unit-testable.
 */

/** The date whose challenge is "Daily #1". Days before it clamp to #1. */
export const DAILY_EPOCH = '2026-09-04';
export const DAILY_BATTLE_COUNT = 5;
export const DAILY_SHARE_URL = 'https://battleguess.app/daily';

/** Outcome of one daily round: won without hints, won with hints, or lost. */
export type RoundMark = 'W' | 'H' | 'L';

export interface StreakData {
  currentStreak: number;
  lastPlayDate: string; // YYYY-MM-DD of the last completed daily, '' if none
  longestStreak: number;
}

export const EMPTY_STREAK: StreakData = { currentStreak: 0, lastPlayDate: '', longestStreak: 0 };

const MS_PER_DAY = 86_400_000;
const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isDateKey(value: unknown): value is string {
  return typeof value === 'string' && DATE_KEY_RE.test(value) && !Number.isNaN(Date.parse(value));
}

/** Local-time YYYY-MM-DD for a Date (the app's daily boundary is local midnight). */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Whole days between two YYYY-MM-DD keys (b - a). Calendar days, DST-safe. */
export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / MS_PER_DAY);
}

export function shiftDateKey(dateKey: string, days: number): string {
  const d = new Date(Date.parse(`${dateKey}T00:00:00Z`) + days * MS_PER_DAY);
  return d.toISOString().slice(0, 10);
}

/** "Daily #N": 1 on the epoch day, counting up. Never below 1. */
export function getDailyNumber(dateKey: string): number {
  return Math.max(1, daysBetween(DAILY_EPOCH, dateKey) + 1);
}

/** Milliseconds until the next local midnight, when a new daily unlocks. */
export function msUntilNextDaily(now: Date): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return Math.max(0, next.getTime() - now.getTime());
}

/** "13h 22m", or "22m" under an hour, or "<1m". */
export function formatCountdown(ms: number): string {
  const totalMinutes = Math.floor(ms / 60_000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return '<1m';
}

/**
 * A streak is alive if the last completion was today or yesterday. Older than
 * that and the displayed streak is 0 even though the stored value lingers
 * until the next completion resets it.
 */
export function isStreakAlive(data: StreakData, todayKey: string): boolean {
  if (!data.lastPlayDate || data.currentStreak <= 0) return false;
  const gap = daysBetween(data.lastPlayDate, todayKey);
  return gap === 0 || gap === 1;
}

export function displayStreak(data: StreakData, todayKey: string): number {
  return isStreakAlive(data, todayKey) ? data.currentStreak : 0;
}

/** Streak after completing the daily for `dateKey`. Idempotent for the same day. */
export function advanceStreak(prev: StreakData, dateKey: string): StreakData {
  if (prev.lastPlayDate === dateKey) return prev;
  const continues = !!prev.lastPlayDate && daysBetween(prev.lastPlayDate, dateKey) === 1;
  const currentStreak = continues ? prev.currentStreak + 1 : 1;
  return {
    currentStreak,
    lastPlayDate: dateKey,
    longestStreak: Math.max(currentStreak, prev.longestStreak),
  };
}

/**
 * Reconcile a locally stored streak with the server copy after sign-in. The
 * record with the more recent completion wins the current streak; on a tie
 * the larger streak wins. Longest streak is the max of both.
 */
export function mergeStreaks(local: StreakData, server: StreakData): StreakData {
  let winner: StreakData;
  if (server.lastPlayDate > local.lastPlayDate) winner = server;
  else if (local.lastPlayDate > server.lastPlayDate) winner = local;
  else winner = server.currentStreak > local.currentStreak ? server : local;
  return {
    currentStreak: winner.currentStreak,
    lastPlayDate: winner.lastPlayDate,
    longestStreak: Math.max(local.longestStreak, server.longestStreak, winner.currentStreak),
  };
}

export function markForRound(correct: boolean, hintsUsed: number): RoundMark {
  if (!correct) return 'L';
  return hintsUsed > 0 ? 'H' : 'W';
}

const MARK_EMOJI: Record<RoundMark, string> = { W: '🟩', H: '🟨', L: '🟥' };

export function marksToEmoji(marks: readonly RoundMark[]): string {
  return marks.map(m => MARK_EMOJI[m]).join('');
}

export function marksToString(marks: readonly RoundMark[]): string {
  return marks.join('');
}

export function marksFromString(value: string | undefined | null): RoundMark[] {
  if (!value) return [];
  return value.split('').filter((c): c is RoundMark => c === 'W' || c === 'H' || c === 'L');
}

export interface DailyShareInput {
  dayNumber: number;
  correct: number;
  total: number;
  score: number;
  marks: readonly RoundMark[];
  streak: number;
  beatPercent: number | null;
}

/** Wordle-style text block for the clipboard / native share sheet. */
export function buildDailyShareText(input: DailyShareInput): string {
  const lines = [
    `BattleGuess Daily #${input.dayNumber}`,
    `${marksToEmoji(input.marks)} ${input.correct}/${input.total} · ${input.score.toLocaleString('en-US')} pts`,
  ];
  const extras: string[] = [];
  if (input.streak > 1) extras.push(`🔥 ${input.streak}-day streak`);
  if (input.beatPercent !== null && input.beatPercent > 0) extras.push(`Beat ${input.beatPercent}% of players`);
  if (extras.length > 0) lines.push(extras.join(' · '));
  lines.push(DAILY_SHARE_URL);
  return lines.join('\n');
}

/** Copy the reader can act on when they see their percentile. */
export function describeBeatPercent(beatPercent: number | null, totalPlayers: number): string {
  if (beatPercent === null || totalPlayers <= 1) return "You're the first to finish today's challenge";
  if (beatPercent === 0) return 'Everyone else scored higher today. Tomorrow is a fresh set.';
  return `You beat ${beatPercent}% of today's players`;
}
