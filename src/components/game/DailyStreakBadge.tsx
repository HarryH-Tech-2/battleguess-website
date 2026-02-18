import { motion } from 'framer-motion';

interface DailyStreakBadgeProps {
  streak: number;
}

export function DailyStreakBadge({ streak }: DailyStreakBadgeProps) {
  if (streak <= 0) return null;

  return (
    <motion.div
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-br from-primary-100 to-emerald-100 text-primary-700 shadow-sm"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      title={`${streak} day streak!`}
    >
      <span className="text-sm">🔥</span>
      <span className="text-sm font-bold">{streak}</span>
    </motion.div>
  );
}
