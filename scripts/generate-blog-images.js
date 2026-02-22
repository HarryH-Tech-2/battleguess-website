// Generate blog post hero images using the Gemini API
// Run with: node scripts/generate-blog-images.js [--force]

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

// ============================================================
// BLOG POST IMAGE MANIFEST
// ============================================================

const blogImages = [
  {
    filename: 'decisive-battles.webp',
    prompt: 'A dramatic panoramic painting of armies clashing on a vast battlefield at sunset. Show two opposing forces from different historical eras meeting in an epic confrontation, with smoke, banners, and dramatic lighting. Painterly art style, cinematic composition. No text, labels, or writing.',
  },
  {
    filename: 'ancient-warfare.webp',
    prompt: 'Ancient Greek hoplites and Roman legionaries in bronze armor standing in tight formation with large round shields and long spears on a Mediterranean coastal battlefield. Warm golden light, dust in the air, olive trees in the background. Painterly art style. No text, labels, or writing.',
  },
  {
    filename: 'beginners-guide.webp',
    prompt: 'An open antique history book lying on a wooden desk, with detailed battlefield illustrations spanning multiple eras of warfare visible on its pages. Miniature soldiers from different periods stand around the book. Warm library lighting, scholarly atmosphere. No text, labels, or writing.',
  },
  {
    filename: 'improve-score.webp',
    prompt: 'A strategy war room table viewed from above with military miniature figurines, tactical maps, colored pins marking battle positions, and score tally cards. Warm overhead lamp lighting. Board game aesthetic with historical military theme. No text, labels, or writing.',
  },
  {
    filename: 'siege-warfare.webp',
    prompt: 'A medieval siege scene with massive wooden trebuchets launching flaming boulders at a tall stone castle wall. Defenders pour boiling liquid from the battlements while attackers scale ladders. Dramatic stormy sky. Painterly art style. No text, labels, or writing.',
  },
  {
    filename: 'naval-battles.webp',
    prompt: 'Age of Sail wooden warships exchanging broadside cannon fire on rough stormy seas. Ships with billowing sails, cannon smoke, splashing cannonballs, and dramatic waves. Golden hour lighting breaking through storm clouds. Painterly art style. No text, labels, or writing.',
  },
  {
    filename: 'student-battles.webp',
    prompt: 'A student at a cozy desk studying military history with colorful battle maps, illustrated history books, a globe, and battle diagrams spread across the surface. Warm desk lamp lighting, bookshelf in background. Illustrated art style. No text, labels, or writing.',
  },
  {
    filename: 'military-commanders.webp',
    prompt: 'A commanding general on a rearing horse atop a hill, surveying a vast battlefield below with troops arranged in formation. The general wears ornate 18th-century military uniform with a plumed hat. Dramatic clouds and golden sunset light. Painterly portrait style. No text, labels, or writing.',
  },
  {
    filename: 'gunpowder-warfare.webp',
    prompt: 'A large cannon firing with thick white smoke billowing across a European battlefield. Castle walls crumbling from artillery bombardment in the background. Soldiers in 16th-century armor operating the cannons. Dramatic lighting through the smoke. Painterly art style. No text, labels, or writing.',
  },
  {
    filename: 'wwii-turning-points.webp',
    prompt: 'World War II battle scene showing tanks advancing through rubble and smoke on a war-torn European street. Infantry soldiers taking cover behind destroyed buildings. Gray overcast sky with explosions in the distance. Gritty, cinematic art style. No text, labels, or writing.',
  },
  {
    filename: 'samurai-battles.webp',
    prompt: 'Samurai warriors in full traditional lacquered armor clashing with katana swords in front of a Japanese castle with cherry blossoms falling. Dynamic action poses, dramatic wind effects. Traditional Japanese painting meets cinematic style. No text, labels, or writing.',
  },
  {
    filename: 'crusades.webp',
    prompt: 'Crusader knights in chainmail and surcoats bearing cross emblems on their shields, laying siege to a fortified Middle Eastern desert city with tall sandstone walls. Siege towers and ladders in use. Hot desert sun, dusty atmosphere. Painterly art style. No text, labels, or writing.',
  },
  {
    filename: 'american-revolution.webp',
    prompt: 'Continental Army soldiers in blue coats firing muskets in a line formation at advancing British redcoats across a green colonial American field with a white farmhouse and split-rail fence. Musket smoke, morning fog. Painterly American historical art style. No text, labels, or writing.',
  },
  {
    filename: 'latin-american-independence.webp',
    prompt: 'South American independence cavalry forces crossing a dramatic Andes mountain pass with colorful flags and banners. Soldiers on horseback in early 19th-century military uniforms against a backdrop of snow-capped peaks and clouds. Epic, cinematic composition. No text, labels, or writing.',
  },
  {
    filename: 'cavalry-evolution.webp',
    prompt: 'A panoramic timeline scene showing the evolution of mounted warfare: an ancient Egyptian chariot on the left, a medieval armored knight on horseback in the center, and a World War I era tank on the right, all on the same sweeping landscape. Painterly art style. No text, labels, or writing.',
  },
  {
    filename: 'ottoman-victories.webp',
    prompt: 'Ottoman Janissary troops in distinctive uniforms with massive bronze siege cannons positioned outside the massive walls of Constantinople. The Hagia Sophia dome visible behind the walls. Smoke from cannon fire. Rich, warm color palette. Painterly art style. No text, labels, or writing.',
  },
  {
    filename: 'women-military-history.webp',
    prompt: 'Joan of Arc in gleaming plate armor holding a banner and rallying French medieval troops outside a besieged city. She is mounted on a white horse, surrounded by soldiers looking up to her with admiration. Dramatic sunset sky. Heroic painterly art style. No text, labels, or writing.',
  },
  {
    filename: 'weather-battles.webp',
    prompt: 'A Napoleonic-era army marching through a fierce blizzard, soldiers in great coats struggling against howling wind and heavy snow. Horses pulling cannons through deep snowdrifts. Blue-gray cold color palette, harsh winter atmosphere. Painterly art style. No text, labels, or writing.',
  },
  {
    filename: 'rome-vs-greece.webp',
    prompt: 'Roman legionaries with rectangular scutum shields in tight formation facing off against Greek hoplites in a phalanx with round aspis shields and long sarissa spears. Two distinct formations about to clash on an open Mediterranean plain. Dramatic lighting. Painterly art style. No text, labels, or writing.',
  },
  {
    filename: 'battlefield-tactics.webp',
    prompt: 'A tactical battlefield map viewed from directly above showing colorful flanking arrows, troop formation blocks, and strategic movement indicators on a topographic terrain map with hills and rivers marked. Parchment paper aesthetic with military planning symbols. Clean illustration style. No text, labels, or writing.',
  },
];

// ============================================================
// IMAGE GENERATION
// ============================================================

async function generateImage(imageInfo) {
  console.log(`Generating: ${imageInfo.filename}...`);

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp-image-generation',
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: imageInfo.prompt }] }],
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
          const outputPath = path.join(__dirname, '..', 'public', 'blog', imageInfo.filename);
          const buffer = Buffer.from(imageData, 'base64');
          fs.writeFileSync(outputPath, buffer);
          console.log(`  + Saved ${imageInfo.filename}`);
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

  const outputDir = path.join(__dirname, '..', 'public', 'blog');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let imagesToGenerate = blogImages;

  // Skip images that already exist unless --force
  if (!forceFlag) {
    imagesToGenerate = imagesToGenerate.filter(img => {
      const outputPath = path.join(outputDir, img.filename);
      if (fs.existsSync(outputPath)) {
        console.log(`Skipping ${img.filename} (already exists)`);
        return false;
      }
      return true;
    });
  }

  console.log(`\n${imagesToGenerate.length} blog images to generate\n`);

  if (imagesToGenerate.length === 0) {
    console.log('All images already exist. Use --force to regenerate.');
    return;
  }

  let success = 0;
  let failed = 0;
  const failures = [];

  for (const img of imagesToGenerate) {
    const result = await generateImage(img);
    if (result.success) {
      success++;
    } else {
      failed++;
      failures.push({ filename: img.filename, error: result.error });
    }

    // Rate limiting — pause between requests
    if (imagesToGenerate.indexOf(img) < imagesToGenerate.length - 1) {
      console.log('  Waiting 3s...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log(`\n========================================`);
  console.log(`Blog image generation complete!`);
  console.log(`  Success: ${success}`);
  console.log(`  Failed: ${failed}`);
  if (failures.length > 0) {
    console.log(`\nFailed images:`);
    for (const f of failures) {
      console.log(`  - ${f.filename}: ${f.error}`);
    }
  }
  console.log(`========================================\n`);
}

main();
