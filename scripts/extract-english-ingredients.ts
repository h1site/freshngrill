/**
 * Script pour extraire les ingrédients anglais des traductions de recettes existantes
 * et les ajouter à la table ingredients
 *
 * Usage:
 *   npx tsx scripts/extract-english-ingredients.ts
 *   npx tsx scripts/extract-english-ingredients.ts --dry-run
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { extractIngredientsFromRecipe, KNOWN_INGREDIENTS_EN } from '../src/lib/ingredient-extractor';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  console.log('='.repeat(50));
  console.log('Extract English Ingredients from Recipes');
  console.log('='.repeat(50));
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Known English ingredients: ${KNOWN_INGREDIENTS_EN.length}`);
  console.log();

  // Fetch all recipe translations with ingredients
  const { data: translations, error } = await supabase
    .from('recipe_translations')
    .select('recipe_id, ingredients')
    .eq('locale', 'en');

  if (error) {
    console.error('Error fetching translations:', error);
    process.exit(1);
  }

  console.log(`Found ${translations?.length || 0} English recipe translations`);

  const allExtractedIngredients = new Set<string>();
  let recipesProcessed = 0;
  let totalIngredientsLinked = 0;

  for (const translation of translations || []) {
    if (!translation.ingredients || !Array.isArray(translation.ingredients)) {
      continue;
    }

    // Extract ingredients from recipe
    // Handle both old format (items as strings) and new format (items as objects with name)
    const normalizedIngredients = translation.ingredients.map((group: any) => ({
      group: group.title || group.group,
      items: (group.items || []).map((item: any) =>
        typeof item === 'string' ? item : item.name || ''
      ),
    }));

    const detectedIngredients = extractIngredientsFromRecipe(normalizedIngredients, 'en');

    if (detectedIngredients.length === 0) {
      continue;
    }

    recipesProcessed++;
    console.log(`\nRecipe ${translation.recipe_id}: found ${detectedIngredients.length} ingredients`);
    console.log(`  Ingredients: ${detectedIngredients.join(', ')}`);

    for (const ingredientName of detectedIngredients) {
      allExtractedIngredients.add(ingredientName);

      const slug = ingredientName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      if (!DRY_RUN) {
        // Check if ingredient already exists
        const { data: existingIngredient } = await supabase
          .from('ingredients')
          .select('id')
          .eq('slug', slug)
          .single();

        let ingredientId: number;

        if (existingIngredient) {
          ingredientId = existingIngredient.id;
        } else {
          // Create new ingredient
          const { data: newIngredient, error: insertError } = await supabase
            .from('ingredients')
            .insert({
              slug,
              name: ingredientName
            })
            .select('id')
            .single();

          if (insertError) {
            console.error(`  Error creating ingredient "${ingredientName}":`, insertError.message);
            continue;
          }

          ingredientId = newIngredient!.id;
          console.log(`  Created new ingredient: ${ingredientName} (${slug})`);
        }

        // Link ingredient to recipe (if not already linked)
        const { data: existingLink } = await supabase
          .from('recipe_ingredients')
          .select('id')
          .eq('recipe_id', translation.recipe_id)
          .eq('ingredient_id', ingredientId)
          .single();

        if (!existingLink) {
          const { error: linkError } = await supabase
            .from('recipe_ingredients')
            .insert({
              recipe_id: translation.recipe_id,
              ingredient_id: ingredientId
            });

          if (linkError) {
            console.error(`  Error linking ingredient:`, linkError.message);
          } else {
            totalIngredientsLinked++;
          }
        }
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('Summary');
  console.log('='.repeat(50));
  console.log(`Recipes processed: ${recipesProcessed}`);
  console.log(`Unique ingredients found: ${allExtractedIngredients.size}`);
  if (!DRY_RUN) {
    console.log(`New ingredient links created: ${totalIngredientsLinked}`);
  }
  console.log('\nUnique ingredients:');
  Array.from(allExtractedIngredients).sort().forEach(ing => {
    console.log(`  - ${ing}`);
  });

  console.log('\nDone!');
}

main().catch(console.error);
