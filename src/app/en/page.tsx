import { Metadata } from 'next';
import { getAllRecipes, getMainCategoriesWithLocale, enrichRecipesWithEnglishData } from '@/lib/recipes';
import { getRecentPostsWithEnglish } from '@/lib/posts';
import { getRecentVideos } from '@/lib/videos';
import { FeaturesCarousel } from '@/components/home/FeaturesCarousel';
import { MagazineHero } from '@/components/home/MagazineHero';
import { MagazineCategorySection } from '@/components/home/MagazineCategorySection';
import { MagazineCTA } from '@/components/home/MagazineCTA';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { MagazineBlogSection } from '@/components/home/MagazineBlogSection';
import { YouTubeSection } from '@/components/home/YouTubeSection';
import { HomeSEOSection } from '@/components/home/HomeSEOSection';
import WebSiteSchema from '@/components/schema/WebSiteSchema';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Menucochon - Delicious Quebec Recipes Easy to Make',
  description:
    'Menucochon, your gourmet destination! Discover hundreds of easy Quebec recipes. Main dishes, desserts, soups and more on Menucochon.com',
  keywords: [
    'menucochon',
    'Quebec recipes',
    'delicious recipes',
    'easy recipes',
    'Quebec cuisine',
    'homemade cooking',
    'meal ideas',
  ],
  alternates: {
    canonical: '/en/',
    languages: {
      'fr-CA': '/',
      'en-CA': '/en/',
    },
  },
  openGraph: {
    title: 'Menucochon - Delicious Quebec Recipes Easy to Make',
    description:
      'Menucochon, your gourmet destination! Discover hundreds of easy Quebec recipes.',
    type: 'website',
    url: '/en/',
    siteName: 'Menucochon',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Menucochon - Delicious Quebec Recipes Easy to Make',
    description:
      'Menucochon, your gourmet destination! Discover hundreds of easy Quebec recipes.',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
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

  // Get videos (sync function, no await needed)
  const recentVideos = getRecentVideos(3);

  // Get featured recipe (most recent)
  const featuredRecipe = allRecipes[0];
  const sideRecipes = allRecipes.slice(1, 4);

  return (
    <main className="min-h-screen">
      {/* JSON-LD Schema for SEO */}
      <WebSiteSchema locale="en" />

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

      {/* 5. YouTube Section */}
      {recentVideos.length > 0 && (
        <YouTubeSection videos={recentVideos} locale="en" />
      )}

      {/* 6. Newsletter Section */}
      <NewsletterSection locale="en" />

      {/* 6. SEO Section - About Menucochon */}
      <HomeSEOSection locale="en" />

      {/* 7. CTA Section */}
      <MagazineCTA recipe={allRecipes[Math.floor(Math.random() * Math.min(5, allRecipes.length))]} locale="en" />
    </main>
  );
}
