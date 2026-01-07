/**
 * Export all recipes from the PDF book as JSON
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORY_MAP: Record<string, { slug: string; count: number }> = {
  'Plats principaux - Boeuf': { slug: 'plats-principaux-boeuf', count: 5 },
  'Plats principaux - Volaille': { slug: 'plats-principaux-volaille', count: 5 },
  'Plats principaux - Porc': { slug: 'plats-principaux-porc', count: 5 },
  'Plats principaux - Poissons': { slug: 'plat-principaux-poissons', count: 3 },
  'Soupes': { slug: 'soupes', count: 5 },
  'Desserts': { slug: 'dessert', count: 8 },
  'Pâtes': { slug: 'pates', count: 4 },
  'Salades': { slug: 'salades', count: 3 },
  'Déjeuner': { slug: 'dejeuner', count: 4 },
  'Accompagnements': { slug: 'plats-daccompagnement-legumes', count: 4 },
  'Boissons': { slug: 'boissons', count: 2 },
  'Poutine': { slug: 'poutine', count: 2 },
};

async function getRecipes() {
  const result: any[] = [];

  for (const [categoryName, config] of Object.entries(CATEGORY_MAP)) {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', config.slug)
      .single();

    if (!categoryData) continue;

    const { data: recipeIds } = await supabase
      .from('recipe_categories')
      .select('recipe_id')
      .eq('category_id', categoryData.id)
      .limit(config.count * 2);

    if (!recipeIds) continue;

    const ids = recipeIds.map(r => r.recipe_id);

    const { data: recipes } = await supabase
      .from('recipes')
      .select('id, slug, title, excerpt, featured_image, prep_time, cook_time, total_time, servings, difficulty')
      .in('id', ids)
      .not('featured_image', 'is', null)
      .limit(config.count);

    if (recipes) {
      for (const recipe of recipes) {
        result.push({
          category: categoryName,
          id: recipe.id,
          slug: recipe.slug,
          title: recipe.title,
          featured_image: recipe.featured_image,
          prep_time: recipe.prep_time,
          cook_time: recipe.cook_time,
          total_time: recipe.total_time,
          servings: recipe.servings,
          difficulty: recipe.difficulty
        });
      }
    }
  }

  console.log(JSON.stringify(result, null, 2));
}

getRecipes();
