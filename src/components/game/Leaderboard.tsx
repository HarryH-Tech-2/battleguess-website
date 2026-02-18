import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGlobalLeaderboard, type LeaderboardEntry } from '../../services/firebase';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Leaderboard({ isOpen, onClose }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getGlobalLeaderboard().then(data => {
        setEntries(data);
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h2 className="text-lg font-bold text-white">Global Leaderboard</h2>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[60vh]">
            {isLoading ? (
              <div className="p-8 text-center text-gray-400">Loading leaderboard...</div>
            ) : entries.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <p className="text-gray-500 text-sm">No leaderboard data yet.</p>
                <p className="text-gray-400 text-xs">
                  Add your Firebase config to .env to enable global leaderboards!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {entries.map((entry, i) => (
                  <div
                    key={entry.playerId}
                    className={`flex items-center justify-between px-5 py-3 ${
                      i < 3 ? 'bg-gradient-to-r from-yellow-50/50 to-transparent' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        i === 0 ? 'bg-yellow-100 text-yellow-600' :
                        i === 1 ? 'bg-gray-100 text-gray-500' :
                        i === 2 ? 'bg-amber-100 text-amber-600' :
                        'bg-gray-50 text-gray-400'
                      }`}>
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{entry.playerName}</p>
                        <p className="text-xs text-gray-400">
                          {entry.gamesPlayed} games · {entry.accuracy}% accuracy
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">{entry.totalScore.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Best streak: {entry.bestStreak}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
