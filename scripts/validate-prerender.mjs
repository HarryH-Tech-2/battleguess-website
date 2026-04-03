// scripts/validate-prerender.mjs
// Validates that prerendered pages contain expected content

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');

const checks = [
  {
    path: 'battles/2-battle-of-thermopylae/index.html',
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
  let checkFailed = false;

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
      checkFailed = true;
    }
  }

  if (html.length < 5000) {
    console.error(`FAIL: ${check.path} is suspiciously small (${html.length} bytes) — likely not rendered`);
    failures++;
    checkFailed = true;
  }

  if (!checkFailed) {
    console.log(`PASS: ${check.path}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} validation failure(s). Prerendered output may be broken.`);
  process.exit(1);
} else {
  console.log('\nAll prerender validations passed.');
}
