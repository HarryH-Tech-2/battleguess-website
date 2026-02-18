import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { CivilizationId, Difficulty } from '../types';

export interface BattleResult {
  battleId: number;
  civilization: CivilizationId;
  difficulty: Difficulty;
  correct: boolean;
  hintsUsed: number;
  timestamp: number;
  timeSpent?: number;
}

export interface DetailedStats {
  results: BattleResult[];
}

export function useStats() {
  const [stats, setStats] = useLocalStorage<DetailedStats>('battleguess-detailed-stats', { results: [] });

  const recordResult = useCallback((result: BattleResult) => {
    setStats(prev => ({ results: [...prev.results, result] }));
  }, [setStats]);

  const derived = useMemo(() => {
    const { results } = stats;
    const total = results.length;
    const correct = results.filter(r => r.correct).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    const byCivilization: Record<string, { total: number; correct: number }> = {};
    const byDifficulty: Record<string, { total: number; correct: number }> = {};

    for (const r of results) {
      if (!byCivilization[r.civilization]) byCivilization[r.civilization] = { total: 0, correct: 0 };
      byCivilization[r.civilization].total++;
      if (r.correct) byCivilization[r.civilization].correct++;

      if (!byDifficulty[r.difficulty]) byDifficulty[r.difficulty] = { total: 0, correct: 0 };
      byDifficulty[r.difficulty].total++;
      if (r.correct) byDifficulty[r.difficulty].correct++;
    }

    const avgHints = total > 0
      ? Math.round((results.reduce((s, r) => s + r.hintsUsed, 0) / total) * 10) / 10
      : 0;

    return { total, correct, accuracy, byCivilization, byDifficulty, avgHints };
  }, [stats]);

  return { stats, recordResult, ...derived };
}
