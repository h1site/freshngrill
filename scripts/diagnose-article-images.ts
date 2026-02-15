/**
 * Diagnose Super Bowl article images - show current state
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
  // 1. Get current recipe images
  const { data: recipes } = await supabase
    .from('recipes')
    .select('slug, title, featured_image')
    .in('slug', SLUGS);

  if (!recipes) { console.log('No recipes found'); return; }

  const imageMap = new Map(recipes.map(r => [r.slug, r.featured_image]));

  console.log('=== CURRENT RECIPE IMAGES ===');
  for (const slug of SLUGS) {
    const img = imageMap.get(slug);
    console.log(`  ${slug}: ${img ? img.substring(0, 80) + '...' : 'NO IMAGE'}`);
  }

  // 2. Get article content
  const { data: post } = await supabase.from('posts').select('id, content').eq('id', 95).single();
  const { data: trans } = await supabase.from('post_translations').select('id, content').eq('post_id', 95).eq('locale', 'en').single();

  if (!post || !trans) { console.log('Article not found'); return; }

  // 3. Extract ALL image URLs from FR article
  const frImgRegex = /src="(https?:\/\/[^"]+)"/g;
  const frImages: string[] = [];
  let match;
  while ((match = frImgRegex.exec(post.content)) !== null) {
    frImages.push(match[1]);
  }

  const enImgRegex = /src="(https?:\/\/[^"]+)"/g;
  const enImages: string[] = [];
  while ((match = enImgRegex.exec(trans.content)) !== null) {
    enImages.push(match[1]);
  }

  console.log(`\n=== FR ARTICLE IMAGES (${frImages.length} total) ===`);
  frImages.forEach((url, i) => {
    const isCorrect = Array.from(imageMap.values()).includes(url);
    console.log(`  ${i + 1}. ${isCorrect ? '✅' : '❌'} ${url.substring(0, 100)}...`);
  });

  console.log(`\n=== EN ARTICLE IMAGES (${enImages.length} total) ===`);
  enImages.forEach((url, i) => {
    const isCorrect = Array.from(imageMap.values()).includes(url);
    console.log(`  ${i + 1}. ${isCorrect ? '✅' : '❌'} ${url.substring(0, 100)}...`);
  });

  // 4. For each slug, check if article has correct image nearby
  console.log('\n=== SLUG MATCHING ===');
  for (const slug of SLUGS) {
    const correctImage = imageMap.get(slug);

    // Check FR - find image near slug link
    const frSlugIdx = post.content.indexOf(`/recette/${slug}/`);
    const enSlugIdx = trans.content.indexOf(`/recipe/${slug}`);

    // Find nearest image before the slug link
    let frImgNear = 'NOT FOUND';
    if (frSlugIdx > -1) {
      const before = post.content.substring(Math.max(0, frSlugIdx - 2000), frSlugIdx);
      const imgs = before.match(/src="(https?:\/\/[^"]+)"/g);
      if (imgs && imgs.length > 0) {
        const lastImg = imgs[imgs.length - 1];
        frImgNear = lastImg.replace('src="', '').replace('"', '');
      }
    }

    const frMatch = frImgNear === correctImage;
    console.log(`  ${slug}:`);
    console.log(`    FR: ${frMatch ? '✅' : '❌'} ${frImgNear.substring(0, 80)}`);
    if (!frMatch && correctImage) {
      console.log(`    FR expected: ${correctImage.substring(0, 80)}`);
    }
  }
}

main().catch(console.error);
