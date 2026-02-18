import { motion, AnimatePresence } from 'framer-motion';
import { civilizations } from '../../data/civilizations';

interface StatsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  accuracy: number;
  avgHints: number;
  byCivilization: Record<string, { total: number; correct: number }>;
  byDifficulty: Record<string, { total: number; correct: number }>;
  bestStreak: number;
}

function AccuracyBar({ label, icon, correct, total }: { label: string; icon?: string; correct: number; total: number }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{icon && `${icon} `}{label}</span>
        <span className="font-medium text-gray-800">{pct}% ({correct}/{total})</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function StatsPanel({
  isOpen, onClose, total, accuracy, avgHints, byCivilization, byDifficulty, bestStreak,
}: StatsPanelProps) {
  const civMap = Object.fromEntries(civilizations.map(c => [c.id, c]));

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
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 mx-auto z-50 w-auto max-w-lg max-h-[85vh] overflow-y-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-5 relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Stats</h3>

              {total === 0 ? (
                <p className="text-gray-500 text-center py-8">Play some battles to see your stats!</p>
              ) : (
                <div className="space-y-5">
                  {/* Overview grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'Battles', value: total },
                      { label: 'Accuracy', value: `${accuracy}%` },
                      { label: 'Avg Hints', value: avgHints },
                      { label: 'Best Streak', value: bestStreak },
                    ].map(s => (
                      <div key={s.label} className="bg-primary-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-primary-700">{s.value}</p>
                        <p className="text-xs text-gray-500">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* By Difficulty */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">By Difficulty</h4>
                    <div className="space-y-2">
                      {(['easy', 'medium', 'hard'] as const).map(d => {
                        const data = byDifficulty[d];
                        if (!data) return null;
                        const icon = d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : '🔴';
                        return <AccuracyBar key={d} label={d.charAt(0).toUpperCase() + d.slice(1)} icon={icon} correct={data.correct} total={data.total} />;
                      })}
                    </div>
                  </div>

                  {/* By Civilization */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">By Civilization</h4>
                    <div className="space-y-2">
                      {Object.entries(byCivilization).map(([civId, data]) => {
                        const civ = civMap[civId];
                        return (
                          <AccuracyBar
                            key={civId}
                            label={civ?.name || civId}
                            icon={civ?.icon}
                            correct={data.correct}
                            total={data.total}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
