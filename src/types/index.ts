export interface Battle {
  id: number;
  name: string;
  acceptedAnswers: string[];
  prompt: string;
  hints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  year: number;
  location: string;
  description: string;
}

export interface GameState {
  currentBattle: Battle | null;
  score: number;
  streak: number;
  bestStreak: number;
  hintsUsed: number;
  totalGuesses: number;
  correctGuesses: number;
  gameStatus: 'idle' | 'playing' | 'won' | 'lost' | 'loading';
  revealedHints: number[];
  currentGuess: string;
  imageUrl: string | null;
  isImageLoading: boolean;
}

export interface GameStats {
  totalGames: number;
  totalCorrect: number;
  bestStreak: number;
  averageHints: number;
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SET_BATTLE'; payload: Battle }
  | { type: 'SET_IMAGE'; payload: string }
  | { type: 'SET_IMAGE_LOADING'; payload: boolean }
  | { type: 'SUBMIT_GUESS'; payload: string }
  | { type: 'CORRECT_ANSWER' }
  | { type: 'WRONG_ANSWER' }
  | { type: 'REVEAL_HINT'; payload: number }
  | { type: 'NEXT_BATTLE' }
  | { type: 'RESET_GAME' }
  | { type: 'GIVE_UP' };
