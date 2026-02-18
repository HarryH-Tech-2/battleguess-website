import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { achievements, type AchievementDef, type AchievementStats } from '../data/achievements';

interface UnlockedAchievement {
  id: string;
  unlockedAt: number;
}

export function useAchievements() {
  const [unlocked, setUnlocked] = useLocalStorage<UnlockedAchievement[]>('battleguess-achievements', []);
  const [newlyUnlocked, setNewlyUnlocked] = useState<AchievementDef | null>(null);
  const [, setAchievementStats] = useLocalStorage<AchievementStats>('battleguess-achievement-stats', {
    totalGames: 0,
    totalCorrect: 0,
    bestStreak: 0,
    totalNoHintWins: 0,
    totalHardCorrect: 0,
    totalMediumCorrect: 0,
    totalEasyCorrect: 0,
    uniqueCivilizations: 0,
    totalTimelineRounds: 0,
    totalCampaignsCompleted: 0,
    totalPerfectTimelines: 0,
  });
  const [uniqueCivs, setUniqueCivs] = useLocalStorage<string[]>('battleguess-unique-civs', []);
  const queueRef = useRef<AchievementDef[]>([]);

  const unlockedIds = new Set(unlocked.map(u => u.id));

  const checkAndUnlock = useCallback((stats: AchievementStats) => {
    const newUnlocks: AchievementDef[] = [];
    for (const achievement of achievements) {
      if (!unlockedIds.has(achievement.id) && achievement.check(stats)) {
        newUnlocks.push(achievement);
      }
    }

    if (newUnlocks.length > 0) {
      setUnlocked(prev => [
        ...prev,
        ...newUnlocks.map(a => ({ id: a.id, unlockedAt: Date.now() })),
      ]);
      // Queue up notifications
      queueRef.current = [...queueRef.current, ...newUnlocks];
      if (!newlyUnlocked) {
        setNewlyUnlocked(queueRef.current.shift()!);
      }
    }
  }, [unlockedIds, setUnlocked, newlyUnlocked]);

  const dismissPopup = useCallback(() => {
    if (queueRef.current.length > 0) {
      setNewlyUnlocked(queueRef.current.shift()!);
    } else {
      setNewlyUnlocked(null);
    }
  }, []);

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (newlyUnlocked) {
      const timer = setTimeout(dismissPopup, 4000);
      return () => clearTimeout(timer);
    }
  }, [newlyUnlocked, dismissPopup]);

  const recordGameResult = useCallback((params: {
    correct: boolean;
    hintsUsed: number;
    difficulty: string;
    civilization: string;
    streak: number;
  }) => {
    setAchievementStats(prev => {
      const newCivs = params.correct && !uniqueCivs.includes(params.civilization)
        ? [...uniqueCivs, params.civilization]
        : uniqueCivs;

      if (newCivs.length > uniqueCivs.length) {
        setUniqueCivs(newCivs);
      }

      const updated: AchievementStats = {
        totalGames: prev.totalGames + 1,
        totalCorrect: prev.totalCorrect + (params.correct ? 1 : 0),
        bestStreak: Math.max(prev.bestStreak, params.streak),
        totalNoHintWins: prev.totalNoHintWins + (params.correct && params.hintsUsed === 0 ? 1 : 0),
        totalHardCorrect: prev.totalHardCorrect + (params.correct && params.difficulty === 'hard' ? 1 : 0),
        totalMediumCorrect: prev.totalMediumCorrect + (params.correct && params.difficulty === 'medium' ? 1 : 0),
        totalEasyCorrect: prev.totalEasyCorrect + (params.correct && params.difficulty === 'easy' ? 1 : 0),
        uniqueCivilizations: newCivs.length,
        totalTimelineRounds: prev.totalTimelineRounds,
        totalCampaignsCompleted: prev.totalCampaignsCompleted,
        totalPerfectTimelines: prev.totalPerfectTimelines,
      };

      // Defer the check to avoid state update during render
      setTimeout(() => checkAndUnlock(updated), 0);
      return updated;
    });
  }, [setAchievementStats, uniqueCivs, setUniqueCivs, checkAndUnlock]);

  const recordTimelineRound = useCallback((isPerfect: boolean) => {
    setAchievementStats(prev => {
      const updated: AchievementStats = {
        ...prev,
        totalTimelineRounds: prev.totalTimelineRounds + 1,
        totalPerfectTimelines: prev.totalPerfectTimelines + (isPerfect ? 1 : 0),
      };
      setTimeout(() => checkAndUnlock(updated), 0);
      return updated;
    });
  }, [setAchievementStats, checkAndUnlock]);

  const recordCampaignComplete = useCallback(() => {
    setAchievementStats(prev => {
      const updated: AchievementStats = {
        ...prev,
        totalCampaignsCompleted: prev.totalCampaignsCompleted + 1,
      };
      setTimeout(() => checkAndUnlock(updated), 0);
      return updated;
    });
  }, [setAchievementStats, checkAndUnlock]);

  return {
    unlocked,
    unlockedCount: unlocked.length,
    totalAchievements: achievements.length,
    newlyUnlocked,
    dismissPopup,
    achievements,
    recordGameResult,
    recordTimelineRound,
    recordCampaignComplete,
  };
}
