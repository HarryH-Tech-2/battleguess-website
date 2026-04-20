// Regenerate battle images via Replicate Flux 2 Pro.
//
// Modes:
//   node scripts/regenerate-battle-images.mjs             dry-run (default, no API calls, no cost)
//   node scripts/regenerate-battle-images.mjs --test      regenerate 5 test battles -> _staging/
//   node scripts/regenerate-battle-images.mjs --all       regenerate all battles     -> _staging/
//   node scripts/regenerate-battle-images.mjs --promote   backup + move _staging/ into public/battles/
//
// Requires REPLICATE_API_TOKEN in .env.local (or .env).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BATTLES_DIR = path.join(ROOT, 'public', 'battles');
const STAGING_DIR = path.join(BATTLES_DIR, '_staging');
const MODEL = 'black-forest-labs/flux-2-pro';
const COST_CAP_USD = 30;
const PRICE_PER_IMAGE = 0.06; // 1 megapixel, Flux 2 Pro estimate
const CONCURRENCY = 3;
const RETRIES = 2;

const TEST_NAMES = ['Thermopylae', 'Hastings', 'Sekigahara', 'Waterloo', 'Stalingrad'];

// --- env loading ------------------------------------------------------------

function loadEnv(filename) {
  const p = path.join(ROOT, filename);
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    if (process.env[key]) continue;
    process.env[key] = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
  }
}
loadEnv('.env.local');
loadEnv('.env');

// --- battle parsing ---------------------------------------------------------

function parseAllBattles() {
  const dir = path.join(ROOT, 'src', 'data', 'battles');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
  const battles = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    const re = /id:\s*(\d+),[\s\S]*?name:\s*"([^"]+)"[\s\S]*?year:\s*(-?\d+)/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      battles.push({ id: +m[1], name: m[2], year: +m[3] });
    }
  }
  battles.sort((a, b) => a.id - b.id);
  return battles;
}

const formatYear = y => (y < 0 ? `${Math.abs(y)} BCE` : `${y}`);

const buildPrompt = b =>
  `Present a clear miniature 3D cartoon scene of ${b.name}, featuring its most ` +
  `iconic landmarks and architectural elements. Use soft, refined textures with ` +
  `realistic PBR materials and gentle, lifelike lighting and shadows and elements ` +
  `of war. Create an immersive atmospheric mood. Use a clean, minimalistic composition.`;

// --- replicate --------------------------------------------------------------

async function replicatePredict(prompt, token) {
  const res = await fetch(`https://api.replicate.com/v1/models/${MODEL}/predictions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'wait=60',
    },
    body: JSON.stringify({
      input: {
        prompt,
        aspect_ratio: '1:1',
        megapixels: '1',
        output_format: 'webp',
        output_quality: 90,
        safety_tolerance: 5,
      },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Replicate ${res.status}: ${text.slice(0, 300)}`);
  }
  let data = await res.json();
  // Poll if not done yet
  const deadline = Date.now() + 180_000;
  while (data.status !== 'succeeded' && data.status !== 'failed' && data.status !== 'canceled') {
    if (Date.now() > deadline) throw new Error('Prediction timed out');
    await new Promise(r => setTimeout(r, 2000));
    const poll = await fetch(data.urls.get, { headers: { Authorization: `Bearer ${token}` } });
    data = await poll.json();
  }
  if (data.status !== 'succeeded') {
    throw new Error(`Prediction ${data.status}: ${data.error || 'unknown error'}`);
  }
  return Array.isArray(data.output) ? data.output[0] : data.output;
}

async function download(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download ${res.status}`);
  fs.writeFileSync(destPath, Buffer.from(await res.arrayBuffer()));
}

async function withRetry(fn) {
  let lastErr;
  for (let i = 0; i <= RETRIES; i++) {
    try { return await fn(); }
    catch (e) {
      lastErr = e;
      if (i < RETRIES) await new Promise(r => setTimeout(r, (i + 1) * 3000));
    }
  }
  throw lastErr;
}

async function pool(items, n, worker) {
  const results = new Array(items.length);
  let idx = 0;
  const lanes = Array(n).fill(0).map(async () => {
    while (true) {
      const i = idx++;
      if (i >= items.length) return;
      try { results[i] = { ok: true, item: items[i], result: await worker(items[i]) }; }
      catch (e) { results[i] = { ok: false, item: items[i], error: e.message }; }
    }
  });
  await Promise.all(lanes);
  return results;
}

// --- modes ------------------------------------------------------------------

function pickTestBattles(all) {
  const picked = [];
  for (const name of TEST_NAMES) {
    const b = all.find(x => x.name.toLowerCase().includes(name.toLowerCase()));
    if (b) picked.push(b);
    else console.warn(`  warn: no battle matched "${name}"`);
  }
  return picked;
}

async function runGenerate(mode) {
  const token = process.env.REPLICATE_API_TOKEN;
  const all = parseAllBattles();
  const battles = mode === 'test' ? pickTestBattles(all) : all;

  if (mode === 'dry') {
    console.log(`\nDRY RUN — no API calls, no cost.\n`);
    console.log(`Parsed ${all.length} battles from src/data/battles/*.ts`);
    console.log(`Would generate: ${battles.length} images`);
    console.log(`Est. cost: $${(battles.length * PRICE_PER_IMAGE).toFixed(2)} (@ $${PRICE_PER_IMAGE}/img)`);
    console.log(`\nSample prompts:\n`);
    for (const b of battles.slice(0, 3)) {
      console.log(`  [${b.id}] ${b.name}`);
      console.log(`  ${buildPrompt(b)}\n`);
    }
    console.log(`Run with --test for a live 5-image test, or --all for the full batch.`);
    return;
  }

  if (!token) {
    console.error('ERROR: REPLICATE_API_TOKEN not set in .env.local');
    process.exit(1);
  }

  const est = battles.length * PRICE_PER_IMAGE;
  if (est > COST_CAP_USD) {
    console.error(`ERROR: estimated cost $${est.toFixed(2)} exceeds cap $${COST_CAP_USD}`);
    process.exit(1);
  }

  fs.mkdirSync(STAGING_DIR, { recursive: true });
  console.log(`\nMode: ${mode}`);
  console.log(`Battles: ${battles.length}   Est. cost: $${est.toFixed(2)}   Staging: ${STAGING_DIR}\n`);

  // Resume: skip battles whose staging file already exists
  const todo = battles.filter(b => !fs.existsSync(path.join(STAGING_DIR, `battle-${b.id}.webp`)));
  const skipped = battles.length - todo.length;
  if (skipped) console.log(`Skipping ${skipped} already in staging.\n`);

  let done = 0, failed = 0;
  const results = await pool(todo, CONCURRENCY, async (b) => {
    const url = await withRetry(() => replicatePredict(buildPrompt(b), token));
    await withRetry(() => download(url, path.join(STAGING_DIR, `battle-${b.id}.webp`)));
    done++;
    console.log(`  [${done}/${todo.length}] battle-${b.id}.webp  (${b.name})`);
    return url;
  });

  for (const r of results) {
    if (!r.ok) {
      failed++;
      console.error(`  FAIL battle-${r.item.id} (${r.item.name}): ${r.error}`);
    }
  }

  console.log(`\nDone. Success: ${done}   Failed: ${failed}   Staging: ${STAGING_DIR}`);
  if (failed === 0) {
    console.log(`Next: review images in _staging/, then run:`);
    console.log(`  node scripts/regenerate-battle-images.mjs --promote`);
  } else {
    console.log(`Re-run the same command to retry failed battles (resumable).`);
  }
}

async function runPromote() {
  if (!fs.existsSync(STAGING_DIR)) {
    console.error(`ERROR: no staging directory at ${STAGING_DIR}`);
    process.exit(1);
  }
  const staged = fs.readdirSync(STAGING_DIR).filter(f => /^battle-\d+\.webp$/.test(f));
  if (staged.length === 0) {
    console.error(`ERROR: staging dir is empty`);
    process.exit(1);
  }
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const backup = path.join(BATTLES_DIR, `_backup-${stamp}`);
  fs.mkdirSync(backup, { recursive: true });

  let backedUp = 0, moved = 0;
  for (const fname of staged) {
    const live = path.join(BATTLES_DIR, fname);
    if (fs.existsSync(live)) {
      fs.copyFileSync(live, path.join(backup, fname));
      backedUp++;
    }
    fs.renameSync(path.join(STAGING_DIR, fname), live);
    moved++;
  }
  console.log(`Backed up ${backedUp} originals to ${backup}`);
  console.log(`Moved ${moved} new images into ${BATTLES_DIR}`);
  console.log(`Staging dir left in place (now empty of staged files); safe to delete.`);
}

// --- entry ------------------------------------------------------------------

const args = process.argv.slice(2);
const mode = args.includes('--all') ? 'all'
           : args.includes('--test') ? 'test'
           : 'dry';
const promote = args.includes('--promote');

try {
  if (promote) await runPromote();
  else await runGenerate(mode);
} catch (e) {
  console.error(`\nFATAL: ${e.message}`);
  process.exit(1);
}
