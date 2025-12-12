/**
 * Generate English slugs for existing translations
 * Run after adding slug_en column to recipe_translations
 * 
 * Usage: npx tsx scripts/generate-english-slugs.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Multiple hyphens to single
    .replace(/^-|-$/g, ''); // Trim hyphens
}

async function main() {
  console.log('Fetching translations without slug_en...');
  
  const { data: translations, error } = await supabase
    .from('recipe_translations')
    .select('id, title, slug_en')
    .eq('locale', 'en');

  if (error) {
    console.error('Error fetching translations:', error);
    return;
  }

  const toUpdate = translations?.filter(t => !t.slug_en) || [];
  console.log(`Found ${toUpdate.length} translations to update`);

  let updated = 0;
  for (const t of toUpdate) {
    const slugEn = generateSlug(t.title);
    
    const { error: updateError } = await supabase
      .from('recipe_translations')
      .update({ slug_en: slugEn })
      .eq('id', t.id);

    if (updateError) {
      console.error(`Error updating ${t.id}:`, updateError.message);
    } else {
      console.log(`${t.title} -> ${slugEn}`);
      updated++;
    }
  }

  console.log(`\nDone! Updated ${updated} translations`);
}

main().catch(console.error);
