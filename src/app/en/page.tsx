import Link from 'next/link';
import Image from 'next/image';
import { getRecentRecipes, getAllCategories, getMostLikedRecipes } from '@/lib/recipes';
import { getRecentPosts } from '@/lib/posts';
import RecipeCard from '@/components/recipe/RecipeCard';
import { ArrowRight, Heart, BookOpen } from 'lucide-react';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import GoogleAd from '@/components/ads/GoogleAd';
import { getDictionary } from '@/i18n/getDictionary';

export const revalidate = 60;

export default async function EnglishHomePage() {
  const [recentRecipes, allCategories, mostLikedRecipes, recentPosts, dictionary] = await Promise.all([
    getRecentRecipes(8),
    getAllCategories(),
    getMostLikedRecipes(6),
    getRecentPosts(3),
    getDictionary('en'),
  ]);

  const t = dictionary;
  const categories = allCategories.slice(0, 8);

  return (
    <main className="min-h-screen">
      {/* 1. Latest Recipes */}
      {recentRecipes.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
                  Freshly Added
                </span>
                <h2 className="text-4xl md:text-5xl font-display text-black mt-2">
                  {t.home.latestRecipes}
                </h2>
              </div>
              <Link
                href="/en/recipe"
                className="group flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-[#F77313] transition-colors mt-4 md:mt-0"
              >
                {t.common.seeAll}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Divider */}
            <div className="w-16 h-1 bg-[#F77313] mb-12" />

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {recentRecipes.map((recipe, index) => (
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
                  locale="en"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ad */}
      <div className="container mx-auto px-4 py-8">
        <GoogleAd slot="7610644087" />
      </div>

      {/* 2. Categories Section */}
      {categories.length > 0 && (
        <CategoryGrid categories={categories} locale="en" />
      )}

      {/* 3. Most Liked Recipes */}
      {mostLikedRecipes.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 fill-current" />
                Your Favorites
              </span>
              <h2 className="text-4xl md:text-5xl font-display text-black mt-2">
                {t.home.popularRecipes}
              </h2>
              <p className="text-neutral-500 mt-4 max-w-xl mx-auto">
                The recipes you loved the most. Vote for your favorites!
              </p>
              <div className="w-16 h-1 bg-[#F77313] mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mostLikedRecipes.slice(0, 6).map((recipe, index) => (
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
                  variant="large"
                  locale="en"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ad */}
      <div className="container mx-auto px-4 py-8 bg-neutral-50">
        <GoogleAd slot="7610644087" />
      </div>

      {/* 4. Blog Section */}
      {recentPosts.length > 0 && (
        <section className="py-16 md:py-24 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  The Blog
                </span>
                <h2 className="text-4xl md:text-5xl font-display text-black mt-2">
                  {t.home.latestArticles}
                </h2>
              </div>
              <Link
                href="/en/blog"
                className="group flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-[#F77313] transition-colors mt-4 md:mt-0"
              >
                {t.common.seeAll}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="w-16 h-1 bg-[#F77313] mb-12" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/en/blog/${post.slug}`}
                  className="group block bg-white border border-neutral-200 hover:border-[#F77313] transition-all duration-300"
                >
                  {post.featuredImage && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {post.categories.length > 0 && (
                      <span className="text-[#F77313] text-xs font-medium uppercase tracking-widest">
                        {post.categories[0].name}
                      </span>
                    )}
                    <h3 className="font-display text-xl text-black mt-2 group-hover:text-[#F77313] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-neutral-500 text-sm mt-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-4 text-xs text-neutral-400">
                      <span>{post.readingTime} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <NewsletterSection locale="en" />

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(247,115,19,0.1)_50%,transparent_75%)] bg-[length:20px_20px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
              Explore
            </span>
            <h2 className="text-4xl md:text-6xl font-display mt-4 mb-6">
              Ready to Cook?
            </h2>
            <p className="text-neutral-400 text-lg mb-10 max-w-xl mx-auto">
              Discover our complete collection of recipes and find inspiration for your next meals.
            </p>
            <Link
              href="/en/recipe"
              className="inline-flex items-center gap-3 bg-[#F77313] text-white px-8 py-4 font-medium uppercase tracking-wide hover:bg-[#d45f0a] transition-colors"
            >
              Explore recipes
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
