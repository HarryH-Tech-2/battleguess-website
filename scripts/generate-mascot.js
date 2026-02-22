// Generate new Napoleon mascot using Gemini API
// Run with: node scripts/generate-mascot.js

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

async function generateMascot() {
  const prompt = `Create a cute chibi/figurine style 3D rendered character of Napoleon Bonaparte as a game mascot. The character should be:
- Standing upright in a confident pose with hands behind his back
- Wearing his iconic black bicorne hat with a red, white, and blue cockade
- Dressed in a dark green military coat with gold epaulettes on the shoulders
- White waistcoat/vest underneath
- White breeches/pants
- Black knee-high boots
- Standing on a small round beige/cream colored circular base/pedestal
- The character has a cute, round chibi face with small features, rosy cheeks, and a friendly expression
- Clean 3D render style with soft lighting
- Pure white background with no shadows on the ground
- Square 1080x1080 dimension
- No text, labels, or writing anywhere in the image`;

  console.log('Generating Napoleon mascot...');

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
          const outputPath = path.join(__dirname, '..', 'public', 'mascot.png');
          const buffer = Buffer.from(imageData, 'base64');
          fs.writeFileSync(outputPath, buffer);
          console.log('  + Saved mascot.png');
          return;
        }
      }
    }

    console.log('  x No image data returned');
  } catch (error) {
    console.log(`  x Error: ${error.message}`);
  }
}

generateMascot();
