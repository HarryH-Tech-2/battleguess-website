import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Confetti } from '../effects/Confetti';
import { DefeatAnimation } from '../effects/DefeatAnimation';
import { ShareButton } from './ShareButton';
import { battleFacts } from '../../data/battleFacts';
import type { Battle } from '../../types';

interface ResultFeedbackProps {
  isWin: boolean;
  battle: Battle;
  score: number;
  hintsUsed: number;
  streak: number;
  onNextBattle: () => void;
  timedBonus?: number;
}

export function ResultFeedback({
  isWin,
  battle,
  score,
  hintsUsed,
  streak,
  onNextBattle,
  timedBonus = 0,
}: ResultFeedbackProps) {
  const fact = battleFacts[battle.id];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-4"
    >
      {/* Result Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
          isWin ? 'bg-green-100' : 'bg-red-100'
        }`}
      >
        {isWin ? (
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </motion.div>

      {/* Result Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className={`text-2xl sm:text-3xl font-bold ${isWin ? 'text-green-600' : 'text-red-600'}`}>
          {isWin ? 'Correct!' : 'Not this time...'}
        </h2>
        <p className="text-lg sm:text-xl text-gray-700 mt-2">
          It was the <span className="font-bold text-primary-700">{battle.name}</span>
        </p>
      </motion.div>

      {/* Battle Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-primary-50 rounded-xl p-3 sm:p-4 text-left"
      >
        <p className="text-sm sm:text-base text-primary-800">{battle.description}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-primary-200 text-primary-800 rounded text-sm">
            {battle.year < 0 ? `${Math.abs(battle.year)} BCE` : battle.year}
          </span>
          <span className="px-2 py-1 bg-primary-200 text-primary-800 rounded text-sm">
            {battle.location}
          </span>
          <span className={`px-2 py-1 rounded text-sm ${
            battle.difficulty === 'easy' ? 'bg-green-200 text-green-800' :
            battle.difficulty === 'medium' ? 'bg-yellow-200 text-yellow-800' :
            'bg-red-200 text-red-800'
          }`}>
            {battle.difficulty}
          </span>
        </div>
      </motion.div>

      {/* Did You Know? */}
      {fact && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 text-left"
        >
          <div className="flex items-start gap-2">
            <span className="text-lg mt-0.5">💡</span>
            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Did you know?</p>
              <p className="text-sm text-amber-900">{fact}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      {isWin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`grid gap-2 sm:gap-4 ${timedBonus > 0 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}
        >
          <div className="bg-white rounded-xl p-2 sm:p-3 shadow-md border border-primary-100">
            <p className="text-xl sm:text-2xl font-bold text-primary-600">+{score}</p>
            <p className="text-xs text-gray-500">Points</p>
          </div>
          {timedBonus > 0 && (
            <div className="bg-white rounded-xl p-2 sm:p-3 shadow-md border border-green-200">
              <p className="text-xl sm:text-2xl font-bold text-green-600">+{timedBonus}</p>
              <p className="text-xs text-gray-500">Time Bonus</p>
            </div>
          )}
          <div className="bg-white rounded-xl p-2 sm:p-3 shadow-md border border-primary-100">
            <p className="text-xl sm:text-2xl font-bold text-primary-600">{hintsUsed}</p>
            <p className="text-xs text-gray-500">Hints Used</p>
          </div>
          <div className="bg-white rounded-xl p-2 sm:p-3 shadow-md border border-primary-100">
            <p className="text-xl sm:text-2xl font-bold text-primary-600">{streak}</p>
            <p className="text-xs text-gray-500">Streak</p>
          </div>
        </motion.div>
      )}

      {/* Animations */}
      {isWin ? <Confetti /> : <DefeatAnimation />}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3"
      >
        <Button variant="primary" size="lg" onClick={onNextBattle} className="flex-1">
          Next Battle
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
        {isWin && (
          <ShareButton
            data={{
              score,
              accuracy: 0,
              streak,
              rank: '',
              battlesWon: 0,
              totalBattles: 0,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
