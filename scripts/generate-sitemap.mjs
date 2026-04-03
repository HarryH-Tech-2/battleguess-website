// Build-time sitemap generator
// Run with: node scripts/generate-sitemap.mjs

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// We can't import TS files directly, so we'll read the data we need
// and generate the sitemap from known structures.

const BASE_URL = 'https://battleguess.app';
const BUILD_DATE = new Date().toISOString().split('T')[0];
const LANGUAGES = ['en', 'fr', 'es'];

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

// Blog topic/pillar page slugs (from blogPosts.ts)
const blogTopicSlugs = [
  'ancient-warfare',
  'wars-and-conflicts',
  'military-strategy',
  'military-technology',
  'game-guides',
];

// Blog post slugs (from blogPosts.ts)
const blogSlugs = [
  '10-most-decisive-battles-in-history',
  'how-ancient-warfare-shaped-modern-world',
  'beginners-guide-to-military-history',
  '8-ways-to-improve-your-battleguess-score',
  'evolution-of-siege-warfare',
  'top-10-naval-battles-that-ruled-the-waves',
  'battles-every-student-should-know',
  'greatest-military-commanders-of-all-time',
  'how-gunpowder-changed-warfare-forever',
  'world-war-ii-turning-points',
  'samurai-battles-feudal-japan',
  'crusades-explained-battles-and-legacy',
  'american-revolution-key-battles',
  'latin-american-wars-of-independence',
  'history-of-cavalry-from-chariots-to-tanks',
  'ottoman-empire-greatest-military-victories',
  'women-in-military-history',
  'how-weather-decided-famous-battles',
  'ancient-rome-vs-ancient-greece-military-comparison',
  'battlefield-tactics-explained-for-beginners',
];

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

  for (const file of battleFiles) {
    const content = readFileSync(resolve(rootDir, file), 'utf-8');
    // Match id and name from battle objects
    const idMatches = [...content.matchAll(/id:\s*(\d+)/g)];
    const nameMatches = [...content.matchAll(/name:\s*['"]([^'"]+)['"]/g)];

    for (let i = 0; i < idMatches.length && i < nameMatches.length; i++) {
      const id = idMatches[i][1];
      const name = nameMatches[i][1];
      const slug = `${id}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}`;
      slugs.push(slug);
    }
  }

  return slugs;
}

function generateSitemap() {
  const battleSlugs = getBattleSlugs();

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
    { loc: '/battles', priority: '0.8', changefreq: 'weekly', lastmod: BUILD_DATE },
    // Individual battle pages
    ...battleSlugs.map(slug => ({
      loc: `/battles/${slug}`,
      priority: '0.5',
      changefreq: 'monthly',
      lastmod: BUILD_DATE,
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
    // Blog
    { loc: '/blog', priority: '0.7', changefreq: 'weekly', lastmod: BUILD_DATE },
    // Blog topic/pillar pages
    ...blogTopicSlugs.map(slug => ({
      loc: `/blog/topics/${slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: BUILD_DATE,
    })),
    // Individual blog posts
    ...blogSlugs.map(slug => ({
      loc: `/blog/${slug}`,
      priority: '0.6',
      changefreq: 'monthly',
      lastmod: blogPostDates[slug] || BUILD_DATE,
    })),
  ];

  // Generate entries for all languages with hreflang alternates
  const allEntries = [];
  for (const url of urls) {
    for (const lang of LANGUAGES) {
      const prefix = lang === 'en' ? '' : `/${lang}`;
      const loc = `${BASE_URL}${prefix}${url.loc}`;
      const hreflangs = LANGUAGES.map(l => {
        const p = l === 'en' ? '' : `/${l}`;
        return `    <xhtml:link rel="alternate" hreflang="${l}" href="${BASE_URL}${p}${url.loc}"/>`;
      }).join('\n');
      // x-default points to English version
      const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${url.loc}"/>`;
      allEntries.push({ loc, priority: url.priority, changefreq: url.changefreq, lastmod: url.lastmod, hreflangs: hreflangs + '\n' + xDefault });
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allEntries.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
${u.hreflangs}
  </url>`).join('\n')}
</urlset>
`;

  writeFileSync(resolve(rootDir, 'public/sitemap.xml'), xml, 'utf-8');
  console.log(`Sitemap generated with ${urls.length} URLs`);
}

generateSitemap();
