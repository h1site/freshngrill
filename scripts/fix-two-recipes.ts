/**
 * Fix rondelles-oignon-panees and tacos-poulet-bbq images in article
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  // Get current featured_images
  const { data: recipes } = await supabase
    .from('recipes')
    .select('slug, featured_image')
    .in('slug', ['rondelles-oignon-panees', 'tacos-poulet-bbq']);

  if (!recipes) return;

  const imageMap = new Map(recipes.map(r => [r.slug, r.featured_image]));

  // Get article
  const { data: post } = await supabase.from('posts').select('id, content').eq('id', 95).single();
  const { data: trans } = await supabase.from('post_translations').select('id, content').eq('post_id', 95).eq('locale', 'en').single();
  if (!post || !trans) return;

  let contentFr = post.content;
  let contentEn = trans.content;

  // Find ALL occurrences of old URLs and replace them
  for (const [slug, newUrl] of imageMap) {
    // Match any URL containing this slug (with or without query params)
    const oldPattern = new RegExp(
      `https://cjbdgfcxewvxcojxbuab\\.supabase\\.co/storage/v1/object/public/recipe-images/recipes/${slug}\\.png[^"]*`,
      'g'
    );

    const frMatches = contentFr.match(oldPattern);
    const enMatches = contentEn.match(oldPattern);

    console.log(`${slug}:`);
    console.log(`  New URL: ${newUrl}`);
    console.log(`  FR matches: ${frMatches?.length || 0} -> ${frMatches}`);
    console.log(`  EN matches: ${enMatches?.length || 0} -> ${enMatches}`);

    contentFr = contentFr.replace(oldPattern, newUrl);
    contentEn = contentEn.replace(oldPattern, newUrl);
  }

  // Update
  const { error: frErr } = await supabase.from('posts').update({ content: contentFr }).eq('id', 95);
  if (frErr) console.error('FR error:', frErr.message);
  else console.log('\n✅ Article FR updated');

  const { error: enErr } = await supabase.from('post_translations').update({ content: contentEn }).eq('id', trans.id);
  if (enErr) console.error('EN error:', enErr.message);
  else console.log('✅ Article EN updated');
}

main().catch(console.error);
