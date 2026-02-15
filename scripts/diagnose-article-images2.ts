/**
 * Detailed diagnosis - check each recipe image is matched to the correct slug
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
  const { data: recipes } = await supabase
    .from('recipes')
    .select('slug, title, featured_image')
    .in('slug', SLUGS);

  if (!recipes) { console.log('No recipes found'); return; }

  const imageMap = new Map(recipes.map(r => [r.slug, r.featured_image]));
  // Reverse map: image URL -> slug
  const reverseMap = new Map(recipes.map(r => [r.featured_image, r.slug]));

  const { data: post } = await supabase.from('posts').select('id, content').eq('id', 95).single();
  const { data: trans } = await supabase.from('post_translations').select('id, content').eq('post_id', 95).eq('locale', 'en').single();

  if (!post || !trans) { console.log('Article not found'); return; }

  // Extract image+slug pairs from FR article
  // Pattern: <img src="URL" ...> ... <a href="/recette/SLUG/">
  // Each recipe block typically has: img then link
  console.log('=== FR: IMAGE -> SLUG MAPPING ===');
  const frBlocks = post.content.split(/(?=<img\s)/);
  let frMismatches = 0;
  for (const block of frBlocks) {
    const imgMatch = block.match(/src="(https?:\/\/[^"]+)"/);
    const slugMatch = block.match(/\/recette\/([^/"]+)\//);
    if (imgMatch && slugMatch) {
      const imgUrl = imgMatch[1];
      const slug = slugMatch[1];
      const expectedImg = imageMap.get(slug);
      const actualSlug = reverseMap.get(imgUrl) || 'UNKNOWN';
      const correct = imgUrl === expectedImg;
      if (!correct) frMismatches++;
      console.log(`  ${correct ? '✅' : '❌'} slug=${slug} | img belongs to: ${actualSlug}`);
      if (!correct) {
        console.log(`     CURRENT:  ${imgUrl}`);
        console.log(`     EXPECTED: ${expectedImg}`);
      }
    }
  }

  console.log(`\nFR mismatches: ${frMismatches}`);

  console.log('\n=== EN: IMAGE -> SLUG MAPPING ===');
  const enBlocks = trans.content.split(/(?=<img\s)/);
  let enMismatches = 0;
  for (const block of enBlocks) {
    const imgMatch = block.match(/src="(https?:\/\/[^"]+)"/);
    const slugMatch = block.match(/\/recipe\/([^/"]+)/);
    if (imgMatch && slugMatch) {
      const imgUrl = imgMatch[1];
      const slug = slugMatch[1];
      // Find the FR slug from EN slug
      const expectedImg = findImageByEnSlug(slug, recipes);
      const actualSlug = reverseMap.get(imgUrl) || 'UNKNOWN';
      const correct = imgUrl === expectedImg;
      if (!correct) enMismatches++;
      console.log(`  ${correct ? '✅' : '❌'} en-slug=${slug} | img belongs to: ${actualSlug}`);
      if (!correct) {
        console.log(`     CURRENT:  ${imgUrl}`);
        console.log(`     EXPECTED: ${expectedImg}`);
      }
    }
  }
  console.log(`\nEN mismatches: ${enMismatches}`);

  // Also check: which slugs are missing an image in the article?
  console.log('\n=== MISSING FROM FR ARTICLE ===');
  for (const slug of SLUGS) {
    if (!post.content.includes(`/recette/${slug}/`)) {
      console.log(`  ⚠️ ${slug} not linked in FR article`);
    }
  }

  console.log('\n=== MISSING IMAGE CHECK ===');
  // Check for any image NOT in our recipe set
  const allFrImgs = post.content.match(/src="(https?:\/\/[^"]+)"/g) || [];
  for (const img of allFrImgs) {
    const url = img.replace('src="', '').replace('"', '');
    if (!reverseMap.has(url)) {
      console.log(`  ⚠️ FR unknown image: ${url}`);
    }
  }
  const allEnImgs = trans.content.match(/src="(https?:\/\/[^"]+)"/g) || [];
  for (const img of allEnImgs) {
    const url = img.replace('src="', '').replace('"', '');
    if (!reverseMap.has(url)) {
      console.log(`  ⚠️ EN unknown image: ${url}`);
    }
  }
}

function findImageByEnSlug(enSlug: string, recipes: Array<{slug: string; featured_image: string}>): string | undefined {
  // The EN slug might match partially with FR slug
  // For these Super Bowl recipes, let's try direct match first
  const recipe = recipes.find(r => r.slug === enSlug);
  if (recipe) return recipe.featured_image;
  return undefined;
}

main().catch(console.error);
