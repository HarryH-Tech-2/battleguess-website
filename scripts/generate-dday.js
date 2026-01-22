import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(API_KEY);

async function generateDDay() {
  const prompt = `Present a clear, 45° top-down isometric miniature 3D cartoon scene of the historic Normandy beach landings of 1944. Use soft, refined textures with realistic PBR materials and gentle, lifelike lighting and shadows.

Show military vehicles and landing craft approaching a beach with soldiers disembarking, with commanders Eisenhower and Rommel represented as small figures observing from their respective positions. The landscape shows the French coastline with cliffs and fortifications.

Use a clean, minimalistic composition with a soft, solid-colored background. At the top-center, place the date "June 6, 1944" (small text). Square 1080x1080 dimension.`;

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
          const outputPath = path.join(__dirname, '..', 'public', 'battles', 'battle-6.png');
          const buffer = Buffer.from(imageData, 'base64');
          fs.writeFileSync(outputPath, buffer);

          const imagesFile = path.join(__dirname, '..', 'src', 'data', 'battleImages.ts');
          let content = fs.readFileSync(imagesFile, 'utf-8');
          if (!content.includes('"6"')) {
            content = content.replace(
              '"5": "/battles/battle-5.png"',
              '"5": "/battles/battle-5.png",\n  "6": "/battles/battle-6.png"'
            );
            fs.writeFileSync(imagesFile, content);
          }
          return;
        }
      }
    }
  } catch (error) {
    process.exit(1);
  }
}

generateDDay();
