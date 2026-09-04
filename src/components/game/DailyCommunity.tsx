import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { DailyCommunity as DailyCommunityData } from '../../services/dailyApi';
import { describeBeatPercent, formatCountdown, msUntilNextDaily } from '../../utils/daily';
import { analytics } from '../../utils/analytics';

/* ------------------------------------------------------------------ */
/* Streak chip                                                         */
/* ------------------------------------------------------------------ */

interface StreakChipProps {
  streak: number;
  /** Larger, celebratory styling for the result screen. */
  emphasis?: boolean;
  /** Show "+1" pulse because the streak just grew. */
  justGrew?: boolean;
}

export function StreakChip({ streak, emphasis = false, justGrew = false }: StreakChipProps) {
  if (streak <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs font-medium text-gray-500">
        No streak yet
      </span>
    );
  }
  return (
    <motion.span
      initial={justGrew ? { scale: 0.7, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 font-bold shadow-sm ${
        emphasis ? 'px-4 py-1.5 text-base' : 'px-3 py-1 text-xs'
      }`}
      title={`${streak} consecutive days of the Daily Challenge`}
    >
      <span aria-hidden="true">🔥</span>
      {streak}-day streak
      {justGrew && <span className="text-[10px] font-semibold text-orange-600">+1</span>}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* Countdown to the next daily                                         */
/* ------------------------------------------------------------------ */

export function NextDailyCountdown({ className = '' }: { className?: string }) {
  const [remaining, setRemaining] = useState(() => msUntilNextDaily(new Date()));

  useEffect(() => {
    const id = setInterval(() => setRemaining(msUntilNextDaily(new Date())), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className={`text-xs text-gray-500 ${className}`}>
      Next daily in <span className="font-semibold text-gray-700">{formatCountdown(remaining)}</span>
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Percentile + rank                                                   */
/* ------------------------------------------------------------------ */

interface CommunityStatsProps {
  community: DailyCommunityData | null | undefined;
  loading: boolean;
}

export function CommunityStats({ community, loading }: CommunityStatsProps) {
  if (loading && !community) {
    return (
      <div className="rounded-xl bg-primary-50 border border-primary-100 px-4 py-3 text-sm text-primary-600 animate-pulse">
        Comparing you with today&apos;s players…
      </div>
    );
  }
  if (!community) {
    return (
      <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-500">
        Couldn&apos;t reach the leaderboard. Your result is saved on this device.
      </div>
    );
  }
  const headline = describeBeatPercent(community.beatPercent, community.totalPlayers);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-gradient-to-r from-primary-50 to-emerald-50 border border-primary-200 px-4 py-3 text-center"
    >
      <p className="text-base sm:text-lg font-bold text-primary-800">{headline}</p>
      {community.rank !== null && community.totalPlayers > 1 && (
        <p className="text-xs text-primary-600 mt-0.5">
          Rank #{community.rank} of {community.totalPlayers} today
        </p>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Leaderboard                                                         */
/* ------------------------------------------------------------------ */

interface LeaderboardProps {
  community: DailyCommunityData | null | undefined;
  isAuthenticated: boolean;
}

export function Leaderboard({ community, isAuthenticated }: LeaderboardProps) {
  const entries = community?.leaderboard ?? [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden text-left">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Today&apos;s leaderboard</p>
        {community && community.totalPlayers > 0 && (
          <p className="text-xs text-gray-400">{community.totalPlayers} played</p>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="px-4 py-4 text-sm text-gray-500">
          No signed-in players on the board yet. The top spot is open.
        </p>
      ) : (
        <ol className="divide-y divide-gray-100">
          {entries.map((entry, i) => (
            <li
              key={`${entry.name}-${i}`}
              className={`flex items-center gap-3 px-4 py-2 text-sm ${entry.isYou ? 'bg-primary-50' : ''}`}
            >
              <span className={`w-6 text-center font-bold ${i < 3 ? 'text-amber-500' : 'text-gray-400'}`}>
                {i + 1}
              </span>
              {entry.avatarUrl ? (
                <img src={entry.avatarUrl} alt="" className="w-7 h-7 rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">
                  {entry.name.charAt(0).toUpperCase()}
                </span>
              )}
              <span className={`flex-1 truncate ${entry.isYou ? 'font-bold text-primary-800' : 'text-gray-700'}`}>
                {entry.name}
                {entry.isYou && <span className="ml-1 text-xs font-medium text-primary-500">(you)</span>}
              </span>
              <span className="text-xs text-gray-400">{entry.correct}/5</span>
              <span className="font-semibold text-gray-800 tabular-nums">{entry.score.toLocaleString()}</span>
            </li>
          ))}
        </ol>
      )}

      {!isAuthenticated && (
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-600">Your score counts toward the percentile. Only accounts get a name on the board.</p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Share as text (Wordle-style)                                        */
/* ------------------------------------------------------------------ */

interface ShareResultButtonProps {
  text: string;
  className?: string;
}

export function ShareResultButton({ text, className = '' }: ShareResultButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
    if (status === 'idle') return;
    const id = setTimeout(() => setStatus('idle'), 2200);
    return () => clearTimeout(id);
  }, [status]);

  async function share() {
    // Mobile: native share sheet with the text block. Desktop: clipboard.
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ text });
        analytics.dailyShare('native');
        return;
      } catch {
        // user cancelled or unsupported payload — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      analytics.dailyShare('copy');
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  }

  const label = status === 'copied' ? 'Copied to clipboard' : status === 'failed' ? 'Copy failed' : 'Share result';

  return (
    <button
      onClick={share}
      className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
        status === 'copied'
          ? 'bg-green-600'
          : status === 'failed'
            ? 'bg-red-500'
            : 'bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-500 hover:to-emerald-500 shadow-primary-500/25'
      } ${className}`}
    >
      {status === 'copied' ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )}
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Emoji result grid                                                   */
/* ------------------------------------------------------------------ */

export function ResultGrid({ emoji, animate = false }: { emoji: string; animate?: boolean }) {
  const cells = Array.from(emoji);
  return (
    <div className="flex items-center justify-center gap-1 text-3xl sm:text-4xl leading-none" aria-label={`Results: ${emoji}`}>
      {cells.map((c, i) => (
        <motion.span
          key={i}
          initial={animate ? { scale: 0, rotate: -20 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: animate ? 0.15 + i * 0.08 : 0, type: 'spring', stiffness: 320, damping: 16 }}
        >
          {c}
        </motion.span>
      ))}
    </div>
  );
}
