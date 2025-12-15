import { Metadata } from 'next';
import { Suspense } from 'react';
import { getFilteredRecipeCards, getAllCategories, getCategoryBySlug, getAllIngredientNames, getAllOrigines } from '@/lib/recipes';
import RecipeGrid from '@/components/recipe/RecipeGrid';
import RecipeFilters from '@/components/recipe/RecipeFilters';
import FridgeSearch from '@/components/recipe/FridgeSearch';

export const metadata: Metadata = {
  title: 'Toutes nos recettes | Menucochon',
  description: 'Découvrez notre collection de délicieuses recettes faciles à réaliser.',
  alternates: {
    canonical: '/recette/',
    languages: {
      'fr-CA': '/recette/',
      'en-CA': '/en/recipe/',
    },
  },
  openGraph: {
    title: 'Toutes nos recettes | Menucochon',
    description: 'Découvrez notre collection de délicieuses recettes faciles à réaliser.',
    images: [
      {
        url: '/images/og-recettes.svg',
        width: 1200,
        height: 630,
        alt: 'Recettes - Menucochon',
      },
    ],
    type: 'website',
    url: '/recette/',
    siteName: 'Menucochon',
    locale: 'fr_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toutes nos recettes | Menucochon',
    description: 'Découvrez notre collection de délicieuses recettes faciles à réaliser.',
    images: ['/images/og-recettes.svg'],
  },
};

interface SearchParams {
  categorie?: string;
  difficulte?: string;
  temps?: string;
  q?: string;
  origine?: string;
}

export default async function RecettesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [recipes, categories, allIngredients, origines] = await Promise.all([
    getFilteredRecipeCards({
      category: params.categorie,
      difficulty: params.difficulte,
      maxTime: params.temps ? parseInt(params.temps) : undefined,
      search: params.q,
      origine: params.origine,
    }),
    getAllCategories(),
    getAllIngredientNames(),
    getAllOrigines(),
  ]);

  // Obtenir le nom de la catégorie active si présente
  const activeCategory = params.categorie
    ? await getCategoryBySlug(params.categorie)
    : null;

  const hasFilters = params.categorie || params.difficulte || params.temps || params.q || params.origine;

  // Titre dynamique selon le filtre
  let pageTitle = 'Nos Recettes';
  let pageLabel = 'Collection';

  if (params.origine) {
    pageTitle = `Recettes ${params.origine}`;
    pageLabel = 'Cuisine du monde';
  } else if (activeCategory) {
    pageTitle = activeCategory.name;
    pageLabel = 'Catégorie';
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
                ? `${recipes.length} recette${recipes.length > 1 ? 's' : ''} trouvée${recipes.length > 1 ? 's' : ''}`
                : `Découvrez notre collection de ${recipes.length} recettes gourmandes, soigneusement sélectionnées pour vous inspirer en cuisine.`}
            </p>
            <div className="w-16 h-1 bg-[#F77313] mt-8" />
          </div>
        </div>
      </section>

      {/* Filtres et Grille */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        {/* Recherche par ingrédients */}
        <Suspense fallback={<div className="h-16 bg-neutral-100 animate-pulse mb-8" />}>
          <FridgeSearch allIngredients={allIngredients} />
        </Suspense>

        {/* Filtres classiques */}
        <Suspense fallback={<div className="h-16 bg-neutral-100 animate-pulse mb-8" />}>
          <RecipeFilters categories={categories} origines={origines} />
        </Suspense>
        <RecipeGrid recipes={recipes} />
      </section>
    </main>
  );
}
