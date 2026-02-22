import type { Battle, CivilizationId } from '../types';
import { civilizations } from '../data/civilizations';

export function getBattleSlug(battle: Battle): string {
  return `${battle.id}-${battle.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}`;
}

export function parseBattleId(param: string): number {
  return parseInt(param.split('-')[0], 10);
}

export function getEraDisplayName(civId: CivilizationId): string {
  const civ = civilizations.find(c => c.id === civId);
  return civ?.name || civId;
}

export function getEraIcon(civId: CivilizationId): string {
  const civ = civilizations.find(c => c.id === civId);
  return civ?.icon || '⚔️';
}

export function getEraTimeSpan(civId: CivilizationId): string {
  const civ = civilizations.find(c => c.id === civId);
  return civ?.timeSpan || '';
}

export function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

export function groupBattlesByEra(battles: Battle[]): Record<CivilizationId, Battle[]> {
  const groups: Partial<Record<CivilizationId, Battle[]>> = {};
  for (const battle of battles) {
    if (!groups[battle.civilization]) groups[battle.civilization] = [];
    groups[battle.civilization]!.push(battle);
  }
  // Sort within each era by year
  for (const key of Object.keys(groups) as CivilizationId[]) {
    groups[key]!.sort((a, b) => a.year - b.year);
  }
  return groups as Record<CivilizationId, Battle[]>;
}
