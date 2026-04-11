import type { Battle, CivilizationId, Difficulty } from '../../types';
import { ancientEgyptMesopotamiaBattles } from './ancientEgyptMesopotamia';
import { ancientGreeceRomeBattles } from './ancientGreeceRome';
import { medievalEuropeBattles } from './medievalEurope';
import { ottomanIslamicBattles } from './ottomanIslamic';
import { eastAsiaBattles } from './eastAsia';
import { colonialNapoleonicBattles } from './colonialNapoleonic';
import { americanWarsBattles } from './americanWars';
import { worldWarsBattles } from './worldWars';
import { southAmericaBattles } from './southAmerica';

export const allBattles: Battle[] = [
  ...ancientEgyptMesopotamiaBattles,
  ...ancientGreeceRomeBattles,
  ...medievalEuropeBattles,
  ...ottomanIslamicBattles,
  ...eastAsiaBattles,
  ...colonialNapoleonicBattles,
  ...americanWarsBattles,
  ...worldWarsBattles,
  ...southAmericaBattles,
];

export const getBattlesByCivilization = (
  civId: CivilizationId | 'all',
  difficulty: Difficulty | 'all' = 'all'
): Battle[] => {
  let pool = civId === 'all' ? allBattles : allBattles.filter(b => b.civilization === civId);
  if (difficulty !== 'all') {
    pool = pool.filter(b => b.difficulty === difficulty);
  }
  return pool;
};

export const getRandomBattle = (
  excludeIds: number[] = [],
  civilization: CivilizationId | 'all' = 'all',
  difficulty: Difficulty | 'all' = 'all'
): Battle => {
  const pool = getBattlesByCivilization(civilization, difficulty);
  const available = pool.filter(b => !excludeIds.includes(b.id));
  if (available.length === 0) {
    return pool[Math.floor(Math.random() * pool.length)];
  }
  return available[Math.floor(Math.random() * available.length)];
};

export const getBattleById = (id: number): Battle | undefined => {
  return allBattles.find(b => b.id === id);
};

/**
 * Returns the canonical battle for a given name (lowest-ID entry).
 * Some battles have gameplay variants with duplicate names but different IDs
 * (e.g. ids 31 and 226 both "Battle of Kadesh"). For SEO we treat the lowest
 * ID as the canonical URL so duplicates don't compete in search.
 */
export const getCanonicalBattleByName = (name: string): Battle | undefined => {
  const normalized = name.toLowerCase();
  let canonical: Battle | undefined;
  for (const b of allBattles) {
    if (b.name.toLowerCase() !== normalized) continue;
    if (!canonical || b.id < canonical.id) canonical = b;
  }
  return canonical;
};

export const getTimelineBattleSet = (
  civilization: CivilizationId | 'all' = 'all',
  difficulty: Difficulty | 'all' = 'all',
  count: number = 5
): Battle[] => {
  const pool = getBattlesByCivilization(civilization, difficulty);
  if (pool.length < count) return pool.sort((a, b) => a.year - b.year);

  // Try to find a set with good year spread (min 50 years between earliest and latest)
  for (let attempt = 0; attempt < 20; attempt++) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    const years = selected.map(b => b.year);
    const spread = Math.max(...years) - Math.min(...years);
    if (spread >= 50) return selected;
  }

  // Fallback: just pick random ones
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
