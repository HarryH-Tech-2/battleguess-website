import { useState, useCallback } from 'react';
import type { Battle, CivilizationId, Difficulty } from '../types';
import { getTimelineBattleSet } from '../data/battles/index';
import { scoreTimeline, type TimelineScore } from '../utils/timelineScoring';

export type TimelineStatus = 'idle' | 'playing' | 'submitted' | 'completed';

export interface TimelineState {
  status: TimelineStatus;
  battles: Battle[];
  playerOrder: Battle[];
  correctOrder: Battle[];
  score: TimelineScore | null;
  roundsPlayed: number;
  totalScore: number;
}

export function useTimelineGame() {
  const [state, setState] = useState<TimelineState>({
    status: 'idle',
    battles: [],
    playerOrder: [],
    correctOrder: [],
    score: null,
    roundsPlayed: 0,
    totalScore: 0,
  });

  const startRound = useCallback((
    civilization: CivilizationId | 'all' = 'all',
    difficulty: Difficulty | 'all' = 'all'
  ) => {
    const battles = getTimelineBattleSet(civilization, difficulty, 5);
    const correctOrder = [...battles].sort((a, b) => a.year - b.year);
    // Shuffle for player
    const playerOrder = [...battles].sort(() => Math.random() - 0.5);

    setState(prev => ({
      ...prev,
      status: 'playing',
      battles,
      playerOrder,
      correctOrder,
      score: null,
    }));
  }, []);

  const reorderBattles = useCallback((newOrder: Battle[]) => {
    setState(prev => ({
      ...prev,
      playerOrder: newOrder,
    }));
  }, []);

  const submitOrder = useCallback(() => {
    setState(prev => {
      const score = scoreTimeline(prev.playerOrder, prev.correctOrder);
      return {
        ...prev,
        status: 'submitted',
        score,
        roundsPlayed: prev.roundsPlayed + 1,
        totalScore: prev.totalScore + score.totalScore,
      };
    });
  }, []);

  const nextRound = useCallback((
    civilization: CivilizationId | 'all' = 'all',
    difficulty: Difficulty | 'all' = 'all'
  ) => {
    startRound(civilization, difficulty);
  }, [startRound]);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      battles: [],
      playerOrder: [],
      correctOrder: [],
      score: null,
      roundsPlayed: 0,
      totalScore: 0,
    });
  }, []);

  return {
    state,
    actions: {
      startRound,
      reorderBattles,
      submitOrder,
      nextRound,
      reset,
    },
  };
}
