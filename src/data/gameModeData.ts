import type { GameMode } from '../types';

export interface GameModeInfo {
  id: GameMode;
  slug: string;
  icon: string;
}

export const gameModeData: GameModeInfo[] = [
  { id: 'daily', slug: 'daily', icon: '\u{1F4C6}' },
  { id: 'classic', slug: 'classic', icon: '\u{1F3AF}' },
  { id: 'reverse-year', slug: 'reverse-year', icon: '\u{1F4C5}' },
  { id: 'campaign', slug: 'campaign', icon: '\u{1F5FA}\uFE0F' },
  { id: 'challenge', slug: 'challenge', icon: '\u2694\uFE0F' },
];

export function getGameModeBySlug(slug: string): GameModeInfo | undefined {
  return gameModeData.find(m => m.slug === slug);
}
