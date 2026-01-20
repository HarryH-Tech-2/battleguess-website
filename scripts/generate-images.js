import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Key - replace with your key or use environment variable
const API_KEY = process.env.VITE_GEMINI_API_KEY || 'AIzaSyAj8wH8RVa2Z5KIzahHSq7tYD9xFFRuFQc';

const genAI = new GoogleGenerativeAI(API_KEY);

// Battle data with dates for the prompt
const battles = [
  { id: 1, name: "Battle of Waterloo", date: "June 18, 1815", generals: "Napoleon Bonaparte and Duke of Wellington", landscape: "rolling Belgian farmland with muddy fields" },
  { id: 2, name: "Battle of Thermopylae", date: "480 BCE", generals: "King Leonidas and Xerxes I", landscape: "narrow coastal mountain pass in Greece" },
  { id: 3, name: "Battle of Gettysburg", date: "July 1-3, 1863", generals: "General Meade and General Lee", landscape: "Pennsylvania hills and farmland" },
  { id: 4, name: "Battle of Hastings", date: "October 14, 1066", generals: "William the Conqueror and King Harold II", landscape: "English hillside near the coast" },
  { id: 5, name: "Battle of Stalingrad", date: "1942-1943", generals: "Vasily Chuikov and Friedrich Paulus", landscape: "destroyed Soviet city with ruins and rubble" },
  { id: 6, name: "D-Day (Normandy Landings)", date: "June 6, 1944", generals: "Dwight Eisenhower and Erwin Rommel", landscape: "French beach with cliffs and bunkers" },
  { id: 7, name: "Battle of Agincourt", date: "October 25, 1415", generals: "King Henry V and Charles d'Albret", landscape: "muddy French farmland with forests" },
  { id: 8, name: "Battle of Trafalgar", date: "October 21, 1805", generals: "Admiral Nelson and Admiral Villeneuve", landscape: "Atlantic Ocean with wooden warships" },
  { id: 9, name: "Battle of the Somme", date: "July-November 1916", generals: "Douglas Haig and Fritz von Below", landscape: "WWI trenches and no man's land in France" },
  { id: 10, name: "Battle of Marathon", date: "490 BCE", generals: "Miltiades and Datis", landscape: "Greek coastal plain near Athens" },
  { id: 11, name: "Battle of Midway", date: "June 4-7, 1942", generals: "Chester Nimitz and Isoroku Yamamoto", landscape: "Pacific Ocean with aircraft carriers" },
  { id: 12, name: "Battle of Austerlitz", date: "December 2, 1805", generals: "Napoleon Bonaparte and Tsar Alexander I", landscape: "frozen Moravian hills with fog" },
  { id: 13, name: "Battle of Kursk", date: "July-August 1943", generals: "Georgy Zhukov and Erich von Manstein", landscape: "Russian steppe with tank formations" },
  { id: 14, name: "Battle of Cannae", date: "216 BCE", generals: "Hannibal Barca and Gaius Varro", landscape: "Italian plains near the Aufidus River" },
  { id: 15, name: "Battle of Verdun", date: "February-December 1916", generals: "Philippe Pétain and Crown Prince Wilhelm", landscape: "fortified French hills with trenches" },
];

function createPrompt(battle) {
  return `Present a clear, 45° top-down isometric miniature 3D cartoon scene of the ${battle.name}. Use soft, refined textures with realistic PBR materials and gentle, lifelike lighting and shadows.

Show soldiers from the time period fighting with the 2 generals (${battle.generals}) on the outskirts of the battle with the correct landscape (${battle.landscape}).

Use a clean, minimalistic composition with a soft, solid-colored background. At the top-center, place the date "${battle.date}" (small text). Square 1080x1080 dimension.`;
}

async function generateImage(battle) {
  const prompt = createPrompt(battle);
  console.log(`\nGenerating image for: ${battle.name}`);
  console.log(`Prompt: ${prompt.substring(0, 100)}...`);

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

          // Save the image
          const outputPath = path.join(__dirname, '..', 'public', 'battles', `battle-${battle.id}.${extension}`);
          const buffer = Buffer.from(imageData, 'base64');
          fs.writeFileSync(outputPath, buffer);

          console.log(`✓ Saved: ${outputPath}`);
          return { success: true, path: `/battles/battle-${battle.id}.${extension}` };
        }
      }
    }

    console.log(`✗ No image data in response for ${battle.name}`);
    return { success: false, error: 'No image data' };
  } catch (error) {
    console.error(`✗ Error generating ${battle.name}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('BattleGuess Image Generator');
  console.log('='.repeat(60));
  console.log(`Generating ${battles.length} battle images...`);
  console.log(`Output directory: public/battles/`);
  console.log('='.repeat(60));

  const results = [];

  for (const battle of battles) {
    const result = await generateImage(battle);
    results.push({ ...battle, ...result });

    // Add delay between requests to avoid rate limiting
    if (battle.id < battles.length) {
      console.log('Waiting 3 seconds before next request...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Generation Complete!');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`\nSuccessful: ${successful.length}/${battles.length}`);
  if (failed.length > 0) {
    console.log(`Failed: ${failed.length}`);
    failed.forEach(f => console.log(`  - ${f.name}: ${f.error}`));
  }

  // Generate the image paths file
  const imagePaths = {};
  successful.forEach(r => {
    imagePaths[r.id] = r.path;
  });

  const outputFile = path.join(__dirname, '..', 'src', 'data', 'battleImages.ts');
  const fileContent = `// Auto-generated battle image paths
export const battleImages: Record<number, string> = ${JSON.stringify(imagePaths, null, 2)};
`;

  fs.writeFileSync(outputFile, fileContent);
  console.log(`\nImage paths saved to: src/data/battleImages.ts`);
}

main().catch(console.error);
