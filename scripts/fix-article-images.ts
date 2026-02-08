/**
 * Fix Super Bowl article images - replace old DALL-E URLs with new recipe images
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
  console.log('Fixing Super Bowl article images...\n');

  // 1. Get all recipe images
  const { data: recipes } = await supabase
    .from('recipes')
    .select('slug, title, featured_image')
    .in('slug', SLUGS);

  if (!recipes) { console.log('No recipes found'); return; }

  const imageMap = new Map(recipes.map(r => [r.slug, r.featured_image]));
  console.log(`Found ${recipes.length} recipes with images`);

  // 2. Get article FR + EN
  const { data: post } = await supabase.from('posts').select('id, content').eq('id', 95).single();
  const { data: trans } = await supabase.from('post_translations').select('id, content').eq('post_id', 95).eq('locale', 'en').single();

  if (!post || !trans) { console.log('Article not found'); return; }

  let contentFr = post.content;
  let contentEn = trans.content;
  let replacementsFr = 0;
  let replacementsEn = 0;

  // 3. For each recipe, find any img src containing the slug and replace with new URL
  for (const slug of SLUGS) {
    const newUrl = imageMap.get(slug);
    if (!newUrl) {
      console.log(`  ⚠️  No image for ${slug}`);
      continue;
    }

    // Match img tags containing this slug in src attribute
    // Old DALL-E format: recipes/SLUG.png
    const oldUrl = `https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/recipes/${slug}.png`;

    if (contentFr.includes(oldUrl)) {
      contentFr = contentFr.split(oldUrl).join(newUrl);
      replacementsFr++;
      console.log(`  FR ✅ ${slug}`);
    }

    if (contentEn.includes(oldUrl)) {
      contentEn = contentEn.split(oldUrl).join(newUrl);
      replacementsEn++;
      console.log(`  EN ✅ ${slug}`);
    }
  }

  // 4. Check for any remaining old recipe-images URLs and try to match by proximity
  const remainingFr = contentFr.match(/src="([^"]*recipe-images\/recipes\/[^"]*)"/g) || [];
  const remainingEn = contentEn.match(/src="([^"]*recipe-images\/recipes\/[^"]*)"/g) || [];

  if (remainingFr.length > 0 || remainingEn.length > 0) {
    console.log(`\nRemaining image URLs to check:`);
    console.log(`  FR: ${remainingFr.length} images`);
    remainingFr.forEach((m: string) => console.log(`    ${m}`));
    console.log(`  EN: ${remainingEn.length} images`);
    remainingEn.forEach((m: string) => console.log(`    ${m}`));

    // Try to match remaining URLs by finding the slug in context
    // Look at the surrounding HTML to find which recipe each image belongs to
    for (const slug of SLUGS) {
      const newUrl = imageMap.get(slug);
      if (!newUrl) continue;

      // Check if the slug appears in a nearby link (within ~500 chars of an old image)
      const frPattern = new RegExp(`<img[^>]*src="(https://[^"]*recipe-images/recipes/[^"]*)"[^>]*/?>([\\s\\S]{0,500}?)/recette/${slug}/`, 'g');
      let match;
      while ((match = frPattern.exec(contentFr)) !== null) {
        const oldImgUrl = match[1];
        if (oldImgUrl !== newUrl) {
          contentFr = contentFr.split(oldImgUrl).join(newUrl);
          replacementsFr++;
          console.log(`  FR (context) ✅ ${slug}: ${oldImgUrl.substring(0, 60)}...`);
        }
      }

      const enPattern = new RegExp(`<img[^>]*src="(https://[^"]*recipe-images/recipes/[^"]*)"[^>]*/?>([\\s\\S]{0,500}?)/en/recipe/`, 'g');
      while ((match = enPattern.exec(contentEn)) !== null) {
        const oldImgUrl = match[1];
        // Try to match by order (same index)
        const idx = SLUGS.indexOf(slug);
        // Replace all remaining old URLs in order
      }
    }

    // Simpler approach: extract ALL img src URLs in order, map to recipes in order
    const imgSrcPatternFr = /src="(https:\/\/[^"]*recipe-images\/recipes\/[^"]*)"/g;
    const imgSrcPatternEn = /src="(https:\/\/[^"]*recipe-images\/recipes\/[^"]*)"/g;

    let idx = 0;
    contentFr = contentFr.replace(imgSrcPatternFr, (match: string, url: string) => {
      if (idx < SLUGS.length) {
        const newUrl = imageMap.get(SLUGS[idx]);
        idx++;
        if (newUrl && url !== newUrl) {
          replacementsFr++;
          return `src="${newUrl}"`;
        }
      }
      return match;
    });

    idx = 0;
    contentEn = contentEn.replace(imgSrcPatternEn, (match: string, url: string) => {
      if (idx < SLUGS.length) {
        const newUrl = imageMap.get(SLUGS[idx]);
        idx++;
        if (newUrl && url !== newUrl) {
          replacementsEn++;
          return `src="${newUrl}"`;
        }
      }
      return match;
    });
  }

  console.log(`\nTotal replacements: FR=${replacementsFr}, EN=${replacementsEn}`);

  // 5. Update article
  const { error: frError } = await supabase.from('posts').update({ content: contentFr }).eq('id', 95);
  if (frError) console.error('FR update error:', frError.message);
  else console.log('✅ Article FR updated');

  const { error: enError } = await supabase.from('post_translations').update({ content: contentEn }).eq('id', trans.id);
  if (enError) console.error('EN update error:', enError.message);
  else console.log('✅ Article EN updated');

  console.log('\nDone!');
}

main().catch(console.error);
