import { useState, useCallback } from 'react';
import { getDailyDateKey, getDailyBattleIds } from '../services/firebase';
import { getBattleById } from '../data/battles';
import type { Battle } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { markForRound, type RoundMark } from '../utils/daily';
import type { DailyCommunity } from '../services/dailyApi';

export interface DailyDayRecord {
  score: number;
  correct: number;
  marks: RoundMark[];
  /** Last community snapshot we received for this day, if any. */
  community?: DailyCommunity;
  /** True once the result has been accepted by the server. */
  submitted?: boolean;
}

interface DailyChallengeState {
  phase: 'intro' | 'playing' | 'result';
  battles: Battle[];
  currentIndex: number;
  score: number;
  correctGuesses: number;
  marks: RoundMark[];
  dateKey: string;
}

function freshState(): DailyChallengeState {
  return {
    phase: 'intro',
    battles: [],
    currentIndex: 0,
    score: 0,
    correctGuesses: 0,
    marks: [],
    dateKey: getDailyDateKey(),
  };
}

export function useDailyChallenge() {
  const [completedDays, setCompletedDays] = useLocalStorage<Record<string, DailyDayRecord>>(
    'battleguess-daily-completed',
    {},
  );
  const [state, setState] = useState<DailyChallengeState>(freshState);

  const todayKey = getDailyDateKey();
  const todayResult: DailyDayRecord | undefined = completedDays[todayKey];
  const isCompletedToday = !!todayResult;

  const startDaily = useCallback(() => {
    const dateKey = getDailyDateKey();
    const battleIds = getDailyBattleIds(dateKey);
    const battles = battleIds.map(id => getBattleById(id)).filter(Boolean) as Battle[];
    setState({ ...freshState(), phase: 'playing', battles, dateKey });
  }, []);

  const recordBattleResult = useCallback((correct: boolean, score: number, hintsUsed: number) => {
    setState(prev => ({
      ...prev,
      score: prev.score + score,
      correctGuesses: prev.correctGuesses + (correct ? 1 : 0),
      marks: [...prev.marks, markForRound(correct, hintsUsed)],
    }));
  }, []);

  /**
   * Move to the next battle, or finish the day. Finishing persists the
   * result locally straight away so a reload can't lose it; the server
   * submission happens separately (see `markSubmitted`).
   */
  const advanceToNext = useCallback(() => {
    setState(prev => {
      if (prev.currentIndex < prev.battles.length - 1) {
        return { ...prev, currentIndex: prev.currentIndex + 1 };
      }
      return { ...prev, phase: 'result' };
    });
  }, []);

  const persistToday = useCallback((record: Partial<DailyDayRecord> & Pick<DailyDayRecord, 'score' | 'correct' | 'marks'>) => {
    setCompletedDays(days => ({
      ...days,
      [state.dateKey]: { ...days[state.dateKey], ...record },
    }));
  }, [setCompletedDays, state.dateKey]);

  const updateCommunity = useCallback((dateKey: string, community: DailyCommunity, submitted?: boolean) => {
    setCompletedDays(days => {
      const existing = days[dateKey];
      if (!existing) return days;
      return { ...days, [dateKey]: { ...existing, community, submitted: submitted ?? existing.submitted } };
    });
  }, [setCompletedDays]);

  const getCurrentBattle = useCallback((): Battle | null => {
    if (state.phase !== 'playing' || state.currentIndex >= state.battles.length) return null;
    return state.battles[state.currentIndex];
  }, [state.phase, state.currentIndex, state.battles]);

  const reset = useCallback(() => {
    setState(freshState());
  }, []);

  return {
    state,
    todayKey,
    isCompletedToday,
    todayResult,
    startDaily,
    recordBattleResult,
    advanceToNext,
    persistToday,
    updateCommunity,
    getCurrentBattle,
    reset,
  };
}
