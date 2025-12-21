/**
 * Script pour générer des images d'épices avec DALL-E 3
 * et les uploader vers Supabase Storage
 *
 * Usage: OPENAI_API_KEY=sk-... npx tsx scripts/generate-spice-images.ts
 *
 * Options:
 *   --limit=10     Limiter le nombre d'images à générer
 *   --dry-run      Afficher les épices sans générer d'images
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cjbdgfcxewvxcojxbuab.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4OTczNCwiZXhwIjoyMDgwODY1NzM0fQ.wq_hwCrw8CfmKnf7Hla8S_jtQjHE5cOMIfvi5Ww7jYA';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY is required');
  console.log('Usage: OPENAI_API_KEY=sk-... npx tsx scripts/generate-spice-images.ts');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

interface Spice {
  slug: string;
  name_fr: string;
  name_en: string | null;
  featured_image: string | null;
}

// Parse command line arguments
const args = process.argv.slice(2);
const limitArg = args.find(a => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : undefined;
const dryRun = args.includes('--dry-run');

function generatePrompt(spice: Spice): string {
  const name = spice.name_en || spice.name_fr;
  return `Professional food photography of ${name} spice, close-up macro shot on a rustic wooden cutting board, scattered spice with some in a small ceramic bowl, warm natural lighting from the side, shallow depth of field, culinary magazine style, high detail, appetizing presentation. No text or watermarks.`;
}

async function generateImage(spice: Spice): Promise<string | null> {
  const prompt = generatePrompt(spice);

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });

    return response.data?.[0]?.url || null;
  } catch (error) {
    console.error(`  ❌ DALL-E error for ${spice.name_fr}:`, error);
    return null;
  }
}

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadToSupabase(spice: Spice, imageBuffer: Buffer): Promise<string | null> {
  const fileName = `spices/${spice.slug}.webp`;

  // Convert to WebP would require sharp, for now upload as PNG
  const pngFileName = `spices/${spice.slug}.png`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(pngFileName, imageBuffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadError) {
    console.error(`  ❌ Upload error for ${spice.slug}:`, uploadError.message);
    return null;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(pngFileName);

  return publicUrl;
}

async function updateSpiceImage(spice: Spice, imageUrl: string): Promise<boolean> {
  const { error } = await supabase
    .from('spices')
    .update({
      featured_image: imageUrl,
      image_alt_fr: `Photo de ${spice.name_fr}`,
      image_alt_en: `Photo of ${spice.name_en || spice.name_fr}`,
    })
    .eq('slug', spice.slug);

  if (error) {
    console.error(`  ❌ DB update error for ${spice.slug}:`, error.message);
    return false;
  }
  return true;
}

async function main() {
  console.log('🖼️  Génération d\'images d\'épices avec DALL-E 3\n');

  if (dryRun) {
    console.log('🔍 Mode dry-run - aucune image ne sera générée\n');
  }

  // Fetch spices without images
  let query = supabase
    .from('spices')
    .select('slug, name_fr, name_en, featured_image')
    .eq('is_published', true)
    .is('featured_image', null)
    .order('name_fr');

  if (limit) {
    query = query.limit(limit);
  }

  const { data: spices, error } = await query;

  if (error) {
    console.error('❌ Supabase error:', error.message);
    process.exit(1);
  }

  if (!spices || spices.length === 0) {
    console.log('✅ Toutes les épices ont déjà des images!');
    return;
  }

  console.log(`📋 ${spices.length} épices sans image${limit ? ` (limite: ${limit})` : ''}\n`);

  if (dryRun) {
    spices.forEach((s, i) => {
      console.log(`${i + 1}. ${s.name_fr} (${s.name_en || '-'})`);
    });
    console.log(`\n💰 Coût estimé: ~$${(spices.length * 0.04).toFixed(2)} (DALL-E 3 standard)`);
    return;
  }

  let success = 0;
  let failed = 0;
  const startTime = Date.now();

  for (let i = 0; i < spices.length; i++) {
    const spice = spices[i];
    console.log(`[${i + 1}/${spices.length}] ${spice.name_fr}...`);

    // Generate image with DALL-E 3
    const imageUrl = await generateImage(spice);
    if (!imageUrl) {
      failed++;
      continue;
    }

    // Download the image
    console.log('  📥 Téléchargement...');
    let imageBuffer: Buffer;
    try {
      imageBuffer = await downloadImage(imageUrl);
    } catch (error) {
      console.error(`  ❌ Download error:`, error);
      failed++;
      continue;
    }

    // Upload to Supabase Storage
    console.log('  📤 Upload vers Supabase...');
    const publicUrl = await uploadToSupabase(spice, imageBuffer);
    if (!publicUrl) {
      failed++;
      continue;
    }

    // Update database
    const updated = await updateSpiceImage(spice, publicUrl);
    if (updated) {
      console.log(`  ✅ ${spice.name_fr} - image générée`);
      success++;
    } else {
      failed++;
    }

    // Rate limiting - DALL-E 3 has limits
    if (i < spices.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\n🏁 Terminé en ${duration} minutes!`);
  console.log(`  ✅ Succès: ${success}`);
  console.log(`  ❌ Échecs: ${failed}`);
  console.log(`  💰 Coût estimé: ~$${(success * 0.04).toFixed(2)}`);
}

main().catch(console.error);
