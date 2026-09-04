import { sql } from './db.js';
import {
  advanceStreakRow,
  computeBeatPercent,
  computeRank,
  displayName,
  type DailyResultInput,
  type StreakRow,
} from './dailyStats.js';

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
  /** Percent of other players this player beat; null if nobody else played. */
  beatPercent: number | null;
  rank: number | null;
  yourScore: number | null;
  leaderboard: LeaderboardEntry[];
}

export interface StreakSummary {
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null;
}

interface PlayerScoreRow {
  pk: string;
  score: number;
}

interface LeaderRow {
  user_id: string;
  name: string;
  avatar_url: string | null;
  score: number;
  correct: number;
}

/** Insert the day's result. A second submission for the same player only attaches the user id. */
export async function upsertDailyResult(input: DailyResultInput, userId: string | null): Promise<void> {
  await sql`
    INSERT INTO daily_results (date_key, player_key, user_id, score, correct, marks)
    VALUES (${input.dateKey}, ${input.anonId}, ${userId}, ${input.score}, ${input.correct}, ${input.marks})
    ON CONFLICT (date_key, player_key)
    DO UPDATE SET user_id = COALESCE(EXCLUDED.user_id, daily_results.user_id)
  `;
}

/**
 * Community picture for one day: how many played, how the given player
 * ranks, and the top signed-in players. A player is identified by their
 * anonymous id and, when signed in, their user id (either row counts as them).
 */
export async function getDailyCommunity(
  dateKey: string,
  anonId: string | null,
  userId: string | null,
): Promise<DailyCommunity> {
  // Best score per distinct player. Signed-in players who played from two
  // browsers collapse onto their user id.
  const { rows: players } = await sql<PlayerScoreRow>`
    SELECT COALESCE(user_id::text, player_key) AS pk, MAX(score)::int AS score
    FROM daily_results
    WHERE date_key = ${dateKey}
    GROUP BY pk
  `;

  const mine = players.find(p => (userId && p.pk === userId) || (anonId && p.pk === anonId));
  const scores = players.map(p => p.score);

  const { rows: leaders } = await sql<LeaderRow>`
    SELECT DISTINCT ON (d.user_id)
      d.user_id::text AS user_id, u.name, u.avatar_url, d.score::int AS score, d.correct::int AS correct
    FROM daily_results d
    JOIN users u ON u.id = d.user_id
    WHERE d.date_key = ${dateKey} AND d.user_id IS NOT NULL
    ORDER BY d.user_id, d.score DESC
  `;
  leaders.sort((a, b) => b.score - a.score || b.correct - a.correct);

  return {
    dateKey,
    totalPlayers: players.length,
    beatPercent: mine ? computeBeatPercent(scores, mine.score) : null,
    rank: mine ? computeRank(scores, mine.score) : null,
    yourScore: mine ? mine.score : null,
    leaderboard: leaders.slice(0, 10).map(l => ({
      name: displayName(l.name),
      avatarUrl: l.avatar_url,
      score: l.score,
      correct: l.correct,
      isYou: l.user_id === userId,
    })),
  };
}

/** Advance the signed-in user's server streak for a completed daily and return it. */
export async function recordUserStreak(userId: string, dateKey: string): Promise<StreakSummary> {
  await sql`INSERT INTO user_stats (user_id) VALUES (${userId}) ON CONFLICT (user_id) DO NOTHING`;
  const { rows } = await sql<{ current_streak: number; longest_streak: number; last_played_date: Date | string | null }>`
    SELECT current_streak, longest_streak, last_played_date FROM user_stats WHERE user_id = ${userId}
  `;
  const row: StreakRow = {
    current_streak: rows[0]?.current_streak ?? 0,
    longest_streak: rows[0]?.longest_streak ?? 0,
    last_played_date: toDateKey(rows[0]?.last_played_date ?? null),
  };
  const next = advanceStreakRow(row, dateKey);
  if (next !== row) {
    await sql`
      UPDATE user_stats
      SET current_streak = ${next.current_streak},
          longest_streak = ${next.longest_streak},
          last_played_date = ${next.last_played_date}::DATE,
          total_games = total_games + 1
      WHERE user_id = ${userId}
    `;
  }
  return {
    currentStreak: next.current_streak,
    longestStreak: next.longest_streak,
    lastPlayedDate: next.last_played_date,
  };
}

export async function getUserStreak(userId: string): Promise<StreakSummary> {
  const { rows } = await sql<{ current_streak: number; longest_streak: number; last_played_date: Date | string | null }>`
    SELECT current_streak, longest_streak, last_played_date FROM user_stats WHERE user_id = ${userId}
  `;
  return {
    currentStreak: rows[0]?.current_streak ?? 0,
    longestStreak: rows[0]?.longest_streak ?? 0,
    lastPlayedDate: toDateKey(rows[0]?.last_played_date ?? null),
  };
}

// `pg` returns DATE columns as JS Dates at local midnight; normalise to YYYY-MM-DD.
function toDateKey(value: Date | string | null): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value.slice(0, 10);
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, '0');
  const d = String(value.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
