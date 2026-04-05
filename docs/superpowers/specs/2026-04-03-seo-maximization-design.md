# SEO & AEO Maximization Design Spec

**Date:** 2026-04-03
**Goal:** Maximize organic search traffic and technical crawlability for BattleGuess without degrading UX.
**Focus:** Organic traffic growth (ranking higher for history/battle queries) + Technical SEO perfection (full crawlability of 175+ pages across 3 languages).

---

## Current State (Audit Summary)

**Overall SEO Health: 8/10**

### Strengths
- Custom `SEOHead` component dynamically manages meta tags, canonical URLs, hreflang, and JSON-LD per page
- XML sitemap with 150+ URLs and hreflang alternates for en/fr/es
- JSON-LD structured data on homepage: WebApplication, FAQPage, HowTo schemas
- All images use WebP format with alt text
- Route-level code splitting with React.lazy()
- Proper robots.txt pointing to sitemap
- PWA-ready with web manifest and icons

### Gaps
- Prerendering not used in production build — crawlers get empty SPA shells
- Homepage has no `SEOHead`, no `<h1>`, no crawlable body text
- Firebase (257KB) loads on every page including content-only pages
- Images lack `width`/`height` attributes (CLS issues)
- No breadcrumb structured data anywhere
- Sitemap uses today's date as `<lastmod>` for all URLs
- Blog data (98KB) loads on all routes, not just blog pages
- Weak internal cross-linking between content types
- No AEO optimization (quick facts, question headings, expanded FAQ schema)

---

## Workstream 1: Prerendering & Crawlability

**Priority:** Critical
**Problem:** Standard `build` command skips prerendering. Crawlers hitting content pages get an empty SPA shell with no rendered HTML, no meta tags, no content to index.

### Changes

1. **Make prerendering the default build command**
   - Modify `package.json`: rename current `build` to `build:quick` (for dev use), rename `build:prerender` to `build`
   - Production builds always produce prerendered HTML for every sitemap route

2. **Ensure Vercel uses prerendered build**
   - Verify the Vercel build command runs the prerender pipeline
   - Add `vercel.json` if needed to configure the build command

3. **Add noscript fallback to index.html**
   - Insert a `<noscript>` tag with basic site description and navigation links
   - Provides content for crawlers with JS disabled

4. **Add post-build validation script**
   - New script that checks key prerendered routes (homepage, a battle page, a blog post) for expected meta tags and content
   - Fails the build if validation fails, preventing deployment of broken prerendered output

### Impact
Unlocks indexing of all 175+ content pages. Single highest-impact change in this spec.

---

## Workstream 2: Homepage SEO

**Priority:** High
**Problem:** Homepage uses generic `Layout` instead of `ContentLayout`/`SEOHead`. No `<h1>` tag. No crawlable body text. Relies entirely on static `index.html` meta tags.

### Changes

1. **Add a visually hidden H1 tag**
   - `<h1>` with keyword-rich text: "BattleGuess - The History Battle Guessing Game"
   - Use Tailwind `sr-only` class so it's accessible to crawlers and screen readers without disrupting the game UI

2. **Add a crawlable content block**
   - 2-3 sentence paragraph below the game interface describing what BattleGuess is
   - Visible to all users (not hidden) — serves as a brief hero subtitle
   - Provides Google with body text to index

3. **Wire up SEOHead on the homepage**
   - Switch `App.tsx` to use `ContentLayout` or manually add `SEOHead` component
   - Ensures homepage benefits from dynamic meta tag management consistent with other pages

### UX Constraint
The H1 is screen-reader-only. The content block is a brief, tasteful subtitle — not a wall of text. Game interface remains unchanged.

---

## Workstream 3: Core Web Vitals & Page Speed

**Priority:** High
**Problem:** Google uses Core Web Vitals (LCP, CLS, INP) as ranking signals. Firebase (257KB) inflates bundle on content pages. Missing image dimensions cause layout shift.

### Changes

1. **Lazy-load Firebase**
   - Dynamic `import()` for Firebase modules only when needed (leaderboard, stats, daily mode)
   - Removes 257KB from initial bundle on content-only pages (blog, battles, encyclopedia)
   - Content pages load significantly faster

2. **Add width/height to all `<img>` tags**
   - Update `BattleImage.tsx`: add explicit `width` and `height` attributes
   - Update blog image rendering in `Blog.tsx` and `BlogPost.tsx`
   - Update mascot image references
   - Eliminates CLS by allowing browser to reserve space before image loads

3. **Convert mascot PNGs to WebP**
   - Replace `mascot.png` and `mascot-roman.png` with WebP versions
   - ~40% file size reduction
   - Update all references in components

4. **Code-split blogPosts data**
   - Move the 98KB blog content data behind a dynamic `import()`
   - Only loads on `/blog/*` routes
   - Reduces bundle size on all non-blog pages

### Impact
Meaningful improvement in PageSpeed Insights scores. Faster content page loads directly improve Google ranking.

---

## Workstream 4: Structured Data & Rich Snippets

**Priority:** Medium-High
**Problem:** Good JSON-LD on homepage but limited schema on content pages. No breadcrumb schema anywhere — missing SERP breadcrumb trails that improve CTR.

### Changes

1. **Add BreadcrumbList schema to all content pages**
   - Generate breadcrumb JSON-LD dynamically in `ContentLayout`
   - Examples:
     - Battle page: `Home > Battle Encyclopedia > Battle of Thermopylae`
     - Blog post: `Home > Blog > 10 Most Decisive Battles`
     - Collection: `Home > Collections > Naval Battles`
     - Game mode: `Home > Game Modes > Daily Challenge`
   - Enables Google to show clickable breadcrumb trails in search results

2. **Add HistoricalEvent schema to battle detail pages**
   - Properties: `startDate` (year), `location`, `description`, `name`
   - Helps Google understand the content type; potential for knowledge panel surfacing

3. **Enrich blog post Article schema**
   - Add `datePublished`, `dateModified`, `image`, `publisher` fields
   - These fields are commonly used by Google for rich results and news carousels

4. **Add ItemList schema to list pages**
   - Battle encyclopedia (`/battles`): list of all battles
   - Collection detail pages: list of battles in collection
   - Blog topic pages: list of posts in topic
   - Helps Google understand page structure; could enable carousel-style results

### Impact
Richer SERP snippets increase click-through rates. Breadcrumbs especially improve CTR by an estimated 20-30%.

---

## Workstream 5: Internal Linking & Content Discoverability

**Priority:** Medium
**Problem:** Content pages exist but cross-linking is weak. Google follows internal links to discover and weight pages. Weakly-linked pages rank poorly.

### Changes

1. **Battle detail page → related blog posts**
   - If a battle is mentioned in blog posts, show a "Read more about this battle" section at the bottom
   - Data already exists in blog post `relatedBattles` fields — render as links

2. **Blog post → related battle pages**
   - Ensure battle references in blog posts render as clickable links to battle detail pages
   - Not just plain text mentions

3. **Collection pages → individual battles**
   - Verify collection detail pages link directly to each battle's detail page with proper anchor text

4. **Add "Related Battles" section on battle detail pages**
   - Show 3-4 battles from the same era or civilization
   - Helps Google crawl more of the encyclopedia
   - Keeps users exploring (good for engagement metrics)

5. **Add footer navigation**
   - Links to key content sections: Blog, Encyclopedia, Collections, Game Modes
   - Crawlers heavily weight footer links for site structure discovery
   - Also improves user navigation

### UX Constraint
All additions are supplementary content sections placed below primary content. No modals, no interstitials, no changes to existing layouts. Game experience untouched.

---

## Workstream 6: Sitemap & Technical Fixes

**Priority:** Medium
**Problem:** Sitemap uses today's date as `<lastmod>` for every URL. No per-page `<meta name="robots">` directives. Crawl budget may be wasted on thin/duplicate pages.

### Changes

1. **Use real lastmod dates in sitemap**
   - Blog posts: use the `date` field from post data
   - Battle pages: use a static date (content doesn't change frequently) or derive from data updates
   - Dynamic pages (homepage): use build date
   - Gives Google accurate freshness signals for crawl prioritization

2. **Add `<meta name="robots" content="index, follow">` to content pages**
   - Add via `SEOHead` component for consistency
   - Explicitly signals crawlers that content pages should be indexed

3. **Noindex thin/ephemeral pages**
   - If any game-state URLs or user-specific pages exist (e.g., `/stats` with no public data), add `noindex`
   - Prevents thin or duplicate content from diluting the index

4. **Audit sitemap completeness**
   - Verify every indexable route is in the sitemap
   - Verify no non-indexable routes are included
   - Ensure sitemap URL count matches actual content

### Impact
Accurate lastmod dates improve crawl efficiency. Google spends crawl budget on pages that actually changed.

---

## Workstream 7: AEO (Answer Engine Optimization)

**Priority:** Medium
**Problem:** AI search engines (Google AI Overviews, Perplexity, ChatGPT search) extract answers from well-structured, concise content. BattleGuess has great battle data but it's structured for gameplay, not for answering questions.

### Changes

1. **Add "Quick Facts" blocks to battle detail pages**
   - Scannable summary at the top of each battle page: year, location, belligerents, outcome, significance
   - Structured as a definition list or compact table
   - This is the format AI engines extract for featured snippets
   - Also improves UX — users get key info at a glance before reading the full article

2. **Expand FAQ schema beyond the homepage**
   - Add FAQ sections to game mode pages: "How does daily mode work?", "How is scoring calculated?"
   - Add FAQ sections to blog topic pages with topic-specific questions
   - Each FAQ section gets corresponding `FAQPage` JSON-LD

3. **Use question-based H2/H3 headings in blog posts**
   - Where blog content answers common questions, phrase headings as questions
   - Example: "What was the largest naval battle in history?" instead of "Largest Naval Battle"
   - AI engines match user queries directly to heading text

4. **Extend speakable schema to battle detail pages**
   - Homepage already has `SpeakableSpecification`
   - Add it to battle pages targeting the quick facts summary
   - Enables voice assistants to read battle summaries aloud

### UX Constraint
Quick facts blocks are genuinely useful to users — not SEO-only filler. FAQ sections placed below primary content. No changes to game interface.

---

## Hard Constraints

1. **No UX degradation** — All additions are supplementary. Game interface remains untouched. No modals, interstitials, or layout-breaking changes.
2. **No new content creation required** — All changes leverage existing data (battle facts, blog posts, collections). The spec only restructures and exposes data that already exists.
3. **Performance must improve, not degrade** — Firebase lazy-loading and code-splitting must reduce page weight on content pages, not add to it.
4. **Multi-language support maintained** — All changes must work across en/fr/es. Hreflang and locale routing remain intact.

---

## Implementation Order (Recommended)

1. **Workstream 1** (Prerendering) — Foundation. Everything else depends on crawlers seeing rendered HTML.
2. **Workstream 3** (Core Web Vitals) — Page speed improvements compound with all other changes.
3. **Workstream 2** (Homepage SEO) — Quick win, small scope.
4. **Workstream 6** (Sitemap & Technical) — Quick win, improves crawl efficiency.
5. **Workstream 4** (Structured Data) — Rich snippets improve CTR on already-indexed pages.
6. **Workstream 5** (Internal Linking) — Strengthens the link graph across all content.
7. **Workstream 7** (AEO) — Positions for AI search engines, builds on all prior work.

---

## Success Metrics

- **Google Search Console:** Indexed page count increases from current level toward 175+ target
- **PageSpeed Insights:** Content pages score 90+ on mobile
- **Search Console:** Average position improves for target keywords (history game, battle quiz, etc.)
- **Rich Results Test:** Breadcrumb, FAQ, Article, and HistoricalEvent schemas validate successfully
- **CLS Score:** Drops below 0.1 on all pages (currently likely higher due to missing image dimensions)
