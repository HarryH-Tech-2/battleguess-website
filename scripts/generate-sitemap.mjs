// Build-time sitemap generator
// Run with: node scripts/generate-sitemap.mjs

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// We can't import TS files directly, so we'll read the data we need
// and generate the sitemap from known structures.

const BASE_URL = 'https://battleguess.app';
const BUILD_DATE = new Date().toISOString().split('T')[0];

// Fallback used when git history is unavailable (e.g. a shallow CI clone that
// doesn't reach the last commit touching a file). Bump when battle data changes.
const CONTENT_FALLBACK_DATE = '2026-05-12';

// Last commit date (YYYY-MM-DD) that touched a file. Stamping every battle URL
// with the build date on each deploy tells Google "everything changed", which
// it quickly learns to ignore; a real per-file date is a signal it can trust.
function gitLastModified(relPath) {
  try {
    const out = execSync(`git log -1 --format=%cs -- "${relPath}"`, {
      cwd: rootDir,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).toString().trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : CONTENT_FALLBACK_DATE;
  } catch {
    return CONTENT_FALLBACK_DATE;
  }
}

function maxDate(dates) {
  return dates.reduce((a, b) => (a > b ? a : b), '0000-00-00');
}
// Only English is in the sitemap. The /fr/ and /es/ routes still exist at
// runtime (the UI is translated), but the underlying content (battle
// descriptions) is still English. Advertising hreflang alternates
// that point at non-translated pages causes duplicate-content penalties, so
// we emit just the English URLs for now. Re-enable additional languages here
// once real translated body content is in place.
const LANGUAGES = ['en'];

// Game mode slugs (from gameModeData.ts)
const modeSlugs = [
  'daily', 'classic', 'reverse-year', 'campaign', 'challenge'
];

// Collection slugs (from battleCollections.ts)
const collectionSlugs = [
  'naval-battles',
  'siege-warfare',
  'battles-that-changed-history',
  'against-all-odds',
  'ambush-and-surprise',
  'last-stands',
  'empire-builders',
];

// Read battle data to extract IDs and names for slug generation
// We parse the compiled JS or read from source files
function getBattleSlugs() {
  const slugs = [];
  const battleFiles = [
    'src/data/battles/ancientEgyptMesopotamia.ts',
    'src/data/battles/ancientGreeceRome.ts',
    'src/data/battles/medievalEurope.ts',
    'src/data/battles/ottomanIslamic.ts',
    'src/data/battles/eastAsia.ts',
    'src/data/battles/colonialNapoleonic.ts',
    'src/data/battles/americanWars.ts',
    'src/data/battles/worldWars.ts',
    'src/data/battles/southAmerica.ts',
  ];

  // Track names we've already added so duplicate-name battles (gameplay
  // variants that share a canonical battle) are excluded from the sitemap.
  const seenNames = new Set();

  for (const file of battleFiles) {
    const content = readFileSync(resolve(rootDir, file), 'utf-8');
    const lastmod = gitLastModified(file);
    // Match id and name from battle objects
    const idMatches = [...content.matchAll(/id:\s*(\d+)/g)];
    const nameMatches = [...content.matchAll(/name:\s*['"]([^'"]+)['"]/g)];

    for (let i = 0; i < idMatches.length && i < nameMatches.length; i++) {
      const id = idMatches[i][1];
      const name = nameMatches[i][1];
      const nameKey = name.toLowerCase();
      if (seenNames.has(nameKey)) continue; // skip duplicate-name gameplay variants
      seenNames.add(nameKey);
      const slug = `${id}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}`;
      slugs.push({ slug, lastmod });
    }
  }

  return slugs;
}

function generateSitemap() {
  const battleSlugs = getBattleSlugs();
  const battlesLastmod = maxDate(battleSlugs.map(b => b.lastmod));

  const urls = [
    // Home
    { loc: '/', priority: '1.0', changefreq: 'weekly', lastmod: BUILD_DATE },
    // Content pages
    { loc: '/faq', priority: '0.7', changefreq: 'monthly', lastmod: '2026-01-15' },
    { loc: '/about', priority: '0.7', changefreq: 'monthly', lastmod: '2026-01-15' },
    { loc: '/modes', priority: '0.8', changefreq: 'monthly', lastmod: '2026-01-15' },
    // Individual mode pages
    ...modeSlugs.map(slug => ({
      loc: `/modes/${slug}`,
      priority: '0.6',
      changefreq: 'monthly',
      lastmod: '2026-01-15',
    })),
    // Battle encyclopedia
    { loc: '/battles', priority: '0.8', changefreq: 'monthly', lastmod: battlesLastmod },
    // Individual battle pages
    ...battleSlugs.map(({ slug, lastmod }) => ({
      loc: `/battles/${slug}`,
      priority: '0.5',
      changefreq: 'yearly',
      lastmod,
    })),
    // Collections
    { loc: '/collections', priority: '0.8', changefreq: 'monthly', lastmod: '2026-02-01' },
    // Individual collection pages
    ...collectionSlugs.map(slug => ({
      loc: `/collections/${slug}`,
      priority: '0.6',
      changefreq: 'monthly',
      lastmod: '2026-02-01',
    })),
  ];

  // Generate entries for all languages. Only emit hreflang alternates when
  // more than one language is listed — a single-language sitemap doesn't
  // need hreflang and Google treats a lone self-referential alternate as
  // redundant noise.
  const emitHreflangs = LANGUAGES.length > 1;
  const allEntries = [];
  for (const url of urls) {
    for (const lang of LANGUAGES) {
      const prefix = lang === 'en' ? '' : `/${lang}`;
      const loc = `${BASE_URL}${prefix}${url.loc}`;
      let hreflangs = '';
      if (emitHreflangs) {
        const alts = LANGUAGES.map(l => {
          const p = l === 'en' ? '' : `/${l}`;
          return `    <xhtml:link rel="alternate" hreflang="${l}" href="${BASE_URL}${p}${url.loc}"/>`;
        }).join('\n');
        const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${url.loc}"/>`;
        hreflangs = alts + '\n' + xDefault;
      }
      allEntries.push({ loc, priority: url.priority, changefreq: url.changefreq, lastmod: url.lastmod, hreflangs });
    }
  }

  const xmlnsHreflang = emitHreflangs ? '\n        xmlns:xhtml="http://www.w3.org/1999/xhtml"' : '';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${xmlnsHreflang}>
${allEntries.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${u.hreflangs ? '\n' + u.hreflangs : ''}
  </url>`).join('\n')}
</urlset>
`;

  writeFileSync(resolve(rootDir, 'public/sitemap.xml'), xml, 'utf-8');
  console.log(`Sitemap generated with ${urls.length} URLs`);
}

generateSitemap();
