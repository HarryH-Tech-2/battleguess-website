import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Missing VITE_GEMINI_API_KEY environment variable');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const battles = [
  { id: 1, name: "Battle of Waterloo", generals: "Napoleon Bonaparte and Duke of Wellington", landscape: "rolling Belgian farmland with muddy fields" },
  { id: 2, name: "Battle of Thermopylae", generals: "King Leonidas and Xerxes I", landscape: "narrow coastal mountain pass in Greece" },
  { id: 3, name: "Battle of Gettysburg", generals: "General Meade and General Lee", landscape: "Pennsylvania hills and farmland" },
  { id: 4, name: "Battle of Hastings", generals: "William the Conqueror and King Harold II", landscape: "English hillside near the coast" },
  { id: 5, name: "Battle of Stalingrad", generals: "Vasily Chuikov and Friedrich Paulus", landscape: "destroyed Soviet city with ruins and rubble" },
  { id: 6, name: "D-Day (Normandy Landings)", generals: "Dwight Eisenhower and Erwin Rommel", landscape: "French beach with cliffs and bunkers" },
  { id: 7, name: "Battle of Agincourt", generals: "King Henry V and Charles d'Albret", landscape: "muddy French farmland with forests" },
  { id: 8, name: "Battle of Trafalgar", generals: "Admiral Nelson and Admiral Villeneuve", landscape: "Atlantic Ocean with wooden warships" },
  { id: 9, name: "Battle of the Somme", generals: "Douglas Haig and Fritz von Below", landscape: "WWI trenches and no man's land in France" },
  { id: 10, name: "Battle of Marathon", generals: "Miltiades and Datis", landscape: "Greek coastal plain near Athens" },
  { id: 11, name: "Battle of Midway", generals: "Chester Nimitz and Isoroku Yamamoto", landscape: "Pacific Ocean with aircraft carriers" },
  { id: 12, name: "Battle of Austerlitz", generals: "Napoleon Bonaparte and Tsar Alexander I", landscape: "frozen Moravian hills with fog" },
  { id: 13, name: "Battle of Kursk", generals: "Georgy Zhukov and Erich von Manstein", landscape: "Russian steppe with tank formations" },
  { id: 14, name: "Battle of Cannae", generals: "Hannibal Barca and Gaius Varro", landscape: "Italian plains near the Aufidus River" },
  { id: 15, name: "Battle of Verdun", generals: "Philippe Pétain and Crown Prince Wilhelm", landscape: "fortified French hills with trenches" },
  { id: 16, name: "Battle of Saratoga", generals: "Horatio Gates and John Burgoyne", landscape: "upstate New York autumn forests and hills" },
  { id: 17, name: "Battle of Lepanto", generals: "Don John of Austria and Ali Pasha", landscape: "Gulf of Patras with galley warships" },
  { id: 18, name: "Battle of Zama", generals: "Scipio Africanus and Hannibal Barca", landscape: "North African plains with war elephants" },
  { id: 19, name: "Battle of Tours", generals: "Charles Martel and Abd al-Rahman", landscape: "central French plains between Tours and Poitiers" },
  { id: 20, name: "Battle of Teutoburg Forest", generals: "Arminius and Publius Varus", landscape: "dense dark Germanic forest with narrow paths" },
  { id: 21, name: "Battle of Crécy", generals: "King Edward III and Philip VI", landscape: "northern French farmland with gentle hills" },
  { id: 22, name: "Siege of Yorktown", generals: "George Washington and Lord Cornwallis", landscape: "Virginia coastal fortifications with harbor" },
  { id: 23, name: "Battle of Gallipoli", generals: "Ian Hamilton and Mustafa Kemal", landscape: "Turkish peninsula with steep cliffs and beaches" },
  { id: 24, name: "Battle of the Bulge", generals: "Dwight Eisenhower and Gerd von Rundstedt", landscape: "snowy Ardennes forest in Belgium" },
  { id: 25, name: "Battle of Iwo Jima", generals: "Holland Smith and Tadamichi Kuribayashi", landscape: "volcanic black sand beach with Mount Suribachi" },
  { id: 26, name: "Battle of Borodino", generals: "Napoleon Bonaparte and Mikhail Kutuzov", landscape: "vast Russian countryside with redoubts and villages" },
  { id: 27, name: "Battle of Salamis", generals: "Themistocles and Xerxes I", landscape: "narrow Greek strait with triremes" },
  { id: 28, name: "Siege of Alesia", generals: "Julius Caesar and Vercingetorix", landscape: "Gallic hilltop fortress with double Roman siege fortifications" },
  { id: 29, name: "Battle of Bunker Hill", generals: "William Prescott and William Howe", landscape: "hill overlooking Boston Harbor with earthworks" },
  { id: 30, name: "Battle of Tsushima", generals: "Admiral Togo and Admiral Rozhestvensky", landscape: "gray seas of Tsushima Strait with steel battleships" },
];

function createPrompt(battle) {
  return `Present a clear, 45° top-down isometric miniature 3D cartoon scene of the ${battle.name}. Use soft, refined textures with realistic PBR materials and gentle, lifelike lighting and shadows.

Show soldiers from the time period fighting with the 2 generals (${battle.generals}) on the outskirts of the battle with the correct landscape (${battle.landscape}).

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
          const outputPath = path.join(__dirname, '..', 'public', 'battles', `battle-${battle.id}.png`);
          const buffer = Buffer.from(imageData, 'base64');
          fs.writeFileSync(outputPath, buffer);
          console.log(`  ✓ Saved battle-${battle.id}.png`);
          return { success: true };
        }
      }
    }

    console.log(`  ✗ No image data returned`);
    return { success: false, error: 'No image data' };
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log(`\nRegenerating ${battles.length} battle images (no date text)...\n`);

  let successCount = 0;
  let failCount = 0;
  const failed = [];

  for (const battle of battles) {
    const result = await generateImage(battle);
    if (result.success) {
      successCount++;
    } else {
      failCount++;
      failed.push(battle);
    }

    // Rate limit delay between requests
    if (battle.id < battles.length) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log(`\nDone! ${successCount} succeeded, ${failCount} failed.`);
  if (failed.length > 0) {
    console.log('Failed battles:', failed.map(b => `#${b.id} ${b.name}`).join(', '));
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
