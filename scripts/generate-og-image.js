import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

async function generateOGImage() {
  const inputPath = join(rootDir, 'public', 'welcome-placeholder.webp');
  const outputPath = join(rootDir, 'public', 'og-image.png');

  // Get source image dimensions
  const metadata = await sharp(inputPath).metadata();
  const srcW = metadata.width;
  const srcH = metadata.height;
  console.log(`Source image: ${srcW}x${srcH}`);

  // Calculate crop to get 1200:630 aspect ratio (≈1.905:1) from center-top
  const targetRatio = OG_WIDTH / OG_HEIGHT;
  const srcRatio = srcW / srcH;

  let cropLeft = 0, cropTop = 0, cropW = srcW, cropH = srcH;

  if (srcRatio < targetRatio) {
    // Source is taller — crop height, bias toward top to keep title
    cropW = srcW;
    cropH = Math.round(srcW / targetRatio);
    cropTop = 0; // Keep the top with "BattleGuess" title
  } else {
    // Source is wider — crop width from center
    cropH = srcH;
    cropW = Math.round(srcH * targetRatio);
    cropLeft = Math.round((srcW - cropW) / 2);
  }

  console.log(`Cropping to: ${cropW}x${cropH} at (${cropLeft}, ${cropTop})`);

  // Create a dark gradient overlay for the bottom portion (for better text contrast)
  const gradientSvg = `<svg width="${OG_WIDTH}" height="${OG_HEIGHT}">
    <defs>
      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="black" stop-opacity="0"/>
        <stop offset="60%" stop-color="black" stop-opacity="0"/>
        <stop offset="100%" stop-color="black" stop-opacity="0.7"/>
      </linearGradient>
    </defs>
    <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#grad)"/>
  </svg>`;

  // Create bottom bar with tagline text
  const textSvg = `<svg width="${OG_WIDTH}" height="${OG_HEIGHT}">
    <style>
      .tagline { fill: white; font-size: 32px; font-family: 'Arial', 'Helvetica', sans-serif; font-weight: bold; }
      .modes { fill: rgba(255,255,255,0.8); font-size: 22px; font-family: 'Arial', 'Helvetica', sans-serif; }
      .url { fill: rgba(255,255,255,0.6); font-size: 20px; font-family: 'Arial', 'Helvetica', sans-serif; }
    </style>
    <text x="40" y="${OG_HEIGHT - 62}" class="tagline">Free Historical Battle Guessing Game</text>
    <text x="40" y="${OG_HEIGHT - 30}" class="modes">225 Battles  |  8 Game Modes  |  9 Historical Eras  |  Play Free Now</text>
    <text x="${OG_WIDTH - 40}" y="${OG_HEIGHT - 30}" text-anchor="end" class="url">battleguess.app</text>
  </svg>`;

  // Crop, resize, then composite the gradient + text overlay
  await sharp(inputPath)
    .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
    .resize(OG_WIDTH, OG_HEIGHT, { fit: 'fill' })
    .composite([
      { input: Buffer.from(gradientSvg), blend: 'over' },
      { input: Buffer.from(textSvg), blend: 'over' },
    ])
    .png({ quality: 90 })
    .toFile(outputPath);

  const { size } = await sharp(outputPath).metadata();
  const stats = (await import('fs')).statSync(outputPath);
  console.log(`Generated OG image: ${outputPath} (${(stats.size / 1024).toFixed(0)} KB)`);
}

generateOGImage().catch(console.error);
