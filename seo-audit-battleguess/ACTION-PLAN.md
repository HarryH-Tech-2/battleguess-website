# BattleGuess — Prioritized Action Plan

> **Fix status as of 2026-04-11.** 14 of 18 items below have been implemented.
> Each item is annotated inline with ✅ (done), ⚠️ (done with caveat), or
> 🔲 (not yet). See the bottom of this file for the full status summary.

## 🔴 Critical — fix immediately

### C1. Stop soft 404s ✅
**Impact:** Prevents index bloat and crawl waste; protects sitemap trust.
**Effort:** S (30 min)
**How:** In `vercel.json`, add a catch-all that returns HTTP 404 for non-matched routes. Pre-render a dedicated `/404.html`. Example:
```json
{
  "routes": [
    { "src": "/assets/(.*)", "headers": { "cache-control": "public, max-age=31536000, immutable" }, "continue": true },
    { "src": "/(battles|blog|modes|collections|faq|about|fr|es).*", "continue": true },
    { "src": "/(.*)", "status": 404, "dest": "/404.html" }
  ]
}
```
Verify with `curl -I https://battleguess.app/does-not-exist` → expect `HTTP/1.1 404`.

**Implemented:** `vercel.json` rewrites are now scoped to known route prefixes
(`battles|blog|collections|modes|faq|about|stats`, plus `fr`/`es` variants),
so unknown paths fall through to Vercel's `public/404.html` with real HTTP 404.
Added `public/404.html` (static, branded, `noindex`) and `src/pages/NotFound.tsx`
(catch-all SPA route now renders `NotFound` with `robots=noindex` instead of
the homepage). Also added `robots="noindex, follow"` to the `BattleDetail.tsx`
"Battle Not Found" fallback branch.

### C2. Pre-render the three homepage shells ✅
**Impact:** Homepage LCP + indexable content + locale correctness.
**Effort:** M (2–4 h with `vite-plugin-prerender`, `react-snap`, or a small puppeteer script).
**How:** Generate static `/index.html`, `/fr/index.html`, `/es/index.html` at build time with real H1, hero copy, and CTA buttons in HTML. Keep the React hydration behavior afterwards.

**Implemented:** `scripts/prerender.mjs` was explicitly filtering out `/` (old
line 75: `if (path !== '/') routes.push(path)`). Removed the filter so the
homepage is now puppeteered along with every other sitemap URL. The /fr/ and
/es/ shells are no longer in the sitemap (see C3) so they're not prerendered
— they fall through to the SPA rewrite at runtime. Re-enable their prerender
by adding them back to `LANGUAGES` in `scripts/generate-sitemap.mjs`.

### C3. Decide the i18n strategy ⚠️
**Impact:** Eliminates duplicate content across 558 URLs.
**Effort:** Depends on path.
- **Short-term fix (S, 15 min):** strip `/fr/` and `/es/` URLs from `sitemap.xml`; remove `<xhtml:link rel="alternate">` blocks; add `301` redirects `/fr/*` → `/*` and `/es/*` → `/*` in `vercel.json`; remove the in-app language switcher until real translations land.
- **Long-term (L, multi-day):** actually translate UI, meta, and body. Use `react-i18next` or similar; ensure `<html lang="fr">` and `og:locale="fr_FR"` are emitted per locale.

**Implemented (short-term variant, with a twist).** Full strip + hard redirect
would have broken the language switcher because real UI-level translations
already exist (`src/i18n/locales/{en,fr,es}.json`, ~368 keys each, plus
`src/i18n/battleContent/{fr,es}.ts`). We did this instead:

1. `scripts/generate-sitemap.mjs` — `LANGUAGES = ['en']`. No /fr/ or /es/ URLs
   advertised; no hreflang emitted in the sitemap. Also drops the `xmlns:xhtml`
   declaration when only one language is present.
2. `src/components/layout/SEOHead.tsx` — stopped emitting per-page `<link
   rel="alternate" hreflang="…">` tags for the same reason. `path` prop kept
   as an unused optional so existing callers don't need to change.
3. `src/AppRouter.tsx` `LanguageLayout` — now synchronously writes
   `document.documentElement.lang` and `<meta property="og:locale">` whenever
   the URL language changes, so runtime users on `/fr/*` still get the correct
   `<html lang="fr">` and `og:locale="fr_FR"` (Googlebot never sees these URLs
   because they aren't in the sitemap, but search engines that discover them
   via other means will now get consistent language signals).
4. Existing `rel=canonical` on /fr/ and /es/ pages already points at the
   English URL (each page component hard-codes `https://battleguess.app/<path>`
   as the canonical), so any already-indexed /fr/ URLs will deindex via
   canonical over time.
5. **No redirects** — did not add `301 /fr/* → /*` because that would break
   the in-app language switcher for existing runtime users.

**Not done (deferred):** actually translating battle descriptions, blog post
bodies, and page-level SEO titles/descriptions. To re-enable multilingual SEO:
change `LANGUAGES` back to `['en', 'fr', 'es']` in the sitemap generator,
restore hreflang emission in `SEOHead.tsx`, and add translated `title` /
`description` props (or `t('seo.…')` calls) to every page component.

### C4. Remove `HowTo` schema site-wide ✅
**Impact:** Cleans deprecated markup; reduces HTML size on every page.
**Effort:** XS (5 min).
**How:** Delete the entire `HowTo` `<script type="application/ld+json">` block from `index.html`. Google deprecated `HowTo` rich results in **September 2023**; it no longer produces rich snippets.

**Implemented:** `HowTo` block removed from `index.html`. While in there, also
removed the site-wide `WebApplication` and `FAQPage` JSON-LD blocks for H2 (see
below). Only `SpeakableSpecification` remains in the global template.

---

## 🟠 High — fix within 1 week

### H1. Serve hashed assets with immutable cache ✅
**Effort:** XS. **Impact:** Repeat-visit performance.
```json
// vercel.json
{
  "headers": [
    { "source": "/assets/(.*)", "headers": [
      { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
    ]}
  ]
}
```

**Implemented:** `vercel.json` now applies immutable caching to both
`/assets/*` and `/fonts/*`. See `vercel.json` in the repo root for full
config (security headers from M4 are folded into the same file).

### H2. Move schema off the base template ✅
**Effort:** S (20 min). **Impact:** Schema accuracy.
Move each JSON-LD block to only the route that emits it:
- `WebApplication` → `/`, `/fr/`, `/es/` only
- `FAQPage` → `/faq` (and `/fr/faq`, `/es/faq` only if actually localized)
- Delete `HowTo` entirely (see C4)
- `Speakable` → fine to keep globally

Most SSG/SSR prerender scripts can inject per-route `<head>` content.

**Implemented:** `WebApplication`, `FAQPage`, and `HowTo` JSON-LD blocks
deleted from `index.html`. `Speakable` kept globally (benign). `WebApplication`
is now injected on the homepage via the `SEOHead jsonLd` prop in `src/App.tsx`.
`FAQPage` is already injected by `src/pages/FAQ.tsx` (it was being double-
emitted before). Prerendered battle/blog/about pages no longer carry
misleading `FAQPage` or `WebApplication` schema.

### H3. Fix battle image alt text typo ✅
**Effort:** XS (template fix).
**Current:** `alt="Historical artwork depicting the Battle of Battle of Kadesh"`
**Fix:** `alt="Historical artwork depicting the {battle.name}"` — `battle.name` already contains the "Battle of" prefix.

**Implemented:** `src/pages/BattleDetail.tsx:209` updated to
`alt={`Historical artwork depicting the ${battle.name}`}`. Note a few battle
names don't follow the "Battle of" convention (e.g. `D-Day`, `Siege of Tyre`,
`Fall of Nineveh`) so the phrasing is slightly awkward on those, but the
duplicate-prefix bug is gone.

### H4. Remove leading emoji from homepage title ✅
**Effort:** XS.
**Current:** `🟢 BattleGuess — Free Historical Battle Guessing Game …`
**New:** `BattleGuess — Free Historical Battle Guessing Game | Test Your History Knowledge`

**Implemented:** `<title>` in `index.html` updated to the emoji-less version.

### H5. Deduplicate battle IDs ⚠️
**Effort:** S (investigate + decide).
Sitemap contains pairs like `31-battle-of-kadesh` and `226-battle-of-kadesh`. Confirm whether these are different battle records (e.g. two historical engagements at Kadesh) or duplicate entries of the same battle. If duplicates: remove the higher-ID variant or add a `rel="canonical"` pointing to the canonical entry.

**Investigated:** ids 226–230 (in `ancientEgyptMesopotamia.ts`) and 231–235
(in `ottomanIslamic.ts`) are **gameplay variants** — same canonical battle
name (`Battle of Kadesh`, `Fall of Babylon`, etc.), same description, different
`prompt` / `hints` / `acceptedAnswers` / `difficulty`. They were added to give
the game more answer variety.

**Implemented:** rather than deleting them (which would cost gameplay variety)
we canonicalize:

- `src/data/battles/index.ts` — new `getCanonicalBattleByName()` helper that
  returns the lowest-ID entry for a given name.
- `src/pages/BattleDetail.tsx` — canonical URL, canonical path, and the
  breadcrumb JSON-LD URL are all computed from the canonical battle, not the
  current battle. So `/battles/226-battle-of-kadesh` emits
  `<link rel="canonical" href="https://battleguess.app/battles/31-battle-of-kadesh">`.
- `scripts/generate-sitemap.mjs` — `getBattleSlugs()` now dedupes by lowercased
  name, so only the lowest-ID entry per battle name is advertised in the
  sitemap. Total sitemap entries dropped from 837 to 269.

Variants still work at runtime if someone deep-links to `/battles/226-…`, but
they will not be crawled, indexed, or compete with the canonical URL.

### H6. Shorten battle meta descriptions ✅
**Effort:** S (add a template truncation to ~155 chars).
Current descriptions run ~480 chars and are truncated mid-sentence in SERP. Either write a separate `seo_description` field or auto-truncate on the first full sentence under 155 chars.

**Implemented:** chose the auto-truncate path so we don't need to re-author
225 descriptions. New `truncateMetaDescription(text, maxLength = 155)` helper
in `src/utils/battleHelpers.ts` — prefers cutting at the last sentence
terminator (`.`, `!`, `?`) under the limit, else cuts at the last word
boundary and appends an ellipsis. `src/pages/BattleDetail.tsx` now passes
`truncateMetaDescription(battle.description)` to `ContentLayout`.

### H7. Compress OG image ✅
**Effort:** XS.
`og-image.png` is 266 KB. Target < 150 KB. Re-encode as WebP (keep a JPG fallback if needed) or run through `squoosh`/`oxipng`.

**Implemented:** re-encoded via `sharp` (already a project dep).

| Format | Before | After |
|---|---|---|
| `og-image.png` | 266 KB | 234 KB (optimised palette PNG, kept as legacy) |
| `og-image.jpg` | — | **98 KB** (new, referenced by `<meta property="og:image">`) |
| `og-image.webp` | — | 77 KB (new, smaller alternative) |

`index.html` `og:image` / `twitter:image` meta tags and `src/App.tsx`
`WebApplication` JSON-LD now point at `og-image.jpg`. `scripts/generate-og-image.js`
updated to emit JPG + WebP (JPG via `mozjpeg` at quality 85, WebP at quality
85 / effort 6) on every future regeneration. The legacy `og-image.png` is
left in place so any existing cached social scrapes still resolve.

---

## 🟡 Medium — fix within 1 month

### M1. Expand battle-page prose 🔲
Battle detail pages have ~120 words of unique content. Target 250–350 words per page. Possible additions: tactics summary, aftermath/consequences, notable commanders block. Avoid AI-generic filler — use your existing facts.

**Not done.** This is content authoring across 225+ battles — out of scope
for the initial SEO pass. Queued as future work.

### M2. Delete `<meta name="keywords">` from `index.html` ✅
Google ignores it; it's just noise. 5 min.

**Implemented:** removed from `index.html`.

### M3. Resolve duplicate `<h1>` from noscript block ✅
The `<noscript>` fallback `<h1>BattleGuess – The History Battle Guessing Game</h1>` is inside the DOM, producing two H1s on pre-rendered pages. Either:
- Move the noscript H1 to a `<div>` with `role="heading" aria-level="2"`, OR
- Only inject noscript HTML into the shell where no real H1 exists (i.e. only on the homepage pre-render).

**Implemented:** took option 1. `<noscript>` heading in `index.html` is now
`<div role="heading" aria-level="1" style="…">…</div>` — no second `<h1>`
in the DOM, screen readers still announce it as a level-1 heading.

### M4. Add security headers ✅
```
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: (build after inventorying inline scripts)
```

**Implemented:** `X-Content-Type-Options`, `Referrer-Policy`, and
`Permissions-Policy` are now set globally via `vercel.json` `headers`. CSP
intentionally **not** added yet — needs an inventory of inline scripts
(gtag, JSON-LD blocks) first.

### M5. Author bio / E-E-A-T 🔲
Create a real author section on `/about` with author photo, background, sources, social links. Expand `Person` schema with `sameAs: [...]`.

**Not done.** Content authoring task, deferred.

---

## 🟢 Low — backlog

### L1. Route-level code splitting 🔲
947 KB single bundle. Lazy-load the battle encyclopedia pages, the blog, and the modes screens so the initial bundle drops under 300 KB. Minimal user impact since most content is pre-rendered, but helps interactive paths.

**Partial.** Content pages are already `lazy(() => import(...))` in
`src/AppRouter.tsx`, so the bundle is already split at the route level. The
residual 947 KB is the game bundle itself (framer-motion, React, Firebase,
game hooks). Further splitting would require refactoring the game screens,
which is out of scope. No change made this pass.

### L2. Add `ai.txt` 🔲
Optional. Spec at https://site.spawning.ai/. Declares your AI consent policy.

**Not done.** Optional backlog item.

### L3. Cross-link battle pages to topic hubs 🔲
Battle pages currently link to 2 blog articles + 4 sibling battles. Consider also linking the era landing page (e.g. `/blog/topics/ancient-warfare` when era is "Ancient Egypt & Mesopotamia").

**Not done.** Backlog.

### L4. Add last-updated dates to blog articles 🔲
Visible publication + updated dates reinforce freshness (E-E-A-T).

**Not done.** Backlog.

---

## Fix summary (2026-04-11)

| # | Issue | Status | Notes |
|---|---|---|---|
| C1 | Soft 404s | ✅ | `vercel.json` rewrites scoped; `public/404.html`; `NotFound.tsx` catch-all route; noindex on "Battle Not Found" |
| C2 | Homepage not prerendered | ✅ | Removed `/` filter in `prerender.mjs`. /fr/ /es/ excluded via sitemap changes (C3). |
| C3 | i18n broken | ⚠️ Short-term | Sitemap EN-only; hreflang dropped; html lang + og:locale synced at runtime. Body content translation deferred. |
| C4 | `HowTo` schema | ✅ | Block deleted from `index.html`. |
| H1 | Asset cache | ✅ | `Cache-Control: immutable` for `/assets/*` and `/fonts/*`. |
| H2 | Schema on every page | ✅ | `WebApplication` + `FAQPage` removed from `index.html`, injected per-route. |
| H3 | "Battle of Battle of" alt text | ✅ | `BattleDetail.tsx:209` fixed. |
| H4 | 🟢 emoji in title | ✅ | Removed. |
| H5 | Duplicate battle IDs | ⚠️ | Sitemap dedupes by name; variants canonicalize to lowest ID via new `getCanonicalBattleByName()`. Data rows kept for gameplay variety. |
| H6 | Battle meta descriptions too long | ✅ | New `truncateMetaDescription()` helper in `battleHelpers.ts`. |
| H7 | OG image 266 KB | ✅ | New `og-image.jpg` (98 KB) + `og-image.webp` (77 KB); meta tags updated; generator script updated. |
| M1 | Thin battle prose | 🔲 | Content authoring, deferred. |
| M2 | Meta keywords | ✅ | Removed from `index.html`. |
| M3 | Duplicate H1 in noscript | ✅ | Changed to `<div role="heading" aria-level="1">`. |
| M4 | Security headers | ✅ (3 of 4) | `nosniff`, `Referrer-Policy`, `Permissions-Policy` added. **CSP deferred** — needs inline-script inventory first. |
| M5 | Author bio / E-E-A-T | 🔲 | Content authoring, deferred. |
| L1 | Bundle splitting | 🔲 | Route-level splitting already exists for content pages; game bundle not split. |
| L2 | `ai.txt` | 🔲 | Optional backlog item. |
| L3 | Battle → topic hub links | 🔲 | Backlog. |
| L4 | Blog last-updated dates | 🔲 | Backlog. |

### Files changed

- `index.html` — removed 🟢, keywords, `HowTo` / `WebApplication` / `FAQPage`
  JSON-LD, updated OG image to `.jpg`, converted noscript `<h1>` to ARIA div.
- `vercel.json` — scoped SPA rewrites + cache headers + security headers.
- `public/404.html` — **new**, branded static 404.
- `public/og-image.jpg`, `public/og-image.webp` — **new**, compressed.
- `scripts/generate-sitemap.mjs` — dedupe by battle name; `LANGUAGES = ['en']`;
  drop hreflang when single language.
- `scripts/prerender.mjs` — stop skipping `/`.
- `scripts/generate-og-image.js` — emit `.jpg` + `.webp` instead of `.png`.
- `src/AppRouter.tsx` — `NotFound` catch-all; `LanguageLayout` now syncs
  `<html lang>` and `og:locale`.
- `src/App.tsx` — inject `WebApplication` JSON-LD via SEOHead; OG URL → `.jpg`.
- `src/components/layout/SEOHead.tsx` — stop emitting hreflang alternates.
- `src/data/battles/index.ts` — new `getCanonicalBattleByName()`.
- `src/pages/BattleDetail.tsx` — alt text fix; canonical via
  `getCanonicalBattleByName`; `truncateMetaDescription`; noindex on "Battle
  Not Found" branch.
- `src/pages/NotFound.tsx` — **new**.
- `src/utils/battleHelpers.ts` — new `truncateMetaDescription()`.

### Verification

- `npx tsc -b` — clean
- `node scripts/generate-sitemap.mjs` — 269 URLs (down from 837), English
  only, no duplicate battle names
- `npx eslint` on all changed files — clean

---

## Effort legend

- **XS** — under 15 min
- **S** — 15–60 min
- **M** — 1–4 h
- **L** — half-day or more

## Recommended sequencing

1. Day 0 (≤ 2 h): C1, C4, H1, H3, H4, H7, M2 — all XS/S wins
2. Day 1 (half-day): C3 short-term (remove /fr/ /es/ from sitemap + redirect)
3. Week 1: C2, H2, H5, H6
4. Week 2–4: M1, M3, M4, M5
5. Backlog: L1–L4, then long-term i18n if business justifies it.
