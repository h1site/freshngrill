import { Recipe, RecipeCard as RecipeCardType } from '@/types/recipe';
import RecipeCard from './RecipeCard';
import type { Locale } from '@/i18n/config';

interface Props {
  recipes: Recipe[] | RecipeCardType[];
  locale?: Locale;
}

export default function RecipeSimilar({ recipes, locale = 'fr' }: Props) {
  const recipeCards = recipes.map((recipe) => ({
    id: recipe.id,
    slug: recipe.slug,
    slugEn: 'slugEn' in recipe ? recipe.slugEn : undefined,
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
