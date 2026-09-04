import { LocaleLink } from '../ui/LocaleLink';
import { getBattleById } from '../../data/battles';
import { battleCollections } from '../../data/battleCollections';
import { getBattleSlug, formatYear } from '../../utils/battleHelpers';

/**
 * Crawlable "explore" block rendered under the game on the idle homepage.
 *
 * The homepage receives ~60% of organic landings but is pre-rendered with
 * <400 words and links only to hub pages. This gives search engines (and
 * curious players) descriptive text plus direct anchor-text links to the
 * game modes, the collections and the best-known battle pages — the pages
 * most likely to rank for their own names.
 */

// Famous, high-search-volume battles. IDs are the canonical entries in
// src/data/battles/*.ts (lowest ID wins for duplicate-name variants).
const FEATURED_BATTLE_IDS = [
  2,  // Thermopylae
  10, // Marathon
  14, // Cannae
  4,  // Hastings
  7,  // Agincourt
  1,  // Waterloo
  8,  // Trafalgar
  3,  // Gettysburg
  9,  // Somme
  5,  // Stalingrad
  6,  // D-Day
  11, // Midway
];

const MODES: { slug: string; label: string; blurb: string }[] = [
  { slug: 'classic', label: 'Classic', blurb: 'guess the battle from the picture' },
  { slug: 'daily', label: 'Daily Challenge', blurb: 'the same 5 battles for everyone, once a day' },
  { slug: 'reverse-year', label: 'Year Mode', blurb: 'name the year a battle was fought' },
  { slug: 'campaign', label: 'Campaign', blurb: 'play through history era by era' },
  { slug: 'challenge', label: 'Challenge a Friend', blurb: 'send a link, beat their score' },
];

export function ExploreSection() {
  const featured = FEATURED_BATTLE_IDS
    .map(id => getBattleById(id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  return (
    <section
      aria-labelledby="explore-heading"
      className="mt-10 sm:mt-14 pt-8 border-t border-primary-100/70 text-left"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-3">
          <h2 id="explore-heading" className="text-xl sm:text-2xl font-bold text-primary-800">
            What is BattleGuess?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            BattleGuess is a free military history quiz game. Each round shows you an
            illustration of a famous historical battle and you try to name it — from the
            chariot clashes of ancient Egypt and the phalanxes of Greece and Rome, through
            medieval sieges, the Napoleonic Wars and the American Civil War, to the great
            battles of the First and Second World Wars. Every battle comes with hints, a
            short history and a fact you probably didn&apos;t know. Over 200 battles across
            eight eras, no download and no account required.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-primary-800">Five ways to play</h3>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm sm:text-base text-gray-600">
            {MODES.map(m => (
              <li key={m.slug}>
                <LocaleLink
                  to={`/modes/${m.slug}`}
                  className="font-semibold text-primary-700 hover:text-primary-900 underline-offset-2 hover:underline"
                >
                  {m.label}
                </LocaleLink>
                {' — '}
                {m.blurb}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-primary-800">Famous battles in the game</h3>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-sm sm:text-base text-gray-600">
            {featured.map(b => (
              <li key={b.id}>
                <LocaleLink
                  to={`/battles/${getBattleSlug(b)}`}
                  className="font-semibold text-primary-700 hover:text-primary-900 underline-offset-2 hover:underline"
                >
                  {b.name}
                </LocaleLink>
                <span className="text-gray-400"> · {formatYear(b.year)}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-500">
            Browse all of them in the{' '}
            <LocaleLink to="/battles" className="font-semibold text-primary-700 hover:underline">
              Battle Encyclopedia
            </LocaleLink>
            .
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-primary-800">Battle collections</h3>
          <ul className="flex flex-wrap gap-2">
            {battleCollections.map(c => (
              <li key={c.slug}>
                <LocaleLink
                  to={`/collections/${c.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-white/70 px-3 py-1 text-sm font-medium text-primary-700 hover:bg-primary-50"
                >
                  <span aria-hidden="true">{c.icon}</span>
                  {c.title}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-gray-500">
          Not sure where to start? Play today&apos;s{' '}
          <LocaleLink to="/modes/daily" className="font-semibold text-primary-700 hover:underline">
            Daily Challenge
          </LocaleLink>
          : five battles, the same for everyone, once a day. Come back tomorrow to keep your streak.
        </p>
      </div>
    </section>
  );
}
