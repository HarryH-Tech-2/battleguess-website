import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ContentLayout } from '../components/layout/ContentLayout';
import { battleCollections, getCollectionBattles } from '../data/battleCollections';

function BattleCollections() {
  const { t } = useTranslation();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Battle Collections | BattleGuess',
    description:
      'Curated battle playlists organized by theme — Naval Battles, Siege Warfare, Battles That Changed History, and more.',
    url: 'https://battleguess.app/collections',
  };

  return (
    <ContentLayout
      title="Battle Collections | BattleGuess"
      description="Curated battle playlists organized by theme — Naval Battles, Siege Warfare, Battles That Changed History, and more."
      canonical="https://battleguess.app/collections"
      jsonLd={jsonLd}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
          {t('pages.collections.title')}
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          {t('pages.collections.subtitle')}
        </p>
      </motion.div>

      {/* Collection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {battleCollections.map((collection, i) => {
          const battleCount = getCollectionBattles(collection).length;
          return (
            <motion.div
              key={collection.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
            >
              <Link
                to={`/collections/${collection.slug}`}
                className="block bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300 group h-full"
              >
                <div className="text-4xl mb-3">{collection.icon}</div>
                <h2 className="text-lg font-bold text-slate-800 group-hover:text-primary-700 transition-colors mb-2">
                  {collection.title}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                  {collection.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                    {battleCount} {t('pages.collections.battlesCount')}
                  </span>
                  <span className="text-primary-500 group-hover:translate-x-1 transition-transform duration-200">
                    &rarr;
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center mt-12"
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

export default BattleCollections;
