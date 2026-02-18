import { motion } from 'framer-motion';

interface ScoreDisplayProps {
  score: number;
  streak: number;
  bestStreak: number;
}

export function ScoreDisplay({ score, streak, bestStreak }: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
      {/* Score */}
      <motion.div
        className="flex items-center gap-1.5 sm:gap-2 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-md border border-primary-100"
        whileHover={{ scale: 1.05 }}
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <span className="font-bold text-sm sm:text-base text-primary-700">{score.toLocaleString()}</span>
        <span className="text-gray-400 text-xs sm:text-sm">pts</span>
      </motion.div>

      {/* Current Streak */}
      <motion.div
        className="flex items-center gap-1.5 sm:gap-2 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-md border border-primary-100"
        whileHover={{ scale: 1.05 }}
        key={streak}
        initial={streak > 0 ? { scale: 1.2 } : false}
        animate={{ scale: 1 }}
      >
        <span className="text-base sm:text-xl">🔥</span>
        <span className="font-bold text-sm sm:text-base text-primary-600">{streak}</span>
        <span className="text-gray-400 text-xs sm:text-sm">streak</span>
      </motion.div>

      {/* Best Streak */}
      <motion.div
        className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-md text-white"
        whileHover={{ scale: 1.05 }}
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="font-bold text-sm sm:text-base">{bestStreak}</span>
        <span className="text-primary-100 text-xs sm:text-sm">best</span>
      </motion.div>
    </div>
  );
}
