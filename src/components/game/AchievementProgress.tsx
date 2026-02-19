import { motion } from 'framer-motion';
import { getNextAchievement, type AchievementStats } from '../../data/achievements';

interface AchievementProgressProps {
  stats: AchievementStats;
  unlockedIds: Set<string>;
}

export function AchievementProgress({ stats, unlockedIds }: AchievementProgressProps) {
  const next = getNextAchievement(stats, unlockedIds);

  if (!next) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-full px-4 py-1.5 shadow-sm"
      >
        <span className="text-base">🏆</span>
        <span className="text-sm font-semibold text-yellow-700">All achievements unlocked!</span>
      </motion.div>
    );
  }

  const isClose = next.progress > 0.8;
  const pct = Math.round(next.progress * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm border border-primary-100">
        {/* Icon */}
        <motion.span
          className="text-lg flex-shrink-0"
          animate={isClose ? { scale: [1, 1.15, 1] } : {}}
          transition={isClose ? { duration: 1.5, repeat: Infinity } : {}}
        >
          {next.achievement.icon}
        </motion.span>

        {/* Progress info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs font-semibold text-gray-700 truncate">{next.achievement.name}</span>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{next.current}/{next.target}</span>
          </div>

          {/* Bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${isClose ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-primary-400 to-primary-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
