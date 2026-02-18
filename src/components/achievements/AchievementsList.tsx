import { motion, AnimatePresence } from 'framer-motion';
import { achievements, type AchievementDef } from '../../data/achievements';

interface AchievementsListProps {
  isOpen: boolean;
  onClose: () => void;
  unlocked: { id: string; unlockedAt: number }[];
}

export function AchievementsList({ isOpen, onClose, unlocked }: AchievementsListProps) {
  const unlockedIds = new Set(unlocked.map(u => u.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto pointer-events-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-5 relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 className="text-xl font-bold text-gray-800 mb-1">Achievements</h3>
              <p className="text-sm text-gray-500 mb-4">
                {unlocked.length} / {achievements.length} unlocked
              </p>

              {/* Progress bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(unlocked.length / achievements.length) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>

              <div className="space-y-2">
                {achievements.map((achievement) => {
                  const isUnlocked = unlockedIds.has(achievement.id);
                  return (
                    <AchievementRow
                      key={achievement.id}
                      achievement={achievement}
                      isUnlocked={isUnlocked}
                    />
                  );
                })}
              </div>
            </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function AchievementRow({ achievement, isUnlocked }: { achievement: AchievementDef; isUnlocked: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
      isUnlocked ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-100 opacity-60'
    }`}>
      <span className={`text-2xl ${isUnlocked ? '' : 'grayscale'}`}>
        {achievement.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
          {achievement.name}
        </p>
        <p className="text-xs text-gray-400">{achievement.description}</p>
      </div>
      {isUnlocked && (
        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
}
