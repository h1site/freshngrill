'use client';

import Link from 'next/link';
import { Recipe } from '@/types/recipe';
import { Clock, Users } from 'lucide-react';
import LikeButton from './LikeButton';
import ShareButton from './ShareButton';
import PrintButton from './PrintButton';
import CookModeButton from './CookModeButton';
import type { Locale } from '@/i18n/config';
import { getCategoryName } from '@/lib/categoryTranslations';

interface Props {
  recipe: Recipe;
  locale?: Locale;
}

export default function RecipeHeader({ recipe, locale = 'fr' }: Props) {
  const isEN = locale === 'en';

  const t = isEN ? {
    prep: 'Prep',
    cook: 'Cook',
    servings: 'Servings',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
  } : {
    prep: 'Préparation',
    cook: 'Cuisson',
    servings: 'Portions',
    difficulty: 'Difficulté',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
  };

  const difficultyColors = {
    facile: 'bg-green-500',
    moyen: 'bg-amber-500',
    difficile: 'bg-red-500',
  };

  const difficultyTranslation: Record<string, string> = {
    facile: t.easy,
    moyen: t.medium,
    difficile: t.hard,
  };

  return (
    <div className="text-white max-w-4xl">
      {/* Categories - clickable links */}
      {recipe.categories.length > 0 && (
        <div className="hidden sm:flex flex-wrap gap-2 mb-3 md:mb-4">
          {recipe.categories.map((cat) => (
            <Link
              key={cat.id}
              href={isEN ? `/en/category/${cat.slug}` : `/categorie/${cat.slug}`}
              className="bg-white/20 backdrop-blur-sm text-white text-xs md:text-sm font-medium px-3 py-1 md:px-4 md:py-1.5 rounded-full hover:bg-[#F77313] transition-colors duration-200"
            >
              {getCategoryName(cat.name, locale)}
            </Link>
          ))}
        </div>
      )}

      {/* Title - smaller on mobile */}
      <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-6 leading-tight">
        {recipe.title}
      </h1>

      {/* Meta information - compact on mobile */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 mb-3 md:mb-6">
        {/* Prep time */}
        {recipe.prepTime > 0 && (
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 bg-black/40 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2.5 rounded-md md:rounded-lg">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#F77313]" />
            <div className="flex flex-col leading-tight">
              <span className="text-white/60 text-[10px] sm:text-xs uppercase tracking-wide">{t.prep}</span>
              <span className="font-semibold text-white text-xs sm:text-sm md:text-base">{recipe.prepTime} min</span>
            </div>
          </div>
        )}

        {/* Cook time */}
        {recipe.cookTime > 0 && (
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 bg-black/40 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2.5 rounded-md md:rounded-lg">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#F77313]" />
            <div className="flex flex-col leading-tight">
              <span className="text-white/60 text-[10px] sm:text-xs uppercase tracking-wide">{t.cook}</span>
              <span className="font-semibold text-white text-xs sm:text-sm md:text-base">{recipe.cookTime} min</span>
            </div>
          </div>
        )}

        {/* Servings */}
        {recipe.servings > 0 && (
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 bg-black/40 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2.5 rounded-md md:rounded-lg">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#F77313]" />
            <div className="flex flex-col leading-tight">
              <span className="text-white/60 text-[10px] sm:text-xs uppercase tracking-wide">{t.servings}</span>
              <span className="font-semibold text-white text-xs sm:text-sm md:text-base">{recipe.servings}</span>
            </div>
          </div>
        )}

        {/* Difficulty */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 bg-black/40 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2.5 rounded-md md:rounded-lg">
          <span
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
              difficultyColors[recipe.difficulty] || difficultyColors.moyen
            }`}
          />
          <div className="flex flex-col leading-tight">
            <span className="text-white/60 text-[10px] sm:text-xs uppercase tracking-wide">{t.difficulty}</span>
            <span className="font-semibold text-white text-xs sm:text-sm md:text-base capitalize">
              {difficultyTranslation[recipe.difficulty] || recipe.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Actions - icon only on mobile */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <LikeButton recipeId={recipe.id} initialCount={recipe.likes} size="sm" showCount={false} />

        <ShareButton
          title={recipe.title}
          description={recipe.excerpt}
          image={recipe.featuredImage}
          compact
          locale={locale}
        />

        <PrintButton recipe={recipe} compact locale={locale} />

        <CookModeButton recipe={recipe} compact locale={locale} />
      </div>
    </div>
  );
}
