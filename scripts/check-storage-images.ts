/**
 * Check Supabase storage for newer images for the 5 recipes with old DALL-E images
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const OLD_SLUGS = [
  'nachos-supreme-fromage',
  'boulettes-viande-sauce-bbq',
  'guacamole-maison-chips',
  'rondelles-oignon-panees',
  'tacos-poulet-bbq',
];

async function main() {
  // List all files in recipe-images/recipes/
  const { data: files, error } = await supabase.storage
    .from('recipe-images')
    .list('recipes', { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } });

  if (error) {
    console.error('Error listing files:', error.message);
    return;
  }

  console.log(`Total files in recipes/: ${files?.length}\n`);

  // For each old slug, find matching files
  for (const slug of OLD_SLUGS) {
    console.log(`=== ${slug} ===`);
    const matching = files?.filter(f => f.name.includes(slug) || f.name.includes(slug.replace(/-/g, '')));
    if (matching && matching.length > 0) {
      for (const f of matching) {
        console.log(`  ${f.name} (created: ${f.created_at}, size: ${f.metadata?.size || 'unknown'})`);
      }
    } else {
      console.log(`  No files found with slug in name`);
    }
  }

  // Also show last 30 uploaded files (most recent)
  console.log('\n=== LAST 30 UPLOADED FILES ===');
  const recent = files?.slice(0, 30);
  if (recent) {
    for (const f of recent) {
      console.log(`  ${f.name} (created: ${f.created_at})`);
    }
  }
}

main().catch(console.error);
