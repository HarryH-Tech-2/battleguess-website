import type { Battle } from '../types';

export interface TimelineScore {
  totalScore: number;
  positionScores: number[];
  perfectBonus: number;
  isPerfect: boolean;
}

export function scoreTimeline(
  playerOrder: Battle[],
  correctOrder: Battle[]
): TimelineScore {
  const positionScores: number[] = [];
  let correctCount = 0;

  for (let i = 0; i < playerOrder.length; i++) {
    const correctIndex = correctOrder.findIndex(b => b.id === playerOrder[i].id);

    if (correctIndex === i) {
      // Exact correct position
      positionScores.push(100);
      correctCount++;
    } else if (Math.abs(correctIndex - i) === 1) {
      // Off by one position
      positionScores.push(25);
    } else {
      positionScores.push(0);
    }
  }

  const isPerfect = correctCount === playerOrder.length;
  const perfectBonus = isPerfect ? 200 : 0;
  const totalScore = positionScores.reduce((sum, s) => sum + s, 0) + perfectBonus;

  return { totalScore, positionScores, perfectBonus, isPerfect };
}
