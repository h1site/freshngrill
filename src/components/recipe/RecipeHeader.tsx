'use client';

import { Recipe } from '@/types/recipe';
import { Clock, Users, ChefHat } from 'lucide-react';
import LikeButton from './LikeButton';
import ShareButton from './ShareButton';
import PrintButton from './PrintButton';
import CookModeButton from './CookModeButton';

interface Props {
  recipe: Recipe;
}

export default function RecipeHeader({ recipe }: Props) {
  const difficultyColors = {
    facile: 'bg-green-500',
    moyen: 'bg-amber-500',
    difficile: 'bg-red-500',
  };

  return (
    <div className="text-white max-w-4xl">
      {/* Catégories */}
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

      {/* Titre */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
        {recipe.title}
      </h1>

      {/* Meta informations */}
      <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6">
        {/* Temps de préparation */}
        {recipe.prepTime > 0 && (
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2.5 rounded-lg">
            <Clock className="w-5 h-5 text-[#F77313]" />
            <div>
              <div className="text-[10px] text-white/70 uppercase tracking-wider font-medium">
                Préparation
              </div>
              <div className="font-bold text-white text-lg leading-tight">{recipe.prepTime} min</div>
            </div>
          </div>
        )}

        {/* Temps de cuisson */}
        {recipe.cookTime > 0 && (
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2.5 rounded-lg">
            <Clock className="w-5 h-5 text-[#F77313]" />
            <div>
              <div className="text-[10px] text-white/70 uppercase tracking-wider font-medium">
                Cuisson
              </div>
              <div className="font-bold text-white text-lg leading-tight">{recipe.cookTime} min</div>
            </div>
          </div>
        )}

        {/* Portions */}
        {recipe.servings > 0 && (
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2.5 rounded-lg">
            <Users className="w-5 h-5 text-[#F77313]" />
            <div>
              <div className="text-[10px] text-white/70 uppercase tracking-wider font-medium">
                Portions
              </div>
              <div className="font-bold text-white text-lg leading-tight">
                {recipe.servings} {recipe.servingsUnit || 'portions'}
              </div>
            </div>
          </div>
        )}

        {/* Difficulté */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2.5 rounded-lg">
          <ChefHat className="w-5 h-5 text-[#F77313]" />
          <div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-medium">
              Difficulté
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-lg leading-tight capitalize">{recipe.difficulty}</span>
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
