import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  const { ingredientIds, locale = 'fr' } = await request.json();

  if (!ingredientIds || ingredientIds.length === 0) {
    return NextResponse.json([]);
  }

  // Récupérer toutes les liaisons recipe_ingredients pour les ingrédients sélectionnés
  const { data: recipeIngredients, error: riError } = await supabase
    .from('recipe_ingredients')
    .select('recipe_id, ingredient_id')
    .in('ingredient_id', ingredientIds);

  if (riError) {
    console.error('Erreur recipe_ingredients:', riError);
    return NextResponse.json([], { status: 500 });
  }

  if (!recipeIngredients || recipeIngredients.length === 0) {
    return NextResponse.json([]);
  }

  // Compter les ingrédients matchés par recette
  const recipeMatches = new Map<number, number>();
  for (const ri of recipeIngredients) {
    recipeMatches.set(ri.recipe_id, (recipeMatches.get(ri.recipe_id) || 0) + 1);
  }

  // Récupérer les IDs de recettes avec au moins 1 match
  const recipeIds = Array.from(recipeMatches.keys());

  // Récupérer les détails des recettes
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('id, slug, title, featured_image, total_time, difficulty')
    .in('id', recipeIds);

  if (recipesError) {
    console.error('Erreur fetch recipes:', recipesError);
    return NextResponse.json([], { status: 500 });
  }

  // Si locale anglaise, récupérer les traductions
  let translationsMap = new Map<number, { title: string; slug_en: string | null }>();
  if (locale === 'en' && recipes && recipes.length > 0) {
    const { data: translations } = await supabase
      .from('recipe_translations')
      .select('recipe_id, title, slug_en')
      .eq('locale', 'en')
      .in('recipe_id', recipeIds);

    if (translations) {
      for (const t of translations) {
        translationsMap.set(t.recipe_id, { title: t.title, slug_en: t.slug_en });
      }
    }
  }

  // Récupérer le nombre total d'ingrédients par recette
  const { data: allRecipeIngredients } = await supabase
    .from('recipe_ingredients')
    .select('recipe_id')
    .in('recipe_id', recipeIds);

  const totalIngredientsMap = new Map<number, number>();
  for (const ri of allRecipeIngredients || []) {
    totalIngredientsMap.set(ri.recipe_id, (totalIngredientsMap.get(ri.recipe_id) || 0) + 1);
  }

  // Construire la réponse avec le pourcentage de match
  const results = recipes?.map(recipe => {
    const matchingIngredients = recipeMatches.get(recipe.id) || 0;
    const totalIngredients = totalIngredientsMap.get(recipe.id) || 1;
    const matchPercentage = Math.round((matchingIngredients / totalIngredients) * 100);
    const translation = translationsMap.get(recipe.id);

    return {
      id: recipe.id,
      slug: locale === 'en' && translation?.slug_en ? translation.slug_en : recipe.slug,
      title: locale === 'en' && translation?.title ? translation.title : recipe.title,
      featuredImage: recipe.featured_image,
      totalTime: recipe.total_time,
      difficulty: recipe.difficulty,
      matchingIngredients,
      totalIngredients,
      matchPercentage,
    };
  }) || [];

  // Trier par pourcentage de match décroissant
  results.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return NextResponse.json(results);
}
