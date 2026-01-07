/**
 * Export all recipes from the PDF book as complete JSON with ingredients and instructions
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

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

// Nettoyer le HTML
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function getRecipes() {
  const result: any[] = [];
  const seenIds = new Set<number>();

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
      .select('*')
      .in('id', ids)
      .not('featured_image', 'is', null)
      .limit(config.count);

    if (recipes) {
      for (const recipe of recipes) {
        // Éviter les doublons
        if (seenIds.has(recipe.id)) continue;
        seenIds.add(recipe.id);

        // Formater les ingrédients
        const ingredients: any[] = [];
        if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
          for (const group of recipe.ingredients) {
            const formattedGroup: any = {
              title: group.title || null,
              items: []
            };

            for (const item of group.items || []) {
              formattedGroup.items.push({
                quantity: item.quantity || null,
                unit: item.unit || null,
                name: item.name || '',
                note: item.note || null
              });
            }

            ingredients.push(formattedGroup);
          }
        }

        // Formater les instructions
        const instructions: any[] = [];
        if (recipe.instructions && Array.isArray(recipe.instructions)) {
          for (const inst of recipe.instructions) {
            instructions.push({
              step: inst.step || instructions.length + 1,
              title: inst.title || null,
              content: stripHtml(inst.content || '')
            });
          }
        }

        result.push({
          id: recipe.id,
          slug: recipe.slug,
          category: categoryName,
          title: recipe.title,
          excerpt: recipe.excerpt ? stripHtml(recipe.excerpt) : null,
          featured_image: recipe.featured_image,
          prep_time: recipe.prep_time,
          cook_time: recipe.cook_time,
          total_time: recipe.total_time,
          servings: recipe.servings,
          servings_unit: recipe.servings_unit || 'portions',
          difficulty: recipe.difficulty,
          ingredients: ingredients,
          instructions: instructions,
          tips: recipe.tips ? stripHtml(recipe.tips) : null,
          url: `https://menucochon.com/recette/${recipe.slug}/`
        });
      }
    }
  }

  return result;
}

async function main() {
  console.log('📚 Export des recettes du livre PDF...\n');

  const recipes = await getRecipes();

  console.log(`✅ ${recipes.length} recettes exportées\n`);

  // Sauvegarder en fichier JSON
  const outputPath = path.join(process.cwd(), 'public', 'livre-recettes.json');
  fs.writeFileSync(outputPath, JSON.stringify(recipes, null, 2), 'utf-8');

  console.log(`📁 Fichier sauvegardé: ${outputPath}`);

  // Aussi afficher dans la console
  console.log('\n' + JSON.stringify(recipes, null, 2));
}

main();
