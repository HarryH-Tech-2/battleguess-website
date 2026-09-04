import { motion } from 'framer-motion';
import { NextDailyCountdown, StreakChip } from '../game/DailyCommunity';
import { marksToEmoji, type RoundMark } from '../../utils/daily';

interface DailyCardProps {
  dayNumber: number;
  streak: number;
  completed?: { correct: number; total: number; marks: RoundMark[]; beatPercent: number | null };
  onOpen: () => void;
}

/**
 * The homepage's front door to the Daily Challenge. Sits above the classic
 * game so a returning player sees their streak and today's status before
 * anything else.
 */
export function DailyCard({ dayNumber, streak, completed, onOpen }: DailyCardProps) {
  const today = new Date();

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full text-left rounded-2xl border border-primary-200 bg-white/80 backdrop-blur shadow-sm hover:shadow-md hover:border-primary-300 transition-all px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 sm:gap-4"
      aria-label={completed ? "View today's Daily Challenge result" : "Play today's Daily Challenge"}
    >
      <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-600 text-white flex flex-col items-center justify-center shadow">
        <span className="text-[9px] uppercase tracking-wider leading-none opacity-80">
          {today.toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-xl sm:text-2xl font-bold leading-tight">{today.getDate()}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="font-bold text-primary-900 text-base sm:text-lg">Daily Challenge #{dayNumber}</p>
          <StreakChip streak={streak} />
        </div>
        {completed ? (
          <p className="text-sm text-gray-600 mt-0.5 flex items-center gap-2 flex-wrap">
            <span className="text-base leading-none">{marksToEmoji(completed.marks)}</span>
            <span>
              {completed.correct}/{completed.total} today
              {completed.beatPercent !== null && completed.beatPercent > 0 ? ` · beat ${completed.beatPercent}% of players` : ''}
            </span>
          </p>
        ) : (
          <p className="text-sm text-gray-600 mt-0.5">
            {streak > 0 ? `Play today's 5 battles to keep your streak alive.` : 'Same 5 battles for everyone. One attempt. Start a streak.'}
          </p>
        )}
      </div>

      <div className="flex-shrink-0 text-right">
        {completed ? (
          <>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full px-2.5 py-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Done
            </span>
            <NextDailyCountdown className="mt-1 hidden sm:block" />
          </>
        ) : (
          <span className="inline-flex items-center gap-1.5 bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm">
            Play
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        )}
      </div>
    </motion.button>
  );
}
