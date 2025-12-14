import { Metadata } from 'next';
import { getAllRecipes, getMainCategories } from '@/lib/recipes';
import { getRecentPosts } from '@/lib/posts';
import { MagazineHero } from '@/components/home/MagazineHero';
import { MagazineRecipeGrid } from '@/components/home/MagazineRecipeGrid';
import { MagazineCategorySection } from '@/components/home/MagazineCategorySection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { MagazineCTA } from '@/components/home/MagazineCTA';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { MagazineBlogSection } from '@/components/home/MagazineBlogSection';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Menu Cochon | Recettes gourmandes québécoises',
  description:
    'Découvrez notre collection de recettes gourmandes et faciles à réaliser. Des idées de repas pour tous les jours, des entrées aux desserts.',
  alternates: {
    canonical: '/',
    languages: {
      'fr-CA': '/',
      'en-CA': '/en/',
    },
  },
  openGraph: {
    title: 'Menu Cochon | Recettes gourmandes québécoises',
    description:
      'Découvrez notre collection de recettes gourmandes et faciles à réaliser. Des idées de repas pour tous les jours.',
    images: [
      {
        url: '/images/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Menu Cochon - Recettes gourmandes',
      },
    ],
    type: 'website',
    url: '/',
    siteName: 'Menu Cochon',
    locale: 'fr_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Menu Cochon | Recettes gourmandes québécoises',
    description:
      'Découvrez notre collection de recettes gourmandes et faciles à réaliser.',
    images: ['/images/og-home.jpg'],
  },
};

export default async function HomePage() {
  const [allRecipes, categories, recentPosts] = await Promise.all([
    getAllRecipes(),
    getMainCategories(10),
    getRecentPosts(4),
  ]);

  // Get featured recipe (most recent)
  const featuredRecipe = allRecipes[0];
  const sideRecipes = allRecipes.slice(1, 4);
  const gridRecipes = allRecipes.slice(0, 9).map(recipe => ({
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

  return (
    <main className="min-h-screen">
      {/* 1. Hero Section - Full Screen Magazine Style */}
      {featuredRecipe && (
        <MagazineHero
          featuredRecipe={featuredRecipe}
          sideRecipes={sideRecipes}
        />
      )}

      {/* 2. Latest Recipes - Bento Grid */}
      {gridRecipes.length > 0 && (
        <MagazineRecipeGrid recipes={gridRecipes} />
      )}

      {/* 3. Features Section */}
      <FeaturesSection />

      {/* 4. Categories Section */}
      {categories.length > 0 && (
        <MagazineCategorySection categories={categories} />
      )}

      {/* 5. Blog Section */}
      {recentPosts.length > 0 && (
        <MagazineBlogSection posts={recentPosts} />
      )}

      {/* 6. Newsletter Section */}
      <NewsletterSection />

      {/* 7. CTA Section */}
      <MagazineCTA recipe={allRecipes[Math.floor(Math.random() * Math.min(5, allRecipes.length))]} />
    </main>
  );
}
