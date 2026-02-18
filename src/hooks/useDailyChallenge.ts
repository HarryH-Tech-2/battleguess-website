import { useState, useCallback } from 'react';
import { getDailyDateKey, getDailyBattleIds, submitDailyScore, getDailyLeaderboard, type DailyScore } from '../services/firebase';
import { getBattleById } from '../data/battles';
import type { Battle } from '../types';
import { useLocalStorage } from './useLocalStorage';

interface DailyChallengeState {
  phase: 'intro' | 'playing' | 'result';
  battles: Battle[];
  currentIndex: number;
  score: number;
  correctGuesses: number;
  dateKey: string;
  leaderboard: DailyScore[];
  isLoadingLeaderboard: boolean;
}

export function useDailyChallenge() {
  const [completedDays, setCompletedDays] = useLocalStorage<Record<string, { score: number; correct: number }>>('battleguess-daily-completed', {});

  const [state, setState] = useState<DailyChallengeState>({
    phase: 'intro',
    battles: [],
    currentIndex: 0,
    score: 0,
    correctGuesses: 0,
    dateKey: getDailyDateKey(),
    leaderboard: [],
    isLoadingLeaderboard: false,
  });

  const todayKey = getDailyDateKey();
  const isCompletedToday = !!completedDays[todayKey];
  const todayResult = completedDays[todayKey];

  const startDaily = useCallback(() => {
    const dateKey = getDailyDateKey();
    const battleIds = getDailyBattleIds(dateKey);
    const battles = battleIds.map(id => getBattleById(id)).filter(Boolean) as Battle[];

    setState({
      phase: 'playing',
      battles,
      currentIndex: 0,
      score: 0,
      correctGuesses: 0,
      dateKey,
      leaderboard: [],
      isLoadingLeaderboard: false,
    });
  }, []);

  const recordBattleResult = useCallback((correct: boolean, score: number) => {
    setState(prev => ({
      ...prev,
      score: prev.score + score,
      correctGuesses: prev.correctGuesses + (correct ? 1 : 0),
    }));
  }, []);

  const advanceToNext = useCallback(() => {
    setState(prev => {
      if (prev.currentIndex >= prev.battles.length - 1) {
        // All battles done
        const result = { score: prev.score, correct: prev.correctGuesses };
        // Save to localStorage
        setCompletedDays(days => ({ ...days, [prev.dateKey]: result }));
        // Submit to Firebase (fire-and-forget)
        submitDailyScore(prev.score, prev.correctGuesses, prev.battles.length);
        // Load leaderboard
        loadLeaderboard(prev.dateKey);

        return { ...prev, phase: 'result' as const };
      }
      return { ...prev, currentIndex: prev.currentIndex + 1 };
    });
  }, [setCompletedDays]);

  const loadLeaderboard = async (dateKey: string) => {
    setState(prev => ({ ...prev, isLoadingLeaderboard: true }));
    const leaderboard = await getDailyLeaderboard(dateKey);
    setState(prev => ({ ...prev, leaderboard, isLoadingLeaderboard: false }));
  };

  const getCurrentBattle = useCallback((): Battle | null => {
    if (state.phase !== 'playing' || state.currentIndex >= state.battles.length) return null;
    return state.battles[state.currentIndex];
  }, [state.phase, state.currentIndex, state.battles]);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'intro',
      currentIndex: 0,
      score: 0,
      correctGuesses: 0,
      leaderboard: [],
    }));
  }, []);

  return {
    state,
    isCompletedToday,
    todayResult,
    startDaily,
    recordBattleResult,
    advanceToNext,
    getCurrentBattle,
    reset,
  };
}
