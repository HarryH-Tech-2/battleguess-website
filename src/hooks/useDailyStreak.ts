import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface DailyStreakData {
  currentStreak: number;
  lastPlayDate: string;
  longestStreak: number;
}

export function useDailyStreak() {
  const [data, setData] = useLocalStorage<DailyStreakData>('battleguess-daily-streak', {
    currentStreak: 0,
    lastPlayDate: '',
    longestStreak: 0,
  });

  const recordPlay = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    if (data.lastPlayDate === today) return;

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const newStreak = data.lastPlayDate === yesterday ? data.currentStreak + 1 : 1;

    setData({
      currentStreak: newStreak,
      lastPlayDate: today,
      longestStreak: Math.max(newStreak, data.longestStreak),
    });
  }, [data, setData]);

  return { ...data, recordPlay };
}
