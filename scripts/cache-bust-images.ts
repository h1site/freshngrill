/**
 * Add cache-busting parameter to the 5 recipes that had in-place image replacement
 * This forces CDN/browsers to reload the new image files
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const STALE_SLUGS = [
  'nachos-supreme-fromage',
  'boulettes-viande-sauce-bbq',
  'guacamole-maison-chips',
  'rondelles-oignon-panees',
  'tacos-poulet-bbq',
];

const CACHE_BUST = `?t=${Date.now()}`;

async function main() {
  console.log('Cache-busting 5 recipe images...\n');

  // 1. Update featured_image in recipes table
  for (const slug of STALE_SLUGS) {
    const { data: recipe } = await supabase
      .from('recipes')
      .select('id, slug, featured_image')
      .eq('slug', slug)
      .single();

    if (!recipe) { console.log(`  ❌ ${slug}: not found`); continue; }

    // Strip any existing query params before adding new one
    const baseUrl = recipe.featured_image.split('?')[0];
    const newUrl = baseUrl + CACHE_BUST;

    const { error } = await supabase
      .from('recipes')
      .update({ featured_image: newUrl })
      .eq('id', recipe.id);

    if (error) {
      console.log(`  ❌ ${slug}: ${error.message}`);
    } else {
      console.log(`  ✅ ${slug}: featured_image updated`);
    }
  }

  // 2. Update article content (FR + EN) - replace old URLs with cache-busted ones
  const { data: post } = await supabase.from('posts').select('id, content').eq('id', 95).single();
  const { data: trans } = await supabase.from('post_translations').select('id, content').eq('post_id', 95).eq('locale', 'en').single();

  if (!post || !trans) { console.log('Article not found'); return; }

  let contentFr = post.content;
  let contentEn = trans.content;
  let frCount = 0;
  let enCount = 0;

  for (const slug of STALE_SLUGS) {
    const oldUrl = `https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/recipes/${slug}.png`;
    const newUrl = oldUrl + CACHE_BUST;

    if (contentFr.includes(oldUrl)) {
      contentFr = contentFr.split(oldUrl).join(newUrl);
      frCount++;
    }
    if (contentEn.includes(oldUrl)) {
      contentEn = contentEn.split(oldUrl).join(newUrl);
      enCount++;
    }
  }

  console.log(`\nArticle replacements: FR=${frCount}, EN=${enCount}`);

  if (frCount > 0) {
    const { error } = await supabase.from('posts').update({ content: contentFr }).eq('id', 95);
    if (error) console.error('FR update error:', error.message);
    else console.log('✅ Article FR updated');
  }

  if (enCount > 0) {
    const { error } = await supabase.from('post_translations').update({ content: contentEn }).eq('id', trans.id);
    if (error) console.error('EN update error:', error.message);
    else console.log('✅ Article EN updated');
  }

  console.log('\nDone! Images should now bypass cache.');
}

main().catch(console.error);
