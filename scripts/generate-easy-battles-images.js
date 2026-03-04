// Generate images for new easy battles (IDs 226-235)
// Run with: node scripts/generate-easy-battles-images.js [--force]

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env manually since this runs outside Vite
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) {
      process.env[key.trim()] = vals.join('=').trim();
    }
  });
}

const API_KEY = process.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Missing VITE_GEMINI_API_KEY environment variable');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const battles = [
  // Ancient Egypt & Mesopotamia - Easy
  { id: 226, name: "Battle of Kadesh", landscape: "desert terrain with the Orontes River in Syria, bronze age setting", generals: "Ramesses II on a war chariot and Hittite King Muwatalli II", era: "1274 BC Bronze Age" },
  { id: 227, name: "Battle of Gaugamela", landscape: "wide Mesopotamian plain near modern Mosul, Iraq", generals: "Alexander the Great on horseback and Persian King Darius III in a royal chariot", era: "331 BC Hellenistic" },
  { id: 228, name: "Fall of Babylon", landscape: "massive double walls of Babylon with the Ishtar Gate and ziggurat, Euphrates River flowing through", generals: "Cyrus the Great of Persia entering peacefully on horseback", era: "539 BC ancient Persian conquest" },
  { id: 229, name: "Battle of Actium", landscape: "Mediterranean Sea off the coast of Greece with ancient warships", generals: "Octavian's Roman fleet and Cleopatra's Egyptian royal barge with golden sails", era: "31 BC Roman naval battle" },
  { id: 230, name: "Siege of Jerusalem", landscape: "hilltop city of Jerusalem with Solomon's Temple burning, Judean hills", generals: "Nebuchadnezzar II of Babylon directing siege and Judean defenders on walls", era: "587 BC ancient siege" },
  // Ottoman & Islamic - Easy
  { id: 231, name: "Fall of Constantinople", landscape: "massive Theodosian Walls of Constantinople with Hagia Sophia in background, Bosphorus strait", generals: "Sultan Mehmed II and Byzantine Emperor Constantine XI", era: "1453 medieval siege" },
  { id: 232, name: "Battle of Tours", landscape: "rolling hills and farmland of central France", generals: "Charles Martel with Frankish heavy infantry and Umayyad Arab-Berber cavalry", era: "732 AD early medieval" },
  { id: 233, name: "Siege of Vienna", landscape: "walled city of Vienna surrounded by Ottoman siege tents, European architecture", generals: "Polish King Jan Sobieski with winged hussars and Ottoman Grand Vizier Kara Mustafa", era: "1683 early modern siege" },
  { id: 234, name: "Battle of Hattin", landscape: "dry, rocky hillside near the Sea of Galilee in the Holy Land", generals: "Saladin on horseback and Crusader King Guy of Lusignan in heavy armor", era: "1187 Crusades" },
  { id: 235, name: "Battle of Gallipoli", landscape: "steep cliffs and beaches of the Gallipoli peninsula with the Dardanelles strait", generals: "Mustafa Kemal Ataturk defending and ANZAC soldiers landing on beaches", era: "1915 World War I" },
];

function createPrompt(battle) {
  return `Present a clear, 45° top-down isometric miniature 3D cartoon scene of the ${battle.name}. Use soft, refined textures with realistic PBR materials and gentle, lifelike lighting and shadows.

Show soldiers from the ${battle.era} time period fighting with the 2 generals/commanders (${battle.generals}) on the outskirts of the battle with the correct landscape (${battle.landscape}).

Use a clean, minimalistic composition with a soft, solid-colored background. Do NOT include any text, labels, dates, words, numbers, or writing anywhere in the image. Square 1080x1080 dimension.`;
}

async function generateImage(battle) {
  const prompt = createPrompt(battle);
  console.log(`Generating image for Battle #${battle.id}: ${battle.name}...`);

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp-image-generation',
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['image', 'text'],
      },
    });

    const response = result.response;
    const candidates = response.candidates;

    if (candidates && candidates[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const outputPath = path.join(__dirname, '..', 'public', 'battles', `battle-${battle.id}.webp`);
          const buffer = Buffer.from(imageData, 'base64');
          fs.writeFileSync(outputPath, buffer);
          console.log(`  + Saved battle-${battle.id}.webp`);
          return { success: true };
        }
      }
    }

    console.log(`  x No image data returned`);
    return { success: false, error: 'No image data' };
  } catch (error) {
    console.log(`  x Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const forceFlag = args.includes('--force');

  let battlesToGenerate = battles;

  if (!forceFlag) {
    battlesToGenerate = battlesToGenerate.filter(b => {
      const outputPath = path.join(__dirname, '..', 'public', 'battles', `battle-${b.id}.webp`);
      if (fs.existsSync(outputPath)) {
        console.log(`Skipping battle-${b.id}.webp (already exists)`);
        return false;
      }
      return true;
    });
  }

  console.log(`\n${battlesToGenerate.length} easy battle images to generate\n`);

  if (battlesToGenerate.length === 0) {
    console.log('All images already exist. Use --force to regenerate.');
    return;
  }

  let success = 0;
  let failed = 0;
  const failures = [];

  for (const battle of battlesToGenerate) {
    const result = await generateImage(battle);
    if (result.success) {
      success++;
    } else {
      failed++;
      failures.push({ id: battle.id, name: battle.name, error: result.error });
    }

    // Rate limiting
    if (battlesToGenerate.indexOf(battle) < battlesToGenerate.length - 1) {
      console.log('  Waiting 3s...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log(`\n========================================`);
  console.log(`Easy battle image generation complete!`);
  console.log(`  Success: ${success}`);
  console.log(`  Failed: ${failed}`);
  if (failures.length > 0) {
    console.log(`\nFailed images:`);
    for (const f of failures) {
      console.log(`  - battle-${f.id} (${f.name}): ${f.error}`);
    }
  }
  console.log(`========================================\n`);

  // Update battleImages.ts
  updateBattleImagesFile();
}

function updateBattleImagesFile() {
  const imagesPath = path.join(__dirname, '..', 'src', 'data', 'battleImages.ts');
  const battlesDir = path.join(__dirname, '..', 'public', 'battles');

  let lines = ['// Auto-generated battle image paths', 'export const battleImages: Record<number, string> = {'];

  for (let id = 1; id <= 235; id++) {
    const webpPath = path.join(battlesDir, `battle-${id}.webp`);
    const pngPath = path.join(battlesDir, `battle-${id}.png`);
    if (fs.existsSync(webpPath)) {
      lines.push(`  "${id}": "/battles/battle-${id}.webp",`);
    } else if (fs.existsSync(pngPath)) {
      lines.push(`  "${id}": "/battles/battle-${id}.png",`);
    }
  }

  lines.push('};');
  lines.push('');

  fs.writeFileSync(imagesPath, lines.join('\n'));
  console.log(`\nUpdated battleImages.ts with all existing image paths (1-235).`);
}

main();
