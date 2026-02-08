'use client';

import { useRef } from 'react';
import { Recipe, RecipeCard as RecipeCardType } from '@/types/recipe';
import RecipeCard from './RecipeCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface Props {
  recipes: Recipe[] | RecipeCardType[];
  locale?: Locale;
}

export default function RecipeSimilar({ recipes, locale = 'fr' }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 280;
    const gap = 24;
    const scrollAmount = (cardWidth + gap) * 2;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative group">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {recipeCards.map((recipe) => (
          <div key={recipe.id} className="flex-none w-[260px] sm:w-[280px] snap-start">
            <RecipeCard recipe={recipe} locale={locale} />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {recipeCards.length > 4 && (
        <>
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-neutral-700 hover:text-[#F77313] transition-all opacity-0 group-hover:opacity-100 z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-neutral-700 hover:text-[#F77313] transition-all opacity-0 group-hover:opacity-100 z-10"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}
