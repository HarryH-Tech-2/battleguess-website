import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ContentLayout } from '../components/layout/ContentLayout';
import { useStats } from '../hooks/useStats';
import { useAchievements } from '../hooks/useAchievements';
import { civilizations } from '../data/civilizations';
import { getNextAchievement } from '../data/achievements';

function AccuracyBar({ label, icon, correct, total }: { label: string; icon?: string; correct: number; total: number }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-slate-600">{icon && `${icon} `}{label}</span>
        <span className="font-medium text-slate-800">{pct}% ({correct}/{total})</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
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

function Stats() {
  const { total, correct, accuracy, byCivilization, byDifficulty, avgHints } = useStats();
  const { unlocked, achievementStats, achievements: allAchievements } = useAchievements();

  const civMap = useMemo(
    () => Object.fromEntries(civilizations.map(c => [c.id, c])),
    []
  );

  const unlockedIds = useMemo(() => new Set(unlocked.map(u => u.id)), [unlocked]);
  const nextAchievement = useMemo(
    () => getNextAchievement(achievementStats, unlockedIds),
    [achievementStats, unlockedIds]
  );

  const bestStreak = achievementStats.bestStreak;

  return (
    <ContentLayout
      title="Your Stats | BattleGuess"
      description="Track your BattleGuess progress, accuracy, streaks, and achievements."
      canonical="https://battleguess.app/stats"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/"
            className="text-slate-500 hover:text-primary-600 font-medium transition-colors text-sm"
          >
            &larr; Back to Game
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-8">Your Stats</h1>

        {total === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">No stats yet</h2>
            <p className="text-slate-500 mb-6">Play some battles to start tracking your progress!</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all"
            >
              Play BattleGuess
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview */}
            <section>
              <h2 className="text-lg font-bold text-slate-700 mb-4">Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Battles Played', value: total, color: 'from-primary-500 to-emerald-500' },
                  { label: 'Accuracy', value: `${accuracy}%`, color: 'from-blue-500 to-primary-500' },
                  { label: 'Avg Hints', value: avgHints, color: 'from-amber-500 to-orange-500' },
                  { label: 'Best Streak', value: bestStreak, color: 'from-red-500 to-pink-500' },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center"
                  >
                    <p className={`text-2xl sm:text-3xl font-extrabold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                      {s.value}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Win/Loss Summary */}
            <section>
              <h2 className="text-lg font-bold text-slate-700 mb-4">Win Rate</h2>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{correct}</p>
                    <p className="text-xs text-slate-500">Correct</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-500">{total - correct}</p>
                    <p className="text-xs text-slate-500">Incorrect</p>
                  </div>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
                  <motion.div
                    className="h-full bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${accuracy}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                  <motion.div
                    className="h-full bg-red-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - accuracy}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </section>

            {/* By Difficulty */}
            <section>
              <h2 className="text-lg font-bold text-slate-700 mb-4">By Difficulty</h2>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
                {(['easy', 'medium', 'hard'] as const).map(d => {
                  const data = byDifficulty[d];
                  if (!data) return null;
                  const icon = d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : '🔴';
                  return (
                    <AccuracyBar
                      key={d}
                      label={d.charAt(0).toUpperCase() + d.slice(1)}
                      icon={icon}
                      correct={data.correct}
                      total={data.total}
                    />
                  );
                })}
              </div>
            </section>

            {/* By Civilization */}
            <section>
              <h2 className="text-lg font-bold text-slate-700 mb-4">By Civilization</h2>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
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
            </section>

            {/* Achievements Progress */}
            <section>
              <h2 className="text-lg font-bold text-slate-700 mb-4">
                Achievements ({unlocked.length}/{allAchievements.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allAchievements.map(achievement => {
                  const isUnlocked = unlockedIds.has(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={`rounded-xl p-3 text-center border ${
                        isUnlocked
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-slate-50 border-slate-100 opacity-50'
                      }`}
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <p className={`text-xs font-semibold mt-1 ${isUnlocked ? 'text-amber-800' : 'text-slate-500'}`}>
                        {achievement.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{achievement.description}</p>
                    </div>
                  );
                })}
              </div>

              {nextAchievement && (
                <div className="mt-4 bg-primary-50 border border-primary-200 rounded-xl p-4">
                  <p className="text-sm text-primary-700 font-medium">
                    Next achievement: {nextAchievement.achievement.icon} {nextAchievement.achievement.name}
                  </p>
                  <div className="h-2 bg-primary-100 rounded-full overflow-hidden mt-2">
                    <motion.div
                      className="h-full bg-primary-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${nextAchievement.progress * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <p className="text-xs text-primary-500 mt-1">
                    {nextAchievement.current}/{nextAchievement.target}
                  </p>
                </div>
              )}
            </section>

            {/* Play More CTA */}
            <div className="text-center pt-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all"
              >
                Keep Playing
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </ContentLayout>
  );
}

export default Stats;
