# Battle Image Regeneration via Flux 2 Pro

**Date:** 2026-04-20
**Status:** Design approved, pending spec review

## Goal

Regenerate all 235 battle images in `/public/battles/` using a single consistent
AI art style, via the Flux 2 Pro API on Replicate. Replace the current mixed-style
WebPs with a cohesive "3D cartoon / PBR" look across the entire set.

Non-goal: animation (planned as a separate pipeline later).

## Approach

A Node.js batch script run locally by the developer. Three modes: dry-run,
test (5 battles across eras), full (all 235). Outputs go to a staging directory,
then swap into place only after a manual visual spot-check.

## Prompt construction

Ignore each battle's existing `prompt` field. Build prompts from `name` + `year`
using a fixed template so every image shares the same visual language:

```
Present a clear 3D cartoon scene of the {BATTLE_NAME} in {YEAR}, featuring its
most iconic landmarks and architectural elements. Use soft, refined textures with
realistic PBR materials and gentle, lifelike lighting and shadows. Create an
immersive atmospheric mood. Use a clean, minimalistic composition. No text,
no modern logos, no watermarks.
```

Year formatting: `216 BCE` for negative years, `1815` for positive.

## Pipeline

1. **Load battles** — import all battle arrays from `src/data/battles/*.ts`,
   flatten into a single list, sort by id.
2. **Build prompts** — apply the template above to each battle.
3. **Call Replicate** — model `black-forest-labs/flux-2-pro`, square 1024×1024,
   WebP output, 3 concurrent requests, 2 retries on transient failure.
4. **Stream to staging** — write each result to `public/battles/_staging/battle-{id}.webp`.
   Skip if already present (resumable).
5. **Backup + swap** — after the developer reviews the staging dir and runs
   `--promote`:
   - Copy current `public/battles/battle-*.webp` to `public/battles/_backup-YYYYMMDD/`
   - Move every file from `_staging/` into `public/battles/`, overwriting originals.
   - Battles with no staging counterpart are left untouched.
   - `battleImages.ts` does not change (filenames are the same).

## Modes

- **Dry-run** (default, no flag): print prompts + cost estimate, no API calls.
- **Test** (`--test`): only regenerate 5 battles — Thermopylae (id 2),
  Hastings, Sekigahara, Waterloo, Stalingrad — spanning ancient → modern.
- **Full** (`--all`): regenerate all 235.

Separate command (`--promote`) performs the backup + swap from staging.

## Safety

- **Cost cap**: script aborts if it has spent >$30 (belt-and-suspenders; expected
  spend is ~$14 at $0.06/image × 235).
- **Dry-run by default**: running the script with no flags prints the plan,
  never spends money.
- **Staging dir, not direct overwrite**: no originals are touched until an
  explicit `--promote` step after visual review.
- **Automatic backup** on promote, timestamped, kept indefinitely until the
  developer deletes.
- **API token** read from `.env.local` (`REPLICATE_API_TOKEN`). Never logged.

## Config

- Model: `black-forest-labs/flux-2-pro`
- Input params: `aspect_ratio=1:1`, `megapixels=1`, `output_format=webp`,
  `output_quality=90`, `safety_tolerance=5`
- Concurrency: 3
- Retries: 2 (exponential backoff 1s, 4s)
- Hard cost cap: $30

## File layout

```
scripts/
  regenerate-battle-images.mjs   (new — the batch script)
  promote-battle-images.mjs      (new — staging → live + backup)
public/battles/
  battle-1.webp                  (existing, left alone until promote)
  _staging/                      (new — where the script writes outputs)
  _backup-20260420/              (created on first promote)
```

Both staging and backup dirs are added to `.gitignore`.

## Explicit non-goals

- No changes to `useImageGeneration.ts` or `services/gemini.ts` (runtime gen
  stays dormant).
- No changes to `battleImages.ts` (filenames identical).
- No animation, no upscaling, no OG image regeneration.
- No new UI components.
