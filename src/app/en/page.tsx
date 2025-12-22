import { Metadata } from 'next';
import { getAllRecipes, getMainCategoriesWithLocale, enrichRecipesWithEnglishData } from '@/lib/recipes';
import { getRecentPostsWithEnglish } from '@/lib/posts';
import { FeaturesCarousel } from '@/components/home/FeaturesCarousel';
import { MagazineHero } from '@/components/home/MagazineHero';
import { MagazineCategorySection } from '@/components/home/MagazineCategorySection';
import { MagazineCTA } from '@/components/home/MagazineCTA';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { MagazineBlogSection } from '@/components/home/MagazineBlogSection';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Menucochon | Delicious Quebec Recipes',
  description:
    'Discover our collection of delicious and easy-to-make recipes. Meal ideas for every day, from appetizers to desserts.',
  alternates: {
    canonical: '/en/',
    languages: {
      'fr-CA': '/',
      'en-CA': '/en/',
    },
  },
  openGraph: {
    title: 'Menucochon | Delicious Quebec Recipes',
    description:
      'Discover our collection of delicious and easy-to-make recipes. Meal ideas for every day.',
    images: [
      {
        url: '/images/og-home.svg',
        width: 1200,
        height: 630,
        alt: 'Menucochon - Delicious Recipes',
      },
    ],
    type: 'website',
    url: '/en/',
    siteName: 'Menucochon',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Menucochon | Delicious Quebec Recipes',
    description:
      'Discover our collection of delicious and easy-to-make recipes.',
    images: ['/images/og-home.svg'],
  },
};

export default async function EnglishHomePage() {
  const [rawRecipes, categories, recentPosts] = await Promise.all([
    getAllRecipes(),
    getMainCategoriesWithLocale('en', 10),
    getRecentPostsWithEnglish(4),
  ]);

  // Enrichir avec les données anglaises
  const allRecipes = await enrichRecipesWithEnglishData(rawRecipes);

  // Get featured recipe (most recent)
  const featuredRecipe = allRecipes[0];
  const sideRecipes = allRecipes.slice(1, 4);

  return (
    <main className="min-h-screen">
      {/* 1. Features Carousel - Full width animated slideshow */}
      <FeaturesCarousel locale="en" />

      {/* 2. Hero Section - Featured Recipe with "Discover" */}
      {featuredRecipe && (
        <MagazineHero
          featuredRecipe={featuredRecipe}
          sideRecipes={sideRecipes}
          locale="en"
          showDiscoverCTA
        />
      )}

      {/* 3. Categories Section */}
      {categories.length > 0 && (
        <MagazineCategorySection categories={categories} locale="en" />
      )}

      {/* 4. Blog Section */}
      {recentPosts.length > 0 && (
        <MagazineBlogSection posts={recentPosts} locale="en" />
      )}

      {/* 5. Newsletter Section */}
      <NewsletterSection locale="en" />

      {/* 6. CTA Section */}
      <MagazineCTA recipe={allRecipes[Math.floor(Math.random() * Math.min(5, allRecipes.length))]} locale="en" />
    </main>
  );
}
