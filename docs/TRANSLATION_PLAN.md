# Battle Content Translation Plan

## Goal
Translate battle `description` and `fact` fields (shown in the result popup)
from English to Spanish and French. Difficulty label (easy/medium/hard) is
done via i18n keys already.

## Current progress
**80 / 236 battles complete** (ids 1–80 done in both es and fr).

Last commit: pending — "feat(i18n): translate battles 51–80 (80/236 done)"

## Infrastructure (DONE — don't re-do)
- `src/i18n/battleContent/index.ts` — `getLocalizedBattleContent(id, lang)` helper, fallback to English when entry missing
- `src/i18n/battleContent/es.ts` — Spanish map (ids 1–50 done)
- `src/i18n/battleContent/fr.ts` — French map (ids 1–50 done)
- `src/components/game/ResultFeedback.tsx` — already wired up, uses `i18n.language` to look up localized content
- `src/i18n/locales/{en,es,fr}.json` — `result.difficulty.{easy,medium,hard}` keys added

Because the fallback is to English, the app already works correctly today —
users just see English for battles not yet translated.

## Source of truth for English content
`scripts/.battle-content.json` — extracted map `{ id: { name, description, fact? } }`
for all 236 battles. Use the `Read` tool with offset/limit to grab chunks
(~50 battles per 200 lines of JSON).

## What's left (186 battles × 2 languages = 372 translations)
Battle IDs still to translate: **81–236 (rest)**.

Read the source in chunks like:
- ids 51–80: lines ~252–400 of `scripts/.battle-content.json`
- ids 81–130: lines ~400–650
- etc.

## Procedure for each batch
1. `Read` the next ~25 battles' worth of English from `scripts/.battle-content.json`.
2. `Edit` both `es.ts` and `fr.ts` — append new entries keyed by id, matching
   the existing format:
   ```ts
   <id>: {
     description: "...",
     fact: "...",
   },
   ```
   (omit `fact` if the source JSON has no fact for that id)
3. `npx tsc --noEmit` to verify no syntax errors.
4. Commit with message `feat(i18n): translate battles N–M (total/236 done)`
   and push. Keep batches to ~25–30 battles to avoid huge commits.

## Translation style notes
- **Tone**: historical, a little literary — match the English which is
  narrative non-fiction.
- **Proper nouns**: translate battle names only when they have a well-known
  localized form (e.g. Hastings → Hastings in both; Thermopylae → Termópilas (es),
  Thermopyles (fr); Agincourt → Azincourt (fr), Agincourt (es)). When in
  doubt, keep the English/Latinate form.
- **Numbers**: use local number formats (1.000 in Spanish, 1 000 in French with
  non-breaking space where natural, 1,000 in English).
- **Quotes**: use language-appropriate quotation marks (« » in fr, « » or " " in es).
- **"BCE/CE"**: in Spanish use "a.C./d.C.", in French "av. J.-C./apr. J.-C.".

## After all translations done
- Delete `scripts/.battle-content.json` (was just an extraction helper).
- Consider also translating `battle.location` if you want — currently falls
  back to English and user said "no" but it's a small lift if you change mind.
