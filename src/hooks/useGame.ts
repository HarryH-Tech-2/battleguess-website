import { useReducer, useCallback, useEffect } from 'react';
import type { GameState, GameAction, CivilizationId, Difficulty } from '../types';
import { getRandomBattle, getBattlesByCivilization } from '../data/battles/index';
import { checkAnswer } from '../utils/stringMatch';
import { calculateScore } from '../utils/scoring';
import { useLocalStorage } from './useLocalStorage';

const initialState: GameState = {
  currentBattle: null,
  score: 0,
  streak: 0,
  bestStreak: 0,
  hintsUsed: 0,
  totalGuesses: 0,
  correctGuesses: 0,
  gameStatus: 'idle',
  revealedHints: [],
  currentGuess: '',
  imageUrl: null,
  isImageLoading: false,
  selectedCivilization: 'all',
  selectedDifficulty: 'all',
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        gameStatus: 'loading',
        revealedHints: [],
        hintsUsed: 0,
        currentGuess: '',
      };
    case 'SET_BATTLE':
      return {
        ...state,
        currentBattle: action.payload,
        gameStatus: 'playing',
      };
    case 'SET_IMAGE':
      return {
        ...state,
        imageUrl: action.payload,
        isImageLoading: false,
      };
    case 'SET_IMAGE_LOADING':
      return {
        ...state,
        isImageLoading: action.payload,
      };
    case 'CORRECT_ANSWER':
      const newStreak = state.streak + 1;
      const scoreIncrease = state.currentBattle
        ? calculateScore(state.hintsUsed, state.currentBattle.difficulty, state.streak)
        : 0;
      return {
        ...state,
        gameStatus: 'won',
        streak: newStreak,
        bestStreak: Math.max(newStreak, state.bestStreak),
        score: state.score + scoreIncrease,
        correctGuesses: state.correctGuesses + 1,
        totalGuesses: state.totalGuesses + 1,
      };
    case 'WRONG_ANSWER':
      return {
        ...state,
        totalGuesses: state.totalGuesses + 1,
      };
    case 'REVEAL_HINT':
      if (state.revealedHints.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        revealedHints: [...state.revealedHints, action.payload],
        hintsUsed: state.hintsUsed + 1,
      };
    case 'GIVE_UP':
      return {
        ...state,
        gameStatus: 'lost',
        streak: 0,
        totalGuesses: state.totalGuesses + 1,
      };
    case 'NEXT_BATTLE':
      return {
        ...state,
        gameStatus: 'loading',
        revealedHints: [],
        hintsUsed: 0,
        currentGuess: '',
        imageUrl: null,
      };
    case 'COMPLETE_GAME':
      return {
        ...state,
        gameStatus: 'completed',
      };
    case 'RESET_GAME':
      return {
        ...initialState,
        bestStreak: state.bestStreak,
        selectedCivilization: state.selectedCivilization,
        selectedDifficulty: state.selectedDifficulty,
      };
    case 'SET_CIVILIZATION':
      return {
        ...state,
        selectedCivilization: action.payload,
      };
    case 'SET_DIFFICULTY':
      return {
        ...state,
        selectedDifficulty: action.payload,
      };
    default:
      return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [savedStats, setSavedStats] = useLocalStorage('battleguess-stats', {
    bestStreak: 0,
    totalGames: 0,
    totalCorrect: 0,
  });
  const [playedBattles, setPlayedBattles] = useLocalStorage<number[]>('battleguess-played', []);

  // Sync best streak with localStorage
  useEffect(() => {
    if (state.bestStreak > savedStats.bestStreak) {
      setSavedStats(prev => ({ ...prev, bestStreak: state.bestStreak }));
    }
  }, [state.bestStreak, savedStats.bestStreak, setSavedStats]);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
    const battle = getRandomBattle(playedBattles, state.selectedCivilization, state.selectedDifficulty);
    setPlayedBattles(prev => [...prev, battle.id]);
    dispatch({ type: 'SET_BATTLE', payload: battle });
  }, [playedBattles, setPlayedBattles, state.selectedCivilization, state.selectedDifficulty]);

  const submitGuess = useCallback((guess: string): boolean => {
    if (!state.currentBattle || state.gameStatus !== 'playing') {
      return false;
    }

    const isCorrect = checkAnswer(guess, state.currentBattle.acceptedAnswers);

    if (isCorrect) {
      dispatch({ type: 'CORRECT_ANSWER' });
      setSavedStats(prev => ({
        ...prev,
        totalGames: prev.totalGames + 1,
        totalCorrect: prev.totalCorrect + 1,
      }));
      return true;
    } else {
      dispatch({ type: 'WRONG_ANSWER' });
      return false;
    }
  }, [state.currentBattle, state.gameStatus, setSavedStats]);

  const revealHint = useCallback((hintIndex: number) => {
    dispatch({ type: 'REVEAL_HINT', payload: hintIndex });
  }, []);

  const giveUp = useCallback(() => {
    dispatch({ type: 'GIVE_UP' });
    setSavedStats(prev => ({
      ...prev,
      totalGames: prev.totalGames + 1,
    }));
  }, [setSavedStats]);

  const nextBattle = useCallback(() => {
    const pool = getBattlesByCivilization(state.selectedCivilization, state.selectedDifficulty);
    const remaining = pool.filter(b => !playedBattles.includes(b.id));
    if (remaining.length === 0) {
      dispatch({ type: 'COMPLETE_GAME' });
      return;
    }
    dispatch({ type: 'NEXT_BATTLE' });
    const battle = remaining[Math.floor(Math.random() * remaining.length)];
    setPlayedBattles(prev => [...prev, battle.id]);
    dispatch({ type: 'SET_BATTLE', payload: battle });
  }, [playedBattles, setPlayedBattles, state.selectedCivilization, state.selectedDifficulty]);

  const selectCivilization = useCallback((civ: CivilizationId | 'all') => {
    dispatch({ type: 'SET_CIVILIZATION', payload: civ });
    setPlayedBattles([]);
  }, [setPlayedBattles]);

  const selectDifficulty = useCallback((difficulty: Difficulty | 'all') => {
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });
    setPlayedBattles([]);
  }, [setPlayedBattles]);

  const setImage = useCallback((url: string) => {
    dispatch({ type: 'SET_IMAGE', payload: url });
  }, []);

  const setImageLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_IMAGE_LOADING', payload: loading });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
    setPlayedBattles([]);
  }, [setPlayedBattles]);

  const pool = getBattlesByCivilization(state.selectedCivilization, state.selectedDifficulty);

  return {
    state: {
      ...state,
      bestStreak: Math.max(state.bestStreak, savedStats.bestStreak),
    },
    savedStats,
    totalBattlesInPool: pool.length,
    battlesPlayed: playedBattles.length,
    actions: {
      startGame,
      submitGuess,
      revealHint,
      giveUp,
      nextBattle,
      selectCivilization,
      selectDifficulty,
      setImage,
      setImageLoading,
      resetGame,
    },
  };
}
