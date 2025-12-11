'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RecipeCard as RecipeCardType } from '@/types/recipe';
import RecipeCard from './RecipeCard';
import { ArrowRight } from 'lucide-react';

interface Props {
  recipes: RecipeCardType[];
  initialCount?: number;
}

export default function RecipeGrid({ recipes, initialCount = 12 }: Props) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const visibleRecipes = recipes.slice(0, visibleCount);
  const hasMore = visibleCount < recipes.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 12, recipes.length));
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
          Aucune recette trouvée
        </h3>
        <p className="text-neutral-500">
          Essayez de modifier vos filtres de recherche.
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {visibleRecipes.map((recipe, index) => (
          <RecipeCard key={recipe.id} recipe={recipe} index={index} />
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
            Voir plus de recettes
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
