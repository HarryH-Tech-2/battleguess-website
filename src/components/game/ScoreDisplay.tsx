import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScoreDisplayProps {
  score: number;
  streak: number;
  bestStreak: number;
}

function getStreakTier(streak: number) {
  if (streak >= 10) return { size: 'w-8 h-8', color: 'from-yellow-400 to-amber-500', border: 'border-yellow-300', label: 'Unstoppable!' };
  if (streak >= 5) return { size: 'w-7 h-7', color: 'from-orange-400 to-red-500', border: 'border-orange-300', label: `${streak} streak!` };
  if (streak >= 3) return { size: 'w-6 h-6', color: 'from-orange-400 to-orange-600', border: 'border-orange-200', label: '3 in a row!' };
  return { size: 'w-5 h-5', color: 'from-orange-300 to-orange-500', border: 'border-primary-100', label: '' };
}

function FireIcon({ streak }: { streak: number }) {
  const tier = getStreakTier(streak);
  const intensity = streak >= 10 ? 1.2 : streak >= 5 ? 0.9 : streak >= 3 ? 0.6 : 0.3;

  return (
    <motion.div className="relative flex-shrink-0">
      {/* Glow behind fire */}
      {streak >= 3 && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-t ${tier.color} rounded-full blur-md`}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Fire SVG */}
      <motion.svg
        className={`${tier.size} relative`}
        viewBox="0 0 24 24"
        fill="none"
        animate={{
          scaleY: [1, 1 + intensity * 0.15, 1],
          scaleX: [1, 1 - intensity * 0.05, 1],
          rotate: streak >= 3 ? [0, -2, 2, 0] : 0,
        }}
        transition={{
          duration: streak >= 5 ? 0.4 : 0.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <defs>
          <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={streak >= 10 ? '#f59e0b' : '#f97316'} />
            <stop offset="50%" stopColor={streak >= 10 ? '#eab308' : '#ef4444'} />
            <stop offset="100%" stopColor={streak >= 10 ? '#fbbf24' : '#dc2626'} />
          </linearGradient>
        </defs>
        <path
          d="M12 23C6.5 23 2 18.5 2 13c0-3 1.5-5.5 3-7.5C6.5 3.5 8 2 9.5 1c.5-.3 1 .1.8.6C9.5 4 10 6 12 7c1-2 2.5-3 4-4 .4-.3 1 0 .8.5C16 6 16 8 17 9c2 2 5 4 5 7 0 4-3.5 7-10 7z"
          fill="url(#fireGrad)"
        />
        {/* Inner flame */}
        <path
          d="M12 23c-2.5 0-5-1.5-5-5 0-2 1-3.5 2-4.5.5-.5 1.2-.1 1 .5-.3 1 0 2 1 2.5.5-1 1.5-2 2.5-2.5.4-.2.8.1.7.5-.2 1 0 2 .8 2.5 1.5 1 2 2.5 2 3.5 0 2-2.5 3-5 3z"
          fill={streak >= 10 ? '#fef08a' : '#fdba74'}
          opacity={0.9}
        />
      </motion.svg>
    </motion.div>
  );
}

export function ScoreDisplay({ score, streak, bestStreak }: ScoreDisplayProps) {
  const [milestoneText, setMilestoneText] = useState('');
  const tier = getStreakTier(streak);

  // Show milestone text on streak changes
  useEffect(() => {
    if (streak >= 3 && tier.label) {
      setMilestoneText(tier.label);
      const timer = setTimeout(() => setMilestoneText(''), 2500);
      return () => clearTimeout(timer);
    }
  }, [streak, tier.label]);

  return (
    <div className="space-y-2">
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
          className={`flex items-center gap-1.5 sm:gap-2 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-md border ${tier.border} transition-colors`}
          whileHover={{ scale: 1.05 }}
          key={streak}
          initial={streak > 0 ? { scale: 1.2 } : false}
          animate={{ scale: 1 }}
        >
          {streak > 0 ? (
            <FireIcon streak={streak} />
          ) : (
            <span className="text-base sm:text-xl opacity-40">🔥</span>
          )}
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

      {/* Streak milestone text */}
      <AnimatePresence>
        {milestoneText && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.8 }}
            className="text-center"
          >
            <span className="inline-block text-sm font-bold text-orange-500 bg-orange-50 border border-orange-200 px-3 py-0.5 rounded-full">
              {milestoneText}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
