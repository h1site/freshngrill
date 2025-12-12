'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RecipeCard as RecipeCardType } from '@/types/recipe';
import RecipeCard from './RecipeCard';
import { ArrowRight } from 'lucide-react';
import type { Locale } from '@/i18n/config';

const STORAGE_KEY = 'recipeGrid';

interface Props {
  recipes: RecipeCardType[];
  initialCount?: number;
  locale?: Locale;
}

export default function RecipeGrid({ recipes, initialCount = 12, locale = 'fr' }: Props) {
  const [visibleCount, setVisibleCount] = useState(() => {
    if (typeof window === 'undefined') return initialCount;
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { count } = JSON.parse(saved);
      return Math.min(count, recipes.length);
    }
    return initialCount;
  });
  const batchStartRef = useRef(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const hasRestored = useRef(false);

  // Restore scroll position on mount
  useEffect(() => {
    if (hasRestored.current) return;
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { scrollY } = JSON.parse(saved);
      // Wait for recipes to render, then restore scroll
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
        hasRestored.current = true;
      });
    }
  }, []);

  // Save state before navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        count: visibleCount,
        scrollY: window.scrollY,
      }));
    };

    // Save on click (for SPA navigation)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && (link.href.includes('/recette/') || link.href.includes('/recipe/'))) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
          count: visibleCount,
          scrollY: window.scrollY,
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClick);
    };
  }, [visibleCount]);

  const visibleRecipes = recipes.slice(0, visibleCount);
  const hasMore = visibleCount < recipes.length;

  const loadMore = () => {
    batchStartRef.current = visibleCount;
    setVisibleCount((prev) => Math.min(prev + 12, recipes.length));
  };

  const t = locale === 'en' ? {
    noResults: 'No recipes found',
    tryAgain: 'Try adjusting your search filters.',
    loadMore: 'Load more recipes',
  } : {
    noResults: 'Aucune recette trouvée',
    tryAgain: 'Essayez de modifier vos filtres de recherche.',
    loadMore: 'Voir plus de recettes',
  };

  if (recipes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🍳</span>
        </div>
        <h3 className="text-2xl font-display text-black mb-3">
          {t.noResults}
        </h3>
        <p className="text-neutral-500">
          {t.tryAgain}
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {visibleRecipes.map((recipe, index) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            index={index >= batchStartRef.current ? index - batchStartRef.current : index}
            locale={locale}
          />
        ))}
      </div>

      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-16"
        >
          <button
            onClick={loadMore}
            className="inline-flex items-center gap-3 bg-black hover:bg-neutral-800 text-white font-medium text-sm uppercase tracking-wide px-8 py-4 transition-colors"
          >
            {t.loadMore}
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
