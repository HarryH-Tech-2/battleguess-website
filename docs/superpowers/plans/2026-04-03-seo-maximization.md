# SEO & AEO Maximization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Maximize organic search traffic and technical crawlability for BattleGuess without degrading UX.

**Architecture:** 7 independent workstreams modifying the React SPA's build pipeline, meta tag management, structured data, and content pages. All changes are additive — no existing functionality is modified or removed. Prerendering becomes the default build to ensure crawlers see fully rendered HTML.

**Tech Stack:** React 19, Vite 7, TypeScript, Tailwind CSS, Puppeteer (prerendering), Firebase (lazy-loaded)

---

## File Map

### Modified Files
- `package.json` — Swap build scripts so prerender is default
- `scripts/generate-sitemap.mjs` — Add real lastmod dates, blog post date lookup
- `scripts/prerender.mjs` — Add post-build validation step
- `src/App.tsx` — Add SEOHead and H1 to homepage
- `src/components/layout/SEOHead.tsx` — Add robots meta tag support
- `src/components/layout/ContentLayout.tsx` — Add breadcrumb JSON-LD generation
- `src/components/game/BattleImage.tsx` — Add width/height attributes to img tags
- `src/pages/BattleDetail.tsx` — Add quick facts, related battles, HistoricalEvent schema, breadcrumbs, speakable
- `src/pages/BlogPost.tsx` — Add breadcrumbs, enriched Article schema
- `src/pages/BattleEncyclopedia.tsx` — Add ItemList schema
- `src/services/firebase.ts` — Convert to lazy dynamic imports
- `src/components/layout/Footer.tsx` — Add Blog link to Explore column
- `index.html` — Add noscript fallback
- `vite.config.ts` — Add blogPosts to manual chunks for code-splitting

### New Files
- `scripts/validate-prerender.mjs` — Post-build validation of prerendered HTML
- `src/utils/breadcrumbs.ts` — Breadcrumb JSON-LD generator utility

---

## Task 1: Make Prerendering the Default Build

**Files:**
- Modify: `package.json:6-11`

- [ ] **Step 1: Update build scripts in package.json**

In `package.json`, swap the `build` and `build:prerender` scripts so prerendering is the default:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && node scripts/generate-sitemap.mjs && vite build && node scripts/prerender.mjs",
  "build:quick": "tsc -b && node scripts/generate-sitemap.mjs && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
},
```

- [ ] **Step 2: Verify the change is correct**

Run: `node -e "const pkg = require('./package.json'); console.log(pkg.scripts.build)"`

Expected output includes `prerender.mjs` at the end.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "feat(seo): make prerendering the default build command"
```

---

## Task 2: Add Noscript Fallback to index.html

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add noscript tag before the closing body tag**

In `index.html`, find the `<div id="root"></div>` line and add a noscript block after it:

```html
    <div id="root"></div>
    <noscript>
      <div style="max-width:800px;margin:0 auto;padding:2rem;font-family:system-ui,sans-serif">
        <h1>BattleGuess - The History Battle Guessing Game</h1>
        <p>Test your knowledge of military history by identifying famous battles from historical artwork. Featuring over 200 battles across 8 eras, from Ancient Egypt to the World Wars.</p>
        <nav>
          <ul>
            <li><a href="/battles">Battle Encyclopedia</a></li>
            <li><a href="/blog">History Blog</a></li>
            <li><a href="/collections">Battle Collections</a></li>
            <li><a href="/modes">Game Modes</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
      </div>
    </noscript>
    <script type="module" src="/src/main.tsx"></script>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat(seo): add noscript fallback with site description and nav links"
```

---

## Task 3: Add Post-Build Prerender Validation Script

**Files:**
- Create: `scripts/validate-prerender.mjs`
- Modify: `package.json:8` (add validation to build command)

- [ ] **Step 1: Create the validation script**

```javascript
// scripts/validate-prerender.mjs
// Validates that prerendered pages contain expected content

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');

const checks = [
  {
    path: 'battles/1-battle-of-thermopylae/index.html',
    mustContain: ['<title>', 'Thermopylae', '<main'],
  },
  {
    path: 'blog/10-most-decisive-battles-in-history/index.html',
    mustContain: ['<title>', 'Decisive Battles', '<main'],
  },
  {
    path: 'faq/index.html',
    mustContain: ['<title>', 'FAQ', '<main'],
  },
];

let failures = 0;

for (const check of checks) {
  const filePath = resolve(distDir, check.path);
  if (!existsSync(filePath)) {
    console.error(`FAIL: ${check.path} does not exist`);
    failures++;
    continue;
  }

  const html = readFileSync(filePath, 'utf-8');

  for (const needle of check.mustContain) {
    if (!html.includes(needle)) {
      console.error(`FAIL: ${check.path} missing expected content: "${needle}"`);
      failures++;
    }
  }

  // Check that the page has more than just the SPA shell
  if (html.length < 5000) {
    console.error(`FAIL: ${check.path} is suspiciously small (${html.length} bytes) — likely not rendered`);
    failures++;
  }

  if (failures === 0) {
    console.log(`PASS: ${check.path}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} validation failure(s). Prerendered output may be broken.`);
  process.exit(1);
} else {
  console.log('\nAll prerender validations passed.');
}
```

- [ ] **Step 2: Add validation to the build command**

Update `package.json` build script to include validation:

```json
"build": "tsc -b && node scripts/generate-sitemap.mjs && vite build && node scripts/prerender.mjs && node scripts/validate-prerender.mjs",
```

- [ ] **Step 3: Commit**

```bash
git add scripts/validate-prerender.mjs package.json
git commit -m "feat(seo): add post-build validation for prerendered HTML"
```

---

## Task 4: Add SEOHead and H1 to Homepage

**Files:**
- Modify: `src/App.tsx:1-3` (imports) and `src/App.tsx:303-314` (Layout usage)

- [ ] **Step 1: Add SEOHead import to App.tsx**

At line 3 of `src/App.tsx`, add the SEOHead import alongside the existing Layout import:

```typescript
import { Layout } from './components/layout/Layout';
import { SEOHead } from './components/layout/SEOHead';
```

- [ ] **Step 2: Add SEOHead component and H1 inside the Layout return**

In `src/App.tsx`, find the `<Layout` opening tag (around line 304) and add SEOHead right after the opening `<Layout ...>` tag, and an H1 + description before the game content:

```tsx
    <Layout
      buyMeACoffeeUrl={BUY_ME_A_COFFEE_URL}
      dailyStreak={dailyStreak}
      onOpenStats={() => setShowStatsPanel(true)}
      onOpenAchievements={() => setShowAchievements(true)}
      achievementCount={{ unlocked: achievementsSystem.unlockedCount, total: achievementsSystem.totalAchievements }}
      onOpenLeaderboard={() => setShowLeaderboard(true)}
      onOpenNameInput={() => setShowNameInput(true)}
      playerName={getPlayerName()}
    >
      <SEOHead
        title="BattleGuess - The History Battle Guessing Game"
        description="Test your knowledge of military history by identifying famous battles from artwork. Over 200 battles across 8 historical eras."
        canonical="https://battleguess.app"
        path="/"
      />
      <h1 className="sr-only">BattleGuess - The History Battle Guessing Game</h1>
      <div className="space-y-4 sm:space-y-6 pb-6 sm:pb-8">
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat(seo): add SEOHead and crawlable H1 to homepage"
```

---

## Task 5: Add Robots Meta Tag Support to SEOHead

**Files:**
- Modify: `src/components/layout/SEOHead.tsx:4-11` (props) and `src/components/layout/SEOHead.tsx:26-41` (useEffect body)

- [ ] **Step 1: Add robots prop to SEOHeadProps interface**

```typescript
interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  path?: string;
  jsonLd?: object;
  ogImage?: string;
  robots?: string;
}
```

- [ ] **Step 2: Update the component signature and useEffect**

Update the component to destructure and apply the robots prop:

```typescript
export function SEOHead({ title, description, canonical, path, jsonLd, ogImage, robots = 'index, follow' }: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    setMetaTag('description', description);
    setMetaTag('robots', robots);
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:url', canonical, true);
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:url', canonical);
```

Note: add `robots` to the useEffect dependency array at the end of the file (line 89):

```typescript
  }, [title, description, canonical, path, jsonLd, ogImage, robots]);
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/SEOHead.tsx
git commit -m "feat(seo): add robots meta tag support to SEOHead component"
```

---

## Task 6: Create Breadcrumb JSON-LD Utility

**Files:**
- Create: `src/utils/breadcrumbs.ts`

- [ ] **Step 1: Create the breadcrumb utility**

```typescript
// src/utils/breadcrumbs.ts

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/breadcrumbs.ts
git commit -m "feat(seo): add breadcrumb JSON-LD utility"
```

---

## Task 7: Add Breadcrumbs and Enriched Schema to BattleDetail

**Files:**
- Modify: `src/pages/BattleDetail.tsx:1-17` (imports), `src/pages/BattleDetail.tsx:70-80` (jsonLd), `src/pages/BattleDetail.tsx:82-89` (ContentLayout)

- [ ] **Step 1: Add breadcrumb import**

Add to the imports at the top of `src/pages/BattleDetail.tsx`:

```typescript
import { buildBreadcrumbJsonLd } from '../utils/breadcrumbs';
```

- [ ] **Step 2: Replace the jsonLd block with enriched schema**

Replace the existing `jsonLd` constant (lines 70-80) with a combined schema array including HistoricalEvent, breadcrumbs, and speakable:

```typescript
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', url: 'https://battleguess.app' },
    { name: 'Battle Encyclopedia', url: 'https://battleguess.app/battles' },
    { name: battle.name, url: `https://battleguess.app/battles/${battleId}` },
  ]);

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: battle.name,
    description: battle.description,
    author: { '@type': 'Organization', name: 'BattleGuess' },
    publisher: { '@type': 'Organization', name: 'BattleGuess', url: 'https://battleguess.app' },
    ...(imageUrl && { image: `https://battleguess.app${imageUrl}` }),
  };

  const historicalEvent = {
    '@context': 'https://schema.org',
    '@type': 'HistoricalEvent',
    name: battle.name,
    description: battle.description,
    startDate: battle.year < 0 ? `${String(Math.abs(battle.year)).padStart(4, '0')}-01-01` : `${String(battle.year).padStart(4, '0')}-01-01`,
    location: {
      '@type': 'Place',
      name: battle.location,
    },
  };

  const speakable = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.battle-quick-facts', '.battle-description'],
    },
  };

  const jsonLd = [breadcrumbs, article, historicalEvent, speakable];
```

- [ ] **Step 3: Add quick facts section after the battle header**

After the battle header `</motion.div>` (line 132) and before the battle image section, add:

```tsx
      {/* Quick Facts */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="mb-8 battle-quick-facts"
      >
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-700 mb-3">{t('pages.battles.quickFacts', 'Quick Facts')}</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <dt className="text-slate-500 font-medium">{t('pages.battles.year', 'Year')}</dt>
            <dd className="text-slate-800 font-semibold">{formatYear(battle.year)}</dd>
            <dt className="text-slate-500 font-medium">{t('pages.battles.location', 'Location')}</dt>
            <dd className="text-slate-800">{battle.location}</dd>
            <dt className="text-slate-500 font-medium">{t('pages.battles.era', 'Era')}</dt>
            <dd className="text-slate-800">{getEraIcon(battle.civilization)} {getEraDisplayName(battle.civilization)}</dd>
            <dt className="text-slate-500 font-medium">{t('pages.battles.difficulty', 'Difficulty')}</dt>
            <dd className="text-slate-800 capitalize">{battle.difficulty}</dd>
          </dl>
        </div>
      </motion.div>
```

- [ ] **Step 4: Add a CSS class to the description for speakable targeting**

Find the description div (line 160) and add the class `battle-description`:

```tsx
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 battle-description">
```

- [ ] **Step 5: Add related battles section**

Before the CTA section (line 242), add a related battles section. Import `allBattles` at the top:

```typescript
import { getBattleById, allBattles } from '../data/battles';
```

Add the related battles computation after `featuredCollections`:

```typescript
  const relatedBattles = useMemo(
    () => allBattles
      .filter(b => b.id !== battle.id && b.civilization === battle.civilization)
      .slice(0, 4),
    [battle.id, battle.civilization]
  );
```

Add the JSX before the CTA section:

```tsx
      {/* Related Battles */}
      {relatedBattles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.39 }}
          className="mb-10"
        >
          <h2 className="text-lg font-bold text-slate-700 mb-3">{t('pages.battles.relatedBattles', 'Related Battles')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedBattles.map(b => (
              <LocaleLink
                key={b.id}
                to={`/battles/${getBattleSlug(b)}`}
                className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all duration-200 group"
              >
                <span className="text-2xl flex-shrink-0">{getEraIcon(b.civilization)}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 group-hover:text-primary-700 transition-colors text-sm truncate">
                    {b.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatYear(b.year)} &middot; {b.location}
                  </p>
                </div>
              </LocaleLink>
            ))}
          </div>
        </motion.div>
      )}
```

Also import `getBattleSlug` — it's already imported in the file via `battleHelpers`.

- [ ] **Step 6: Update ContentLayout jsonLd prop**

The `ContentLayout` component currently accepts `jsonLd?: object`. Update `ContentLayout.tsx` and `SEOHead.tsx` to support arrays:

In `src/components/layout/SEOHead.tsx`, update the jsonLd handling (lines 74-83):

```typescript
    // JSON-LD
    document.querySelectorAll('.seo-jsonld').forEach(el => el.remove());
    if (jsonLd) {
      const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      items.forEach((item, index) => {
        const script = document.createElement('script');
        script.className = 'seo-jsonld';
        script.id = `seo-jsonld-${index}`;
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(item);
        document.head.appendChild(script);
      });
    }

    return () => {
      document.querySelectorAll('.seo-jsonld').forEach(el => el.remove());
    };
```

Also update the prop type in `SEOHeadProps`:

```typescript
  jsonLd?: object | object[];
```

And in `ContentLayoutProps`:

```typescript
  jsonLd?: object | object[];
```

- [ ] **Step 7: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 8: Commit**

```bash
git add src/pages/BattleDetail.tsx src/utils/breadcrumbs.ts src/components/layout/SEOHead.tsx src/components/layout/ContentLayout.tsx
git commit -m "feat(seo): add breadcrumbs, quick facts, related battles, and enriched schema to battle detail"
```

---

## Task 8: Add Breadcrumbs and Enriched Schema to BlogPost

**Files:**
- Modify: `src/pages/BlogPost.tsx:1-10` (imports), `src/pages/BlogPost.tsx:130-146` (jsonLd)

- [ ] **Step 1: Add breadcrumb import**

Add to the imports:

```typescript
import { buildBreadcrumbJsonLd } from '../utils/breadcrumbs';
```

- [ ] **Step 2: Replace jsonLd with combined schema**

Replace the `jsonLd` constant (lines 130-146) with:

```typescript
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', url: 'https://battleguess.app' },
    { name: 'Blog', url: 'https://battleguess.app/blog' },
    ...(category ? [{ name: category.title, url: `https://battleguess.app/blog/topics/${post.category}` }] : []),
    { name: post.title, url: `https://battleguess.app/blog/${post.slug}` },
  ]);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    ...(post.image && { image: `https://battleguess.app${post.image}` }),
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BattleGuess',
      url: 'https://battleguess.app',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://battleguess.app/blog/${post.slug}`,
    },
  };

  const jsonLd = [breadcrumbs, articleSchema];
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/BlogPost.tsx
git commit -m "feat(seo): add breadcrumbs and enriched BlogPosting schema to blog posts"
```

---

## Task 9: Add ItemList Schema to BattleEncyclopedia

**Files:**
- Modify: `src/pages/BattleEncyclopedia.tsx:1-16` (imports), `src/pages/BattleEncyclopedia.tsx:48-54` (ContentLayout)

- [ ] **Step 1: Add imports**

```typescript
import { buildBreadcrumbJsonLd } from '../utils/breadcrumbs';
```

- [ ] **Step 2: Add schema computation inside the component**

After the `eraOrder` line (line 46) and before the `return`:

```typescript
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', url: 'https://battleguess.app' },
    { name: 'Battle Encyclopedia', url: 'https://battleguess.app/battles' },
  ]);

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Historical Battles Encyclopedia',
    description: `Explore over ${allBattles.length} historical battles across 8 eras.`,
    numberOfItems: allBattles.length,
    itemListElement: allBattles.slice(0, 50).map((battle, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: battle.name,
      url: `https://battleguess.app/battles/${getBattleSlug(battle)}`,
    })),
  };

  const jsonLd = [breadcrumbs, itemList];
```

- [ ] **Step 3: Pass jsonLd to ContentLayout**

Update the ContentLayout props:

```tsx
    <ContentLayout
      title="Battle Encyclopedia | BattleGuess"
      description="Explore over 200 historical battles across 8 eras in the BattleGuess encyclopedia. Learn about battles from ancient Egypt to the World Wars."
      canonical="https://battleguess.app/battles"
      path="/battles"
      jsonLd={jsonLd}
    >
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/BattleEncyclopedia.tsx
git commit -m "feat(seo): add breadcrumbs and ItemList schema to battle encyclopedia"
```

---

## Task 10: Add Image Dimensions to BattleImage Component

**Files:**
- Modify: `src/components/game/BattleImage.tsx:48-59` (img tags)

- [ ] **Step 1: Add width and height to all img elements**

In `src/components/game/BattleImage.tsx`, update the main battle image (motion.img around line 48):

```tsx
              <motion.img
                  key="image"
                  src={imageUrl}
                  alt={battleName ? `Battle scene of ${battleName}` : 'Historical battle scene'}
                  className="w-full h-full object-contain bg-gray-900"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={1080}
                  height={1080}
                />
```

Update the placeholder image (motion.img around line 62):

```tsx
                <motion.img
                  key="placeholder"
                  src="/welcome-placeholder.webp"
                  alt="BattleGuess - Can you name the battle?"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={1080}
                  height={1080}
                />
```

- [ ] **Step 2: Add dimensions to BattleDetail page image**

In `src/pages/BattleDetail.tsx`, find the battle image `<img>` tag (line 143-147):

```tsx
            <img
              src={imageUrl}
              alt={`Historical artwork depicting the Battle of ${battle.name}`}
              loading="lazy"
              className="w-full h-auto object-cover"
              width={1080}
              height={1080}
            />
```

- [ ] **Step 3: Add dimensions to BlogPost images**

In `src/pages/BlogPost.tsx`, find the hero image (line 223-225):

```tsx
            <img
              src={post.image}
              alt={post.imageAlt || post.title}
              loading="eager"
              className="w-full h-auto object-cover max-h-64 sm:max-h-80"
              width={800}
              height={450}
            />
```

Find the related post images (line 345-349):

```tsx
                    <img
                      src={related.image}
                      alt={related.imageAlt || related.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      width={400}
                      height={225}
                    />
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/game/BattleImage.tsx src/pages/BattleDetail.tsx src/pages/BlogPost.tsx
git commit -m "feat(seo): add width/height to all img tags for CLS optimization"
```

---

## Task 11: Lazy-Load Firebase

**Files:**
- Modify: `src/services/firebase.ts:1-13` (imports), `src/services/firebase.ts:25-39` (initialization)

- [ ] **Step 1: Convert Firebase imports to dynamic imports**

Replace the top of `src/services/firebase.ts` (lines 1-39) with lazy-loaded versions:

```typescript
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';

// Firebase config - replace with your own from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

function isConfigured(): boolean {
  return !!firebaseConfig.apiKey && !!firebaseConfig.projectId;
}

async function getDb(): Promise<Firestore | null> {
  if (!isConfigured()) return null;
  if (!app) {
    const { initializeApp } = await import('firebase/app');
    const { getFirestore } = await import('firebase/firestore');
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db;
}
```

- [ ] **Step 2: Update all functions that call getDb() to be async-aware**

The functions `submitDailyScore`, `getDailyLeaderboard`, `submitLeaderboardScore`, `getGlobalLeaderboard`, `createChallenge`, `getChallenge`, `submitChallengeAttempt`, and `getChallengeAttempts` are already async and call `getDb()`. Update each call from:

```typescript
const firestore = getDb();
```

to:

```typescript
const firestore = await getDb();
```

Also update each Firestore operation to dynamically import the needed functions. For example, in `submitDailyScore`:

```typescript
export async function submitDailyScore(score: number, correctGuesses: number, totalBattles: number): Promise<boolean> {
  const firestore = await getDb();
  if (!firestore) return false;

  try {
    const { doc, setDoc } = await import('firebase/firestore');
    const dateKey = getDailyDateKey();
    const playerId = getPlayerId();
    await setDoc(doc(firestore, 'daily', dateKey, 'scores', playerId), {
      playerId,
      playerName: getPlayerName(),
      score,
      correctGuesses,
      totalBattles,
      timestamp: Date.now(),
    });
    return true;
  } catch {
    return false;
  }
}
```

Apply the same pattern to all other async Firestore functions — dynamically import `collection`, `doc`, `getDoc`, `getDocs`, `setDoc`, `query`, `orderBy`, `limit` only where needed.

- [ ] **Step 3: Remove the static Firestore imports from the top of the file**

The static imports of `collection`, `doc`, `getDoc`, `getDocs`, `setDoc`, `query`, `orderBy`, `limit` from `firebase/firestore` should be fully removed since they are now dynamically imported.

- [ ] **Step 4: Remove Firebase from Vite manual chunks**

In `vite.config.ts`, remove the firebase entry from manualChunks since it's now dynamically imported and Vite will code-split it automatically:

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'framer-motion': ['framer-motion'],
        },
      },
    },
  },
})
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/services/firebase.ts vite.config.ts
git commit -m "feat(seo): lazy-load Firebase for faster content page loads"
```

---

## Task 12: Code-Split Blog Data

**Files:**
- Modify: `vite.config.ts` (add blogPosts chunk)

- [ ] **Step 1: Add blogPosts to Vite manual chunks**

This ensures blog data is in its own chunk, only loaded on blog routes. In `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'framer-motion': ['framer-motion'],
          'blog-data': ['./src/data/blogPosts'],
        },
      },
    },
  },
})
```

Note: Since blog pages are already lazy-loaded via React.lazy in `AppRouter.tsx`, the blogPosts module will only load when a blog route is visited. The manual chunk ensures it's a separate file rather than being bundled into a shared chunk.

- [ ] **Step 2: Check that BattleDetail.tsx imports blogPosts**

`BattleDetail.tsx` also imports `blogPosts` (line 10) for showing related articles. This means blog data loads on battle pages too. To fix this, make the related articles computation lazy:

In `src/pages/BattleDetail.tsx`, replace the static import:

```typescript
import { blogPosts } from '../data/blogPosts';
```

With a lazy import inside the component using a state + effect pattern:

```typescript
import { useState } from 'react';
import type { BlogPost } from '../data/blogPosts';
```

Then inside the `BattleDetail` component, replace the `relatedArticles` useMemo with:

```typescript
  const [relatedArticles, setRelatedArticles] = useState<BlogPost[]>([]);

  useEffect(() => {
    import('../data/blogPosts').then(({ blogPosts }) => {
      setRelatedArticles(blogPosts.filter(p => p.relatedBattleIds?.includes(battle.id)));
    });
  }, [battle.id]);
```

Note: `useState` needs to be imported — check if it's already in the imports from `react`. Currently line 1 only imports `useMemo`. Update to:

```typescript
import { useMemo, useState, useEffect } from 'react';
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add vite.config.ts src/pages/BattleDetail.tsx
git commit -m "feat(seo): code-split blog data to reduce bundle on non-blog pages"
```

---

## Task 13: Fix Sitemap Lastmod Dates

**Files:**
- Modify: `scripts/generate-sitemap.mjs:14-15` (date handling), `scripts/generate-sitemap.mjs:100-175` (URL generation)

- [ ] **Step 1: Add blog post date lookup**

After the `blogSlugs` array (line 65), add a mapping of blog slugs to their dates by reading the blogPosts source:

```javascript
// Extract blog post dates from source for accurate lastmod
function getBlogPostDates() {
  const content = readFileSync(resolve(rootDir, 'src/data/blogPosts.ts'), 'utf-8');
  const dates = {};
  const slugMatches = [...content.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];
  const dateMatches = [...content.matchAll(/date:\s*['"]([^'"]+)['"]/g)];
  for (let i = 0; i < slugMatches.length && i < dateMatches.length; i++) {
    dates[slugMatches[i][1]] = dateMatches[i][1];
  }
  return dates;
}

const blogPostDates = getBlogPostDates();
```

- [ ] **Step 2: Update URL generation to use real dates**

Replace the `TODAY` constant usage. Change the `urls` array to include a `lastmod` field:

```javascript
const BUILD_DATE = new Date().toISOString().split('T')[0];

const urls = [
  { loc: '/', priority: '1.0', changefreq: 'weekly', lastmod: BUILD_DATE },
  { loc: '/faq', priority: '0.7', changefreq: 'monthly', lastmod: '2026-01-15' },
  { loc: '/about', priority: '0.7', changefreq: 'monthly', lastmod: '2026-01-15' },
  { loc: '/modes', priority: '0.8', changefreq: 'monthly', lastmod: '2026-01-15' },
  ...modeSlugs.map(slug => ({
    loc: `/modes/${slug}`,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2026-01-15',
  })),
  { loc: '/battles', priority: '0.8', changefreq: 'weekly', lastmod: BUILD_DATE },
  ...battleSlugs.map(slug => ({
    loc: `/battles/${slug}`,
    priority: '0.5',
    changefreq: 'monthly',
    lastmod: BUILD_DATE,
  })),
  { loc: '/collections', priority: '0.8', changefreq: 'monthly', lastmod: '2026-02-01' },
  ...collectionSlugs.map(slug => ({
    loc: `/collections/${slug}`,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2026-02-01',
  })),
  { loc: '/blog', priority: '0.7', changefreq: 'weekly', lastmod: BUILD_DATE },
  ...blogTopicSlugs.map(slug => ({
    loc: `/blog/topics/${slug}`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: BUILD_DATE,
  })),
  ...blogSlugs.map(slug => ({
    loc: `/blog/${slug}`,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: blogPostDates[slug] || BUILD_DATE,
  })),
];
```

- [ ] **Step 3: Update the XML template to use per-URL lastmod**

In the XML generation section, replace `${TODAY}` with `${u.lastmod}`:

```javascript
${allEntries.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
${u.hreflangs}
  </url>`).join('\n')}
```

Also update the `allEntries` loop to pass through `lastmod`:

```javascript
  for (const url of urls) {
    for (const lang of LANGUAGES) {
      const prefix = lang === 'en' ? '' : `/${lang}`;
      const loc = `${BASE_URL}${prefix}${url.loc}`;
      // ... hreflangs logic stays the same ...
      allEntries.push({ loc, priority: url.priority, changefreq: url.changefreq, lastmod: url.lastmod, hreflangs: hreflangs + '\n' + xDefault });
    }
  }
```

- [ ] **Step 4: Remove the unused TODAY constant**

Delete: `const TODAY = new Date().toISOString().split('T')[0];`

- [ ] **Step 5: Regenerate the sitemap to verify**

Run: `node scripts/generate-sitemap.mjs`

Expected: "Sitemap generated with N URLs" — verify the output file has varied lastmod dates.

- [ ] **Step 6: Commit**

```bash
git add scripts/generate-sitemap.mjs public/sitemap.xml
git commit -m "feat(seo): use real lastmod dates in sitemap instead of today's date"
```

---

## Task 14: Add Noindex to Stats Page

**Files:**
- Find and modify the Stats page component

- [ ] **Step 1: Locate the stats page**

The `/stats` route renders a stats page. Find the component and add `robots="noindex, follow"` to its SEOHead/ContentLayout if it uses one, or add SEOHead with noindex if it doesn't.

If the stats page uses `ContentLayout`, pass the robots prop through. Update `ContentLayout` to accept and forward `robots`:

In `src/components/layout/ContentLayout.tsx`:

```typescript
interface ContentLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  canonical: string;
  path?: string;
  jsonLd?: object | object[];
  robots?: string;
}

export function ContentLayout({ children, title, description, canonical, path, jsonLd, robots }: ContentLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <SEOHead title={title} description={description} canonical={canonical} path={path} jsonLd={jsonLd} robots={robots} />
```

Then in the stats page component, add `robots="noindex, follow"` to the ContentLayout.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/ContentLayout.tsx src/pages/Stats.tsx
git commit -m "feat(seo): add noindex to stats page, pass robots prop through ContentLayout"
```

---

## Task 15: Convert Mascot PNGs to WebP

**Files:**
- Modify: `public/mascot.png` → `public/mascot.webp`
- Modify: `public/mascot-roman.png` → `public/mascot-roman.webp`
- Modify: any component referencing these files

- [ ] **Step 1: Convert images using sharp**

```bash
npx sharp-cli -i public/mascot.png -o public/mascot.webp --quality 85
npx sharp-cli -i public/mascot-roman.png -o public/mascot-roman.webp --quality 85
```

If sharp-cli is not available, use Node directly:

```bash
node -e "const sharp = require('sharp'); sharp('public/mascot.png').webp({quality: 85}).toFile('public/mascot.webp')"
node -e "const sharp = require('sharp'); sharp('public/mascot-roman.png').webp({quality: 85}).toFile('public/mascot-roman.webp')"
```

- [ ] **Step 2: Find and update all references**

Search the codebase for `mascot.png` and `mascot-roman.png` and update to `.webp`:

```bash
grep -r "mascot" src/ --include="*.tsx" --include="*.ts" -l
```

Update each file to reference `.webp` instead of `.png`.

- [ ] **Step 3: Remove old PNG files**

```bash
rm public/mascot.png public/mascot-roman.png
```

- [ ] **Step 4: Verify the app renders correctly**

Run: `npm run dev` and check that mascot images display correctly.

- [ ] **Step 5: Commit**

```bash
git add public/mascot.webp public/mascot-roman.webp src/
git rm public/mascot.png public/mascot-roman.png
git commit -m "feat(seo): convert mascot images from PNG to WebP"
```

---

## Task 16: Add Footer Blog Link to Explore Column

**Files:**
- Modify: `src/components/layout/Footer.tsx:162-195`

- [ ] **Step 1: Add Blog link to the Explore column**

The footer already has a comprehensive nav. Verify that `/blog` is linked — it currently appears under "Read" column (line 185). The footer is already well-structured with links to all major sections. No changes needed here — the footer already covers Blog, Battles, Collections, Modes, topics, About, and FAQ.

Skip this task — footer navigation is already complete.

- [ ] **Step 2: Commit (skip — no changes)**

---

## Task 17: Final Verification

- [ ] **Step 1: Run TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 2: Run the dev server and spot-check pages**

Run: `npm run dev`

Check:
- Homepage: H1 visible in DOM (inspect element), SEOHead sets title
- `/battles/1-battle-of-thermopylae`: Quick facts section visible, related battles section visible, breadcrumb schema in head
- `/blog/10-most-decisive-battles-in-history`: Breadcrumb schema in head, enriched BlogPosting schema
- `/battles`: ItemList schema in head

- [ ] **Step 3: Validate structured data**

Copy the HTML source of a battle detail page and paste into Google's Rich Results Test (search.google.com/test/rich-results) to verify:
- BreadcrumbList validates
- Article validates
- HistoricalEvent validates

- [ ] **Step 4: Run a production build (if possible)**

Run: `npm run build:quick` (use quick build to test without Puppeteer dependency)

Verify:
- Build succeeds with no errors
- Blog data is in a separate chunk (check `dist/assets/` for a `blog-data-*.js` file)
- Firebase is NOT in the main bundle (check chunk names)

- [ ] **Step 5: Final commit with any fixes**

```bash
git add -A
git commit -m "feat(seo): final verification and fixes"
```
