import { Metadata } from 'next';
import { getAllRecipes, getMainCategoriesWithLocale, enrichRecipesWithEnglishData, getRecipesBySlugs } from '@/lib/recipes';
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
import { FeaturedRecipesSection } from '@/components/home/FeaturedRecipesSection';
import { AdvertisingCTA } from '@/components/home/AdvertisingCTA';
import { FrigoMagiqueCTA } from '@/components/home/FrigoMagiqueCTA';
import { LatestRecipesCarousel } from '@/components/home/LatestRecipesCarousel';
import WebSiteSchema from '@/components/schema/WebSiteSchema';
import HomePageAd from '@/components/ads/HomePageAd';

// Featured recipes for Menucochon (slugs)
const FEATURED_RECIPE_SLUGS = [
  'filet-de-porc',
  'macaroni-chinois',
  'orange-julep',
  'jambon-a-la-biere-a-la-mijoteuse',
  'soupe-won-ton',
];

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
  const [rawRecipes, categories, recentPosts, rawFeaturedRecipes] = await Promise.all([
    getAllRecipes(),
    getMainCategoriesWithLocale('en', 10),
    getRecentPostsWithEnglish(4),
    getRecipesBySlugs(FEATURED_RECIPE_SLUGS),
  ]);

  // Enrichir avec les données anglaises
  const allRecipes = await enrichRecipesWithEnglishData(rawRecipes);
  const featuredRecipes = await enrichRecipesWithEnglishData(rawFeaturedRecipes);

  // Get videos (sync function, no await needed)
  const recentVideos = getRecentVideos(3);

  // Get featured recipe (most recent)
  const featuredRecipe = allRecipes[0];
  const sideRecipes = allRecipes.slice(1, 4);
  const latestRecipes = allRecipes.slice(4, 29);

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

      {/* 2. Latest Recipes Carousel */}
      {latestRecipes.length > 0 && (
        <LatestRecipesCarousel recipes={latestRecipes} locale="en" />
      )}

      {/* AD #1 - After Hero (Top Viewability) */}
      <HomePageAd position="after-hero" />

      {/* 3. Featured Recipes Section - Menucochon's Best */}
      {featuredRecipes.length > 0 && (
        <FeaturedRecipesSection recipes={featuredRecipes} locale="en" />
      )}

      {/* AD #2 - After Featured Recipes (In-feed / Scroll) */}
      <HomePageAd position="after-featured" />

      {/* 4. Combined Section - Magic Fridge CTA + Categories */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Magic Fridge CTA */}
          <div className="mb-16">
            <FrigoMagiqueCTA locale="en" />
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <MagazineCategorySection categories={categories} locale="en" />
          )}
        </div>
      </section>

      {/* 5. Blog Section */}
      {recentPosts.length > 0 && (
        <MagazineBlogSection posts={recentPosts} locale="en" />
      )}

      {/* 6. YouTube Section */}
      {recentVideos.length > 0 && (
        <YouTubeSection videos={recentVideos} locale="en" />
      )}

      {/* AD #3 - After YouTube (Deep Scroll) */}
      <HomePageAd position="after-youtube" />

      {/* 7. Newsletter Section */}
      <NewsletterSection locale="en" />

      {/* 6. SEO Section - About Menucochon */}
      <HomeSEOSection locale="en" />

      {/* 7. Advertising CTA */}
      <AdvertisingCTA locale="en" />

      {/* 8. CTA Section */}
      <MagazineCTA recipe={allRecipes[Math.floor(Math.random() * Math.min(5, allRecipes.length))]} locale="en" />
    </main>
  );
}
