import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Missing VITE_GEMINI_API_KEY');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const prompt = `Create a stunning 45° top-down isometric miniature 3D cartoon scene showing a dramatic "war room" strategy table.

On the table is a large vintage military map with miniature soldier figurines, tiny cannons, and small flags from different historical eras (Roman, Medieval, Napoleonic, WW2) scattered across it. A pair of crossed swords sits prominently in the center. Small dice and a magnifying glass are on the table edge.

The scene should feel inviting and game-like, with warm dramatic lighting from above, soft shadows, and refined PBR textures. Use a rich emerald green and gold color palette.

In elegant gold military-style text at the top: "BattleGuess" and small text below: "Can you name the battle?"

Clean minimalistic composition with a soft dark green background. Square 1080x1080 dimension.`;

async function main() {
  console.log('Generating placeholder image...');

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
          const outputPath = path.join(__dirname, '..', 'public', 'welcome-placeholder.png');
          const buffer = Buffer.from(imageData, 'base64');
          fs.writeFileSync(outputPath, buffer);
          console.log('Placeholder image saved to public/welcome-placeholder.png');
          return;
        }
      }
    }

    console.error('No image data in response');
  } catch (error) {
    console.error('Error generating image:', error.message);
  }
}

main();
