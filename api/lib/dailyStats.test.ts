import { describe, it, expect } from 'vitest';
import {
  advanceStreakRow,
  computeBeatPercent,
  computeRank,
  displayName,
  validateDailyResult,
} from './dailyStats';

const NOW = new Date('2026-09-04T12:00:00Z');
const good = { dateKey: '2026-09-04', anonId: 'abcdefgh-1234', score: 900, correct: 3, marks: 'WWHLL' };

describe('validateDailyResult', () => {
  it('accepts a well-formed submission', () => {
    const r = validateDailyResult(good, NOW);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toEqual(good);
  });

  it('allows a client whose local date is a day off from UTC', () => {
    expect(validateDailyResult({ ...good, dateKey: '2026-09-05' }, NOW).ok).toBe(true);
    expect(validateDailyResult({ ...good, dateKey: '2026-09-03' }, NOW).ok).toBe(true);
  });

  it('rejects dates far from today', () => {
    expect(validateDailyResult({ ...good, dateKey: '2026-08-01' }, NOW).ok).toBe(false);
  });

  it('rejects bad ids, scores and counts', () => {
    expect(validateDailyResult({ ...good, anonId: 'short' }, NOW).ok).toBe(false);
    expect(validateDailyResult({ ...good, anonId: 'has spaces here' }, NOW).ok).toBe(false);
    expect(validateDailyResult({ ...good, score: 99_999 }, NOW).ok).toBe(false);
    expect(validateDailyResult({ ...good, score: -1 }, NOW).ok).toBe(false);
    expect(validateDailyResult({ ...good, score: 1.5 }, NOW).ok).toBe(false);
    expect(validateDailyResult({ ...good, correct: 6 }, NOW).ok).toBe(false);
  });

  it('rejects marks that disagree with the correct count', () => {
    expect(validateDailyResult({ ...good, marks: 'WWWWW' }, NOW).ok).toBe(false);
    expect(validateDailyResult({ ...good, marks: 'ABC' }, NOW).ok).toBe(false);
    expect(validateDailyResult({ ...good, marks: '' }, NOW).ok).toBe(true);
  });

  it('rejects a missing body', () => {
    expect(validateDailyResult(undefined, NOW).ok).toBe(false);
  });
});

describe('percentile and rank', () => {
  it('returns null with no other players', () => {
    expect(computeBeatPercent([900], 900)).toBeNull();
    expect(computeBeatPercent([], 900)).toBeNull();
  });

  it('counts only strictly lower scores among the others', () => {
    // others: 100, 500, 900, 1200 -> beats 2 of 4
    expect(computeBeatPercent([100, 500, 900, 900, 1200], 900)).toBe(50);
    expect(computeBeatPercent([100, 500, 900], 900)).toBe(100);
    expect(computeBeatPercent([1000, 900], 900)).toBe(0);
  });

  it('ranks ties equally', () => {
    expect(computeRank([1200, 900, 900, 100], 900)).toBe(2);
    expect(computeRank([1200, 900, 900, 100], 1200)).toBe(1);
    expect(computeRank([1200, 900, 900, 100], 100)).toBe(4);
  });
});

describe('advanceStreakRow', () => {
  it('starts, continues, resets and stays idempotent', () => {
    const fresh = { current_streak: 0, longest_streak: 0, last_played_date: null };
    const d1 = advanceStreakRow(fresh, '2026-09-04');
    expect(d1).toEqual({ current_streak: 1, longest_streak: 1, last_played_date: '2026-09-04' });
    const d2 = advanceStreakRow(d1, '2026-09-05');
    expect(d2.current_streak).toBe(2);
    expect(advanceStreakRow(d2, '2026-09-05')).toBe(d2);
    const gap = advanceStreakRow(d2, '2026-09-08');
    expect(gap).toEqual({ current_streak: 1, longest_streak: 2, last_played_date: '2026-09-08' });
  });
});

describe('displayName', () => {
  it('shortens to first name plus last initial', () => {
    expect(displayName('Harry Harrison')).toBe('Harry H.');
    expect(displayName('Ada King Lovelace')).toBe('Ada L.');
    expect(displayName('Cher')).toBe('Cher');
    expect(displayName('')).toBe('Commander');
    expect(displayName(null)).toBe('Commander');
  });
});
