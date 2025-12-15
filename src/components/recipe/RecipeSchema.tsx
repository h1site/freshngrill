import { Recipe } from '@/types/recipe';

interface Props {
  recipe: Recipe;
  locale?: 'fr' | 'en';
  rating?: {
    averageRating: number;
    ratingCount: number;
  };
}

export default function RecipeSchema({ recipe, locale = 'fr', rating }: Props) {
  const baseUrl = 'https://menucochon.com';
  const recipePath = locale === 'en' ? `/en/recipe/${recipe.slug}/` : `/recette/${recipe.slug}/`;
  const recipeUrl = `${baseUrl}${recipePath}`;

  // Description: use excerpt, introduction (stripped of HTML), or title
  const getDescription = () => {
    if (recipe.excerpt && recipe.excerpt.trim()) return recipe.excerpt;
    if (recipe.introduction) {
      // Strip HTML tags from introduction
      const stripped = recipe.introduction.replace(/<[^>]*>/g, '').trim();
      if (stripped) return stripped.substring(0, 300);
    }
    return `Recette de ${recipe.title} - ${recipe.categories[0]?.name || 'Menucochon'}`;
  };

  // Keywords: combine tags, categories, and cuisine
  const getKeywords = () => {
    const keywords: string[] = [];
    if (recipe.tags?.length) keywords.push(...recipe.tags);
    if (recipe.categories?.length) keywords.push(...recipe.categories.map(c => c.name));
    if (recipe.cuisine) keywords.push(recipe.cuisine);
    if (recipe.ingredientTags?.length) keywords.push(...recipe.ingredientTags.map(t => t.name));
    // Add default keywords if empty
    if (keywords.length === 0) {
      keywords.push('recette', recipe.title);
    }
    return [...new Set(keywords)].join(', ');
  };

  // Ingredients: ensure no empty strings and proper formatting
  const getIngredients = () => {
    const ingredients = recipe.ingredients.flatMap((group) =>
      group.items.map((item) => {
        const parts: string[] = [];
        if (item.quantity) parts.push(item.quantity);
        if (item.unit) parts.push(item.unit);
        if (item.name) parts.push(item.name);
        if (item.note) parts.push(`(${item.note})`);
        return parts.join(' ').trim();
      })
    ).filter(ing => ing.length > 0);

    // Google requires at least one ingredient
    return ingredients.length > 0 ? ingredients : ['Voir les ingrédients dans la recette'];
  };

  // Instructions: add url field for each step
  const getInstructions = () => {
    if (!recipe.instructions?.length) {
      return [{
        '@type': 'HowToStep',
        text: 'Consultez la recette complète sur le site.',
        url: recipeUrl,
      }];
    }

    return recipe.instructions.map((step, index) => {
      const instruction: Record<string, unknown> = {
        '@type': 'HowToStep',
        name: step.title || `Étape ${step.step || index + 1}`,
        text: step.content,
        url: `${recipeUrl}#etape-${step.step || index + 1}`,
      };
      if (step.image) {
        instruction.image = step.image;
      }
      return instruction;
    });
  };

  // Category: ensure we have one
  const getCategory = () => {
    if (recipe.categories?.[0]?.name) return recipe.categories[0].name;
    return 'Recette';
  };

  // Cuisine: default to Quebec/Canadian
  const getCuisine = () => {
    if (recipe.cuisine) return recipe.cuisine;
    if (recipe.cuisineTypeTags?.[0]?.name) return recipe.cuisineTypeTags[0].name;
    return 'Québécoise';
  };

  // Video object if available
  const getVideo = () => {
    if (!recipe.videoUrl) return undefined;

    // Extract YouTube video ID if it's a YouTube URL
    const youtubeMatch = recipe.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    const videoId = youtubeMatch ? youtubeMatch[1] : null;

    return {
      '@type': 'VideoObject',
      name: recipe.title,
      description: getDescription(),
      thumbnailUrl: videoId
        ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        : recipe.featuredImage,
      contentUrl: recipe.videoUrl,
      embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : recipe.videoUrl,
      uploadDate: recipe.publishedAt,
    };
  };

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: recipe.title,
    description: getDescription(),
    image: recipe.featuredImage
      ? [recipe.featuredImage]
      : [`${baseUrl}/images/default-recipe.svg`],
    author: {
      '@type': 'Person',
      name: recipe.author || 'Menucochon',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Menucochon',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logos/menucochon-blanc.svg`,
      },
    },
    datePublished: recipe.publishedAt,
    dateModified: recipe.updatedAt || recipe.publishedAt,
    prepTime: `PT${recipe.prepTime || 0}M`,
    cookTime: `PT${recipe.cookTime || 0}M`,
    totalTime: `PT${recipe.totalTime || (recipe.prepTime || 0) + (recipe.cookTime || 0)}M`,
    recipeYield: `${recipe.servings || 4} ${recipe.servingsUnit || 'portions'}`,
    recipeCategory: getCategory(),
    recipeCuisine: getCuisine(),
    keywords: getKeywords(),
    recipeIngredient: getIngredients(),
    recipeInstructions: getInstructions(),
    url: recipeUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': recipeUrl,
    },
  };

  // Add nutrition if available
  if (recipe.nutrition) {
    const nutrition: Record<string, string> = {
      '@type': 'NutritionInformation',
    };
    if (recipe.nutrition.calories) nutrition.calories = `${recipe.nutrition.calories} kcal`;
    if (recipe.nutrition.protein) nutrition.proteinContent = `${recipe.nutrition.protein} g`;
    if (recipe.nutrition.carbs) nutrition.carbohydrateContent = `${recipe.nutrition.carbs} g`;
    if (recipe.nutrition.fat) nutrition.fatContent = `${recipe.nutrition.fat} g`;
    if (recipe.nutrition.fiber) nutrition.fiberContent = `${recipe.nutrition.fiber} g`;
    if (recipe.nutrition.sugar) nutrition.sugarContent = `${recipe.nutrition.sugar} g`;
    if (recipe.nutrition.sodium) nutrition.sodiumContent = `${recipe.nutrition.sodium} mg`;

    if (Object.keys(nutrition).length > 1) {
      schema.nutrition = nutrition;
    }
  }

  // Add video if available
  const video = getVideo();
  if (video) {
    schema.video = video;
  }

  // Add aggregate rating if available (for Google rich snippets stars)
  if (rating && rating.ratingCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.averageRating,
      ratingCount: rating.ratingCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Nettoyer les valeurs undefined/null
  const cleanSchema = JSON.parse(JSON.stringify(schema));

  // FAQ Schema - Parse le nouveau format JSON
  let faqSchema = null;
  if (recipe.faq) {
    try {
      const faqData = JSON.parse(recipe.faq);
      if (faqData.faq && Array.isArray(faqData.faq) && faqData.faq.length > 0) {
        const faqItems = faqData.faq
          .filter((item: { question_fr?: string; question_en?: string; answer_fr?: string; answer_en?: string }) => {
            const question = locale === 'en' ? item.question_en : item.question_fr;
            const answer = locale === 'en' ? item.answer_en : item.answer_fr;
            return question && answer;
          })
          .map((item: { question_fr?: string; question_en?: string; answer_fr?: string; answer_en?: string }) => ({
            '@type': 'Question',
            name: locale === 'en' ? item.question_en : item.question_fr,
            acceptedAnswer: {
              '@type': 'Answer',
              text: locale === 'en' ? item.answer_en : item.answer_fr,
            },
          }));

        if (faqItems.length > 0) {
          faqSchema = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems,
          };
        }
      }
    } catch {
      // FAQ n'est pas en format JSON valide, ignorer
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(cleanSchema),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}
    </>
  );
}
