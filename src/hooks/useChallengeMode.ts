import { useState, useCallback, useEffect } from 'react';
import {
  createChallenge,
  getChallenge,
  type Challenge,
  type ChallengeAttempt,
} from '../services/firebase';
import { getBattleById } from '../data/battles';
import type { Battle } from '../types';

interface ChallengeState {
  phase: 'idle' | 'creating' | 'playing' | 'result' | 'viewing' | 'share';
  challenge: Challenge | null;
  battles: Battle[];
  currentIndex: number;
  score: number;
  correctGuesses: number;
  attempts: ChallengeAttempt[];
  isLoading: boolean;
  challengeUrl: string | null;
  playedBattleIds: number[];
}

export function useChallengeMode() {
  const [state, setState] = useState<ChallengeState>({
    phase: 'idle',
    challenge: null,
    battles: [],
    currentIndex: 0,
    score: 0,
    correctGuesses: 0,
    attempts: [],
    isLoading: false,
    challengeUrl: null,
    playedBattleIds: [],
  });

  const loadChallenge = useCallback((challengeId: string) => {
    setState(prev => ({ ...prev, isLoading: true, phase: 'viewing' }));
    const challenge = getChallenge(challengeId);
    if (challenge) {
      const battles = challenge.battleIds.map(id => getBattleById(id)).filter(Boolean) as Battle[];
      setState(prev => ({
        ...prev,
        challenge,
        battles,
        isLoading: false,
        phase: 'viewing',
      }));
    } else {
      setState(prev => ({ ...prev, isLoading: false, phase: 'idle' }));
    }
  }, []);

  // Check URL for challenge ID on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const challengeId = params.get('challenge');
    if (challengeId) {
      loadChallenge(challengeId); // eslint-disable-line react-hooks/set-state-in-effect -- intentional mount-time initialization from URL
    }
  }, [loadChallenge]);

  // For accepting a received challenge
  const startChallenge = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'playing',
      currentIndex: 0,
      score: 0,
      correctGuesses: 0,
    }));
  }, []);

  // For creating a new challenge (creator plays first)
  const startCreating = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'creating',
      score: 0,
      correctGuesses: 0,
      playedBattleIds: [],
      challengeUrl: null,
    }));
  }, []);

  const recordBattlePlayed = useCallback((battleId: number) => {
    setState(prev => ({
      ...prev,
      playedBattleIds: [...prev.playedBattleIds, battleId],
    }));
  }, []);

  const finishCreating = useCallback((score: number, correctGuesses: number, difficulty: string, civilization: string) => {
    const battleIds = state.playedBattleIds;
    if (battleIds.length === 0) return;

    const challengeId = createChallenge(battleIds, score, correctGuesses, difficulty, civilization);
    const url = `${window.location.origin}/?challenge=${challengeId}`;
    setState(prev => ({ ...prev, phase: 'share', challengeUrl: url, score, correctGuesses }));
  }, [state.playedBattleIds]);

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
        return { ...prev, phase: 'result' as const };
      }
      return { ...prev, currentIndex: prev.currentIndex + 1 };
    });
  }, []);

  const createNewChallenge = useCallback((
    battleIds: number[],
    score: number,
    correctGuesses: number,
    difficulty: string,
    civilization: string
  ): string | null => {
    const challengeId = createChallenge(battleIds, score, correctGuesses, difficulty, civilization);
    const url = `${window.location.origin}/?challenge=${challengeId}`;
    setState(prev => ({ ...prev, challengeUrl: url }));
    return url;
  }, []);

  const getCurrentBattle = useCallback((): Battle | null => {
    if (state.phase !== 'playing' || state.currentIndex >= state.battles.length) return null;
    return state.battles[state.currentIndex];
  }, [state.phase, state.currentIndex, state.battles]);

  const reset = useCallback(() => {
    setState({
      phase: 'idle',
      challenge: null,
      battles: [],
      currentIndex: 0,
      score: 0,
      correctGuesses: 0,
      attempts: [],
      isLoading: false,
      challengeUrl: null,
      playedBattleIds: [],
    });
    // Clear URL param
    const url = new URL(window.location.href);
    url.searchParams.delete('challenge');
    window.history.replaceState({}, '', url.toString());
  }, []);

  return {
    state,
    startChallenge,
    startCreating,
    recordBattlePlayed,
    finishCreating,
    recordBattleResult,
    advanceToNext,
    createNewChallenge,
    getCurrentBattle,
    reset,
    loadChallenge,
  };
}
