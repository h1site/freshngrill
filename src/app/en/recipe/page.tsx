import { Metadata } from 'next';
import { Suspense } from 'react';
import { getFilteredRecipeCards, getAllCategories, getCategoryBySlug, getAllIngredientNames } from '@/lib/recipes';
import RecipeGrid from '@/components/recipe/RecipeGrid';
import RecipeFilters from '@/components/recipe/RecipeFilters';
import FridgeSearch from '@/components/recipe/FridgeSearch';

export const metadata: Metadata = {
  title: 'All Recipes | Menu Cochon',
  description: 'Discover our collection of delicious and easy-to-make recipes.',
  alternates: {
    canonical: '/en/recipe/',
    languages: {
      'fr-CA': '/recette/',
      'en-CA': '/en/recipe/',
    },
  },
};

interface SearchParams {
  category?: string;
  difficulty?: string;
  time?: string;
  q?: string;
  origin?: string;
}

export default async function RecipesPageEN({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [recipes, categories, allIngredients] = await Promise.all([
    getFilteredRecipeCards({
      category: params.category,
      difficulty: params.difficulty,
      maxTime: params.time ? parseInt(params.time) : undefined,
      search: params.q,
      origine: params.origin,
    }),
    getAllCategories(),
    getAllIngredientNames(),
  ]);

  // Get active category name if present
  const activeCategory = params.category
    ? await getCategoryBySlug(params.category)
    : null;

  const hasFilters = params.category || params.difficulty || params.time || params.q || params.origin;

  // Dynamic title based on filter
  let pageTitle = 'Our Recipes';
  let pageLabel = 'Collection';

  if (params.origin) {
    pageTitle = `${params.origin} Recipes`;
    pageLabel = 'World Cuisine';
  } else if (activeCategory) {
    pageTitle = activeCategory.name;
    pageLabel = 'Category';
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
              {pageLabel}
            </span>
            <h1 className="text-5xl md:text-7xl font-display mt-3 mb-6">
              {pageTitle}
            </h1>
            <p className="text-neutral-400 text-lg max-w-xl">
              {hasFilters
                ? `${recipes.length} recipe${recipes.length > 1 ? 's' : ''} found`
                : `Discover our collection of ${recipes.length} delicious recipes, carefully selected to inspire your cooking.`}
            </p>
            <div className="w-16 h-1 bg-[#F77313] mt-8" />
          </div>
        </div>
      </section>

      {/* Filters and Grid */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        {/* Ingredient search */}
        <Suspense fallback={<div className="h-16 bg-neutral-100 animate-pulse mb-8" />}>
          <FridgeSearch allIngredients={allIngredients} locale="en" />
        </Suspense>

        {/* Classic filters */}
        <Suspense fallback={<div className="h-16 bg-neutral-100 animate-pulse mb-8" />}>
          <RecipeFilters categories={categories} locale="en" />
        </Suspense>
        <RecipeGrid recipes={recipes} locale="en" />
      </section>
    </main>
  );
}
