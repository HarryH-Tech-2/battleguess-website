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

// Get all routes to pre-render by parsing the sitemap
function getRoutes() {
  const sitemapPath = resolve(distDir, 'sitemap.xml');
  if (!existsSync(sitemapPath)) {
    console.error('Sitemap not found at', sitemapPath);
    process.exit(1);
  }

  const sitemap = readFileSync(sitemapPath, 'utf-8');
  const routes = [];
  const locMatches = sitemap.matchAll(/<loc>https:\/\/battleguess\.app([^<]*)<\/loc>/g);
  for (const match of locMatches) {
    const path = match[1] || '/';
    routes.push(path);
  }

  console.log(`Found ${routes.length} routes in sitemap to pre-render`);
  return routes;
}

async function prerender() {
  const PORT = 4173;
  const server = await startServer(PORT);

  let browser;
  try {
    const puppeteer = await import('puppeteer-core');
    let executablePath;
    // @sparticuz/chromium ships a Linux-only binary for Vercel/Lambda. On a
    // Windows/macOS dev machine its import succeeds but the extracted path
    // doesn't exist, so the launch fails with ENOENT before the catch below
    // can help. Only try it on Linux; elsewhere use puppeteer's own Chrome.
    if (process.platform === 'linux') {
      try {
        const chromium = await import('@sparticuz/chromium');
        executablePath = await chromium.default.executablePath();
      } catch {
        // fall through to local puppeteer
      }
    }
    if (!executablePath) {
      // Local dev: fall back to regular puppeteer's Chrome
      const localPuppeteer = await import('puppeteer');
      const { executablePath: localPath } = localPuppeteer.default;
      executablePath = localPath();
    }
    browser = await puppeteer.default.launch({
      headless: true,
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const routes = getRoutes();
    console.log(`Pre-rendering ${routes.length} routes...`);

    // Render a single route. Returns true on success.
    async function renderRoute(route, attempt) {
      const page = await browser.newPage();
      try {
        // domcontentloaded + waitForSelector('main') is more reliable than
        // networkidle0 on slow build machines — networkidle0 can time out
        // when long-lived connections (e.g. analytics) keep the network busy
        // even after the page is fully interactive.
        await page.goto(`http://localhost:${PORT}${route}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        });

        // Wait for React to mount and render the main landmark.
        await page.waitForSelector('main', { timeout: 10000 });

        const html = await page.content();

        // Sanity check: pre-rendered HTML should be meaningfully populated.
        // If it's tiny, treat as a failure so the retry logic kicks in
        // rather than writing a broken file that fails validation later.
        if (html.length < 5000) {
          throw new Error(`html too small (${html.length} bytes)`);
        }

        const outDir = resolve(distDir, route.slice(1));
        mkdirSync(outDir, { recursive: true });
        writeFileSync(resolve(outDir, 'index.html'), html, 'utf-8');
        return true;
      } catch (err) {
        const prefix = attempt > 1 ? `  Retry ${attempt} failed for` : `  Failed to render`;
        console.error(`${prefix} ${route}: ${err.message}`);
        return false;
      } finally {
        await page.close();
      }
    }

    // Process in batches of 10 for speed
    const BATCH_SIZE = 10;
    let completed = 0;
    const failedRoutes = [];

    for (let i = 0; i < routes.length; i += BATCH_SIZE) {
      const batch = routes.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (route) => {
        const ok = await renderRoute(route, 1);
        if (ok) {
          completed++;
          if (completed % 20 === 0 || completed === routes.length) {
            console.log(`  ${completed}/${routes.length} pages rendered`);
          }
        } else {
          failedRoutes.push(route);
        }
      }));
    }

    // Retry failed routes serially with a longer budget. A second pass
    // typically rescues transient timeouts caused by build-machine
    // contention during the parallel batches.
    if (failedRoutes.length > 0) {
      console.log(`Retrying ${failedRoutes.length} failed route(s)...`);
      for (const route of failedRoutes) {
        const ok = await renderRoute(route, 2);
        if (ok) completed++;
      }
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
