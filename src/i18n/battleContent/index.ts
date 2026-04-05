import { battleContentEs } from './es';
import { battleContentFr } from './fr';

export interface LocalizedBattleContent {
  description?: string;
  fact?: string;
}

export type LocalizedBattleMap = Record<number, LocalizedBattleContent>;

const maps: Record<string, LocalizedBattleMap | undefined> = {
  es: battleContentEs,
  fr: battleContentFr,
};

/**
 * Returns localized description and fact for a battle, or undefined fields
 * if the language is English (fallback) or the entry is missing.
 */
export function getLocalizedBattleContent(
  battleId: number,
  language: string,
): LocalizedBattleContent {
  const map = maps[language];
  return map?.[battleId] ?? {};
}
