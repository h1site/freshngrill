'use client';

import { Recipe } from '@/types/recipe';
import { Clock, Users, ChefHat } from 'lucide-react';
import LikeButton from './LikeButton';
import ShareButton from './ShareButton';
import PrintButton from './PrintButton';
import CookModeButton from './CookModeButton';
import type { Locale } from '@/i18n/config';

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
      {/* Categories */}
      {recipe.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.categories.map((cat) => (
            <span
              key={cat.id}
              className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full"
            >
              {cat.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
        {recipe.title}
      </h1>

      {/* Meta information */}
      <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6">
        {/* Prep time */}
        {recipe.prepTime > 0 && (
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2.5 rounded-lg">
            <Clock className="w-5 h-5 text-[#F77313]" />
            <div>
              <div className="text-[10px] text-white/70 uppercase tracking-wider font-medium">
                {t.prep}
              </div>
              <div className="font-bold text-white text-lg leading-tight">{recipe.prepTime} min</div>
            </div>
          </div>
        )}

        {/* Cook time */}
        {recipe.cookTime > 0 && (
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2.5 rounded-lg">
            <Clock className="w-5 h-5 text-[#F77313]" />
            <div>
              <div className="text-[10px] text-white/70 uppercase tracking-wider font-medium">
                {t.cook}
              </div>
              <div className="font-bold text-white text-lg leading-tight">{recipe.cookTime} min</div>
            </div>
          </div>
        )}

        {/* Servings */}
        {recipe.servings > 0 && (
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2.5 rounded-lg">
            <Users className="w-5 h-5 text-[#F77313]" />
            <div>
              <div className="text-[10px] text-white/70 uppercase tracking-wider font-medium">
                {t.servings}
              </div>
              <div className="font-bold text-white text-lg leading-tight">
                {recipe.servings} {recipe.servingsUnit || (isEN ? 'servings' : 'portions')}
              </div>
            </div>
          </div>
        )}

        {/* Difficulty */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2.5 rounded-lg">
          <ChefHat className="w-5 h-5 text-[#F77313]" />
          <div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-medium">
              {t.difficulty}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-lg leading-tight capitalize">
                {difficultyTranslation[recipe.difficulty] || recipe.difficulty}
              </span>
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  difficultyColors[recipe.difficulty] || difficultyColors.moyen
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <LikeButton recipeId={recipe.id} initialCount={recipe.likes} size="md" />

        <ShareButton
          title={recipe.title}
          description={recipe.excerpt}
          image={recipe.featuredImage}
        />

        <PrintButton recipe={recipe} />

        <CookModeButton recipe={recipe} />
      </div>
    </div>
  );
}
