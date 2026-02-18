import { motion } from 'framer-motion';
import type { Battle } from '../../types';
import type { TimelineScore } from '../../utils/timelineScoring';
import { Button } from '../ui/Button';
import { Confetti } from '../effects/Confetti';

interface TimelineResultProps {
  playerOrder: Battle[];
  correctOrder: Battle[];
  score: TimelineScore;
  onNextRound: () => void;
  onReset: () => void;
  totalScore: number;
  roundsPlayed: number;
}

export function TimelineResult({
  playerOrder,
  correctOrder,
  score,
  onNextRound,
  onReset,
  totalScore,
  roundsPlayed,
}: TimelineResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="text-center">
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl font-bold ${score.isPerfect ? 'text-green-600' : 'text-primary-700'}`}
        >
          {score.isPerfect ? 'Perfect Order!' : 'Timeline Submitted!'}
        </motion.h3>
        <p className="text-sm text-gray-500 mt-1">
          Round {roundsPlayed} complete
        </p>
      </div>

      {score.isPerfect && <Confetti variant="celebration" count={40} />}

      {/* Correct order with scoring */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">
          Correct chronological order
        </p>
        {correctOrder.map((battle, index) => {
          const playerIndex = playerOrder.findIndex(b => b.id === battle.id);
          const posScore = score.positionScores[playerIndex];
          const isCorrect = posScore === 100;
          const isClose = posScore === 25;

          return (
            <motion.div
              key={battle.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 rounded-xl p-3 border ${
                isCorrect
                  ? 'bg-green-50 border-green-200'
                  : isClose
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
              }`}
            >
              {/* Position number */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                isCorrect ? 'bg-green-200 text-green-800' :
                isClose ? 'bg-yellow-200 text-yellow-800' :
                'bg-red-200 text-red-800'
              }`}>
                {index + 1}
              </div>

              {/* Battle info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{battle.name}</p>
                <p className="text-xs text-gray-500">
                  {battle.year < 0 ? `${Math.abs(battle.year)} BCE` : battle.year} • {battle.location}
                </p>
              </div>

              {/* Score for this position */}
              <div className={`text-sm font-bold flex-shrink-0 ${
                isCorrect ? 'text-green-600' : isClose ? 'text-yellow-600' : 'text-red-500'
              }`}>
                +{posScore}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Score Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-3 gap-2"
      >
        <div className="bg-white rounded-xl p-3 shadow-md border border-primary-100 text-center">
          <p className="text-xl font-bold text-primary-600">+{score.totalScore}</p>
          <p className="text-xs text-gray-500">Round Score</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-md border border-primary-100 text-center">
          <p className="text-xl font-bold text-primary-600">{totalScore}</p>
          <p className="text-xs text-gray-500">Total Score</p>
        </div>
        {score.perfectBonus > 0 && (
          <div className="bg-white rounded-xl p-3 shadow-md border border-green-200 text-center">
            <p className="text-xl font-bold text-green-600">+{score.perfectBonus}</p>
            <p className="text-xs text-gray-500">Perfect Bonus</p>
          </div>
        )}
        {score.perfectBonus === 0 && (
          <div className="bg-white rounded-xl p-3 shadow-md border border-primary-100 text-center">
            <p className="text-xl font-bold text-primary-600">{roundsPlayed}</p>
            <p className="text-xs text-gray-500">Rounds</p>
          </div>
        )}
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3"
      >
        <Button variant="primary" size="lg" onClick={onNextRound} className="flex-1">
          Next Round
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
        <Button variant="secondary" size="lg" onClick={onReset}>
          End
        </Button>
      </motion.div>
    </motion.div>
  );
}
