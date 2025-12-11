import { Recipe } from '@/types/recipe';

interface Props {
  recipe: Recipe;
}

export default function RecipeSchema({ recipe }: Props) {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.excerpt,
    image: recipe.featuredImage ? [recipe.featuredImage] : [],
    author: {
      '@type': 'Person',
      name: recipe.author,
    },
    datePublished: recipe.publishedAt,
    dateModified: recipe.updatedAt,
    prepTime: `PT${recipe.prepTime}M`,
    cookTime: `PT${recipe.cookTime}M`,
    totalTime: `PT${recipe.totalTime}M`,
    recipeYield: `${recipe.servings} ${recipe.servingsUnit || 'portions'}`,
    recipeCategory: recipe.categories[0]?.name,
    recipeCuisine: recipe.cuisine,
    keywords: recipe.tags.join(', '),
    recipeIngredient: recipe.ingredients.flatMap((group) =>
      group.items.map((item) => {
        const parts = [];
        if (item.quantity) parts.push(item.quantity);
        if (item.unit) parts.push(item.unit);
        parts.push(item.name);
        if (item.note) parts.push(`(${item.note})`);
        return parts.join(' ');
      })
    ),
    recipeInstructions: recipe.instructions.map((step) => ({
      '@type': 'HowToStep',
      name: step.title || `Étape ${step.step}`,
      text: step.content,
      image: step.image,
    })),
    nutrition: recipe.nutrition
      ? {
          '@type': 'NutritionInformation',
          calories: recipe.nutrition.calories
            ? `${recipe.nutrition.calories} kcal`
            : undefined,
          proteinContent: recipe.nutrition.protein
            ? `${recipe.nutrition.protein} g`
            : undefined,
          carbohydrateContent: recipe.nutrition.carbs
            ? `${recipe.nutrition.carbs} g`
            : undefined,
          fatContent: recipe.nutrition.fat
            ? `${recipe.nutrition.fat} g`
            : undefined,
          fiberContent: recipe.nutrition.fiber
            ? `${recipe.nutrition.fiber} g`
            : undefined,
          sugarContent: recipe.nutrition.sugar
            ? `${recipe.nutrition.sugar} g`
            : undefined,
          sodiumContent: recipe.nutrition.sodium
            ? `${recipe.nutrition.sodium} mg`
            : undefined,
        }
      : undefined,
    aggregateRating: recipe.likes > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: '4.5',
          ratingCount: recipe.likes,
        }
      : undefined,
  };

  // Nettoyer les valeurs undefined
  const cleanSchema = JSON.parse(JSON.stringify(schema));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(cleanSchema),
      }}
    />
  );
}
