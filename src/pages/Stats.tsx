import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ContentLayout } from '../components/layout/ContentLayout';
import { LocaleLink } from '../components/ui/LocaleLink';
import { useStats } from '../hooks/useStats';
import { useAchievements } from '../hooks/useAchievements';
import { civilizations } from '../data/civilizations';
import { progressExtractors } from '../data/achievements';

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
  const { t } = useTranslation();

  const civMap = useMemo(
    () => Object.fromEntries(civilizations.map(c => [c.id, c])),
    []
  );

  const unlockedIds = useMemo(() => new Set(unlocked.map(u => u.id)), [unlocked]);

  const bestStreak = achievementStats.bestStreak;

  return (
    <ContentLayout
      title="Your Stats | BattleGuess"
      description="Track your BattleGuess progress, accuracy, streaks, and achievements."
      canonical="https://battleguess.app/stats"
      path="/stats"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <LocaleLink
            to="/"
            className="text-slate-500 hover:text-primary-600 font-medium transition-colors text-sm"
          >
            &larr; {t('pages.stats.backToGame')}
          </LocaleLink>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-8">{t('pages.stats.title')}</h1>

        {total === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">{t('pages.stats.noStats')}</h2>
            <p className="text-slate-500 mb-6">{t('pages.stats.noStatsDesc')}</p>
            <LocaleLink
              to="/"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all"
            >
              {t('pages.battles.playBattleGuess')}
            </LocaleLink>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview */}
            <section>
              <h2 className="text-lg font-bold text-slate-700 mb-4">{t('pages.stats.overview')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: t('pages.stats.battlesPlayed'), value: total, color: 'from-primary-500 to-emerald-500' },
                  { label: t('pages.stats.accuracy'), value: `${accuracy}%`, color: 'from-blue-500 to-primary-500' },
                  { label: t('pages.stats.avgHints'), value: avgHints, color: 'from-amber-500 to-orange-500' },
                  { label: t('pages.stats.bestStreak'), value: bestStreak, color: 'from-red-500 to-pink-500' },
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
              <h2 className="text-lg font-bold text-slate-700 mb-4">{t('pages.stats.winRate')}</h2>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{correct}</p>
                    <p className="text-xs text-slate-500">{t('pages.stats.correct')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-500">{total - correct}</p>
                    <p className="text-xs text-slate-500">{t('pages.stats.incorrect')}</p>
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
              <h2 className="text-lg font-bold text-slate-700 mb-4">{t('pages.stats.byDifficulty')}</h2>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
                {(['easy', 'medium', 'hard'] as const).map(d => {
                  const data = byDifficulty[d];
                  if (!data) return null;
                  const icon = d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : '🔴';
                  return (
                    <AccuracyBar
                      key={d}
                      label={t(`difficulty.${d}`)}
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
              <h2 className="text-lg font-bold text-slate-700 mb-4">{t('pages.stats.byCivilization')}</h2>
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
                {t('pages.stats.achievements')} ({unlocked.length}/{allAchievements.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allAchievements.map((achievement, i) => {
                  const isUnlocked = unlockedIds.has(achievement.id);
                  const extractor = progressExtractors[achievement.id];
                  const progress = extractor ? extractor(achievementStats) : null;
                  const pct = progress ? Math.min(Math.round((progress.current / progress.target) * 100), 100) : 0;
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`rounded-xl p-5 text-center border ${
                        isUnlocked
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-white border-slate-100'
                      }`}
                    >
                      <span className={`text-4xl ${isUnlocked ? '' : 'grayscale opacity-40'}`}>
                        {achievement.icon}
                      </span>
                      <p className={`text-base font-bold mt-2 ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                        {achievement.name}
                      </p>
                      <p className={`text-sm mt-1 leading-snug ${isUnlocked ? 'text-slate-600' : 'text-slate-400'}`}>
                        {achievement.description}
                      </p>
                      {!isUnlocked && progress && (
                        <div className="mt-3">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-primary-400 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, delay: i * 0.03 }}
                            />
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{progress.current}/{progress.target}</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Play More CTA */}
            <div className="text-center pt-4">
              <LocaleLink
                to="/"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all"
              >
                {t('pages.stats.keepPlaying')}
              </LocaleLink>
            </div>
          </div>
        )}
      </motion.div>
    </ContentLayout>
  );
}

export default Stats;
