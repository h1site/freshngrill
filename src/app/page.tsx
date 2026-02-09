import { Metadata } from 'next';
import { getAllRecipes, getMainCategories, getRecipesBySlugs } from '@/lib/recipes';
import { getRecentPosts } from '@/lib/posts';
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

// Recettes vedettes Menucochon (slugs)
const FEATURED_RECIPE_SLUGS = [
  'filet-de-porc',
  'macaroni-chinois',
  'orange-julep',
  'jambon-a-la-biere-a-la-mijoteuse',
  'soupe-won-ton',
];

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Menucochon - Recettes québécoises gourmandes et faciles',
  description:
    'Menucochon, votre destination gourmande! Découvrez des centaines de recettes québécoises faciles à réaliser. Plats principaux, desserts, soupes et plus sur Menucochon.com',
  keywords: [
    'menucochon',
    'recettes québécoises',
    'recettes gourmandes',
    'recettes faciles',
    'cuisine québécoise',
    'cuisine maison',
    'idées repas',
  ],
  alternates: {
    canonical: '/',
    languages: {
      'fr-CA': '/',
      'en-CA': '/en/',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'Menucochon - Recettes québécoises gourmandes et faciles',
    description:
      'Menucochon, votre destination gourmande! Découvrez des centaines de recettes québécoises faciles à réaliser.',
    type: 'website',
    url: '/',
    siteName: 'Menucochon',
    locale: 'fr_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Menucochon - Recettes québécoises gourmandes et faciles',
    description:
      'Menucochon, votre destination gourmande! Découvrez des centaines de recettes québécoises faciles.',
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

export default async function HomePage() {
  const [allRecipes, categories, recentPosts, featuredRecipes] = await Promise.all([
    getAllRecipes(),
    getMainCategories(10),
    getRecentPosts(4),
    getRecipesBySlugs(FEATURED_RECIPE_SLUGS),
  ]);

  // Get videos (sync function, no await needed)
  const recentVideos = getRecentVideos(3);

  // Get featured recipe (most recent)
  const featuredRecipe = allRecipes[0];
  const sideRecipes = allRecipes.slice(1, 4);
  const latestRecipes = allRecipes.slice(4, 29); // 25 latest (after hero ones)

  return (
    <main className="min-h-screen">
      {/* JSON-LD Schema for SEO */}
      <WebSiteSchema locale="fr" />

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

      {/* 2. Latest Recipes Carousel */}
      {latestRecipes.length > 0 && (
        <LatestRecipesCarousel recipes={latestRecipes} locale="fr" />
      )}

      {/* AD #1 - After Hero (Top Viewability) */}
      <HomePageAd position="after-hero" />

      {/* 3. Featured Recipes Section - Menucochon's Best */}
      {featuredRecipes.length > 0 && (
        <FeaturedRecipesSection recipes={featuredRecipes} locale="fr" />
      )}

      {/* AD #2 - After Featured Recipes (In-feed / Scroll) */}
      <HomePageAd position="after-featured" />

      {/* 4. Combined Section - Frigo Magique CTA + Categories */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Frigo Magique CTA */}
          <div className="mb-16">
            <FrigoMagiqueCTA locale="fr" />
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <MagazineCategorySection categories={categories} />
          )}
        </div>
      </section>

      {/* 5. Blog Section */}
      {recentPosts.length > 0 && (
        <MagazineBlogSection posts={recentPosts} />
      )}

      {/* 6. YouTube Section */}
      {recentVideos.length > 0 && (
        <YouTubeSection videos={recentVideos} locale="fr" />
      )}

      {/* AD #3 - After YouTube (Deep Scroll) */}
      <HomePageAd position="after-youtube" />

      {/* 7. Newsletter Section */}
      <NewsletterSection />

      {/* 6. SEO Section - About Menucochon */}
      <HomeSEOSection locale="fr" />

      {/* 7. Advertising CTA */}
      <AdvertisingCTA locale="fr" />

      {/* 8. CTA Section */}
      <MagazineCTA recipe={allRecipes[Math.floor(Math.random() * Math.min(5, allRecipes.length))]} />
    </main>
  );
}
