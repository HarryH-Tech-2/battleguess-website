import type { Battle } from '../types';
import { allBattles } from './battles';

export interface BattleCollection {
  slug: string;
  title: string;
  description: string;
  icon: string;
  battleIds: number[];
  tags: string[];
}

export const battleCollections: BattleCollection[] = [
  {
    slug: 'naval-battles',
    title: 'Naval Battles',
    description:
      'From ancient triremes to modern battleships, these engagements were decided on the open water. Explore the sea battles that shaped maritime history and determined the fate of empires.',
    icon: '\u{26F5}',
    battleIds: [34, 44, 27, 94, 17, 101, 118, 123, 124, 125, 129, 132, 8, 30, 150, 153, 159, 161, 178, 186, 193, 196, 215, 216, 221],
    tags: ['naval', 'maritime', 'fleet', 'ships'],
  },
  {
    slug: 'siege-warfare',
    title: 'Siege Warfare',
    description:
      'Walls breached, cities starved, and fortresses toppled. These famous sieges tested the endurance of both defender and attacker, often lasting months or even years.',
    icon: '\u{1F3F0}',
    battleIds: [36, 37, 38, 41, 45, 28, 65, 73, 75, 82, 91, 97, 100, 107, 112, 121, 138, 160, 165, 174, 176, 180, 194, 195, 198, 200, 202, 204],
    tags: ['siege', 'fortification', 'castle', 'defense'],
  },
  {
    slug: 'battles-that-changed-history',
    title: 'Battles That Changed History',
    description:
      'These pivotal engagements altered the course of civilization. Each one toppled empires, redrawn borders, or redirected the flow of culture and technology for centuries to come.',
    icon: '\u{1F30D}',
    battleIds: [2, 27, 42, 75, 4, 14, 1, 8, 5, 6, 11, 13, 16, 3, 209, 197, 10, 19],
    tags: ['decisive', 'pivotal', 'turning point', 'world history'],
  },
  {
    slug: 'against-all-odds',
    title: 'Against All Odds',
    description:
      'Outnumbered, outgunned, and written off before the fight began. These battles were won by forces that had no business winning, proving that courage, terrain, and tactics can overcome raw numbers.',
    icon: '\u{1F4AA}',
    battleIds: [2, 10, 7, 29, 83, 86, 125, 134, 146, 149, 170, 171, 218, 84, 80, 98],
    tags: ['underdog', 'outnumbered', 'courage', 'unlikely victory'],
  },
  {
    slug: 'ambush-and-surprise',
    title: 'Ambush & Surprise Attacks',
    description:
      'The element of surprise has decided more battles than any weapon ever forged. These commanders struck when least expected, turning the tide before their enemies could react.',
    icon: '\u{26A1}',
    battleIds: [20, 60, 68, 70, 98, 127, 131, 134, 164, 170, 181, 201, 220, 224, 225, 12],
    tags: ['ambush', 'surprise', 'deception', 'tactics'],
  },
  {
    slug: 'last-stands',
    title: 'Famous Last Stands',
    description:
      'Heroic defenses where warriors fought to the bitter end. These legendary last stands became symbols of courage and sacrifice that echo through history.',
    icon: '\u{1F6E1}\u{FE0F}',
    battleIds: [2, 73, 29, 81, 89, 92, 108, 138, 174, 183, 191, 198, 214, 219, 25],
    tags: ['last stand', 'defense', 'heroic', 'sacrifice'],
  },
  {
    slug: 'empire-builders',
    title: 'Empire Builders',
    description:
      'The battles that built the greatest empires in history. From Alexander the Great to Napoleon, these conquests forged the political map of the world.',
    icon: '\u{1F451}',
    battleIds: [42, 43, 58, 14, 18, 28, 59, 1, 12, 144, 145, 111, 95, 96, 102, 105, 148, 155, 202, 205, 207],
    tags: ['empire', 'conquest', 'expansion', 'conqueror'],
  },
];

export function getCollectionBySlug(slug: string): BattleCollection | undefined {
  return battleCollections.find(c => c.slug === slug);
}

export function getCollectionBattles(collection: BattleCollection): Battle[] {
  return collection.battleIds
    .map(id => allBattles.find(b => b.id === id))
    .filter((b): b is Battle => b !== undefined);
}
