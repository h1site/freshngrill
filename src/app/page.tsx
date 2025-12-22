import { Metadata } from 'next';
import { getAllRecipes, getMainCategories } from '@/lib/recipes';
import { getRecentPosts } from '@/lib/posts';
import { FeaturesCarousel } from '@/components/home/FeaturesCarousel';
import { MagazineHero } from '@/components/home/MagazineHero';
import { MagazineCategorySection } from '@/components/home/MagazineCategorySection';
import { MagazineCTA } from '@/components/home/MagazineCTA';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { MagazineBlogSection } from '@/components/home/MagazineBlogSection';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Menucochon | Recettes gourmandes québécoises',
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
    title: 'Menucochon | Recettes gourmandes québécoises',
    description:
      'Découvrez notre collection de recettes gourmandes et faciles à réaliser. Des idées de repas pour tous les jours.',
    images: [
      {
        url: '/images/og-home.svg',
        width: 1200,
        height: 630,
        alt: 'Menucochon - Recettes gourmandes',
      },
    ],
    type: 'website',
    url: '/',
    siteName: 'Menucochon',
    locale: 'fr_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Menucochon | Recettes gourmandes québécoises',
    description:
      'Découvrez notre collection de recettes gourmandes et faciles à réaliser.',
    images: ['/images/og-home.svg'],
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

  return (
    <main className="min-h-screen">
      {/* 1. Features Carousel - Full width animated slideshow */}
      <FeaturesCarousel />

      {/* 2. Hero Section - Featured Recipe with "À découvrir" */}
      {featuredRecipe && (
        <MagazineHero
          featuredRecipe={featuredRecipe}
          sideRecipes={sideRecipes}
          showDiscoverCTA
        />
      )}

      {/* 3. Categories Section */}
      {categories.length > 0 && (
        <MagazineCategorySection categories={categories} />
      )}

      {/* 4. Blog Section */}
      {recentPosts.length > 0 && (
        <MagazineBlogSection posts={recentPosts} />
      )}

      {/* 5. Newsletter Section */}
      <NewsletterSection />

      {/* 6. CTA Section */}
      <MagazineCTA recipe={allRecipes[Math.floor(Math.random() * Math.min(5, allRecipes.length))]} />
    </main>
  );
}
