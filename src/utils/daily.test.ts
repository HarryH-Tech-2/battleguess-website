import { describe, it, expect } from 'vitest';
import {
  DAILY_EPOCH,
  EMPTY_STREAK,
  advanceStreak,
  buildDailyShareText,
  daysBetween,
  describeBeatPercent,
  displayStreak,
  formatCountdown,
  getDailyNumber,
  isDateKey,
  isStreakAlive,
  markForRound,
  marksFromString,
  marksToEmoji,
  mergeStreaks,
  msUntilNextDaily,
  shiftDateKey,
  toDateKey,
} from './daily';

describe('date keys', () => {
  it('formats local dates as YYYY-MM-DD', () => {
    expect(toDateKey(new Date(2026, 8, 4, 23, 59))).toBe('2026-09-04');
    expect(toDateKey(new Date(2026, 0, 1, 0, 0))).toBe('2026-01-01');
  });

  it('validates keys strictly', () => {
    expect(isDateKey('2026-09-04')).toBe(true);
    expect(isDateKey('2026-9-4')).toBe(false);
    expect(isDateKey('2026-13-40')).toBe(false);
    expect(isDateKey(20260904)).toBe(false);
  });

  it('counts calendar days between keys', () => {
    expect(daysBetween('2026-09-04', '2026-09-05')).toBe(1);
    expect(daysBetween('2026-09-05', '2026-09-04')).toBe(-1);
    expect(daysBetween('2026-02-28', '2026-03-01')).toBe(1);
    expect(daysBetween('2026-03-28', '2026-03-30')).toBe(2); // across EU DST switch
  });

  it('shifts keys by days', () => {
    expect(shiftDateKey('2026-12-31', 1)).toBe('2027-01-01');
    expect(shiftDateKey('2026-03-01', -1)).toBe('2026-02-28');
  });
});

describe('daily number', () => {
  it('is 1 on the epoch day and counts up', () => {
    expect(getDailyNumber(DAILY_EPOCH)).toBe(1);
    expect(getDailyNumber(shiftDateKey(DAILY_EPOCH, 9))).toBe(10);
  });

  it('never drops below 1 for days before the epoch', () => {
    expect(getDailyNumber(shiftDateKey(DAILY_EPOCH, -30))).toBe(1);
  });
});

describe('countdown', () => {
  it('measures to the next local midnight', () => {
    const now = new Date(2026, 8, 4, 22, 30, 0);
    expect(msUntilNextDaily(now)).toBe(90 * 60_000);
  });

  it('formats hours and minutes', () => {
    expect(formatCountdown(13 * 3_600_000 + 22 * 60_000 + 5_000)).toBe('13h 22m');
    expect(formatCountdown(22 * 60_000)).toBe('22m');
    expect(formatCountdown(30_000)).toBe('<1m');
  });
});

describe('streak', () => {
  it('starts at 1 on first completion', () => {
    expect(advanceStreak(EMPTY_STREAK, '2026-09-04')).toEqual({
      currentStreak: 1,
      lastPlayDate: '2026-09-04',
      longestStreak: 1,
    });
  });

  it('increments on consecutive days and tracks the longest', () => {
    const day1 = advanceStreak(EMPTY_STREAK, '2026-09-04');
    const day2 = advanceStreak(day1, '2026-09-05');
    expect(day2.currentStreak).toBe(2);
    expect(day2.longestStreak).toBe(2);
  });

  it('resets to 1 after a missed day but keeps the longest', () => {
    const streak = { currentStreak: 5, lastPlayDate: '2026-09-04', longestStreak: 5 };
    const after = advanceStreak(streak, '2026-09-06');
    expect(after).toEqual({ currentStreak: 1, lastPlayDate: '2026-09-06', longestStreak: 5 });
  });

  it('is idempotent for the same day', () => {
    const streak = { currentStreak: 3, lastPlayDate: '2026-09-04', longestStreak: 3 };
    expect(advanceStreak(streak, '2026-09-04')).toBe(streak);
  });

  it('is alive today and yesterday, dead after that', () => {
    const streak = { currentStreak: 3, lastPlayDate: '2026-09-04', longestStreak: 3 };
    expect(isStreakAlive(streak, '2026-09-04')).toBe(true);
    expect(isStreakAlive(streak, '2026-09-05')).toBe(true);
    expect(isStreakAlive(streak, '2026-09-06')).toBe(false);
    expect(displayStreak(streak, '2026-09-06')).toBe(0);
    expect(displayStreak(EMPTY_STREAK, '2026-09-06')).toBe(0);
  });
});

describe('mergeStreaks', () => {
  it('prefers the record with the later completion', () => {
    const local = { currentStreak: 1, lastPlayDate: '2026-09-05', longestStreak: 1 };
    const server = { currentStreak: 7, lastPlayDate: '2026-08-20', longestStreak: 7 };
    expect(mergeStreaks(local, server)).toEqual({
      currentStreak: 1,
      lastPlayDate: '2026-09-05',
      longestStreak: 7,
    });
  });

  it('takes the larger streak on the same day', () => {
    const local = { currentStreak: 1, lastPlayDate: '2026-09-05', longestStreak: 1 };
    const server = { currentStreak: 4, lastPlayDate: '2026-09-05', longestStreak: 4 };
    expect(mergeStreaks(local, server).currentStreak).toBe(4);
  });

  it('handles an empty server record', () => {
    const local = { currentStreak: 2, lastPlayDate: '2026-09-05', longestStreak: 2 };
    expect(mergeStreaks(local, EMPTY_STREAK)).toEqual(local);
  });
});

describe('marks', () => {
  it('classifies rounds', () => {
    expect(markForRound(true, 0)).toBe('W');
    expect(markForRound(true, 2)).toBe('H');
    expect(markForRound(false, 1)).toBe('L');
  });

  it('round-trips through strings and renders emoji', () => {
    expect(marksFromString('WHLxW')).toEqual(['W', 'H', 'L', 'W']);
    expect(marksFromString(undefined)).toEqual([]);
    expect(marksToEmoji(['W', 'H', 'L'])).toBe('🟩🟨🟥');
  });
});

describe('share text', () => {
  it('includes grid, score, streak and percentile', () => {
    const text = buildDailyShareText({
      dayNumber: 12,
      correct: 4,
      total: 5,
      score: 1240,
      marks: ['W', 'W', 'H', 'L', 'W'],
      streak: 3,
      beatPercent: 68,
    });
    expect(text).toBe(
      'BattleGuess Daily #12\n🟩🟩🟨🟥🟩 4/5 · 1,240 pts\n🔥 3-day streak · Beat 68% of players\nhttps://battleguess.app/daily',
    );
  });

  it('omits the extras line when there is nothing to brag about', () => {
    const text = buildDailyShareText({
      dayNumber: 1,
      correct: 0,
      total: 5,
      score: 0,
      marks: ['L', 'L', 'L', 'L', 'L'],
      streak: 1,
      beatPercent: null,
    });
    expect(text.split('\n')).toHaveLength(3);
  });
});

describe('describeBeatPercent', () => {
  it('handles first player, zero, and normal cases', () => {
    expect(describeBeatPercent(null, 1)).toMatch(/first to finish/);
    expect(describeBeatPercent(0, 5)).toMatch(/Everyone else/);
    expect(describeBeatPercent(72, 40)).toBe("You beat 72% of today's players");
  });
});
