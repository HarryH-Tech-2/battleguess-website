export const calculateScore = (
  hintsUsed: number,
  difficulty: 'easy' | 'medium' | 'hard',
  streak: number
): number => {
  const baseScore: Record<string, number> = {
    easy: 100,
    medium: 200,
    hard: 300,
  };

  const hintPenalty = hintsUsed * 25;
  const streakBonus = Math.min(streak * 10, 100); // Max 100 bonus from streak

  const score = Math.max(baseScore[difficulty] - hintPenalty + streakBonus, 10);

  return score;
};

export const calculateTimedBonus = (
  timeRemaining: number,
  totalTime: number
): number => {
  if (totalTime <= 0 || timeRemaining <= 0) return 0;
  const ratio = timeRemaining / totalTime;
  return Math.round(ratio * 50); // Up to 50 bonus points
};

export const getTimerDuration = (
  difficulty: 'easy' | 'medium' | 'hard'
): number => {
  const durations: Record<string, number> = {
    easy: 60,
    medium: 45,
    hard: 30,
  };
  return durations[difficulty];
};

export const formatScore = (score: number): string => {
  return score.toLocaleString();
};
