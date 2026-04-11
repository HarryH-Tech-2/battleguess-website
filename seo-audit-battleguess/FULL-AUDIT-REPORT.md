# BattleGuess SEO Audit — Full Report

- **Site:** https://battleguess.app/
- **Audit date:** 2026-04-10
- **Remediation date:** 2026-04-11 (see `ACTION-PLAN.md` for per-item status)
- **Business type:** Publisher / Web Game (non-commercial, free)
- **Tech stack:** React + Vite SPA on Vercel, pre-rendered HTML for most routes, gtag.js analytics
- **Crawl scope:** Homepage, robots.txt, sitemap.xml, llms.txt, 6 representative sub-pages (battle, blog, faq, modes, fr/battle, fr/faq), asset headers

> **⚠️ Status banner (2026-04-11):** The issues documented in this report
> describe the site **as audited on 2026-04-10**. A remediation pass has
> since landed that closes most of the Critical and High items. See
> [`ACTION-PLAN.md`](./ACTION-PLAN.md) for the per-item fix status; the
> "Post-fix state" table below summarises what's changed.

---

## Executive Summary

### SEO Health Score: **68 / 100**

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 60 | 13.2 |
| Content Quality | 23% | 80 | 18.4 |
| On-Page SEO | 20% | 75 | 15.0 |
| Schema / Structured Data | 10% | 55 | 5.5 |
| Performance (CWV) | 10% | 55 | 5.5 |
| AI Search Readiness | 10% | 90 | 9.0 |
| Images | 5% | 70 | 3.5 |
| **Total** | 100% | | **~70** |

*Final rounded score: **68** (slight deduction for Critical issues capping ceiling).*

### Post-fix state (2026-04-11)

The remediation pass below has not been re-scored by re-running the crawler,
but projected category deltas based on the fixes landed:

| Category | Before | After (projected) | Change driver |
|---|---|---|---|
| Technical SEO | 60 | ~85 | C1 real 404, C2 prerender, H1 cache, M4 headers |
| Content Quality | 80 | 80 | No content rewrite (M1/M5 deferred) |
| On-Page SEO | 75 | ~90 | H3 alt text, H4 emoji, H5 canonical, H6 description length, M2 keywords, M3 noscript H1 |
| Schema / Structured Data | 55 | ~90 | C4 HowTo removed, H2 WebApplication/FAQPage scoped per-route |
| Performance (CWV) | 55 | ~75 | H1 immutable cache, C2 homepage prerender, H7 OG image |
| AI Search Readiness | 90 | 90 | Already strong; unchanged |
| Images | 70 | ~90 | H3 alt text, H7 OG compression |
| **Total (projected)** | **68** | **~85** | — |

Items that still pull the score down: M1 thin battle prose, M5 author bio
(both content-authoring tasks), the deferred CSP header, and the long-term
i18n body-translation work.

### Top 5 Critical Issues

1. **Soft 404 on every unknown URL** — the SPA fallback returns HTTP 200 + homepage HTML for any missing path (`/.well-known/security.txt`, `/ai.txt`, `/nonexistent-page-12345` all return 200 + 9907-byte homepage). Google may index duplicates and lose trust in the sitemap.
2. **Homepage (/, /fr/, /es/) is not pre-rendered** — 9,907-byte SPA shell only; no H1, no copy, no content in source HTML. Sub-pages ARE pre-rendered, but the most linked/authoritative page on the site has no indexable content before JS runs.
3. **Hreflang i18n is broken** — all `/fr/` and `/es/` pages declare `<html lang="en">`, serve the English `<title>`, English meta description, and English body copy. The sitemap declares 558 duplicate non-English URLs (2 × 279) that are effectively duplicate content with mismatched hreflang.
4. **Deprecated `HowTo` schema on every page** — `HowTo`/`HowToStep` JSON-LD is emitted site-wide in the base `index.html`. Google deprecated `HowTo` rich results in **September 2023**. It no longer produces rich results and wastes crawl.
5. **Title tag emoji prefix corrupts SERP snippet** — `🟢 BattleGuess — Free Historical Battle Guessing Game …` puts a decorative green circle before the brand. Google frequently drops/replaces leading emojis in SERP titles and it eats pixel width.

### Top 5 Quick Wins

1. Remove the leading `🟢` emoji from the homepage `<title>`.
2. Delete the four hard-coded `application/ld+json` blocks (`FAQPage`, `HowTo`, `Speakable`, and arguably `WebApplication`) from `index.html` — they fire on every prerendered page including battle/blog pages where they don't match the visible content.
3. Configure a real 404: Vercel `vercel.json` → `"routes": [{ "src": "/...", "status": 404 }]` for a `/404.html` that Vercel returns with real HTTP 404 status, and prerender a `404.html` page.
4. Serve hashed assets (`/assets/*.js`, `/assets/*.css`) with `Cache-Control: public, max-age=31536000, immutable` instead of the current `public, max-age=0, must-revalidate`. This will cut repeat-visit LCP dramatically.
5. Pre-render the three homepage shells (`/`, `/fr/`, `/es/`) with real above-the-fold HTML content + locale-correct `<html lang>` + translated `<title>`.

---

## Technical SEO

### Crawlability ✅ / ❌

| Check | Status | Detail |
|---|---|---|
| `robots.txt` | ✅ | `User-agent: * / Allow: /` + sitemap link |
| `sitemap.xml` | ✅ | 837 `<url>` entries, well-formed, hreflang per URL |
| HTTP → HTTPS redirect | ✅ | `308 Permanent Redirect` (prefer `301` but `308` is acceptable) |
| HSTS | ✅ | `max-age=63072000` (2 years) |
| Canonical tags | ✅ | Present and correct on all checked pages |
| Pre-rendering | ⚠️ | Sub-pages YES; homepage in all locales NO |
| 404 handling | ❌ | Soft 404: unknown paths return 200 OK with homepage HTML |
| Infinite crawl traps | ✅ | None detected |

### Indexability

- No `noindex` found on any sampled page ✓
- Canonicals self-reference correctly on `/battles/31-battle-of-kadesh`, `/blog/...`, `/faq`, `/modes/classic` ✓
- **Risk:** Because unknown URLs return 200 + homepage, Google may discover and index arbitrary URLs (e.g. old typos, link-rot inbound links) as duplicates of the homepage. Search Console will eventually flag many URLs as "Duplicate without user-selected canonical."

### Security headers

Headers present on homepage response:

```
Strict-Transport-Security: max-age=63072000
Access-Control-Allow-Origin: *
```

Missing (recommended but not SEO-blocking):
- `Content-Security-Policy` — missing
- `X-Content-Type-Options: nosniff` — missing
- `Referrer-Policy` — missing
- `Permissions-Policy` — missing

### Core Web Vitals (lab)

PageSpeed Insights API is rate-limited on the shared IP pool; no field CrUX data was retrievable for this audit. Inferred from response sizes and architecture:

| Metric | Expected | Reason |
|---|---|---|
| **LCP** homepage | ⚠️ 2.5–4.0s | SPA shell: user sees nothing until `index-CLf_RuUT.js` (970 KB) parses and renders |
| **LCP** sub-pages | ✅ likely < 2.5s | HTML fully pre-rendered; LCP element is either the `<h1>` or the single `battle-31.webp` |
| **INP** | ✅ likely good | Single-page, light interaction |
| **CLS** | ⚠️ risk | Preloaded `welcome-placeholder.webp` suggests a hero image gets swapped in — needs `width`/`height` attributes. Battle image has explicit `width="1080" height="1080"` ✓ |

**Asset cache policy is wrong for a fingerprinted bundle:**

```
GET /assets/index-CLf_RuUT.js → Cache-Control: public, max-age=0, must-revalidate
```

Hashed filenames are safe to cache forever. Current policy forces revalidation on every navigation, which is ~970 KB of JS that should be `immutable`.

---

## Content Quality

### Pre-rendered sub-pages (positive)

`/battles/31-battle-of-kadesh` sample:
- Valid single on-page `<h1>`: *"Battle of Kadesh"*
- Meta description: **unique** to the page (historically rich, 487 chars — *too long*, will be truncated by Google at ~155–160 chars).
- Content blocks: Quick Facts (year/location/era/difficulty), battle image, description, "Did you know" trivia, Related Articles, Related Battles, CTA. ✅
- Internal links: 2 blog articles + 4 related battles. ✅ good internal linking
- Prose: ~120 words of unique copy per battle page. ⚠️ **Borderline thin** — below the 300-word quality-gate minimum for standard content pages (see `references/quality-gates.md`). Acceptable because the schema + relatedness signals are strong and it's a catalogue entry, but long-tail rankings for "battle of kadesh" will be limited by the short prose.

### Blog content

`/blog/10-most-decisive-battles-in-history` sample:
- Proper article structure: H1 + multiple H2 section headings ✓
- Good alt text ("Dramatic painting of armies clashing on a battlefield …") ✓
- Related Articles sidebar + "Explore These Battles" cross-linking ✓
- Schema: `BlogPosting` + `BreadcrumbList` + `Organization` + `Person` author ✓
- Content depth: significant (45 KB pre-rendered HTML) ✓

### Thin content risks

- **225 battle detail pages** × **3 locales** (EN/FR/ES) = **675 battle URLs**, of which ~450 are currently duplicate English content masquerading as localized. This triggers the quality-gates concern: any significant volume of near-duplicate pages suppresses crawl budget and authority.
- The sitemap also contains **duplicate battle IDs** (e.g. `31-battle-of-kadesh` AND `226-battle-of-kadesh`, `32-battle-of-megiddo` AND `227-…`). Investigate — these may be deliberate (two difficulty variants) or an error. If duplicates, add canonical pointing to the lower-numbered entry or remove from sitemap.

### E-E-A-T signals

| Signal | Status |
|---|---|
| Author bio | ⚠️ `Person` schema names "Harry" linking to `x.com/HarryHH1993` — no on-site `/about` author page with bio or credentials |
| About page | ✓ `/about` exists (28 KB, pre-rendered) |
| Contact info | Unknown — not visible in samples; recommend adding |
| Last-updated dates | ✓ Sitemap has `lastmod`; blog post visible publication/update date unverified |
| Original research / sourcing | Blog articles are general-interest listicles, no citations observed in the two sampled — low E for Expertise |

---

## On-Page SEO

### Title tags

| Page | Title | Issue |
|---|---|---|
| `/` | `🟢 BattleGuess — Free Historical Battle Guessing Game \| Test Your History Knowledge` | **Leading emoji** often dropped by Google; 84 chars — fine |
| `/battles/31-battle-of-kadesh` | `Battle of Kadesh \| BattleGuess` | Too bare — add year or descriptor, e.g. `Battle of Kadesh (1274 BCE) – Ramesses II vs Hittites \| BattleGuess` |
| `/modes/classic` | `Classic Mode \| BattleGuess` | Weak. Should be `Classic Mode – Guess the Battle from an Image \| BattleGuess` |
| `/blog/10-most-decisive-battles-in-history` | (not directly inspected — inferred pre-rendered) | Likely fine |
| `/fr/faq` | `FAQ \| BattleGuess` | **In English despite /fr/ path** |

### Meta descriptions

- Homepage: ✓ well-written, 165 chars (right at limit).
- Battle pages: ❌ **Too long** — ~480 chars, will be truncated mid-sentence in SERP. Trim to ~155 chars.
- `/modes/classic`: ✓ concise.

### Heading structure

- Battle, blog, FAQ: proper single H1 → H2 → H3 hierarchy in the pre-rendered body.
- **But every pre-rendered page includes a SECOND, hidden-in-noscript H1**: `<h1>BattleGuess - The History Battle Guessing Game</h1>` inside `<noscript>`. Technically two H1s in the DOM. Low-severity ambiguity for bots.
- Homepage shell: **no H1 at all** in source HTML (only inside `<noscript>`).

### Meta keywords

Present on every page:
```html
<meta name="keywords" content="history game, battle quiz, military history trivia, …" />
```
Ignored by Google since 2009. Cost: minor bytes + noise. Safe to remove.

### Internal linking

- Navigation links to /modes, /battles, /collections, /blog, /faq, /about ✓
- Battle pages cross-link to 4 sibling battles + 2 blog articles ✓
- Blog pages cross-link to sibling blog articles + "Explore These Battles" ✓
- Footer has 4-column topic hub (Ancient Warfare, Strategy, Military Tech…) ✓
- **Gap:** blog `/blog/topics/*` hub pages exist but no evidence of them being linked from battle pages.

### Duplicate content

- Every `/fr/` and `/es/` URL currently renders identical English HTML — **~558 URLs of duplicate content**.
- Duplicate battle IDs in sitemap (31 & 226, 32 & 227, 33 & 228, 34 & 229, 35 & 230…) — 5 spot-checked, likely more.

---

## Schema & Structured Data

### Site-wide (baked into `index.html`, fires on every prerendered page)

| Type | Status | Notes |
|---|---|---|
| `WebApplication` | ⚠️ | Fine on homepage, incorrect on `/faq`, `/battles/*`, `/blog/*` |
| `FAQPage` | ⚠️ | Correct on `/faq`, incorrect on every other page |
| `HowTo` + `HowToStep` | ❌ **DEPRECATED Sept 2023** — no rich result, remove |
| `SpeakableSpecification` | ✓ | Benign |

### Per-page (pre-rendered, correct)

| Page type | Schema | Status |
|---|---|---|
| Battle detail | `Article`, `BreadcrumbList`, `HistoricalEvent`, `Place`, `Organization` | ✅ Excellent — `HistoricalEvent` is perfectly on-topic |
| Blog post | `BlogPosting`, `BreadcrumbList`, `Organization`, `Person` (author) | ✅ |
| FAQ page | `FAQPage` + `Question` + `Answer` | ✅ (but note August 2023 restriction: `FAQPage` rich results only show for government and healthcare sites — still useful for AI/LLM citation; keep it, no new rich snippet benefit) |

### Issues

1. **HowTo is deprecated.** Delete from `index.html`. (Rule: never recommend HowTo.)
2. **FAQPage on non-FAQ pages.** Moving FAQ schema to only the `/faq` route is cleaner and avoids Google confusing the schema target.
3. **WebApplication on every page.** Keep only on `/`, `/fr/`, `/es/`.
4. **Author info is minimal.** `Person` schema has `name: "Harry"` + `url: x.com/HarryHH1993`. Adding `sameAs` (LinkedIn, personal site) and a named `/about` author bio improves E-E-A-T.

---

## Performance (CWV)

No field (CrUX) data retrievable during this audit (no API key; PSI rate-limited). Lab-reasoning only:

### Payload analysis

| Resource | Bytes | Note |
|---|---|---|
| Homepage HTML | 9,907 | ✅ Small, but lacks content |
| JS bundle `index-CLf_RuUT.js` | **970,268** (947 KB) | ⚠️ Large — consider route-level code splitting if not already |
| CSS `index-CC49qHIm.css` | (not measured) | |
| Battle image `battle-31.webp` | 42,536 (41 KB) | ✅ Reasonable |
| `og-image.png` | 272,792 (266 KB) | ⚠️ Oversized for an OG — target < 150 KB, prefer WebP/JPG |

### Homepage LCP risk

The `<div id="root"></div>` starts empty. The LCP element cannot paint until:
1. `index-CLf_RuUT.js` downloads (947 KB)
2. Parses and executes
3. Mounts React tree
4. Loads `welcome-placeholder.webp` hero

On a 4G mobile connection this commonly lands **LCP > 3.0s** (outside "Good"). Pre-rendering the homepage shell's hero H1 + preloaded image would flip it to < 2.0s instantly.

### Recommendations

1. **Fix hashed-asset caching** (Critical for repeat visits).
2. Pre-render the homepage shell (Critical for first-visit LCP).
3. Re-encode `og-image.png` → < 150 KB.
4. Measure real CWV via GSC / CrUX once field data exists.

---

## Images

| Check | Result |
|---|---|
| Alt text on battle image | ✅ `alt="Historical artwork depicting the Battle of Battle of Kadesh"` — ⚠️ note typo **"Battle of Battle of"** — template bug |
| Alt text on blog images | ✅ Descriptive, natural |
| Width/height attrs | ✅ Present on `battle-31.webp` (1080×1080) |
| Lazy loading | ✅ `loading="lazy"` on battle image |
| Modern format | ✅ `.webp` used throughout |
| OG image size | ⚠️ 266 KB PNG — compress or switch to WebP/JPG |
| Image count per battle page | 1 (the hero battle image) — fine |

### Alt text bug (High)

Every battle page alt text has the template repetition **"Battle of Battle of X"**:

```html
alt="Historical artwork depicting the Battle of Battle of Kadesh"
```

Fix the template: `alt="Historical artwork depicting the {battle.name}"` where `battle.name` already includes the "Battle of" prefix.

---

## AI Search Readiness (GEO) — Strongest category

| Check | Status |
|---|---|
| `llms.txt` at site root | ✅ **Present and comprehensive** — hub structure, links to every section, clear description |
| `robots.txt` allows AI crawlers | ✅ Not blocking GPTBot, ClaudeBot, PerplexityBot, Google-Extended |
| Pre-rendered content for AI parsers | ✅ Sub-pages fully crawlable by LLM scrapers |
| Speakable schema | ✅ Present |
| Citable factoids | ✅ Each battle page has "Quick Facts" dl + "Did you know" blocks — perfect for LLM snippet extraction |
| Brand consistency | ✅ "BattleGuess" consistent |
| `ai.txt` file | ❌ Does not exist (the 200 response is the soft-404 SPA shell). `ai.txt` is optional — nice to add for AI consent policy. |

This category is genuinely strong. The `llms.txt` file alone puts the site ahead of >99 % of peers. Only caveat: the HTML homepage delivered to non-JS AI crawlers is the 10 KB empty shell.

---

## Hreflang / i18n — Critical failure

The sitemap advertises every URL with three language alternates + `x-default`:

```xml
<url>
  <loc>https://battleguess.app/faq</loc>
  <xhtml:link rel="alternate" hreflang="en" href="…/faq"/>
  <xhtml:link rel="alternate" hreflang="fr" href="…/fr/faq"/>
  <xhtml:link rel="alternate" hreflang="es" href="…/es/faq"/>
  <xhtml:link rel="alternate" hreflang="x-default" href="…/faq"/>
</url>
```

But when fetched:

| URL | `html lang` | `<title>` | Body content |
|---|---|---|---|
| `/fr/` | `en` | 🟢 BattleGuess — Free Historical Battle … | empty SPA shell |
| `/fr/faq` | `en` | FAQ \| BattleGuess | English FAQ HTML |
| `/fr/battles/31-battle-of-kadesh` | `en` | Battle of Kadesh \| BattleGuess | English battle HTML |

**There is no French or Spanish content anywhere on the site.** Hreflang pointing at non-translated pages is a known penalty pattern — Google will treat all three locales as duplicates and pick one, wasting the crawl budget of the other two. Worse, anyone in France or Spain who lands on `/fr/` expecting French will bounce.

### Options

1. **Remove hreflang + `/fr/` + `/es/` URLs from the sitemap** (fast) until actual translations exist. Add a `301` from `/fr/*` → `/*`.
2. **Actually translate** the ~279 canonical pages (UI, titles, descriptions, body). Then set `<html lang="fr">` and locale-correct Open Graph `og:locale="fr_FR"`.

Option 1 is the Critical fix.

---

## Crawl coverage

From the XML sitemap:

| Section | EN URLs (approx) | Notes |
|---|---|---|
| Homepage | 1 | |
| Core pages (faq, about, modes, collections, battles index, blog index) | ~8 | |
| `/modes/*` | 5 | |
| `/battles/*` | 225+ (with duplicate-ID variants raising it to ~240) | |
| `/blog/topics/*` | 5 | |
| `/blog/*` articles | 20+ | |
| Per locale | × 3 (en/fr/es) | |
| **Total sitemap entries** | **837** | — |

Nothing stands out as missing from the sitemap.

---

## Summary Table

| Priority | Issue | Category | 2026-04-11 status |
|---|---|---|---|
| 🔴 Critical | Soft 404 on every unknown URL | Technical | ✅ fixed (`vercel.json` + `NotFound.tsx` + `public/404.html`) |
| 🔴 Critical | Homepage(s) not pre-rendered → LCP risk + no indexable content | Performance / Content | ✅ fixed (removed `/` skip in `prerender.mjs`) |
| 🔴 Critical | Hreflang i18n broken: /fr/ and /es/ serve English | On-Page / Content | ⚠️ short-term fix applied: sitemap EN-only, hreflang dropped, `<html lang>` + `og:locale` synced at runtime. Full body translation deferred. |
| 🔴 Critical | Deprecated `HowTo` schema site-wide | Schema | ✅ removed from `index.html` |
| 🟠 High | Hashed asset `Cache-Control: max-age=0` | Performance | ✅ `immutable` for `/assets/*` and `/fonts/*` |
| 🟠 High | `FAQPage` + `WebApplication` schema on every page | Schema | ✅ removed from `index.html`; now injected per-route in `App.tsx` / `FAQ.tsx` |
| 🟠 High | Battle image alt text typo ("Battle of Battle of …") | Images | ✅ fixed at `BattleDetail.tsx:209` |
| 🟠 High | Homepage title leading emoji `🟢` | On-Page | ✅ removed |
| 🟠 High | Duplicate battle IDs in sitemap (31 & 226, 32 & 227 …) | Technical | ⚠️ sitemap dedupes by name; runtime variants canonicalize to lowest-ID via new helper. Data rows retained for gameplay variety. |
| 🟠 High | Meta descriptions on battle pages too long (~480 chars) | On-Page | ✅ auto-truncated via new `truncateMetaDescription()` |
| 🟠 High | OG image 266 KB PNG | Images | ✅ re-encoded to 98 KB JPG + 77 KB WebP; meta tags updated |
| 🟡 Medium | Thin content (~120 words) on battle detail pages | Content | 🔲 deferred (content authoring) |
| 🟡 Medium | Generic `keywords` meta on every page | On-Page | ✅ removed |
| 🟡 Medium | Duplicate `<h1>` caused by noscript block inside DOM | On-Page | ✅ noscript heading is now a `<div role="heading" aria-level="1">` |
| 🟡 Medium | Missing `X-Content-Type-Options`, `CSP`, `Referrer-Policy` | Technical | ⚠️ `nosniff`, `Referrer-Policy`, `Permissions-Policy` added. CSP deferred pending inline-script inventory. |
| 🟢 Low | JS bundle 947 KB — consider route-level code splitting | Performance | ⚠️ content pages already lazy-loaded; game bundle not split |
| 🟢 Low | No author bio page for E-E-A-T | Content | 🔲 deferred (content authoring) |
| 🟢 Low | No `ai.txt` (optional) | GEO | 🔲 backlog |

See `ACTION-PLAN.md` for prioritized sequencing, effort estimates, and the
full per-item fix summary.
