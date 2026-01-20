import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = 'AIzaSyAj8wH8RVa2Z5KIzahHSq7tYD9xFFRuFQc';
const genAI = new GoogleGenerativeAI(API_KEY);

async function generateDDay() {
  // Modified prompt focusing on the strategic/historical aspect
  const prompt = `Present a clear, 45° top-down isometric miniature 3D cartoon scene of the historic Normandy beach landings of 1944. Use soft, refined textures with realistic PBR materials and gentle, lifelike lighting and shadows.

Show military vehicles and landing craft approaching a beach with soldiers disembarking, with commanders Eisenhower and Rommel represented as small figures observing from their respective positions. The landscape shows the French coastline with cliffs and fortifications.

Use a clean, minimalistic composition with a soft, solid-colored background. At the top-center, place the date "June 6, 1944" (small text). Square 1080x1080 dimension.`;

  console.log('Generating D-Day image with modified prompt...');

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
          console.log('✓ D-Day image saved successfully!');

          // Update battleImages.ts
          const imagesFile = path.join(__dirname, '..', 'src', 'data', 'battleImages.ts');
          let content = fs.readFileSync(imagesFile, 'utf-8');
          if (!content.includes('"6"')) {
            content = content.replace(
              '"5": "/battles/battle-5.png"',
              '"5": "/battles/battle-5.png",\n  "6": "/battles/battle-6.png"'
            );
            fs.writeFileSync(imagesFile, content);
            console.log('✓ Updated battleImages.ts');
          }
          return;
        }
      }
    }
    console.log('✗ No image data in response');
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

generateDDay();
