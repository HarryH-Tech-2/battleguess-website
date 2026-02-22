import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ContentLayout } from '../components/layout/ContentLayout';
import { allBattles } from '../data/battles';
import { civilizations } from '../data/civilizations';
import type { CivilizationId } from '../types';
import {
  getBattleSlug,
  getEraDisplayName,
  getEraIcon,
  getEraTimeSpan,
  formatYear,
  groupBattlesByEra,
} from '../utils/battleHelpers';

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};

function BattleEncyclopedia() {
  const [search, setSearch] = useState('');
  const [selectedEra, setSelectedEra] = useState<CivilizationId | 'all'>('all');

  const filteredBattles = useMemo(() => {
    let battles = allBattles;

    if (selectedEra !== 'all') {
      battles = battles.filter(b => b.civilization === selectedEra);
    }

    if (search.trim()) {
      const term = search.toLowerCase().trim();
      battles = battles.filter(b => b.name.toLowerCase().includes(term));
    }

    return battles;
  }, [search, selectedEra]);

  const groupedBattles = useMemo(() => groupBattlesByEra(filteredBattles), [filteredBattles]);

  const eraOrder = civilizations.map(c => c.id);

  return (
    <ContentLayout
      title="Battle Encyclopedia | BattleGuess"
      description="Explore over 200 historical battles across 8 eras in the BattleGuess encyclopedia. Learn about battles from ancient Egypt to the World Wars."
      canonical="https://battleguess.app/battles"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
          Battle Encyclopedia
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Explore {allBattles.length} historical battles across 8 eras
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search battles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent shadow-sm"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </motion.div>

      {/* Era Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex flex-wrap justify-center gap-2 mb-10"
      >
        <button
          onClick={() => setSelectedEra('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedEra === 'all'
              ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
              : 'bg-white text-slate-600 hover:bg-primary-50 hover:text-primary-700 border border-slate-200'
          }`}
        >
          All Eras
        </button>
        {civilizations.map(civ => (
          <button
            key={civ.id}
            onClick={() => setSelectedEra(civ.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedEra === civ.id
                ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                : 'bg-white text-slate-600 hover:bg-primary-50 hover:text-primary-700 border border-slate-200'
            }`}
          >
            {civ.icon} {civ.name}
          </button>
        ))}
      </motion.div>

      {/* Battle Groups */}
      {filteredBattles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-slate-500 text-lg">No battles found matching your search.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {eraOrder
            .filter(eraId => groupedBattles[eraId]?.length)
            .map(eraId => (
              <motion.section
                key={eraId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Era Header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{getEraIcon(eraId)}</span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {getEraDisplayName(eraId)}
                    </h2>
                    <p className="text-slate-400 text-sm">{getEraTimeSpan(eraId)}</p>
                  </div>
                </div>

                {/* Battle Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {groupedBattles[eraId]!.map(battle => (
                    <Link
                      key={battle.id}
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
                  ))}
                </div>
              </motion.section>
            ))}
        </div>
      )}
    </ContentLayout>
  );
}

export default BattleEncyclopedia;
