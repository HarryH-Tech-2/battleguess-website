import type { RoundMark, StreakData } from '../utils/daily';
import { marksToString } from '../utils/daily';

export interface LeaderboardEntry {
  name: string;
  avatarUrl: string | null;
  score: number;
  correct: number;
  isYou: boolean;
}

export interface DailyCommunity {
  dateKey: string;
  totalPlayers: number;
  beatPercent: number | null;
  rank: number | null;
  yourScore: number | null;
  leaderboard: LeaderboardEntry[];
}

export interface ServerStreak {
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null;
}

const ANON_ID_KEY = 'battleguess-anon-id';

/**
 * Stable per-browser id so anonymous players count toward the daily
 * percentile and can be attached to an account if they sign in later.
 */
export function getAnonId(): string {
  try {
    const existing = localStorage.getItem(ANON_ID_KEY);
    if (existing && /^[A-Za-z0-9_-]{8,64}$/.test(existing)) return existing;
    const fresh = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
    localStorage.setItem(ANON_ID_KEY, fresh);
    return fresh;
  } catch {
    return 'anon-no-storage';
  }
}

function authHeaders(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface SubmitDailyInput {
  dateKey: string;
  score: number;
  correct: number;
  marks: RoundMark[];
}

export async function submitDailyResult(
  input: SubmitDailyInput,
  token: string | null,
): Promise<DailyCommunity & { streak: ServerStreak | null }> {
  const res = await fetch('/api/daily/result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({
      dateKey: input.dateKey,
      anonId: getAnonId(),
      score: input.score,
      correct: input.correct,
      marks: marksToString(input.marks),
    }),
  });
  if (!res.ok) throw new Error(`daily/result ${res.status}`);
  return res.json();
}

export async function fetchDailyCommunity(dateKey: string, token: string | null): Promise<DailyCommunity> {
  const params = new URLSearchParams({ date: dateKey, anonId: getAnonId() });
  const res = await fetch(`/api/daily/leaderboard?${params}`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error(`daily/leaderboard ${res.status}`);
  return res.json();
}

export async function fetchServerStreak(token: string): Promise<StreakData> {
  const res = await fetch('/api/me/stats', { headers: authHeaders(token) });
  if (!res.ok) throw new Error(`me/stats ${res.status}`);
  const data = await res.json() as { streak: ServerStreak };
  return serverStreakToLocal(data.streak);
}

export function serverStreakToLocal(streak: ServerStreak | null | undefined): StreakData {
  return {
    currentStreak: streak?.currentStreak ?? 0,
    longestStreak: streak?.longestStreak ?? 0,
    lastPlayDate: streak?.lastPlayedDate ?? '',
  };
}

/** Push the browser's stats to the account so nothing is lost on sign-in. */
export async function migrateLocalStats(token: string, streak: StreakData): Promise<void> {
  let totalGames = 0;
  let battlesDiscovered = 0;
  try {
    const raw = localStorage.getItem('battleguess-detailed-stats');
    const parsed = raw ? JSON.parse(raw) as { results?: Array<{ battleId: number; correct: boolean }> } : null;
    const results = parsed?.results ?? [];
    totalGames = results.length;
    battlesDiscovered = new Set(results.filter(r => r.correct).map(r => r.battleId)).size;
  } catch {
    // ignore malformed local data
  }
  await fetch('/api/auth/migrate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({
      totalGames,
      battlesDiscovered,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastPlayedDate: streak.lastPlayDate || null,
    }),
  });
}
