import { Recipe } from '@/types/recipe';
import RecipeCard from './RecipeCard';
import type { Locale } from '@/i18n/config';

interface Props {
  recipes: Recipe[];
  locale?: Locale;
}

export default function RecipeSimilar({ recipes, locale = 'fr' }: Props) {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {recipeCards.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} locale={locale} />
      ))}
    </div>
  );
}
