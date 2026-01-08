import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import {
  getCategoryBySlug,
  getRecipesByCategory,
  getAllCategorySlugs,
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
      title: 'Catégorie non trouvée',
    };
  }

  const categoryName = getCategoryName(category.name, 'fr');

  return {
    title: `Recettes ${categoryName}`,
    description: `Découvrez toutes nos délicieuses recettes de ${categoryName.toLowerCase()}. Des idées savoureuses pour régaler toute la famille.`,
    alternates: {
      canonical: `/categorie/${slug}/`,
      languages: {
        'fr-CA': `/categorie/${slug}/`,
        'en-CA': `/en/category/${slug}/`,
      },
    },
    openGraph: {
      title: `Recettes ${categoryName}`,
      description: `Découvrez toutes nos délicieuses recettes de ${categoryName.toLowerCase()}.`,
      type: 'website',
      url: `/categorie/${slug}/`,
      siteName: 'Menucochon',
      locale: 'fr_CA',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Recettes ${categoryName}`,
      description: `Découvrez toutes nos délicieuses recettes de ${categoryName.toLowerCase()}.`,
    },
  };
}

export default async function CategoriePage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const recipes = await getRecipesByCategory(slug);
  const categoryName = getCategoryName(category.name, 'fr');

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-neutral-900 to-black py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>Accueil</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/recettes" className="hover:text-white transition-colors">
              Recettes
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#F77313]">{categoryName}</span>
          </nav>

          {/* Title */}
          <div className="max-w-3xl">
            <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest mb-3 block">
              Catégorie
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-white mb-4">
              {categoryName}
            </h1>
            <p className="text-white/70 text-lg md:text-xl">
              {recipes.length} recette{recipes.length > 1 ? 's' : ''} à découvrir
            </p>
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {recipes.map((recipe, index) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={{
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
                  }}
                  index={index}
                  locale="fr"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-neutral-500 text-lg">
                Aucune recette trouvée dans cette catégorie.
              </p>
              <Link
                href="/recettes"
                className="inline-flex items-center gap-2 mt-4 text-[#F77313] hover:underline"
              >
                Voir toutes les recettes
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
