import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Confetti } from '../effects/Confetti';
import { ShareButton } from './ShareButton';
import { SaveProgressCTA } from '../auth/SaveProgressCTA';
import {
  CommunityStats,
  Leaderboard,
  NextDailyCountdown,
  ResultGrid,
  ShareResultButton,
  StreakChip,
} from './DailyCommunity';
import type { DailyCommunity } from '../../services/dailyApi';
import { buildDailyShareText, marksToEmoji, type RoundMark } from '../../utils/daily';

/* ------------------------------------------------------------------ */
/* Shared summary (result screen + "already done today" intro)         */
/* ------------------------------------------------------------------ */

export interface DailySummaryProps {
  dayNumber: number;
  score: number;
  correctGuesses: number;
  totalBattles: number;
  marks: RoundMark[];
  streak: number;
  community: DailyCommunity | null | undefined;
  communityLoading: boolean;
  isAuthenticated: boolean;
  /** True right after finishing: confetti, animated grid, "+1" on the streak. */
  justFinished: boolean;
}

export function DailySummary({
  dayNumber,
  score,
  correctGuesses,
  totalBattles,
  marks,
  streak,
  community,
  communityLoading,
  isAuthenticated,
  justFinished,
}: DailySummaryProps) {
  const accuracy = totalBattles > 0 ? Math.round((correctGuesses / totalBattles) * 100) : 0;
  const shareText = buildDailyShareText({
    dayNumber,
    correct: correctGuesses,
    total: totalBattles,
    score,
    marks,
    streak,
    beatPercent: community?.beatPercent ?? null,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4 sm:space-y-5"
    >
      {justFinished && <Confetti variant="celebration" count={40} />}

      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-widest text-primary-400 font-medium">Daily #{dayNumber}</p>
        <h2 className="text-2xl font-bold text-primary-800">
          {justFinished ? 'Daily Challenge Complete!' : "Today's challenge is done"}
        </h2>
        <div className="flex justify-center">
          <StreakChip streak={streak} emphasis justGrew={justFinished} />
        </div>
      </div>

      <ResultGrid emoji={marksToEmoji(marks)} animate={justFinished} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-xl p-3 shadow-md border border-primary-100 text-center">
          <p className="text-2xl font-bold text-primary-600">{score.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Score</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-md border border-green-200 text-center">
          <p className="text-2xl font-bold text-green-600">{correctGuesses}/{totalBattles}</p>
          <p className="text-xs text-gray-500">Correct</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-md border border-primary-200 text-center">
          <p className="text-2xl font-bold text-primary-600">{accuracy}%</p>
          <p className="text-xs text-gray-500">Accuracy</p>
        </div>
      </div>

      <CommunityStats community={community} loading={communityLoading} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <ShareResultButton text={shareText} />
        <ShareButton
          data={{
            score,
            accuracy,
            streak,
            rank: `Daily #${dayNumber}`,
            battlesWon: correctGuesses,
            totalBattles,
            battleResults: [],
            isDaily: true,
          }}
        />
      </div>

      {!isAuthenticated && (
        <SaveProgressCTA
          placement={justFinished ? 'daily_result' : 'daily_intro_done'}
          title={streak > 1 ? `Keep your ${streak}-day streak` : 'Keep your streak going'}
          message="Right now it lives only in this browser. A free account saves it, syncs it to your other devices, and puts your name on today's leaderboard."
          ctaLabel="Save my streak"
          modalHeading="Save your streak"
          modalSubheading="Free account. Your streak, scores and leaderboard spot stay with you."
        />
      )}

      <Leaderboard community={community} isAuthenticated={isAuthenticated} />

      <NextDailyCountdown className="text-center" />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Intro                                                               */
/* ------------------------------------------------------------------ */

interface DailyChallengeIntroProps {
  onStart: () => void;
  dayNumber: number;
  streak: number;
  /** Streak is alive but today's challenge hasn't been played yet. */
  streakAtRisk: boolean;
  battleCount: number;
  completed?: Omit<DailySummaryProps, 'justFinished' | 'dayNumber' | 'streak'>;
}

export function DailyChallengeIntro({
  onStart,
  dayNumber,
  streak,
  streakAtRisk,
  battleCount,
  completed,
}: DailyChallengeIntroProps) {
  if (completed) {
    return <DailySummary {...completed} dayNumber={dayNumber} streak={streak} justFinished={false} />;
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-5"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"
      >
        <span className="text-white text-3xl font-bold">{today.getDate()}</span>
      </motion.div>

      <div>
        <p className="text-xs uppercase tracking-widest text-primary-400 font-medium">Daily #{dayNumber}</p>
        <h2 className="text-2xl font-bold text-primary-800">Daily Challenge</h2>
        <p className="text-sm text-gray-500 mt-1">{dateStr}</p>
      </div>

      <div className="flex justify-center">
        <StreakChip streak={streak} />
      </div>

      <p className="text-gray-600 text-sm max-w-sm mx-auto">
        {streakAtRisk
          ? `Everyone gets the same ${battleCount} battles today. Finish them to take your streak to ${streak + 1}.`
          : `Everyone gets the same ${battleCount} battles today. Finish them to start a streak and see how you rank.`}
      </p>

      <Button variant="primary" size="lg" onClick={onStart} className="w-full">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        </svg>
        Start Daily Challenge
      </Button>

      <NextDailyCountdown />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Progress bar shown during the daily                                 */
/* ------------------------------------------------------------------ */

interface DailyProgressProps {
  current: number;
  total: number;
  score: number;
  marks: RoundMark[];
}

export function DailyProgress({ current, total, score, marks }: DailyProgressProps) {
  return (
    <div className="flex items-center justify-between bg-primary-50 rounded-lg px-3 py-2 border border-primary-200">
      <div className="flex items-center gap-2">
        <span className="text-primary-600 font-bold text-sm">DAILY</span>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => {
            const mark = marks[i];
            const color = mark === 'W'
              ? 'bg-green-500'
              : mark === 'H'
                ? 'bg-yellow-400'
                : mark === 'L'
                  ? 'bg-red-400'
                  : i === current
                    ? 'bg-primary-300 animate-pulse'
                    : 'bg-primary-100';
            return <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${color}`} />;
          })}
        </div>
      </div>
      <span className="text-sm font-medium text-primary-700">{score} pts</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Result (just finished)                                              */
/* ------------------------------------------------------------------ */

interface DailyResultProps extends Omit<DailySummaryProps, 'justFinished'> {
  onBack: () => void;
}

export function DailyResult({ onBack, ...summary }: DailyResultProps) {
  return (
    <div className="space-y-4">
      <DailySummary {...summary} justFinished />
      <Button variant="secondary" size="lg" onClick={onBack} className="w-full">
        Back to Menu
      </Button>
    </div>
  );
}
