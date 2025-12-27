'use client';

import { Recipe } from '@/types/recipe';
import LikeButton from './LikeButton';
import ShareButton from './ShareButton';
import PrintButton from './PrintButton';
import CookModeButton from './CookModeButton';
import type { Locale } from '@/i18n/config';

interface Props {
  recipe: Recipe;
  locale?: Locale;
}

export default function RecipeActions({ recipe, locale = 'fr' }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3">
      <LikeButton recipeId={recipe.id} initialCount={recipe.likes} size="sm" showCount={false} />

      <ShareButton
        title={recipe.title}
        description={recipe.excerpt}
        image={recipe.featuredImage}
        pinterestImage={recipe.pinterestImage}
        compact
        locale={locale}
      />

      <PrintButton recipe={recipe} compact locale={locale} />

      <CookModeButton recipe={recipe} compact locale={locale} />
    </div>
  );
}
