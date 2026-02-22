import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ContentLayout } from '../components/layout/ContentLayout';
import { getGameModeBySlug } from '../data/gameModeData';

function GameModeDetail() {
  const { modeId } = useParams<{ modeId: string }>();
  const mode = modeId ? getGameModeBySlug(modeId) : undefined;
  const { t } = useTranslation();

  if (!mode) {
    return (
      <ContentLayout
        title="Mode Not Found | BattleGuess"
        description="The requested game mode could not be found."
        canonical="https://battleguess.app/modes"
      >
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-3">
            {t('pages.modes.modeNotFound')}
          </h1>
          <p className="text-slate-500 mb-6">
            {t('pages.modes.modeNotFoundDesc')}
          </p>
          <Link
            to="/modes"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            &larr; {t('pages.modes.backToModes')}
          </Link>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title={`${mode.label} Mode | BattleGuess`}
      description={mode.longDesc}
      canonical={`https://battleguess.app/modes/${mode.slug}`}
    >
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Link
          to="/modes"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-primary-600 text-sm font-medium transition-colors"
        >
          &larr; {t('pages.modes.allGameModes')}
        </Link>
      </motion.div>

      {/* Mode Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-primary-600 text-4xl shadow-lg shadow-primary-200 mb-4">
          {mode.icon}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
          {mode.label}
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
          {mode.longDesc}
        </p>
      </motion.div>

      {/* Rules */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mb-8"
      >
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-lg">📋</span> {t('pages.modes.rules')}
          </h2>
          <p className="text-slate-600 leading-relaxed">{mode.rules}</p>
        </div>
      </motion.section>

      {/* Strategy & Tips */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="mb-12"
      >
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-lg">💡</span> {t('pages.modes.strategy')}
          </h2>
          <p className="text-slate-600 leading-relaxed">{mode.strategy}</p>
        </div>
      </motion.section>

      {/* Play Now CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="text-center"
      >
        <Link
          to={`/?mode=${mode.slug}`}
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md shadow-primary-200 hover:shadow-lg hover:shadow-primary-200 transition-all duration-200 text-lg"
        >
          {t('pages.modes.playMode', { mode: mode.label })}
        </Link>
      </motion.div>
    </ContentLayout>
  );
}

export default GameModeDetail;
