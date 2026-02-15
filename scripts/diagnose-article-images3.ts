/**
 * Check which recipes still have old DALL-E images as featured_image
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

  if (!recipes) return;

  console.log('=== ALL 20 RECIPE featured_image URLs ===\n');

  let oldCount = 0;
  let newCount = 0;

  for (const slug of SLUGS) {
    const recipe = recipes.find(r => r.slug === slug);
    if (!recipe) {
      console.log(`  ❌ ${slug}: NOT FOUND IN DB`);
      continue;
    }

    const url = recipe.featured_image;
    // Old DALL-E format: recipes/SLUG.png
    const isOldDalle = url && url.endsWith('.png') && url.includes(`/${slug}.png`);

    if (isOldDalle) {
      oldCount++;
      console.log(`  🔴 OLD DALL-E: ${slug}`);
      console.log(`     ${url}`);
    } else {
      newCount++;
      console.log(`  🟢 NEW IMAGE:  ${slug}`);
      console.log(`     ${url}`);
    }
  }

  console.log(`\nSummary: ${newCount} new images, ${oldCount} old DALL-E images`);

  // Also check article content for the 20th recipe (cotes-levees)
  const { data: post } = await supabase.from('posts').select('id, content').eq('id', 95).single();
  if (post) {
    const hasCotelettesImg = post.content.includes('cotes-levees-sauce-bbq-maison');
    const imgCount = (post.content.match(/<img /g) || []).length;
    console.log(`\nFR article: ${imgCount} <img> tags, cotes-levees slug present: ${hasCotelettesImg}`);

    // Show text around cotes-levees link
    const idx = post.content.indexOf('cotes-levees-sauce-bbq-maison');
    if (idx > -1) {
      const context = post.content.substring(Math.max(0, idx - 500), idx + 200);
      console.log(`\nContext around cotes-levees in FR:\n${context.substring(context.lastIndexOf('<'), 700)}`);
    }
  }
}

main().catch(console.error);
