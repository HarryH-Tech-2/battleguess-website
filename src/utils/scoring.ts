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

export const formatScore = (score: number): string => {
  return score.toLocaleString();
};
