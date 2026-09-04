import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getDailyDateKey } from '../services/firebase';
import {
  EMPTY_STREAK,
  advanceStreak,
  displayStreak,
  mergeStreaks,
  type StreakData,
} from '../utils/daily';

/**
 * Consecutive days on which the player finished the Daily Challenge.
 *
 * Tracked locally for everyone (it is the hook that brings people back), and
 * mirrored to the account for signed-in players so it survives a new device.
 * Signing up is what makes the streak permanent; that's the pitch.
 */
export function useDailyStreak() {
  const [data, setData] = useLocalStorage<StreakData>('battleguess-daily-streak', EMPTY_STREAK);
  const todayKey = getDailyDateKey();

  const recordDailyCompletion = useCallback((dateKey: string) => {
    setData(prev => advanceStreak(prev, dateKey));
  }, [setData]);

  const mergeServerStreak = useCallback((server: StreakData) => {
    setData(prev => mergeStreaks(prev, server));
  }, [setData]);

  return {
    /** Streak as it should be shown right now: 0 once a day has been missed. */
    currentStreak: displayStreak(data, todayKey),
    longestStreak: data.longestStreak,
    lastPlayDate: data.lastPlayDate,
    completedToday: data.lastPlayDate === todayKey,
    raw: data,
    recordDailyCompletion,
    mergeServerStreak,
  };
}
