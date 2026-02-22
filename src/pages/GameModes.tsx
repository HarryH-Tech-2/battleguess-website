import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ContentLayout } from '../components/layout/ContentLayout';
import { gameModeData } from '../data/gameModeData';

function GameModes() {
  const { t } = useTranslation();

  return (
    <ContentLayout
      title="Game Modes | BattleGuess"
      description="Explore 8 unique game modes in BattleGuess: Classic, Timed, Year, Location, Timeline, Campaign, Daily Challenge, and Community Challenge."
      canonical="https://battleguess.app/modes"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
          {t('pages.modes.title')}
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          {t('pages.modes.subtitle')}
        </p>
      </motion.div>

      {/* Mode Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {gameModeData.map((mode, index) => (
          <motion.div
            key={mode.slug}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
          >
            <Link
              to={`/modes/${mode.slug}`}
              className="block bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all duration-200 group h-full"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-primary-600 flex items-center justify-center text-2xl shadow-md shadow-primary-200 group-hover:scale-105 transition-transform">
                  {mode.icon}
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-slate-800 text-lg group-hover:text-primary-700 transition-colors">
                    {mode.label}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                    {mode.shortDesc}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </ContentLayout>
  );
}

export default GameModes;
