import type { Battle, CivilizationId } from '../../types';
import { ancientEgyptMesopotamiaBattles } from './ancientEgyptMesopotamia';
import { ancientGreeceRomeBattles } from './ancientGreeceRome';
import { medievalEuropeBattles } from './medievalEurope';
import { ottomanIslamicBattles } from './ottomanIslamic';
import { eastAsiaBattles } from './eastAsia';
import { colonialNapoleonicBattles } from './colonialNapoleonic';
import { americanWarsBattles } from './americanWars';
import { worldWarsBattles } from './worldWars';

export const allBattles: Battle[] = [
  ...ancientEgyptMesopotamiaBattles,
  ...ancientGreeceRomeBattles,
  ...medievalEuropeBattles,
  ...ottomanIslamicBattles,
  ...eastAsiaBattles,
  ...colonialNapoleonicBattles,
  ...americanWarsBattles,
  ...worldWarsBattles,
];

export const getBattlesByCivilization = (
  civId: CivilizationId | 'all'
): Battle[] => {
  if (civId === 'all') return allBattles;
  return allBattles.filter(b => b.civilization === civId);
};

export const getRandomBattle = (
  excludeIds: number[] = [],
  civilization: CivilizationId | 'all' = 'all'
): Battle => {
  const pool = getBattlesByCivilization(civilization);
  const available = pool.filter(b => !excludeIds.includes(b.id));
  if (available.length === 0) {
    return pool[Math.floor(Math.random() * pool.length)];
  }
  return available[Math.floor(Math.random() * available.length)];
};

export const getBattleById = (id: number): Battle | undefined => {
  return allBattles.find(b => b.id === id);
};
