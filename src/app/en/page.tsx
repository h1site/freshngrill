import { getAllRecipes, getMainCategoriesWithLocale, enrichRecipesWithEnglishData } from '@/lib/recipes';
import { getRecentPostsWithEnglish } from '@/lib/posts';
import { MagazineHero } from '@/components/home/MagazineHero';
import { MagazineRecipeGrid } from '@/components/home/MagazineRecipeGrid';
import { MagazineCategorySection } from '@/components/home/MagazineCategorySection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { MagazineCTA } from '@/components/home/MagazineCTA';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { MagazineBlogSection } from '@/components/home/MagazineBlogSection';

export const revalidate = 60;

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
  const gridRecipes = allRecipes.slice(0, 9).map(recipe => ({
    id: recipe.id,
    slug: recipe.slug,
    slugEn: recipe.slugEn,
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
          locale="en"
        />
      )}

      {/* 2. Latest Recipes - Bento Grid */}
      {gridRecipes.length > 0 && (
        <MagazineRecipeGrid recipes={gridRecipes} locale="en" />
      )}

      {/* 3. Features Section */}
      <FeaturesSection locale="en" />

      {/* 4. Categories Section */}
      {categories.length > 0 && (
        <MagazineCategorySection categories={categories} locale="en" />
      )}

      {/* 5. Blog Section */}
      {recentPosts.length > 0 && (
        <MagazineBlogSection posts={recentPosts} locale="en" />
      )}

      {/* 6. Newsletter Section */}
      <NewsletterSection locale="en" />

      {/* 7. CTA Section */}
      <MagazineCTA recipe={allRecipes[Math.floor(Math.random() * Math.min(5, allRecipes.length))]} locale="en" />
    </main>
  );
}
