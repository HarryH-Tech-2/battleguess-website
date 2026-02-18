import { motion, AnimatePresence } from 'framer-motion';
import type { AchievementDef } from '../../data/achievements';

interface AchievementPopupProps {
  achievement: AchievementDef | null;
  onDismiss: () => void;
}

export function AchievementPopup({ achievement, onDismiss }: AchievementPopupProps) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -60, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -60, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-24 left-1/2 z-[60] cursor-pointer"
          onClick={onDismiss}
        >
          <div className="bg-gradient-to-r from-primary-500 to-emerald-500 rounded-2xl shadow-2xl p-4 flex items-center gap-3 min-w-[280px]">
            <motion.span
              className="text-3xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            >
              {achievement.icon}
            </motion.span>
            <div>
              <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Achievement Unlocked!</p>
              <p className="text-white font-bold">{achievement.name}</p>
              <p className="text-emerald-100 text-xs">{achievement.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
