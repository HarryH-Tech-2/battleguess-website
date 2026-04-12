import sharp from 'sharp';
import { readdir, stat, rename, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const BATTLES_DIR = 'public/battles';
const MAX_WIDTH = 512;
const QUALITY = 75;

async function optimizeImages() {
  const files = await readdir(BATTLES_DIR);
  const webpFiles = files.filter(f => f.endsWith('.webp'));

  let totalBefore = 0;
  let totalAfter = 0;
  let count = 0;

  for (const file of webpFiles) {
    const filePath = join(BATTLES_DIR, file);
    const tempPath = join(BATTLES_DIR, `_tmp_${file}`);
    const before = (await stat(filePath)).size;
    totalBefore += before;

    // Read into memory first to release file handle
    const inputBuffer = await readFile(filePath);
    const buffer = await sharp(inputBuffer)
      .resize(MAX_WIDTH, MAX_WIDTH, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();

    await writeFile(tempPath, buffer);
    await rename(tempPath, filePath);

    totalAfter += buffer.length;
    count++;

    if (count % 50 === 0) {
      console.log(`Processed ${count}/${webpFiles.length}...`);
    }
  }

  console.log(`\nDone! Optimized ${count} images`);
  console.log(`Before: ${(totalBefore / 1024 / 1024).toFixed(1)}MB`);
  console.log(`After:  ${(totalAfter / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Saved:  ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)}MB (${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`);
}

optimizeImages().catch(console.error);
