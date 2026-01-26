import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file manually
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex > 0) {
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      process.env[key] = value;
    }
  }
}

const API_KEY = process.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Missing VITE_GEMINI_API_KEY');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const newBattles = [
  { id: 16, name: "Battle of Saratoga", date: "October 1777", generals: "Benedict Arnold and John Burgoyne", landscape: "autumn forests and hills of upstate New York" },
  { id: 17, name: "Battle of Lepanto", date: "October 7, 1571", generals: "Don John of Austria and Ali Pasha", landscape: "Gulf of Patras with Mediterranean galleys" },
  { id: 18, name: "Battle of Zama", date: "202 BCE", generals: "Scipio Africanus and Hannibal Barca", landscape: "North African plains with war elephants" },
  { id: 19, name: "Battle of Tours", date: "October 732 CE", generals: "Charles Martel and Abd al-Rahman", landscape: "central French plains between Tours and Poitiers" },
  { id: 20, name: "Battle of Teutoburg Forest", date: "9 CE", generals: "Arminius and Publius Varus", landscape: "dense dark Germanic forest with narrow paths" },
  { id: 21, name: "Battle of Crécy", date: "August 26, 1346", generals: "King Edward III and Philip VI of France", landscape: "muddy northern French farmland with rolling hills" },
  { id: 22, name: "Battle of Yorktown", date: "October 1781", generals: "George Washington and Lord Cornwallis", landscape: "Virginia coastal fortifications with French ships in harbor" },
  { id: 23, name: "Battle of Gallipoli", date: "1915-1916", generals: "Mustafa Kemal and Ian Hamilton", landscape: "steep cliffs and narrow beaches of Turkish peninsula" },
  { id: 24, name: "Battle of the Bulge", date: "December 1944", generals: "George Patton and Gerd von Rundstedt", landscape: "snowy Ardennes forest in Belgium" },
  { id: 25, name: "Battle of Iwo Jima", date: "February-March 1945", generals: "Holland Smith and Tadamichi Kuribayashi", landscape: "volcanic black sand beach with Mount Suribachi" },
  { id: 26, name: "Battle of Borodino", date: "September 7, 1812", generals: "Napoleon Bonaparte and Mikhail Kutuzov", landscape: "vast Russian fields with fortified redoubts" },
  { id: 27, name: "Battle of Salamis", date: "480 BCE", generals: "Themistocles and Xerxes I", landscape: "narrow strait near Athens with Greek triremes" },
  { id: 28, name: "Battle of Alesia", date: "52 BCE", generals: "Julius Caesar and Vercingetorix", landscape: "Gallic hilltop fortress surrounded by Roman siege works" },
  { id: 29, name: "Battle of Bunker Hill", date: "June 17, 1775", generals: "William Prescott and William Howe", landscape: "hilltop overlooking Boston Harbor with earthwork fortifications" },
  { id: 30, name: "Battle of Tsushima", date: "May 27, 1905", generals: "Admiral Togo and Admiral Rozhestvensky", landscape: "Tsushima Strait with modern steel battleships" },
];

function createPrompt(battle) {
  return `Present a clear, 45° top-down isometric miniature 3D cartoon scene of the ${battle.name}. Use soft, refined textures with realistic PBR materials and gentle, lifelike lighting and shadows.

Show soldiers from the time period fighting with the 2 generals (${battle.generals}) on the outskirts of the battle with the correct landscape (${battle.landscape}).

Use a clean, minimalistic composition with a soft, solid-colored background. At the top-center, place the date "${battle.date}" (small text). Square 1080x1080 dimension.`;
}

async function generateImage(battle) {
  const prompt = createPrompt(battle);
  console.log(`Generating image for ${battle.name} (ID: ${battle.id})...`);

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
          const mimeType = part.inlineData.mimeType || 'image/png';
          const extension = mimeType.includes('jpeg') ? 'jpg' : 'png';

          const outputPath = path.join(__dirname, '..', 'public', 'battles', `battle-${battle.id}.${extension}`);
          const buffer = Buffer.from(imageData, 'base64');
          fs.writeFileSync(outputPath, buffer);

          console.log(`  SUCCESS: saved battle-${battle.id}.${extension}`);
          return { success: true, path: `/battles/battle-${battle.id}.${extension}` };
        }
      }
    }

    console.log(`  FAILED: No image data returned`);
    return { success: false, error: 'No image data' };
  } catch (error) {
    console.log(`  FAILED: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log(`\nGenerating images for ${newBattles.length} new battles...\n`);

  const results = [];

  for (let i = 0; i < newBattles.length; i++) {
    const battle = newBattles[i];
    const result = await generateImage(battle);
    results.push({ ...battle, ...result });

    if (i < newBattles.length - 1) {
      console.log('  Waiting 3s before next request...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`\n--- DONE ---`);
  console.log(`  Generated: ${successful.length}/${newBattles.length}`);
  if (failed.length > 0) {
    console.log(`  Failed:`);
    failed.forEach(f => console.log(`    - ${f.name}: ${f.error}`));
  }

  // Build complete image paths (existing + new)
  const imagePaths = {};
  for (let i = 1; i <= 15; i++) {
    imagePaths[i] = `/battles/battle-${i}.png`;
  }
  successful.forEach(r => {
    imagePaths[r.id] = r.path;
  });

  const outputFile = path.join(__dirname, '..', 'src', 'data', 'battleImages.ts');
  const fileContent = `// Auto-generated battle image paths\nexport const battleImages: Record<number, string> = ${JSON.stringify(imagePaths, null, 2)};\n`;
  fs.writeFileSync(outputFile, fileContent);
  console.log(`\n  Updated battleImages.ts with ${Object.keys(imagePaths).length} entries.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
