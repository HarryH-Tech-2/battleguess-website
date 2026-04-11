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

/**
 * Truncates a string for use in a meta description.
 * Google displays ~155–160 characters in SERP snippets; longer descriptions
 * get cut mid-sentence. This trims at the last sentence break under the
 * limit, or falls back to a word-boundary cut with an ellipsis.
 */
export function truncateMetaDescription(text: string, maxLength = 155): string {
  if (text.length <= maxLength) return text;

  // Prefer a clean break at the end of a sentence within the limit.
  const sliced = text.slice(0, maxLength);
  const sentenceEnd = Math.max(
    sliced.lastIndexOf('. '),
    sliced.lastIndexOf('! '),
    sliced.lastIndexOf('? ')
  );
  if (sentenceEnd > 80) {
    return text.slice(0, sentenceEnd + 1);
  }

  // Otherwise cut at the last word boundary and append an ellipsis.
  const lastSpace = sliced.lastIndexOf(' ');
  const cut = lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced;
  return cut.replace(/[.,;:!?-]+$/, '') + '…';
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
