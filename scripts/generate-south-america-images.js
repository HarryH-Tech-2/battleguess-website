// Generate images for South America battles (IDs 201-225)
// Run with: node scripts/generate-south-america-images.js [--force]

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
  { id: 201, name: "Battle of Cajamarca", landscape: "highland Andean city plaza in Peru with Inca architecture", generals: "Francisco Pizarro and Inca Emperor Atahualpa", era: "16th century conquest" },
  { id: 202, name: "Siege of Tenochtitlan", landscape: "massive island city on a lake with causeways, Aztec pyramids and temples", generals: "Hernan Cortes and Aztec defenders", era: "1521 conquest" },
  { id: 203, name: "Battle of Otumba", landscape: "open plains outside the Valley of Mexico", generals: "Hernan Cortes and Aztec commanders", era: "1520 conquest" },
  { id: 204, name: "Siege of Cusco", landscape: "Andean mountain city with Inca stone fortress of Sacsayhuaman on hilltop", generals: "Manco Inca and Spanish garrison defenders", era: "1536 rebellion" },
  { id: 205, name: "Battle of Boyaca", landscape: "stone bridge over a river in Colombian green highlands", generals: "Simon Bolivar and Spanish royalist forces", era: "1819 independence" },
  { id: 206, name: "Battle of Carabobo", landscape: "grassy Venezuelan savanna with wooded ravines", generals: "Simon Bolivar with llanero cavalry and Spanish royalists", era: "1821 independence" },
  { id: 207, name: "Battle of Chacabuco", landscape: "valley descending from the snowy Andes into Chilean farmland", generals: "Jose de San Martin and Spanish royalist forces", era: "1817 independence" },
  { id: 208, name: "Battle of Maipu", landscape: "open plain near Santiago with the Andes mountains in background", generals: "Jose de San Martin and Spanish royalist army", era: "1818 independence" },
  { id: 209, name: "Battle of Ayacucho", landscape: "high Andean plateau at 3000 meters altitude in Peru", generals: "Antonio Jose de Sucre and Spanish Viceroy's army", era: "1824 independence" },
  { id: 210, name: "Battle of Junin", landscape: "high plateau near a lake in the Peruvian Andes", generals: "Simon Bolivar's cavalry and Spanish royalist horsemen", era: "1824 cavalry battle" },
  { id: 211, name: "Battle of Pichincha", landscape: "slopes of a massive volcano above the city of Quito in fog", generals: "Antonio Jose de Sucre and Spanish royalist forces", era: "1822 independence" },
  { id: 212, name: "Battle of Tucuman", landscape: "Argentine pampas grasslands near a northwestern colonial city", generals: "Manuel Belgrano and Spanish royalist forces", era: "1812 independence" },
  { id: 213, name: "Battle of Tuyuti", landscape: "swampy marshlands in Paraguay with entrenched positions", generals: "Brazilian-Argentine-Uruguayan allied forces and Paraguayan army", era: "1866 War of Triple Alliance" },
  { id: 214, name: "Battle of Rancagua", landscape: "colonial Chilean town central plaza with barricades", generals: "Bernardo O'Higgins defending against Spanish royalists", era: "1814 independence" },
  { id: 215, name: "Battle of Iquique", landscape: "Pacific Ocean off the coast of Chile with warships", generals: "Captain Arturo Prat and the Peruvian ironclad Huascar", era: "1879 War of the Pacific" },
  { id: 216, name: "Battle of Angamos", landscape: "open Pacific Ocean with steam-powered warships", generals: "Chilean armored fleet and Admiral Miguel Grau on the Huascar", era: "1879 War of the Pacific" },
  { id: 217, name: "Battle of Arica", landscape: "clifftop fortress overlooking the Pacific Ocean", generals: "Chilean assault forces and Colonel Francisco Bolognesi's defenders", era: "1880 War of the Pacific" },
  { id: 218, name: "Battle of Puebla", landscape: "Mexican hilltop fortifications with countryside", generals: "General Ignacio Zaragoza and French Foreign Legion", era: "1862 French intervention" },
  { id: 219, name: "Battle of Cerro Cora", landscape: "dense Paraguayan tropical forest", generals: "Brazilian cavalry and President Francisco Solano Lopez's last troops", era: "1870 War of Triple Alliance" },
  { id: 220, name: "La Noche Triste", landscape: "causeways over a lake from an island city at night, moonlit", generals: "Cortes retreating and Aztec warriors attacking from canoes", era: "1520 conquest" },
  { id: 221, name: "Battle of Vuelta de Obligado", landscape: "Parana River with iron chains stretched across and shore batteries", generals: "Argentine forces under Rosas and Anglo-French warships", era: "1845 sovereignty" },
  { id: 222, name: "Battle of Ituzaingo", landscape: "open grassland plains of southern Brazil", generals: "Argentine-Uruguayan cavalry and Brazilian imperial forces", era: "1827 Argentine-Brazilian War" },
  { id: 223, name: "Battle of Chaco Boreal", landscape: "dense thorny scrubland in the Gran Chaco wilderness", generals: "Paraguayan soldiers and Bolivian forces", era: "1930s Chaco War" },
  { id: 224, name: "Battle of San Lorenzo", landscape: "monastery on the banks of the Parana River at dawn", generals: "Jose de San Martin's mounted grenadiers and Spanish royalists from riverboats", era: "1813 independence" },
  { id: 225, name: "Battle of Cancha Rayada", landscape: "Chilean countryside at night with patriot army camp", generals: "Spanish royalist night attackers and San Martin's surprised army", era: "1818 independence" },
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

  console.log(`\n${battlesToGenerate.length} South America battle images to generate\n`);

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
  console.log(`South America battle image generation complete!`);
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

  for (let id = 1; id <= 225; id++) {
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
  console.log(`\nUpdated battleImages.ts with all existing image paths (1-225).`);
}

main();
