import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ContentLayout } from '../components/layout/ContentLayout';
import { LocaleLink } from '../components/ui/LocaleLink';
import { getBattleById, allBattles } from '../data/battles';
import { battleFacts } from '../data/battleFacts';
import { battleImages } from '../data/battleImages';
import type { BlogPost } from '../data/blogPosts';
import { battleCollections } from '../data/battleCollections';
import { buildBreadcrumbJsonLd } from '../utils/breadcrumbs';
import {
  parseBattleId,
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

function BattleDetail() {
  const { battleId } = useParams<{ battleId: string }>();
  const id = battleId ? parseBattleId(battleId) : NaN;
  const battle = !isNaN(id) ? getBattleById(id) : undefined;
  const { t } = useTranslation();

  const [relatedArticles, setRelatedArticles] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!battle) return;
    import('../data/blogPosts').then(({ blogPosts }) => {
      setRelatedArticles(blogPosts.filter(p => p.relatedBattleIds?.includes(battle.id)));
    });
  }, [battle?.id]);

  const featuredCollections = useMemo(
    () => battle ? battleCollections.filter(c => c.battleIds.includes(battle.id)) : [],
    [battle]
  );

  const relatedBattles = useMemo(
    () => battle
      ? allBattles
          .filter(b => b.id !== battle.id && b.civilization === battle.civilization)
          .slice(0, 4)
      : [],
    [battle]
  );

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
            {t('pages.battles.battleNotFound')}
          </h1>
          <p className="text-slate-500 mb-6">
            {t('pages.battles.battleNotFoundDesc')}
          </p>
          <LocaleLink
            to="/battles"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            &larr; {t('pages.battles.backToEncyclopedia')}
          </LocaleLink>
        </div>
      </ContentLayout>
    );
  }

  const fact = battleFacts[battle.id];
  const imageUrl = battleImages[battle.id];

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', url: 'https://battleguess.app' },
    { name: 'Battle Encyclopedia', url: 'https://battleguess.app/battles' },
    { name: battle.name, url: `https://battleguess.app/battles/${battleId}` },
  ]);

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: battle.name,
    description: battle.description,
    author: { '@type': 'Organization', name: 'BattleGuess' },
    publisher: { '@type': 'Organization', name: 'BattleGuess', url: 'https://battleguess.app' },
    ...(imageUrl && { image: `https://battleguess.app${imageUrl}` }),
  };

  const historicalEvent = {
    '@context': 'https://schema.org',
    '@type': 'HistoricalEvent',
    name: battle.name,
    description: battle.description,
    startDate: battle.year < 0 ? `-${String(Math.abs(battle.year)).padStart(4, '0')}-01-01` : `${String(battle.year).padStart(4, '0')}-01-01`,
    location: {
      '@type': 'Place',
      name: battle.location,
    },
  };

  const speakable = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.battle-quick-facts', '.battle-description'],
    },
  };

  const jsonLd = [breadcrumbs, article, historicalEvent, speakable];

  return (
    <ContentLayout
      title={`${battle.name} | BattleGuess`}
      description={battle.description}
      canonical={`https://battleguess.app/battles/${battleId}`}
      path={`/battles/${battleId}`}
      jsonLd={jsonLd}
    >
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <LocaleLink
          to="/battles"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-primary-600 text-sm font-medium transition-colors"
        >
          &larr; {t('pages.battles.backToEncyclopedia')}
        </LocaleLink>
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

      {/* Quick Facts */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="mb-8 battle-quick-facts"
      >
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-700 mb-3">Quick Facts</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <dt className="text-slate-500 font-medium">Year</dt>
            <dd className="text-slate-800 font-semibold">{formatYear(battle.year)}</dd>
            <dt className="text-slate-500 font-medium">Location</dt>
            <dd className="text-slate-800">{battle.location}</dd>
            <dt className="text-slate-500 font-medium">Era</dt>
            <dd className="text-slate-800">{getEraIcon(battle.civilization)} {getEraDisplayName(battle.civilization)}</dd>
            <dt className="text-slate-500 font-medium">Difficulty</dt>
            <dd className="text-slate-800 capitalize">{battle.difficulty}</dd>
          </dl>
        </div>
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
              alt={`Historical artwork depicting the Battle of ${battle.name}`}
              loading="lazy"
              className="w-full h-auto object-cover"
              width={1080}
              height={1080}
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
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 battle-description">
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
              <span>💡</span> {t('pages.battles.didYouKnow')}
            </h2>
            <p className="text-amber-900/80 leading-relaxed">
              {fact}
            </p>
          </div>
        </motion.div>
      )}

      {/* Featured In Collections */}
      {featuredCollections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mb-10"
        >
          <h2 className="text-lg font-bold text-slate-700 mb-3">{t('pages.battles.featuredIn')}</h2>
          <div className="flex flex-wrap gap-2">
            {featuredCollections.map(collection => (
              <LocaleLink
                key={collection.slug}
                to={`/collections/${collection.slug}`}
                className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-primary-300 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <span className="text-lg">{collection.icon}</span>
                <span className="text-sm font-medium text-slate-700 group-hover:text-primary-700 transition-colors">
                  {collection.title}
                </span>
              </LocaleLink>
            ))}
          </div>
        </motion.div>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.38 }}
          className="mb-10"
        >
          <h2 className="text-lg font-bold text-slate-700 mb-3">{t('pages.battles.relatedArticles')}</h2>
          <div className="space-y-2">
            {relatedArticles.map(article => (
              <LocaleLink
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all duration-200 group"
              >
                <span className="text-2xl flex-shrink-0">📝</span>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 group-hover:text-primary-700 transition-colors text-sm truncate">
                    {article.title}
                  </p>
                  <p className="text-xs text-slate-400">{article.readTime}</p>
                </div>
              </LocaleLink>
            ))}
          </div>
        </motion.div>
      )}

      {/* Related Battles */}
      {relatedBattles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.39 }}
          className="mb-10"
        >
          <h2 className="text-lg font-bold text-slate-700 mb-3">Related Battles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedBattles.map(b => (
              <LocaleLink
                key={b.id}
                to={`/battles/${getBattleSlug(b)}`}
                className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all duration-200 group"
              >
                <span className="text-2xl flex-shrink-0">{getEraIcon(b.civilization)}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 group-hover:text-primary-700 transition-colors text-sm truncate">
                    {b.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatYear(b.year)} &middot; {b.location}
                  </p>
                </div>
              </LocaleLink>
            ))}
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
            {t('pages.battles.canYouIdentify')}
          </h2>
          <p className="text-slate-600 mb-5">
            {t('pages.battles.putKnowledgeToTest')}
          </p>
          <LocaleLink
            to="/"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-primary-200 hover:shadow-lg hover:shadow-primary-200 transition-all duration-200"
          >
            {t('pages.battles.playBattleGuess')}
          </LocaleLink>
        </div>
      </motion.div>
    </ContentLayout>
  );
}

export default BattleDetail;
