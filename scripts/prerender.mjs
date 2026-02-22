// Pre-render content pages to static HTML for SEO crawlers
// Run after vite build: node scripts/prerender.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');

// Static file server for dist/
function startServer(port) {
  return new Promise((resolveP) => {
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.woff2': 'font/woff2',
      '.ico': 'image/x-icon',
      '.webmanifest': 'application/manifest+json',
      '.mp3': 'audio/mpeg',
    };

    const server = createServer((req, res) => {
      let url = req.url.split('?')[0];

      // Try exact file
      let filePath = resolve(distDir, '.' + url);
      if (existsSync(filePath) && !isDirectory(filePath)) {
        const ext = '.' + filePath.split('.').pop();
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(readFileSync(filePath));
        return;
      }

      // SPA fallback
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(readFileSync(resolve(distDir, 'index.html')));
    });

    server.listen(port, () => {
      console.log(`Preview server running on http://localhost:${port}`);
      resolveP(server);
    });
  });
}

function isDirectory(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

// Get all routes to pre-render
function getRoutes() {
  const routes = ['/faq', '/about', '/modes', '/blog'];

  // Mode detail pages
  const modeSlugs = ['daily', 'classic', 'timed', 'reverse-year', 'reverse-location', 'timeline', 'campaign', 'challenge'];
  for (const slug of modeSlugs) {
    routes.push(`/modes/${slug}`);
  }

  // Blog slugs
  const blogSlugs = [
    '10-most-decisive-battles-in-history',
    'how-ancient-warfare-shaped-modern-world',
    'beginners-guide-to-military-history',
    '8-ways-to-improve-your-battleguess-score',
    'evolution-of-siege-warfare',
  ];
  for (const slug of blogSlugs) {
    routes.push(`/blog/${slug}`);
  }

  // Battle pages - read IDs from the sitemap we already generated
  routes.push('/battles');
  const sitemapPath = resolve(distDir, 'sitemap.xml');
  if (existsSync(sitemapPath)) {
    const sitemap = readFileSync(sitemapPath, 'utf-8');
    const battleMatches = sitemap.matchAll(/<loc>https:\/\/battleguess\.app(\/battles\/\d+-[^<]+)<\/loc>/g);
    for (const match of battleMatches) {
      routes.push(match[1]);
    }
  }

  return routes;
}

async function prerender() {
  const PORT = 4173;
  const server = await startServer(PORT);

  let browser;
  try {
    const puppeteer = await import('puppeteer');
    browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const routes = getRoutes();
    console.log(`Pre-rendering ${routes.length} routes...`);

    // Process in batches of 5 for speed
    const BATCH_SIZE = 5;
    let completed = 0;

    for (let i = 0; i < routes.length; i += BATCH_SIZE) {
      const batch = routes.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (route) => {
        const page = await browser.newPage();
        try {
          await page.goto(`http://localhost:${PORT}${route}`, {
            waitUntil: 'networkidle0',
            timeout: 15000,
          });

          // Wait a bit for React to hydrate
          await page.waitForSelector('main', { timeout: 5000 }).catch(() => {});

          const html = await page.content();

          // Write to dist/<route>/index.html
          const outDir = resolve(distDir, route.slice(1)); // remove leading /
          mkdirSync(outDir, { recursive: true });
          writeFileSync(resolve(outDir, 'index.html'), html, 'utf-8');

          completed++;
          if (completed % 20 === 0 || completed === routes.length) {
            console.log(`  ${completed}/${routes.length} pages rendered`);
          }
        } catch (err) {
          console.error(`  Failed to render ${route}: ${err.message}`);
        } finally {
          await page.close();
        }
      }));
    }

    console.log(`Pre-rendering complete! ${completed} pages written to dist/`);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

prerender().catch(err => {
  console.error('Pre-rendering failed:', err);
  process.exit(1);
});
