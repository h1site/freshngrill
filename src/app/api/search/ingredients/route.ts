import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { IngredientGroup } from '@/types/recipe';

interface RecipeWithIngredients {
  id: number;
  slug: string;
  title: string;
  featured_image: string | null;
  total_time: number;
  difficulty: string;
  ingredients: IngredientGroup[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ingredientsParam = searchParams.get('ingredients');
  const suggestParam = searchParams.get('suggest');

  // Mode suggestion d'ingrédients
  if (suggestParam && suggestParam.length >= 2) {
    const { data: recipes } = await supabase
      .from('recipes')
      .select('ingredients') as { data: { ingredients: IngredientGroup[] | null }[] | null };

    const ingredientSet = new Set<string>();

    for (const recipe of recipes || []) {
      const groups = recipe.ingredients;
      if (!groups) continue;

      for (const group of groups) {
        for (const item of group.items || []) {
          if (item.name) {
            const normalized = item.name.toLowerCase().trim();
            if (normalized.includes(suggestParam.toLowerCase()) && normalized.length > 1) {
              ingredientSet.add(normalized);
            }
          }
        }
      }
    }

    const suggestions = Array.from(ingredientSet).sort().slice(0, 10);
    return NextResponse.json({ suggestions });
  }

  // Mode recherche par ingrédients
  if (!ingredientsParam) {
    return NextResponse.json({ recipes: [], total: 0 });
  }

  const searchIngredients = ingredientsParam
    .split(',')
    .map((i) => i.toLowerCase().trim())
    .filter((i) => i.length > 0);

  if (searchIngredients.length === 0) {
    return NextResponse.json({ recipes: [], total: 0 });
  }

  const { data, error } = await supabase
    .from('recipes')
    .select('id, slug, title, featured_image, total_time, difficulty, ingredients');

  if (error) {
    console.error('Erreur recherche par ingrédients:', error);
    return NextResponse.json({ recipes: [], total: 0 });
  }

  const results: Array<{
    id: number;
    slug: string;
    title: string;
    featured_image: string | null;
    total_time: number;
    difficulty: string;
    matchedCount: number;
    totalIngredients: number;
    matchScore: number;
  }> = [];

  for (const recipe of (data || []) as RecipeWithIngredients[]) {
    const groups = recipe.ingredients;
    if (!groups) continue;

    // Extraire tous les ingrédients de la recette
    const recipeIngredients: string[] = [];
    for (const group of groups) {
      for (const item of group.items || []) {
        if (item.name) {
          recipeIngredients.push(item.name.toLowerCase().trim());
        }
      }
    }

    if (recipeIngredients.length === 0) continue;

    // Trouver les ingrédients matchés
    const matchedIngredients: string[] = [];
    for (const searchIng of searchIngredients) {
      const found = recipeIngredients.find(
        (recipeIng) => recipeIng.includes(searchIng) || searchIng.includes(recipeIng)
      );
      if (found) {
        matchedIngredients.push(found);
      }
    }

    if (matchedIngredients.length > 0) {
      const uniqueMatched = [...new Set(matchedIngredients)];
      results.push({
        id: recipe.id,
        slug: recipe.slug,
        title: recipe.title,
        featured_image: recipe.featured_image,
        total_time: recipe.total_time,
        difficulty: recipe.difficulty,
        matchedCount: uniqueMatched.length,
        totalIngredients: recipeIngredients.length,
        matchScore: Math.round((uniqueMatched.length / recipeIngredients.length) * 100),
      });
    }
  }

  // Trier par score de match décroissant
  results.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    return b.matchedCount - a.matchedCount;
  });

  return NextResponse.json({
    recipes: results.slice(0, 10),
    total: results.length,
  });
}
