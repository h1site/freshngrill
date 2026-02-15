/**
 * Sync Super Bowl article images with current recipe featured_image values
 * Replaces ALL image URLs in the article to match current DB state
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SLUGS = [
  'ailes-de-poulet-buffalo', 'nachos-supreme-fromage', 'trempette-pizza-chaude',
  'mini-pogos-fromage-biere', 'jalapeno-poppers-bacon', 'ailes-general-tao-erable',
  'pelures-patates-garnies', 'trempette-fromage-biere', 'boulettes-viande-sauce-bbq',
  'mini-burgers-smash', 'fromage-en-croute-curds', 'guacamole-maison-chips',
  'pizza-baguette-pepperoni', 'saucisses-cocktail-erable-whisky', 'rondelles-oignon-panees',
  'tacos-poulet-bbq', 'mac-and-cheese-bacon', 'crevettes-coco-panees',
  'chili-con-carne-superbowl', 'cotes-levees-sauce-bbq-maison',
];

async function main() {
  console.log('Syncing Super Bowl article images...\n');

  // 1. Get current featured_image for all recipes
  const { data: recipes } = await supabase
    .from('recipes')
    .select('slug, title, featured_image')
    .in('slug', SLUGS);

  if (!recipes) { console.log('No recipes found'); return; }

  const imageMap = new Map(recipes.map(r => [r.slug, r.featured_image]));
  console.log(`Found ${recipes.length} recipes`);

  // 2. Get EN slugs from translations
  const { data: translations } = await supabase
    .from('recipe_translations')
    .select('recipe_id, slug_en')
    .in('recipe_id', recipes.map(r => (r as any).id || 0));

  // Also get recipe IDs
  const { data: recipesWithId } = await supabase
    .from('recipes')
    .select('id, slug')
    .in('slug', SLUGS);

  const slugToId = new Map(recipesWithId?.map(r => [r.slug, r.id]) || []);

  const { data: allTranslations } = await supabase
    .from('recipe_translations')
    .select('recipe_id, slug_en')
    .in('recipe_id', Array.from(slugToId.values()));

  const idToEnSlug = new Map(allTranslations?.map(t => [t.recipe_id, t.slug_en]) || []);
  const frSlugToEnSlug = new Map<string, string>();
  for (const [frSlug, id] of slugToId) {
    const enSlug = idToEnSlug.get(id);
    if (enSlug) frSlugToEnSlug.set(frSlug, enSlug);
  }

  // 3. Get article content
  const { data: post } = await supabase.from('posts').select('id, content').eq('id', 95).single();
  const { data: trans } = await supabase.from('post_translations').select('id, content').eq('post_id', 95).eq('locale', 'en').single();

  if (!post || !trans) { console.log('Article not found'); return; }

  let contentFr = post.content;
  let contentEn = trans.content;
  let frCount = 0;
  let enCount = 0;

  // 4. FR: For each recipe, find the img tag before its /recette/SLUG/ link and replace src
  for (const slug of SLUGS) {
    const correctImage = imageMap.get(slug);
    if (!correctImage) { console.log(`  ⚠️ No image for ${slug}`); continue; }

    // Find the link to this recipe in FR content
    const linkPattern = `/recette/${slug}/`;
    const linkIdx = contentFr.indexOf(linkPattern);
    if (linkIdx === -1) { console.log(`  ⚠️ FR: ${slug} link not found`); continue; }

    // Look backwards from the link to find the nearest img src
    const before = contentFr.substring(Math.max(0, linkIdx - 3000), linkIdx);
    const imgSrcMatch = before.match(/src="(https?:\/\/[^"]+)"[^]*$/);
    if (!imgSrcMatch) { console.log(`  ⚠️ FR: No img found near ${slug}`); continue; }

    const currentUrl = imgSrcMatch[1];
    if (currentUrl === correctImage) {
      console.log(`  FR ✅ ${slug} (already correct)`);
    } else {
      // Replace this specific occurrence
      contentFr = contentFr.replace(currentUrl, correctImage);
      frCount++;
      console.log(`  FR 🔄 ${slug}`);
    }
  }

  // 5. EN: Same approach with EN slugs
  for (const slug of SLUGS) {
    const correctImage = imageMap.get(slug);
    if (!correctImage) continue;

    const enSlug = frSlugToEnSlug.get(slug);

    // Try both EN slug and FR slug patterns for the link
    let linkIdx = -1;
    if (enSlug) {
      linkIdx = contentEn.indexOf(`/recipe/${enSlug}`);
    }
    if (linkIdx === -1) {
      linkIdx = contentEn.indexOf(`/recipe/${slug}`);
    }
    if (linkIdx === -1) { console.log(`  ⚠️ EN: ${slug} link not found`); continue; }

    const before = contentEn.substring(Math.max(0, linkIdx - 3000), linkIdx);
    const imgSrcMatch = before.match(/src="(https?:\/\/[^"]+)"[^]*$/);
    if (!imgSrcMatch) { console.log(`  ⚠️ EN: No img found near ${slug}`); continue; }

    const currentUrl = imgSrcMatch[1];
    if (currentUrl === correctImage) {
      console.log(`  EN ✅ ${slug} (already correct)`);
    } else {
      contentEn = contentEn.replace(currentUrl, correctImage);
      enCount++;
      console.log(`  EN 🔄 ${slug}`);
    }
  }

  console.log(`\nReplacements: FR=${frCount}, EN=${enCount}`);

  // 6. Update
  if (frCount > 0) {
    const { error } = await supabase.from('posts').update({ content: contentFr }).eq('id', 95);
    if (error) console.error('FR error:', error.message);
    else console.log('✅ Article FR updated');
  } else {
    console.log('FR: no changes needed');
  }

  if (enCount > 0) {
    const { error } = await supabase.from('post_translations').update({ content: contentEn }).eq('id', trans.id);
    if (error) console.error('EN error:', error.message);
    else console.log('✅ Article EN updated');
  } else {
    console.log('EN: no changes needed');
  }

  console.log('\nDone!');
}

main().catch(console.error);
