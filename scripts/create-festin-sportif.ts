/**
 * Create "Festin Sportif" category and link 20 Super Bowl recipes
 * Usage: npx tsx scripts/create-festin-sportif.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SUPERBOWL_SLUGS = [
  'ailes-de-poulet-buffalo',
  'nachos-supreme-fromage',
  'trempette-pizza-chaude',
  'mini-pogos-fromage-biere',
  'jalapeno-poppers-bacon',
  'ailes-general-tao-erable',
  'pelures-patates-garnies',
  'trempette-fromage-biere',
  'boulettes-viande-sauce-bbq',
  'mini-burgers-smash',
  'fromage-en-croute-curds',
  'guacamole-maison-chips',
  'pizza-baguette-pepperoni',
  'saucisses-cocktail-erable-whisky',
  'rondelles-oignon-panees',
  'tacos-poulet-bbq',
  'mac-and-cheese-bacon',
  'crevettes-coco-panees',
  'chili-con-carne-superbowl',
  'cotes-levees-sauce-bbq-maison',
];

async function main() {
  console.log('Creating "Festin Sportif" category...');

  // 1. Create category
  const { data: existingCat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'festin-sportif')
    .single();

  let categoryId: number;

  if (existingCat) {
    categoryId = existingCat.id;
    console.log(`Category already exists (ID: ${categoryId})`);
  } else {
    const { data: newCat, error: catError } = await supabase
      .from('categories')
      .insert({ slug: 'festin-sportif', name: 'Festin Sportif' })
      .select('id')
      .single();

    if (catError || !newCat) {
      console.error('Error creating category:', catError?.message);
      return;
    }
    categoryId = newCat.id;
    console.log(`Category created (ID: ${categoryId})`);
  }

  // 2. Get recipe IDs
  const { data: recipes, error: recError } = await supabase
    .from('recipes')
    .select('id, slug')
    .in('slug', SUPERBOWL_SLUGS);

  if (recError || !recipes) {
    console.error('Error fetching recipes:', recError?.message);
    return;
  }

  console.log(`Found ${recipes.length}/${SUPERBOWL_SLUGS.length} recipes`);

  // Show which ones are missing
  const foundSlugs = recipes.map(r => r.slug);
  const missing = SUPERBOWL_SLUGS.filter(s => !foundSlugs.includes(s));
  if (missing.length > 0) {
    console.log('Missing recipes:', missing);
  }

  // 3. Link recipes to category
  let linked = 0;
  for (const recipe of recipes) {
    const { error: linkError } = await supabase
      .from('recipe_categories')
      .insert({ recipe_id: recipe.id, category_id: categoryId })
      .select();

    if (linkError) {
      if (linkError.message.includes('duplicate') || linkError.code === '23505') {
        console.log(`  ${recipe.slug} - already linked`);
      } else {
        console.error(`  ${recipe.slug} - error:`, linkError.message);
      }
    } else {
      console.log(`  ${recipe.slug} - linked`);
      linked++;
    }
  }

  console.log(`\nDone! ${linked} new links created, ${recipes.length} total recipes in category.`);
}

main().catch(console.error);
