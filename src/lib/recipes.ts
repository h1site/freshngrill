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
    pinterestImage: data.pinterest_image || undefined,
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
    // Community recipe fields
    isCommunityRecipe: data.is_community_recipe || false,
    communityAuthorName: data.community_author_name || undefined,
    communityAuthorImage: data.community_author_image || undefined,
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

  // Toujours chercher la traduction anglaise pour avoir le slug anglais
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

  // Si locale français, retourner la recette FR avec le slug anglais pour la navigation
  if (locale === 'fr') {
    return {
      ...recipe,
      slugFr: recipe.slug,
      slugEn: t.slug_en || undefined,
    };
  }

  // Appliquer les traductions anglaises
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
 * Obtenir plusieurs recettes par leurs slugs (pour les recettes vedettes)
 */
export async function getRecipesBySlugs(slugs: string[]): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes_with_categories')
    .select('*')
    .in('slug', slugs);

  if (error) {
    console.error('Erreur getRecipesBySlugs:', error);
    return [];
  }

  // Trier les résultats dans l'ordre des slugs fournis
  const recipes = (data || []).map(transformRecipe);
  return slugs
    .map(slug => recipes.find(r => r.slug === slug))
    .filter((r): r is Recipe => r !== undefined);
}

/**
 * Obtenir la prochaine recette à suggérer (même catégorie, triée par date)
 */
export async function getNextRecipe(recipe: Recipe, locale: 'fr' | 'en' = 'fr'): Promise<RecipeCard | null> {
  const categoryIds = recipe.categories.map((c) => c.id);

  // Si la recette a des catégories, chercher la prochaine recette dans la même catégorie
  if (categoryIds.length > 0) {
    const { data: recipeIds } = await supabase
      .from('recipe_categories')
      .select('recipe_id')
      .in('category_id', categoryIds)
      .neq('recipe_id', recipe.id);

    if (recipeIds?.length) {
      const uniqueIds = [...new Set((recipeIds as any[]).map(r => r.recipe_id))];

      // Récupérer les recettes triées par date de publication
      const { data, error } = await supabase
        .from('recipes_with_categories')
        .select('id, slug, title, featured_image, prep_time, cook_time, total_time, difficulty, categories, likes, published_at')
        .in('id', uniqueIds)
        .order('published_at', { ascending: false })
        .limit(1);

      if (!error && data?.length) {
        const r = data[0] as any;
        let card: RecipeCard = {
          id: r.id,
          slug: r.slug,
          title: r.title,
          featuredImage: r.featured_image || '',
          prepTime: r.prep_time,
          cookTime: r.cook_time,
          totalTime: r.total_time,
          difficulty: r.difficulty,
          categories: r.categories || [],
          likes: r.likes,
        };

        // Si locale anglais, enrichir avec traduction
        if (locale === 'en') {
          const { data: translation } = await supabase
            .from('recipe_translations')
            .select('slug_en, title')
            .eq('recipe_id', r.id)
            .eq('locale', 'en')
            .single();

          if (translation) {
            card = {
              ...card,
              slugEn: (translation as any).slug_en || undefined,
              title: (translation as any).title || card.title,
            };
          }
        }

        return card;
      }
    }
  }

  // Fallback: retourner la recette la plus récente (exclure la recette actuelle)
  const { data: fallbackData, error: fallbackError } = await supabase
    .from('recipes_with_categories')
    .select('id, slug, title, featured_image, prep_time, cook_time, total_time, difficulty, categories, likes')
    .neq('id', recipe.id)
    .order('published_at', { ascending: false })
    .limit(1);

  if (fallbackError || !fallbackData?.length) {
    return null;
  }

  const r = fallbackData[0] as any;
  let card: RecipeCard = {
    id: r.id,
    slug: r.slug,
    title: r.title,
    featuredImage: r.featured_image || '',
    prepTime: r.prep_time,
    cookTime: r.cook_time,
    totalTime: r.total_time,
    difficulty: r.difficulty,
    categories: r.categories || [],
    likes: r.likes,
  };

  if (locale === 'en') {
    const { data: translation } = await supabase
      .from('recipe_translations')
      .select('slug_en, title')
      .eq('recipe_id', r.id)
      .eq('locale', 'en')
      .single();

    if (translation) {
      card = {
        ...card,
        slugEn: (translation as any).slug_en || undefined,
        title: (translation as any).title || card.title,
      };
    }
  }

  return card;
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

// List of main category slugs to show on homepage (curated list - no ingredients or origins)
const MAIN_CATEGORY_SLUGS = [
  'plats-principaux-boeuf',
  'plats-principaux-volaille',
  'plats-principaux-porc',
  'plat-principaux-poissons',
  'plats-principaux-fruits-de-mer',
  'plats-principaux-vegetariens',
  'dessert',
  'soupes',
  'salades',
  'dejeuner',
  'pates',
  'pizza',
  'snacks',
  'amuse-gueules',
  'patisseries',
  'boissons',
];

/**
 * Obtenir les catégories principales pour la page d'accueil (pas les ingrédients ou origines)
 */
export async function getMainCategories(limit: number = 10): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .in('slug', MAIN_CATEGORY_SLUGS)
    .order('name');

  if (error) {
    console.error('Erreur getMainCategories:', error);
    return [];
  }

  // Sort by the order in MAIN_CATEGORY_SLUGS to have a consistent order
  const slugOrder = new Map(MAIN_CATEGORY_SLUGS.map((slug, index) => [slug, index]));
  const sorted = (data as any[] || []).sort((a, b) => {
    const orderA = slugOrder.get(a.slug) ?? 999;
    const orderB = slugOrder.get(b.slug) ?? 999;
    return orderA - orderB;
  });

  return sorted.slice(0, limit).map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    parent: cat.parent_id ?? undefined,
  }));
}

/**
 * Obtenir les catégories principales avec traduction selon la locale
 */
export async function getMainCategoriesWithLocale(locale: 'fr' | 'en' = 'fr', limit: number = 10): Promise<Category[]> {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .in('slug', MAIN_CATEGORY_SLUGS);

  if (error) {
    console.error('Erreur getMainCategoriesWithLocale:', error);
    return [];
  }

  // Sort by the order in MAIN_CATEGORY_SLUGS
  const slugOrder = new Map(MAIN_CATEGORY_SLUGS.map((slug, index) => [slug, index]));
  const sorted = (categories as any[] || []).sort((a, b) => {
    const orderA = slugOrder.get(a.slug) ?? 999;
    const orderB = slugOrder.get(b.slug) ?? 999;
    return orderA - orderB;
  });

  // If French, return as-is
  if (locale === 'fr') {
    return sorted.slice(0, limit).map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      parent: cat.parent_id ?? undefined,
    }));
  }

  // Get English translations
  const categoryIds = sorted.map(c => c.id);
  const { data: translations, error: translationError } = await supabase
    .from('category_translations')
    .select('category_id, name')
    .eq('locale', 'en')
    .in('category_id', categoryIds);

  if (translationError) {
    console.error('Erreur category translations:', translationError);
  }

  // Create translation map
  const translationMap = new Map((translations || []).map((t: any) => [t.category_id, t.name]));

  return sorted.slice(0, limit).map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    name: translationMap.get(cat.id) || cat.name,
    parent: cat.parent_id ?? undefined,
  }));
}

/**
 * Obtenir toutes les catégories avec traduction selon la locale
 */
export async function getAllCategoriesWithLocale(locale: 'fr' | 'en' = 'fr'): Promise<Category[]> {
  // Get base categories
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Erreur getAllCategoriesWithLocale:', error);
    return [];
  }

  // If French, return as-is
  if (locale === 'fr') {
    return (categories as any[] || []).map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      parent: cat.parent_id ?? undefined,
    }));
  }

  // Get English translations
  const { data: translations, error: translationError } = await supabase
    .from('category_translations')
    .select('category_id, name')
    .eq('locale', 'en');

  if (translationError) {
    console.error('Erreur category translations:', translationError);
  }

  // Create translation map
  const translationMap = new Map((translations || []).map((t: any) => [t.category_id, t.name]));

  // Return categories with translated names
  return (categories as any[] || []).map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    name: translationMap.get(cat.id) || cat.name,
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
 * Obtenir toutes les origines (pays) distinctes des recettes
 */
export async function getAllOrigines(): Promise<{ id: number; slug: string; name: string }[]> {
  const { data, error } = await supabase
    .from('origines')
    .select('id, slug, name')
    .order('name');

  if (error) {
    console.error('Erreur getAllOrigines:', error);
    return [];
  }

  return (data || []) as { id: number; slug: string; name: string }[];
}

/**
 * Obtenir toutes les origines avec traduction selon la locale
 */
export async function getAllOriginesWithLocale(locale: 'fr' | 'en' = 'fr'): Promise<{ id: number; slug: string; name: string }[]> {
  // Get base origines
  const { data: origines, error } = await supabase
    .from('origines')
    .select('id, slug, name')
    .order('name');

  if (error) {
    console.error('Erreur getAllOriginesWithLocale:', error);
    return [];
  }

  // If French, return as-is
  if (locale === 'fr') {
    return (origines || []) as { id: number; slug: string; name: string }[];
  }

  // Get English translations
  const { data: translations, error: translationError } = await supabase
    .from('origine_translations')
    .select('origine_id, name')
    .eq('locale', 'en');

  if (translationError) {
    console.error('Erreur origine translations:', translationError);
  }

  // Create translation map
  const translationMap = new Map((translations || []).map((t: any) => [t.origine_id, t.name]));

  // Return origines with translated names
  return (origines || []).map((orig: any) => ({
    id: orig.id,
    slug: orig.slug,
    name: translationMap.get(orig.id) || orig.name,
  }));
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
  // Si on filtre par origine, on doit d'abord récupérer les IDs des recettes concernées
  let recipeIdsFromOrigine: number[] | null = null;

  if (filters.origine) {
    // Chercher l'origine par slug
    const { data: origineData } = await supabase
      .from('origines')
      .select('id')
      .eq('slug', filters.origine)
      .single();

    if (origineData) {
      const origineId = (origineData as { id: number }).id;
      const { data: recipeOrigines } = await supabase
        .from('recipe_origines')
        .select('recipe_id')
        .eq('origine_id', origineId);

      recipeIdsFromOrigine = (recipeOrigines as { recipe_id: number }[] || []).map(r => r.recipe_id);
    } else {
      // Origine non trouvée, retourner vide
      return [];
    }
  }

  let query = supabase
    .from('recipes_with_categories')
    .select('id, slug, title, featured_image, prep_time, cook_time, total_time, difficulty, categories, likes');

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

  // Filtrer par IDs si origine spécifiée
  if (recipeIdsFromOrigine !== null) {
    if (recipeIdsFromOrigine.length === 0) {
      return [];
    }
    query = query.in('id', recipeIdsFromOrigine);
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

/**
 * Enrichir les cartes de recettes avec les slugs anglais et noms de catégories traduits
 */
export async function enrichRecipeCardsWithEnglishSlugs(cards: RecipeCard[]): Promise<RecipeCard[]> {
  if (cards.length === 0) return cards;

  const recipeIds = cards.map(c => c.id);

  // Get recipe translations and category translations in parallel
  const [recipeTransResult, categoryTransResult] = await Promise.all([
    supabase
      .from('recipe_translations')
      .select('recipe_id, slug_en, title')
      .eq('locale', 'en')
      .in('recipe_id', recipeIds),
    supabase
      .from('category_translations')
      .select('category_id, name')
      .eq('locale', 'en'),
  ]);

  if (recipeTransResult.error) {
    console.error('Erreur enrichRecipeCardsWithEnglishSlugs:', recipeTransResult.error);
  }

  const translationMap = new Map((recipeTransResult.data || []).map((t: any) => [t.recipe_id, t]));
  const categoryTransMap = new Map((categoryTransResult.data || []).map((t: any) => [t.category_id, t.name]));

  return cards.map(card => {
    const translation = translationMap.get(card.id) as any;

    // Translate category names
    const translatedCategories = card.categories.map(cat => ({
      ...cat,
      name: categoryTransMap.get(cat.id) || cat.name,
    }));

    if (translation) {
      return {
        ...card,
        slugEn: translation.slug_en || undefined,
        title: translation.title || card.title,
        categories: translatedCategories,
      };
    }
    return {
      ...card,
      categories: translatedCategories,
    };
  });
}

/**
 * Enrichir les recettes complètes avec les données anglaises (slug, titre, catégories traduites)
 */
export async function enrichRecipesWithEnglishData(recipes: Recipe[]): Promise<(Recipe & { slugEn?: string })[]> {
  if (recipes.length === 0) return recipes;

  const recipeIds = recipes.map(r => r.id);

  const [recipeTransResult, categoryTransResult] = await Promise.all([
    supabase
      .from('recipe_translations')
      .select('recipe_id, slug_en, title')
      .eq('locale', 'en')
      .in('recipe_id', recipeIds),
    supabase
      .from('category_translations')
      .select('category_id, name')
      .eq('locale', 'en'),
  ]);

  if (recipeTransResult.error) {
    console.error('Erreur enrichRecipesWithEnglishData:', recipeTransResult.error);
  }

  const translationMap = new Map((recipeTransResult.data || []).map((t: any) => [t.recipe_id, t]));
  const categoryTransMap = new Map((categoryTransResult.data || []).map((t: any) => [t.category_id, t.name]));

  return recipes.map(recipe => {
    const translation = translationMap.get(recipe.id) as any;

    const translatedCategories = recipe.categories.map(cat => ({
      ...cat,
      name: categoryTransMap.get(cat.id) || cat.name,
    }));

    if (translation) {
      return {
        ...recipe,
        slugEn: translation.slug_en || undefined,
        title: translation.title || recipe.title,
        categories: translatedCategories,
      };
    }
    return {
      ...recipe,
      categories: translatedCategories,
    };
  });
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
  availableIngredients: string[],
  locale: 'fr' | 'en' = 'fr'
): Promise<RecipeWithMatchScore[]> {
  if (!availableIngredients.length) return [];

  const { data, error } = await supabase
    .from('recipes_with_categories')
    .select('id, slug, title, featured_image, prep_time, cook_time, total_time, difficulty, categories, likes, ingredients');

  if (error) {
    console.error('Erreur searchByIngredients:', error);
    return [];
  }

  // Fetch English translations if needed
  let translationsMap = new Map<number, { title: string; slug_en: string | null; ingredients: IngredientGroup[] | null }>();
  if (locale === 'en' && data && data.length > 0) {
    const recipeIds = data.map((r: { id: number }) => r.id);
    const { data: translations } = await supabase
      .from('recipe_translations')
      .select('recipe_id, title, slug_en, ingredients')
      .eq('locale', 'en')
      .in('recipe_id', recipeIds);

    if (translations) {
      for (const t of translations as { recipe_id: number; title: string; slug_en: string | null; ingredients: unknown }[]) {
        translationsMap.set(t.recipe_id, {
          title: t.title,
          slug_en: t.slug_en,
          ingredients: t.ingredients as IngredientGroup[] | null
        });
      }
    }
  }

  // Normaliser les ingrédients recherchés
  const normalizedSearch = availableIngredients.map(i => i.toLowerCase().trim());

  const results: RecipeWithMatchScore[] = [];

  for (const recipe of (data || []) as { id: number; slug: string; title: string; featured_image: string | null; prep_time: number | null; cook_time: number | null; total_time: number | null; difficulty: string | null; categories: Category[]; likes: number | null; ingredients: IngredientGroup[] | null }[]) {
    const translation = translationsMap.get(recipe.id);

    // Use English ingredients for matching if available, otherwise French
    const groups = (locale === 'en' && translation?.ingredients) ? translation.ingredients : recipe.ingredients;
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
        slug: (locale === 'en' && translation?.slug_en) ? translation.slug_en : recipe.slug,
        title: (locale === 'en' && translation?.title) ? translation.title : recipe.title,
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

/**
 * Get recipes with similar ingredients (for internal linking)
 * Returns recipes that share at least 3 key ingredients
 */
export async function getRecipesWithSimilarIngredients(
  recipe: Recipe,
  limit: number = 4,
  locale: 'fr' | 'en' = 'fr'
): Promise<RecipeCard[]> {
  // Extract ingredient names from current recipe
  const currentIngredients: string[] = [];
  for (const group of recipe.ingredients || []) {
    for (const item of group.items || []) {
      if (item.name) {
        // Normalize and extract base ingredient (remove quantities/modifiers)
        const normalized = item.name.toLowerCase()
          .replace(/\d+/g, '')
          .replace(/\s*(g|kg|ml|l|tasse|c\.\s*à\s*soupe|c\.\s*à\s*thé|lb|oz)\s*/gi, '')
          .trim();
        if (normalized.length > 2) {
          currentIngredients.push(normalized);
        }
      }
    }
  }

  if (currentIngredients.length < 3) return [];

  const { data, error } = await supabase
    .from('recipes_with_categories')
    .select('id, slug, title, featured_image, prep_time, cook_time, total_time, difficulty, categories, likes, ingredients')
    .neq('id', recipe.id)
    .limit(100);

  if (error) {
    console.error('Error getRecipesWithSimilarIngredients:', error);
    return [];
  }

  // Score each recipe by shared ingredients
  const scoredRecipes: { recipe: any; sharedCount: number }[] = [];

  for (const r of (data || []) as any[]) {
    if (!r.ingredients) continue;

    const recipeIngredients: string[] = [];
    for (const group of r.ingredients) {
      for (const item of group.items || []) {
        if (item.name) {
          const normalized = item.name.toLowerCase()
            .replace(/\d+/g, '')
            .replace(/\s*(g|kg|ml|l|tasse|c\.\s*à\s*soupe|c\.\s*à\s*thé|lb|oz)\s*/gi, '')
            .trim();
          if (normalized.length > 2) {
            recipeIngredients.push(normalized);
          }
        }
      }
    }

    // Count shared ingredients (fuzzy match)
    let sharedCount = 0;
    for (const currIng of currentIngredients) {
      const hasMatch = recipeIngredients.some(recIng =>
        recIng.includes(currIng) || currIng.includes(recIng)
      );
      if (hasMatch) sharedCount++;
    }

    // Only include if at least 3 shared ingredients
    if (sharedCount >= 3) {
      scoredRecipes.push({ recipe: r, sharedCount });
    }
  }

  // Sort by shared count and take top results
  scoredRecipes.sort((a, b) => b.sharedCount - a.sharedCount);
  const topRecipes = scoredRecipes.slice(0, limit);

  // Transform to RecipeCard format
  let cards: RecipeCard[] = topRecipes.map(({ recipe: r }) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    featuredImage: r.featured_image || '',
    prepTime: r.prep_time,
    cookTime: r.cook_time,
    totalTime: r.total_time,
    difficulty: r.difficulty,
    categories: r.categories || [],
    likes: r.likes,
  }));

  // Enrich with English data if needed
  if (locale === 'en' && cards.length > 0) {
    cards = await enrichRecipeCardsWithEnglishSlugs(cards);
  }

  return cards;
}

/**
 * Get recipe by difficulty for progression linking
 */
export async function getRecipeByDifficultyProgression(
  recipe: Recipe,
  direction: 'easier' | 'harder',
  locale: 'fr' | 'en' = 'fr'
): Promise<RecipeCard | null> {
  const difficultyOrder = ['facile', 'moyen', 'difficile'];
  const currentIndex = difficultyOrder.indexOf(recipe.difficulty);

  let targetDifficulty: string | null = null;
  if (direction === 'easier' && currentIndex > 0) {
    targetDifficulty = difficultyOrder[currentIndex - 1];
  } else if (direction === 'harder' && currentIndex < difficultyOrder.length - 1) {
    targetDifficulty = difficultyOrder[currentIndex + 1];
  }

  if (!targetDifficulty) return null;

  // Find a recipe in same category with target difficulty
  const categoryIds = recipe.categories.map(c => c.id);

  if (categoryIds.length > 0) {
    const { data: recipeIds } = await supabase
      .from('recipe_categories')
      .select('recipe_id')
      .in('category_id', categoryIds)
      .neq('recipe_id', recipe.id);

    if (recipeIds?.length) {
      const uniqueIds = [...new Set((recipeIds as any[]).map(r => r.recipe_id))];

      const { data, error } = await supabase
        .from('recipes_with_categories')
        .select('id, slug, title, featured_image, prep_time, cook_time, total_time, difficulty, categories, likes')
        .in('id', uniqueIds)
        .eq('difficulty', targetDifficulty)
        .limit(1);

      if (!error && data?.length) {
        const r = data[0] as any;
        let card: RecipeCard = {
          id: r.id,
          slug: r.slug,
          title: r.title,
          featuredImage: r.featured_image || '',
          prepTime: r.prep_time,
          cookTime: r.cook_time,
          totalTime: r.total_time,
          difficulty: r.difficulty,
          categories: r.categories || [],
          likes: r.likes,
        };

        if (locale === 'en') {
          const enriched = await enrichRecipeCardsWithEnglishSlugs([card]);
          card = enriched[0];
        }

        return card;
      }
    }
  }

  // Fallback: any recipe with target difficulty
  const { data: fallback } = await supabase
    .from('recipes_with_categories')
    .select('id, slug, title, featured_image, prep_time, cook_time, total_time, difficulty, categories, likes')
    .eq('difficulty', targetDifficulty)
    .neq('id', recipe.id)
    .limit(1);

  if (fallback?.length) {
    const r = fallback[0] as any;
    let card: RecipeCard = {
      id: r.id,
      slug: r.slug,
      title: r.title,
      featuredImage: r.featured_image || '',
      prepTime: r.prep_time,
      cookTime: r.cook_time,
      totalTime: r.total_time,
      difficulty: r.difficulty,
      categories: r.categories || [],
      likes: r.likes,
    };

    if (locale === 'en') {
      const enriched = await enrichRecipeCardsWithEnglishSlugs([card]);
      card = enriched[0];
    }

    return card;
  }

  return null;
}

/**
 * Find spices used in a recipe by matching ingredient names against spices database
 */
export async function getSpicesInRecipe(
  recipe: Recipe,
  limit: number = 6
): Promise<{ slug: string; name: string; image: string | null }[]> {
  // Extract all ingredient names
  const ingredientNames: string[] = [];
  for (const group of recipe.ingredients || []) {
    for (const item of group.items || []) {
      if (item.name) {
        ingredientNames.push(item.name.toLowerCase());
      }
    }
  }

  if (ingredientNames.length === 0) return [];

  // Get all published spices
  const { data: spices, error } = await supabase
    .from('spices')
    .select('slug, name_fr, featured_image')
    .eq('is_published', true);

  if (error) {
    console.error('Error getSpicesInRecipe:', error);
    return [];
  }

  // Match spices against ingredients
  const matchedSpices: { slug: string; name: string; image: string | null }[] = [];

  for (const spice of (spices || []) as { slug: string; name_fr: string; featured_image: string | null }[]) {
    const spiceName = spice.name_fr.toLowerCase();
    // Check if any ingredient contains this spice name
    const isUsed = ingredientNames.some(ing =>
      ing.includes(spiceName) || spiceName.includes(ing.split(' ')[0])
    );

    if (isUsed) {
      matchedSpices.push({
        slug: spice.slug,
        name: spice.name_fr,
        image: spice.featured_image,
      });
    }

    if (matchedSpices.length >= limit) break;
  }

  return matchedSpices;
}
