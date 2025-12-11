import { Recipe } from '@/types/recipe';
import RecipeCard from './RecipeCard';

interface Props {
  recipes: Recipe[];
}

export default function RecipeSimilar({ recipes }: Props) {
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
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
