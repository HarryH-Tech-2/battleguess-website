import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Confetti } from '../effects/Confetti';
import { getDailyDateKey, type DailyScore } from '../../services/firebase';

interface DailyChallengeIntroProps {
  onStart: () => void;
  isCompleted: boolean;
  todayResult?: { score: number; correct: number };
  battleCount: number;
}

export function DailyChallengeIntro({ onStart, isCompleted, todayResult, battleCount }: DailyChallengeIntroProps) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-5"
    >
      {/* Calendar icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg"
      >
        <span className="text-white text-3xl font-bold">{today.getDate()}</span>
      </motion.div>

      <div>
        <h2 className="text-2xl font-bold text-primary-800">Daily Challenge</h2>
        <p className="text-sm text-gray-500 mt-1">{dateStr}</p>
      </div>

      <p className="text-gray-600 text-sm max-w-sm mx-auto">
        Everyone gets the same {battleCount} battles today. How will you rank?
      </p>

      {isCompleted && todayResult ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2"
        >
          <p className="text-green-700 font-semibold">Already completed today!</p>
          <div className="flex justify-center gap-6">
            <div>
              <p className="text-2xl font-bold text-green-600">{todayResult.score}</p>
              <p className="text-xs text-gray-500">Score</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{todayResult.correct}/{battleCount}</p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">Come back tomorrow for a new challenge!</p>
        </motion.div>
      ) : (
        <Button variant="primary" size="lg" onClick={onStart} className="w-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          </svg>
          Start Daily Challenge
        </Button>
      )}
    </motion.div>
  );
}

// Progress bar shown during daily challenge
interface DailyProgressProps {
  current: number;
  total: number;
  score: number;
}

export function DailyProgress({ current, total, score }: DailyProgressProps) {
  return (
    <div className="flex items-center justify-between bg-orange-50 rounded-lg px-3 py-2 border border-orange-200">
      <div className="flex items-center gap-2">
        <span className="text-orange-500 font-bold text-sm">DAILY</span>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i < current ? 'bg-orange-400' : i === current ? 'bg-orange-300 animate-pulse' : 'bg-orange-100'
              }`}
            />
          ))}
        </div>
      </div>
      <span className="text-sm font-medium text-orange-700">{score} pts</span>
    </div>
  );
}

// Daily Challenge Results
interface DailyResultProps {
  score: number;
  correctGuesses: number;
  totalBattles: number;
  leaderboard: DailyScore[];
  isLoadingLeaderboard: boolean;
  onBack: () => void;
}

export function DailyResult({ score, correctGuesses, totalBattles, leaderboard, isLoadingLeaderboard, onBack }: DailyResultProps) {
  const accuracy = totalBattles > 0 ? Math.round((correctGuesses / totalBattles) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-5"
    >
      <Confetti variant="celebration" count={40} />

      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary-800">Daily Challenge Complete!</h2>
        <p className="text-sm text-gray-500 mt-1">{getDailyDateKey()}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-xl p-3 shadow-md border border-primary-100 text-center">
          <p className="text-2xl font-bold text-primary-600">{score}</p>
          <p className="text-xs text-gray-500">Score</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-md border border-green-200 text-center">
          <p className="text-2xl font-bold text-green-600">{correctGuesses}/{totalBattles}</p>
          <p className="text-xs text-gray-500">Correct</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-md border border-orange-200 text-center">
          <p className="text-2xl font-bold text-orange-600">{accuracy}%</p>
          <p className="text-xs text-gray-500">Accuracy</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-200">
          <h3 className="font-semibold text-sm text-gray-700">Today's Leaderboard</h3>
        </div>
        {isLoadingLeaderboard ? (
          <div className="p-6 text-center text-gray-400 text-sm">Loading...</div>
        ) : leaderboard.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">
            No leaderboard data yet. Set up Firebase to compete globally!
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
            {leaderboard.map((entry, i) => (
              <div key={entry.playerId} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center font-bold text-sm ${
                    i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-gray-400'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700">{entry.playerName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{entry.correctGuesses}/{entry.totalBattles}</span>
                  <span className="font-semibold text-sm text-primary-600">{entry.score}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button variant="primary" size="lg" onClick={onBack} className="w-full">
        Back to Menu
      </Button>
    </motion.div>
  );
}
