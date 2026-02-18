export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  totalGames: number;
  totalCorrect: number;
  bestStreak: number;
  totalNoHintWins: number;
  totalHardCorrect: number;
  totalMediumCorrect: number;
  totalEasyCorrect: number;
  uniqueCivilizations: number;
  totalTimelineRounds: number;
  totalCampaignsCompleted: number;
  totalPerfectTimelines: number;
}

export const achievements: AchievementDef[] = [
  {
    id: 'first-blood',
    name: 'First Blood',
    description: 'Get your first correct answer',
    icon: '🎯',
    check: (s) => s.totalCorrect >= 1,
  },
  {
    id: 'rising-star',
    name: 'Rising Star',
    description: 'Get 10 correct answers',
    icon: '⭐',
    check: (s) => s.totalCorrect >= 10,
  },
  {
    id: 'history-buff',
    name: 'History Buff',
    description: 'Get 50 correct answers',
    icon: '📚',
    check: (s) => s.totalCorrect >= 50,
  },
  {
    id: 'master-historian',
    name: 'Master Historian',
    description: 'Get 100 correct answers',
    icon: '🎓',
    check: (s) => s.totalCorrect >= 100,
  },
  {
    id: 'on-fire',
    name: 'On Fire',
    description: 'Get a 3-game winning streak',
    icon: '🔥',
    check: (s) => s.bestStreak >= 3,
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Get a 10-game winning streak',
    icon: '💪',
    check: (s) => s.bestStreak >= 10,
  },
  {
    id: 'legendary',
    name: 'Legendary',
    description: 'Get a 20-game winning streak',
    icon: '👑',
    check: (s) => s.bestStreak >= 20,
  },
  {
    id: 'eagle-eye',
    name: 'Eagle Eye',
    description: 'Win 5 battles without using any hints',
    icon: '🦅',
    check: (s) => s.totalNoHintWins >= 5,
  },
  {
    id: 'no-help-needed',
    name: 'No Help Needed',
    description: 'Win 20 battles without using any hints',
    icon: '🧠',
    check: (s) => s.totalNoHintWins >= 20,
  },
  {
    id: 'tactician',
    name: 'Tactician',
    description: 'Get 5 hard difficulty battles correct',
    icon: '🏆',
    check: (s) => s.totalHardCorrect >= 5,
  },
  {
    id: 'tactician-supreme',
    name: 'Tactician Supreme',
    description: 'Get 25 hard difficulty battles correct',
    icon: '💎',
    check: (s) => s.totalHardCorrect >= 25,
  },
  {
    id: 'world-traveler',
    name: 'World Traveler',
    description: 'Get correct answers from all 8 civilizations',
    icon: '🌍',
    check: (s) => s.uniqueCivilizations >= 8,
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Play 25 games total',
    icon: '📅',
    check: (s) => s.totalGames >= 25,
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'Play 100 games total',
    icon: '🎖️',
    check: (s) => s.totalGames >= 100,
  },
  {
    id: 'easy-rider',
    name: 'Easy Rider',
    description: 'Get 10 easy battles correct',
    icon: '🟢',
    check: (s) => s.totalEasyCorrect >= 10,
  },
  {
    id: 'medium-mastery',
    name: 'Medium Mastery',
    description: 'Get 10 medium battles correct',
    icon: '🟡',
    check: (s) => s.totalMediumCorrect >= 10,
  },
  {
    id: 'timeline-master',
    name: 'Timeline Master',
    description: 'Complete 5 timeline rounds',
    icon: '📜',
    check: (s) => s.totalTimelineRounds >= 5,
  },
  {
    id: 'perfect-timeline',
    name: 'Perfect Order',
    description: 'Get a perfect score in a timeline round',
    icon: '✨',
    check: (s) => s.totalPerfectTimelines >= 1,
  },
  {
    id: 'campaign-hero',
    name: 'Campaign Hero',
    description: 'Complete your first campaign',
    icon: '🗺️',
    check: (s) => s.totalCampaignsCompleted >= 1,
  },
  {
    id: 'campaign-veteran',
    name: 'Campaign Veteran',
    description: 'Complete 3 campaigns',
    icon: '⚔️',
    check: (s) => s.totalCampaignsCompleted >= 3,
  },
];
