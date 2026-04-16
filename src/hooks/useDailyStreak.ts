import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useAuth } from '../contexts/AuthContext';

interface DailyStreakData {
  currentStreak: number;
  lastPlayDate: string;
  longestStreak: number;
}

const EMPTY_STREAK: DailyStreakData = {
  currentStreak: 0,
  lastPlayDate: '',
  longestStreak: 0,
};

export function useDailyStreak() {
  const { isAuthenticated } = useAuth();
  const [rawData, setRawData] = useLocalStorage<DailyStreakData>(
    'battleguess-daily-streak',
    EMPTY_STREAK,
  );

  // Anonymous users don't accumulate a streak. Legacy localStorage data is
  // kept for future sign-in migration but never surfaced.
  const data = isAuthenticated ? rawData : EMPTY_STREAK;

  const recordPlay = useCallback(() => {
    if (!isAuthenticated) return;
    const today = new Date().toISOString().split('T')[0];
    if (rawData.lastPlayDate === today) return;

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const newStreak = rawData.lastPlayDate === yesterday ? rawData.currentStreak + 1 : 1;

    setRawData({
      currentStreak: newStreak,
      lastPlayDate: today,
      longestStreak: Math.max(newStreak, rawData.longestStreak),
    });
  }, [isAuthenticated, rawData, setRawData]);

  return { ...data, recordPlay };
}
