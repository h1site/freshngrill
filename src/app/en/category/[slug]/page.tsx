import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import {
  getCategoryBySlug,
  getRecipesByCategory,
  getAllCategorySlugs,
  enrichRecipeCardsWithEnglishSlugs,
} from '@/lib/recipes';
import RecipeCard from '@/components/recipe/RecipeCard';
import { getCategoryName } from '@/lib/categoryTranslations';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category not found',
    };
  }

  const categoryName = getCategoryName(category.name, 'en');

  return {
    title: `${categoryName} Recipes | Menucochon`,
    description: `Discover all our delicious ${categoryName.toLowerCase()} recipes. Tasty ideas to delight the whole family.`,
    alternates: {
      canonical: `/en/category/${slug}/`,
      languages: {
        'fr-CA': `/categorie/${slug}/`,
        'en-CA': `/en/category/${slug}/`,
      },
    },
    openGraph: {
      title: `${categoryName} Recipes`,
      description: `Discover all our delicious ${categoryName.toLowerCase()} recipes.`,
      type: 'website',
      url: `/en/category/${slug}/`,
      siteName: 'Menucochon',
      locale: 'en_CA',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} Recipes | Menucochon`,
      description: `Discover all our delicious ${categoryName.toLowerCase()} recipes.`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const recipes = await getRecipesByCategory(slug);
  const categoryName = getCategoryName(category.name, 'en');

  // Enrichir les recettes avec les slugs anglais
  const recipeCards = recipes.map((recipe) => ({
    id: recipe.id,
    slug: recipe.slug,
    title: recipe.title,
    featuredImage: recipe.featuredImage,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    totalTime: recipe.totalTime,
    difficulty: recipe.difficulty,
    categories: recipe.categories,
    likes: recipe.likes,
  }));

  const enrichedRecipes = await enrichRecipeCardsWithEnglishSlugs(recipeCards);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-neutral-900 to-black py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/en" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/en/recipes" className="hover:text-white transition-colors">
              Recipes
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#F77313]">{categoryName}</span>
          </nav>

          {/* Title */}
          <div className="max-w-3xl">
            <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest mb-3 block">
              Category
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-white mb-4">
              {categoryName}
            </h1>
            <p className="text-white/70 text-lg md:text-xl">
              {enrichedRecipes.length} recipe{enrichedRecipes.length > 1 ? 's' : ''} to discover
            </p>
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {enrichedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {enrichedRecipes.map((recipe, index) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  index={index}
                  locale="en"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-neutral-500 text-lg">
                No recipes found in this category.
              </p>
              <Link
                href="/en/recipes"
                className="inline-flex items-center gap-2 mt-4 text-[#F77313] hover:underline"
              >
                View all recipes
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
