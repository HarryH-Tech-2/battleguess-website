import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import type { Battle } from '../../types';

interface ResultFeedbackProps {
  isWin: boolean;
  battle: Battle;
  score: number;
  hintsUsed: number;
  streak: number;
  onNextBattle: () => void;
}

export function ResultFeedback({
  isWin,
  battle,
  score,
  hintsUsed,
  streak,
  onNextBattle,
}: ResultFeedbackProps) {
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

      {/* Stats */}
      {isWin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-2 sm:gap-4"
        >
          <div className="bg-white rounded-xl p-2 sm:p-3 shadow-md border border-primary-100">
            <p className="text-xl sm:text-2xl font-bold text-primary-600">+{score}</p>
            <p className="text-xs text-gray-500">Points</p>
          </div>
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

      {/* Confetti effect for wins */}
      {isWin && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: ['#3b82f6', '#60a5fa', '#93c5fd', '#fbbf24', '#34d399'][i % 5],
                left: `${Math.random() * 100}%`,
              }}
              initial={{ y: -20, opacity: 1 }}
              animate={{
                y: window.innerHeight + 20,
                opacity: 0,
                rotate: Math.random() * 720,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: 'easeIn',
              }}
            />
          ))}
        </div>
      )}

      {/* Next Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button variant="primary" size="lg" onClick={onNextBattle} className="w-full">
          Next Battle
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
      </motion.div>
    </motion.div>
  );
}
