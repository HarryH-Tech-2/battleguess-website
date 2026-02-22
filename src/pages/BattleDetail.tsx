import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ContentLayout } from '../components/layout/ContentLayout';
import { getBattleById } from '../data/battles';
import { battleFacts } from '../data/battleFacts';
import { battleImages } from '../data/battleImages';
import {
  parseBattleId,
  getEraDisplayName,
  getEraIcon,
  formatYear,
} from '../utils/battleHelpers';

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};

function BattleDetail() {
  const { battleId } = useParams<{ battleId: string }>();
  const id = battleId ? parseBattleId(battleId) : NaN;
  const battle = !isNaN(id) ? getBattleById(id) : undefined;

  if (!battle) {
    return (
      <ContentLayout
        title="Battle Not Found | BattleGuess"
        description="The requested battle could not be found."
        canonical="https://battleguess.app/battles"
      >
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-3">
            Battle Not Found
          </h1>
          <p className="text-slate-500 mb-6">
            The battle you are looking for does not exist.
          </p>
          <Link
            to="/battles"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            &larr; Back to Encyclopedia
          </Link>
        </div>
      </ContentLayout>
    );
  }

  const fact = battleFacts[battle.id];
  const imageUrl = battleImages[battle.id];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: battle.name,
    description: battle.description,
    datePublished: formatYear(battle.year),
    author: {
      '@type': 'Organization',
      name: 'BattleGuess',
    },
  };

  return (
    <ContentLayout
      title={`${battle.name} | BattleGuess`}
      description={battle.description}
      canonical={`https://battleguess.app/battles/${battleId}`}
      jsonLd={jsonLd}
    >
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Link
          to="/battles"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-primary-600 text-sm font-medium transition-colors"
        >
          &larr; Back to Encyclopedia
        </Link>
      </motion.div>

      {/* Battle Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1 rounded-full">
            {getEraIcon(battle.civilization)} {getEraDisplayName(battle.civilization)}
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
              difficultyColors[battle.difficulty]
            }`}
          >
            {battle.difficulty}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
          {battle.name}
        </h1>

        <p className="text-slate-500 text-lg">
          {formatYear(battle.year)} &middot; {battle.location}
        </p>
      </motion.div>

      {/* Battle Image */}
      {imageUrl && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="rounded-2xl overflow-hidden shadow-md border border-slate-100">
            <img
              src={imageUrl}
              alt={`AI-generated artwork depicting the Battle of ${battle.name}`}
              loading="lazy"
              className="w-full h-auto object-cover"
            />
          </div>
        </motion.div>
      )}

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-8"
      >
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <p className="text-slate-700 leading-relaxed text-lg">
            {battle.description}
          </p>
        </div>
      </motion.div>

      {/* Battle Fact */}
      {fact && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-10"
        >
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 border border-amber-200/50">
            <h2 className="text-lg font-bold text-amber-800 mb-2 flex items-center gap-2">
              <span>💡</span> Did You Know?
            </h2>
            <p className="text-amber-900/80 leading-relaxed">
              {fact}
            </p>
          </div>
        </motion.div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center"
      >
        <div className="bg-gradient-to-br from-primary-50 to-emerald-100/50 rounded-2xl p-8 border border-primary-200/50">
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Can you identify this battle?
          </h2>
          <p className="text-slate-600 mb-5">
            Put your knowledge to the test in BattleGuess
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-primary-200 hover:shadow-lg hover:shadow-primary-200 transition-all duration-200"
          >
            Play BattleGuess
          </Link>
        </div>
      </motion.div>
    </ContentLayout>
  );
}

export default BattleDetail;
