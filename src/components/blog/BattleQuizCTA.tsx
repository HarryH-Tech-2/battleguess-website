import { useMemo, useState } from 'react';
import { LocaleLink } from '../ui/LocaleLink';
import { allBattles, getBattleById } from '../../data/battles';
import { battleImages } from '../../data/battleImages';
import { getBattleSlug, formatYear } from '../../utils/battleHelpers';
import { analytics } from '../../utils/analytics';
import type { Battle } from '../../types';

interface BattleQuizCTAProps {
  /** Stable seed (post slug) so the same post always shows the same battle —
   *  keeps the prerendered HTML and the client render identical. */
  seed: string;
  /** Battles the post already links to; the first one with an image is preferred. */
  battleIds?: number[];
}

// Small deterministic hash so a post always picks the same battle + distractors.
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickQuiz(seed: string, battleIds?: number[]) {
  const h = hashString(seed);

  const withImage = (b: Battle | undefined): b is Battle => !!b && !!battleImages[b.id];
  const preferred = (battleIds ?? []).map(getBattleById).filter(withImage);
  const pool = allBattles.filter(withImage);
  if (pool.length === 0) return null;

  const answer = preferred.length > 0 ? preferred[h % preferred.length] : pool[h % pool.length];

  // Two distractors from the same era so the choice isn't trivially easy.
  const sameEra = pool.filter(b => b.civilization === answer.civilization && b.id !== answer.id);
  const others = pool.filter(b => b.civilization !== answer.civilization);
  const candidates = sameEra.length >= 2 ? sameEra : [...sameEra, ...others];
  const d1 = candidates[(h >>> 8) % candidates.length];
  let d2 = candidates[(h >>> 16) % candidates.length];
  if (d2.id === d1.id) d2 = candidates[((h >>> 16) + 1) % candidates.length];

  const options = [answer, d1, d2];
  const rotate = h % 3;
  return { answer, options: [...options.slice(rotate), ...options.slice(0, rotate)] };
}

/**
 * Inline "Can you identify this battle?" widget for blog posts. Blog readers
 * were bouncing in 2–8 s without ever reaching the end-of-post CTA, so this
 * sits early in the article and gives them something to *do* before they go.
 */
export function BattleQuizCTA({ seed, battleIds }: BattleQuizCTAProps) {
  const quiz = useMemo(() => pickQuiz(seed, battleIds), [seed, battleIds]);
  const [picked, setPicked] = useState<number | null>(null);

  if (!quiz) return null;
  const { answer, options } = quiz;
  const revealed = picked !== null;
  const correct = picked === answer.id;

  const choose = (id: number) => {
    if (revealed) return;
    setPicked(id);
    analytics.blogQuizAnswered(seed, answer.id, id === answer.id);
  };

  return (
    <aside
      aria-label="Battle quiz"
      className="my-10 rounded-2xl border border-primary-200/60 bg-gradient-to-br from-primary-50 to-emerald-50/60 shadow-sm overflow-hidden"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,220px)_1fr]">
        <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[200px] bg-slate-200">
          <img
            src={battleImages[answer.id]}
            alt={revealed ? `Artwork of the ${answer.name}` : 'Historical artwork of a famous battle — can you identify it?'}
            width={400}
            height={300}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {!revealed && (
            <span className="absolute top-2 left-2 bg-slate-900/70 text-white text-[11px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md">
              Quick quiz
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6 flex flex-col justify-center">
          {!revealed ? (
            <>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Can you identify this battle?</h3>
              <p className="text-sm text-slate-500 mb-4">
                One of these three. This is how BattleGuess works — pick your answer.
              </p>
              <div className="flex flex-col gap-2">
                {options.map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => choose(b.id)}
                    className="text-left w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 hover:border-primary-400 hover:bg-primary-50 text-slate-700 hover:text-primary-800 text-sm font-medium transition-colors"
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${correct ? 'text-emerald-600' : 'text-rose-600'}`}>
                {correct ? 'Correct!' : 'Not quite'}
              </p>
              <h3 className="text-lg font-bold text-slate-800">{answer.name}</h3>
              <p className="text-sm text-slate-500 mb-4">
                {formatYear(answer.year)} &middot; {answer.location}
              </p>
              <p className="text-sm text-slate-600 mb-5">
                {correct
                  ? 'Nicely done. There are 200+ more battles waiting — think you can keep the streak going?'
                  : 'Tricky one. The full game gives you hints, a streak to protect, and 200+ battles to learn.'}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <LocaleLink
                  to="/?mode=classic"
                  onClick={() => analytics.blogQuizPlayClick(seed)}
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-primary-200 transition-colors text-sm"
                >
                  Play the full game &rarr;
                </LocaleLink>
                <LocaleLink
                  to={`/battles/${getBattleSlug(answer)}`}
                  className="text-sm text-primary-700 hover:text-primary-800 font-medium underline decoration-primary-300 hover:decoration-primary-500 transition-colors"
                >
                  About this battle
                </LocaleLink>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
