import { supabase } from './supabase';
import { Recipe, RecipeCard, Category, IngredientGroup, InstructionStep, NutritionInfo } from '@/types/recipe';

// Transformer les données Supabase vers le format Recipe
function transformRecipe(data: any): Recipe {
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt || '',
    content: data.content || '',
    featuredImage: data.featured_image || '',
    images: data.images || [],
    // Champs ACF
    introduction: data.introduction || undefined,
    conclusion: data.conclusion || undefined,
    faq: data.faq || undefined,
    videoUrl: data.video_url || undefined,
    // Temps
    prepTime: data.prep_time,
    cookTime: data.cook_time,
    restTime: data.rest_time,
    totalTime: data.total_time,
    servings: data.servings,
    servingsUnit: data.servings_unit,
    difficulty: data.difficulty,
    ingredients: data.ingredients as IngredientGroup[],
    instructions: data.instructions as InstructionStep[],
    nutrition: data.nutrition as NutritionInfo | undefined,
    categories: data.categories || [],
    tags: data.tags || [],
    cuisine: data.cuisine,
    // Taxonomies ACF
    ingredientTags: data.ingredient_tags || undefined,
    origineTags: data.origine_tags || undefined,
    cuisineTypeTags: data.cuisine_type_tags || undefined,
    author: data.author,
    publishedAt: data.published_at,
    updatedAt: data.updated_at,
    likes: data.likes,
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
  };
}

/**
 * Obtenir toutes les recettes
 */
export async function getAllRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes_with_categories')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Erreur getAllRecipes:', error);
    return [];
  }

  return (data || []).map(transformRecipe);
}

/**
 * Obtenir une recette par son slug
 */
export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes_with_categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Erreur getRecipeBySlug:', error);
    return null;
  }

  return data ? transformRecipe(data) : null;
}

/**
 * Obtenir une recette par son slug avec traduction
 * Supporte les slugs français ET anglais pour locale='en'
 */
export async function getRecipeBySlugWithLocale(slug: string, locale: 'fr' | 'en' = 'fr'): Promise<(Recipe & { slugEn?: string; slugFr?: string }) | null> {
  // Si locale anglais, d'abord chercher par slug_en dans les traductions
  if (locale === 'en') {
    const { data: translationBySlug } = await supabase
      .from('recipe_translations')
      .select('*, recipes!inner(slug)')
      .eq('slug_en', slug)
      .eq('locale', 'en')
      .single();

    if (translationBySlug) {
      // On a trouvé par le slug anglais, récupérer la recette complète
      const frenchSlug = (translationBySlug as any).recipes?.slug;
      const { data, error } = await supabase
        .from('recipes_with_categories')
        .select('*')
        .eq('slug', frenchSlug)
        .single();

      if (!error && data) {
        const recipe = transformRecipe(data);
        const t = translationBySlug as any;
        return {
          ...recipe,
          slugFr: recipe.slug,
          slugEn: t.slug_en || slug,
          title: t.title || recipe.title,
          excerpt: t.excerpt || recipe.excerpt,
          introduction: t.introduction || recipe.introduction,
          conclusion: t.conclusion || recipe.conclusion,
          content: t.content || recipe.content,
          faq: t.faq || recipe.faq,
          ingredients: t.ingredients || recipe.ingredients,
          instructions: t.instructions || recipe.instructions,
          seoTitle: t.seo_title || recipe.seoTitle,
          seoDescription: t.seo_description || recipe.seoDescription,
        };
      }
    }
  }

  // Chercher par slug français (comportement par défaut)
  const { data, error } = await supabase
    .from('recipes_with_categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Erreur getRecipeBySlugWithLocale:', error);
    return null;
  }

  if (!data) return null;

  const recipe = transformRecipe(data);

  // Si locale français, retourner tel quel
  if (locale === 'fr') {
    return { ...recipe, slugFr: recipe.slug };
  }

  // Chercher la traduction anglaise
  const { data: translation, error: translationError } = await supabase
    .from('recipe_translations')
    .select('*')
    .eq('recipe_id', recipe.id)
    .eq('locale', 'en')
    .single();

  if (translationError || !translation) {
    // Pas de traduction disponible, retourner la version française
    console.log(`No English translation found for recipe ${slug}`);
    return { ...recipe, slugFr: recipe.slug };
  }

  // Cast translation to any to access dynamic fields from Supabase
  const t = translation as any;

  // Appliquer les traductions
  return {
    ...recipe,
    slugFr: recipe.slug,
    slugEn: t.slug_en || undefined,
    title: t.title || recipe.title,
    excerpt: t.excerpt || recipe.excerpt,
    introduction: t.introduction || recipe.introduction,
    conclusion: t.conclusion || recipe.conclusion,
    content: t.content || recipe.content,
    faq: t.faq || recipe.faq,
    ingredients: t.ingredients || recipe.ingredients,
    instructions: t.instructions || recipe.instructions,
    seoTitle: t.seo_title || recipe.seoTitle,
    seoDescription: t.seo_description || recipe.seoDescription,
  };
}

/**
 * Obtenir tous les slugs anglais (pour generateStaticParams)
 */
export async function getAllEnglishRecipeSlugs(): Promise<{ slugEn: string; slugFr: string }[]> {
  const { data, error } = await supabase
    .from('recipe_translations')
    .select('slug_en, recipe_id, recipes!inner(slug)')
    .eq('locale', 'en')
    .not('slug_en', 'is', null);

  if (error) {
    console.error('Erreur getAllEnglishRecipeSlugs:', error);
    return [];
  }

  return (data || []).map((t: any) => ({
    slugEn: t.slug_en,
    slugFr: t.recipes?.slug,
  })).filter((s: { slugEn: string | null }) => s.slugEn);
}

/**
 * Obtenir une recette par son ID
 */
export async function getRecipeById(id: number): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes_with_categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erreur getRecipeById:', error);
    return null;
  }

  return data ? transformRecipe(data) : null;
}

/**
 * Obtenir les cartes de recettes (version légère)
 */
export async function getRecipeCards(): Promise<RecipeCard[]> {
  const { data, error } = await supabase
    .from('recipes_with_categories')
    .select('id, slug, title, featured_image, prep_time, cook_time, total_time, difficulty, categories, likes')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Erreur getRecipeCards:', error);
    return [];
  }

  return (data as any[] || []).map((recipe) => ({
    id: recipe.id,
    slug: recipe.slug,
    title: recipe.title,
    featuredImage: recipe.featured_image || '',
    prepTime: recipe.prep_time,
    cookTime: recipe.cook_time,
    totalTime: recipe.total_time,
    difficulty: recipe.difficulty,
    categories: recipe.categories || [],
    likes: recipe.likes,
  }));
}

/**
 * Obtenir les recettes par catégorie
 */
export async function getRecipesByCategory(categorySlug: string): Promise<Recipe[]> {
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (!category) return [];

  const { data: recipeIds } = await supabase
    .from('recipe_categories')
    .select('recipe_id')
    .eq('category_id', (category as any).id);

  if (!recipeIds?.length) return [];

  const { data, error } = await supabase
    .from('recipes_with_categories')
    .select('*')
    .in('id', (recipeIds as any[]).map(r => r.recipe_id))
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Erreur getRecipesByCategory:', error);
    return [];
  }

  return (data || []).map(transformRecipe);
}

/**
 * Obtenir les recettes par tag
 */
export async function getRecipesByTag(tag: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes_with_categories')
    .select('*')
    .contains('tags', [tag])
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Erreur getRecipesByTag:', error);
    return [];
  }

  return (data || []).map(transformRecipe);
}

/**
 * Rechercher des recettes
 */
export async function searchRecipes(query: string): Promise<Recipe[]> {
  const searchTerm = `%${query}%`;

  const { data, error } = await supabase
    .from('recipes_with_categories')
    .select('*')
    .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Erreur searchRecipes:', error);
    return [];
  }

  return (data || []).map(transformRecipe);
}

/**
 * Obtenir les recettes les plus populaires
 */
export async function getPopularRecipes(limit: number = 10): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes_with_categories')
    .select('*')
    .order('likes', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erreur getPopularRecipes:', error);
    return [];
  }

  return (data || []).map(transformRecipe);
}

/**
 * Obtenir les recettes récentes
 */
export async function getRecentRecipes(limit: number = 10): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes_with_categories')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erreur getRecentRecipes:', error);
    return [];
  }

  return (data || []).map(transformRecipe);
}

/**
 * Obtenir les recettes similaires (avec fallback sur recettes récentes)
 */
export async function getSimilarRecipes(recipe: Recipe, limit: number = 4): Promise<Recipe[]> {
  const categoryIds = recipe.categories.map((c) => c.id);

  // Si la recette a des catégories, chercher des recettes similaires
  if (categoryIds.length > 0) {
    const { data: recipeIds } = await supabase
      .from('recipe_categories')
      .select('recipe_id')
      .in('category_id', categoryIds)
      .neq('recipe_id', recipe.id);

    if (recipeIds?.length) {
      const uniqueIds = [...new Set((recipeIds as any[]).map(r => r.recipe_id))].slice(0, limit);

      const { data, error } = await supabase
        .from('recipes_with_categories')
        .select('*')
        .in('id', uniqueIds);

      if (!error && data?.length) {
        return data.map(transformRecipe);
      }
    }
  }

  // Fallback: retourner des recettes récentes (exclure la recette actuelle)
  const { data: fallbackData, error: fallbackError } = await supabase
    .from('recipes_with_categories')
    .select('*')
    .neq('id', recipe.id)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (fallbackError) {
    console.error('Erreur getSimilarRecipes fallback:', fallbackError);
    return [];
  }

  return (fallbackData || []).map(transformRecipe);
}

/**
 * Obtenir toutes les catégories
 */
export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Erreur getAllCategories:', error);
    return [];
  }

  return (data as any[] || []).map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    parent: cat.parent_id ?? undefined,
  }));
}

/**
 * Obtenir une catégorie par son slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Erreur getCategoryBySlug:', error);
    return null;
  }

  const cat = data as any;
  return cat ? {
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    parent: cat.parent_id ?? undefined,
  } : null;
}

/**
 * Obtenir tous les slugs de recettes (pour generateStaticParams)
 */
export async function getAllRecipeSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('slug');

  if (error) {
    console.error('Erreur getAllRecipeSlugs:', error);
    return [];
  }

  return (data as any[] || []).map((recipe) => recipe.slug);
}

/**
 * Obtenir tous les slugs de catégories
 */
export async function getAllCategorySlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('slug');

  if (error) {
    console.error('Erreur getAllCategorySlugs:', error);
    return [];
  }

  return (data as any[] || []).map((cat) => cat.slug);
}

/**
 * Filtrer les recettes
 */
export interface RecipeFilters {
  category?: string;
  difficulty?: string;
  maxTime?: number;
  search?: string;
  origine?: string;
}

/**
 * Obtenir les cartes de recettes filtrées
 */
export async function getFilteredRecipeCards(filters: RecipeFilters): Promise<RecipeCard[]> {
  let query = supabase
    .from('recipes_with_categories')
    .select('id, slug, title, featured_image, prep_time, cook_time, total_time, difficulty, categories, likes, origine');

  if (filters.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }

  if (filters.maxTime) {
    query = query.lte('total_time', filters.maxTime);
  }

  if (filters.search) {
    const searchTerm = `%${filters.search}%`;
    query = query.or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`);
  }

  // Filtrer par origine (pays)
  if (filters.origine) {
    query = query.eq('origine', filters.origine);
  }

  const { data, error } = await query.order('published_at', { ascending: false });

  if (error) {
    console.error('Erreur getFilteredRecipeCards:', error);
    return [];
  }

  let results = (data as any[] || []).map((recipe) => ({
    id: recipe.id,
    slug: recipe.slug,
    title: recipe.title,
    featuredImage: recipe.featured_image || '',
    prepTime: recipe.prep_time,
    cookTime: recipe.cook_time,
    totalTime: recipe.total_time,
    difficulty: recipe.difficulty,
    categories: recipe.categories || [],
    likes: recipe.likes,
  }));

  // Filtrer par catégorie côté client (car c'est dans un JSON)
  if (filters.category) {
    results = results.filter((r) =>
      r.categories.some((c: { slug: string }) => c.slug === filters.category)
    );
  }

  return results;
}

export async function filterRecipes(filters: RecipeFilters): Promise<Recipe[]> {
  let query = supabase
    .from('recipes_with_categories')
    .select('*');

  if (filters.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }

  if (filters.maxTime) {
    query = query.lte('total_time', filters.maxTime);
  }

  if (filters.search) {
    const searchTerm = `%${filters.search}%`;
    query = query.or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`);
  }

  const { data, error } = await query.order('published_at', { ascending: false });

  if (error) {
    console.error('Erreur filterRecipes:', error);
    return [];
  }

  let results = (data || []).map(transformRecipe);

  // Filtrer par catégorie côté client (car c'est dans un JSON)
  if (filters.category) {
    results = results.filter((r) =>
      r.categories.some((c) => c.slug === filters.category)
    );
  }

  return results;
}

/**
 * Obtenir les recettes les plus aimées (basé sur recipe_likes)
 */
export async function getMostLikedRecipes(limit: number = 10): Promise<RecipeCard[]> {
  // D'abord, obtenir les counts de likes par recette
  const { data: likeCounts, error: likeError } = await supabase
    .from('recipe_likes')
    .select('recipe_id')
    .limit(1000); // Récupérer tous les likes

  if (likeError) {
    console.error('Erreur getMostLikedRecipes (likes):', likeError);
    // Fallback sur la colonne likes existante
    return getPopularRecipeCards(limit);
  }

  // Compter les likes par recette
  const likeCountMap = new Map<number, number>();
  (likeCounts || []).forEach((like: { recipe_id: number }) => {
    const current = likeCountMap.get(like.recipe_id) || 0;
    likeCountMap.set(like.recipe_id, current + 1);
  });

  // Trier par nombre de likes
  const sortedRecipeIds = [...likeCountMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([recipeId]) => recipeId);

  if (sortedRecipeIds.length === 0) {
    // Fallback: retourner les recettes populaires classiques
    return getPopularRecipeCards(limit);
  }

  // Récupérer les recettes
  const { data, error } = await supabase
    .from('recipes_with_categories')
    .select('id, slug, title, featured_image, prep_time, cook_time, total_time, difficulty, categories, likes')
    .in('id', sortedRecipeIds);

  if (error) {
    console.error('Erreur getMostLikedRecipes:', error);
    return [];
  }

  // Trier dans l'ordre des likes
  const recipeMap = new Map((data || []).map((r: any) => [r.id, r]));
  const sortedRecipes = sortedRecipeIds
    .map(id => recipeMap.get(id))
    .filter(Boolean);

  return sortedRecipes.map((recipe: any) => ({
    id: recipe.id,
    slug: recipe.slug,
    title: recipe.title,
    featuredImage: recipe.featured_image || '',
    prepTime: recipe.prep_time,
    cookTime: recipe.cook_time,
    totalTime: recipe.total_time,
    difficulty: recipe.difficulty,
    categories: recipe.categories || [],
    likes: likeCountMap.get(recipe.id) || recipe.likes,
  }));
}

/**
 * Obtenir les cartes des recettes populaires (fallback)
 */
export async function getPopularRecipeCards(limit: number = 10): Promise<RecipeCard[]> {
  const { data, error } = await supabase
    .from('recipes_with_categories')
    .select('id, slug, title, featured_image, prep_time, cook_time, total_time, difficulty, categories, likes')
    .order('likes', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erreur getPopularRecipeCards:', error);
    return [];
  }

  return (data as any[] || []).map((recipe) => ({
    id: recipe.id,
    slug: recipe.slug,
    title: recipe.title,
    featuredImage: recipe.featured_image || '',
    prepTime: recipe.prep_time,
    cookTime: recipe.cook_time,
    totalTime: recipe.total_time,
    difficulty: recipe.difficulty,
    categories: recipe.categories || [],
    likes: recipe.likes,
  }));
}

/**
 * Incrémenter les likes d'une recette
 */
export async function incrementRecipeLikes(recipeId: number): Promise<boolean> {
  const { error } = await (supabase.rpc as any)('increment_likes', { recipe_id: recipeId });

  if (error) {
    // Fallback si la fonction RPC n'existe pas
    const { data: recipe } = await supabase
      .from('recipes')
      .select('likes')
      .eq('id', recipeId)
      .single();

    if (recipe) {
      const { error: updateError } = await (supabase as any)
        .from('recipes')
        .update({ likes: (recipe as any).likes + 1 })
        .eq('id', recipeId);

      return !updateError;
    }
    return false;
  }

  return true;
}

/**
 * Obtenir tous les noms d'ingrédients uniques (pour l'autocomplete)
 */
export async function getAllIngredientNames(): Promise<string[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('ingredients');

  if (error) {
    console.error('Erreur getAllIngredientNames:', error);
    return [];
  }

  const ingredientSet = new Set<string>();

  for (const recipe of (data || []) as { ingredients: IngredientGroup[] | null }[]) {
    const groups = recipe.ingredients;
    if (!groups) continue;

    for (const group of groups) {
      for (const item of group.items || []) {
        if (item.name) {
          // Normaliser le nom (minuscule, trim)
          const normalizedName = item.name.toLowerCase().trim();
          if (normalizedName.length > 1) {
            ingredientSet.add(normalizedName);
          }
        }
      }
    }
  }

  // Retourner triés alphabétiquement
  return Array.from(ingredientSet).sort();
}

/**
 * Interface pour les résultats de recherche par ingrédients
 */
export interface RecipeWithMatchScore extends RecipeCard {
  matchedIngredients: string[];
  totalIngredients: number;
  matchScore: number; // Pourcentage de match (0-100)
}

/**
 * Chercher des recettes par ingrédients disponibles
 * Retourne les recettes triées par nombre d'ingrédients matchés
 */
export async function searchByIngredients(
  availableIngredients: string[]
): Promise<RecipeWithMatchScore[]> {
  if (!availableIngredients.length) return [];

  const { data, error } = await supabase
    .from('recipes_with_categories')
    .select('id, slug, title, featured_image, prep_time, cook_time, total_time, difficulty, categories, likes, ingredients');

  if (error) {
    console.error('Erreur searchByIngredients:', error);
    return [];
  }

  // Normaliser les ingrédients recherchés
  const normalizedSearch = availableIngredients.map(i => i.toLowerCase().trim());

  const results: RecipeWithMatchScore[] = [];

  for (const recipe of (data || []) as { id: number; slug: string; title: string; featured_image: string | null; prep_time: number | null; cook_time: number | null; total_time: number | null; difficulty: string | null; categories: Category[]; likes: number | null; ingredients: IngredientGroup[] | null }[]) {
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
    for (const searchIng of normalizedSearch) {
      // Cherche si l'ingrédient recherché est contenu dans un ingrédient de la recette
      const found = recipeIngredients.find(recipeIng =>
        recipeIng.includes(searchIng) || searchIng.includes(recipeIng)
      );
      if (found) {
        matchedIngredients.push(found);
      }
    }

    // Ne garder que les recettes avec au moins 1 match
    if (matchedIngredients.length > 0) {
      results.push({
        id: recipe.id,
        slug: recipe.slug,
        title: recipe.title,
        featuredImage: recipe.featured_image || '',
        prepTime: recipe.prep_time || 0,
        cookTime: recipe.cook_time || 0,
        totalTime: recipe.total_time || 0,
        difficulty: recipe.difficulty || 'moyen',
        categories: recipe.categories || [],
        likes: recipe.likes || 0,
        matchedIngredients: [...new Set(matchedIngredients)],
        totalIngredients: recipeIngredients.length,
        matchScore: Math.round((matchedIngredients.length / recipeIngredients.length) * 100),
      });
    }
  }

  // Trier par score de match décroissant, puis par nombre d'ingrédients matchés
  return results.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    return b.matchedIngredients.length - a.matchedIngredients.length;
  });
}
