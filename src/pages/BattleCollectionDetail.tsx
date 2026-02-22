import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ContentLayout } from '../components/layout/ContentLayout';
import { getCollectionBySlug, getCollectionBattles } from '../data/battleCollections';
import {
  getBattleSlug,
  getEraDisplayName,
  getEraIcon,
  formatYear,
} from '../utils/battleHelpers';

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};

function BattleCollectionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const collection = slug ? getCollectionBySlug(slug) : undefined;
  const { t } = useTranslation();

  if (!collection) {
    return (
      <ContentLayout
        title="Collection Not Found | BattleGuess"
        description="The requested battle collection could not be found."
        canonical="https://battleguess.app/collections"
      >
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-3">
            {t('pages.collections.notFound')}
          </h1>
          <p className="text-slate-500 mb-6">
            {t('pages.collections.notFoundDesc')}
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            &larr; {t('pages.collections.backToCollections')}
          </Link>
        </div>
      </ContentLayout>
    );
  }

  const battles = getCollectionBattles(collection);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: collection.title,
    description: collection.description,
    numberOfItems: battles.length,
    itemListElement: battles.map((battle, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: battle.name,
      url: `https://battleguess.app/battles/${getBattleSlug(battle)}`,
    })),
  };

  return (
    <ContentLayout
      title={`${collection.title} | BattleGuess`}
      description={collection.description}
      canonical={`https://battleguess.app/collections/${slug}`}
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
          to="/collections"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-primary-600 text-sm font-medium transition-colors"
        >
          &larr; {t('pages.collections.backToCollections')}
        </Link>
      </motion.div>

      {/* Collection Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{collection.icon}</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
              {collection.title}
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {battles.length} {t('pages.collections.battlesCount')}
            </p>
          </div>
        </div>
        <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">
          {collection.description}
        </p>
      </motion.div>

      {/* Tags */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        {collection.tags.map(tag => (
          <span
            key={tag}
            className="text-xs font-medium text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100"
          >
            {tag}
          </span>
        ))}
      </motion.div>

      {/* Battle List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {battles.map((battle, i) => (
          <motion.div
            key={battle.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.03 * i }}
          >
            <Link
              to={`/battles/${getBattleSlug(battle)}`}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all duration-200 group block"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-800 group-hover:text-primary-700 transition-colors truncate">
                    {battle.name}
                  </h3>
                  <p className="text-slate-400 text-sm mt-0.5">
                    {formatYear(battle.year)} &middot; {battle.location}
                  </p>
                  <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                    <span>{getEraIcon(battle.civilization)}</span>
                    {getEraDisplayName(battle.civilization)}
                  </p>
                </div>
                <span
                  className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                    difficultyColors[battle.difficulty]
                  }`}
                >
                  {battle.difficulty}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center mt-10"
      >
        <div className="bg-gradient-to-br from-primary-50 to-emerald-100/50 rounded-2xl p-8 border border-primary-200/50">
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            {t('pages.collections.ctaTitle')}
          </h2>
          <p className="text-slate-600 mb-5">
            {t('pages.collections.ctaSubtitle')}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-primary-200 hover:shadow-lg hover:shadow-primary-200 transition-all duration-200"
          >
            {t('pages.battles.playBattleGuess')}
          </Link>
        </div>
      </motion.div>
    </ContentLayout>
  );
}

export default BattleCollectionDetail;
