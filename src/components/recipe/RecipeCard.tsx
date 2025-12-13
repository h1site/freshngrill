'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RecipeCard as RecipeCardType } from '@/types/recipe';
import { Clock, ArrowUpRight, ChefHat } from 'lucide-react';

import type { Locale } from '@/i18n/config';

interface Props {
  recipe: RecipeCardType;
  index?: number;
  variant?: 'default' | 'large';
  locale?: Locale;
}

export default function RecipeCard({ recipe, index = 0, variant = 'default', locale = 'fr' }: Props) {
  const isLarge = variant === 'large';
  const recipeBasePath = locale === 'en' ? '/en/recipe' : '/recette';
  // Utiliser le slug anglais si disponible et locale EN, sinon slug français
  const recipeSlug = locale === 'en' && recipe.slugEn ? recipe.slugEn : recipe.slug;

  // Translate difficulty labels
  const difficultyLabels: Record<string, Record<string, string>> = {
    fr: { facile: 'Facile', moyen: 'Moyen', difficile: 'Difficile' },
    en: { facile: 'Easy', moyen: 'Medium', difficile: 'Hard' },
  };
  const difficultyLabel = difficultyLabels[locale]?.[recipe.difficulty] || recipe.difficulty;

  // Difficulty color
  const difficultyColors: Record<string, string> = {
    facile: 'text-emerald-500',
    moyen: 'text-amber-500',
    difficile: 'text-red-500',
  };
  const difficultyColor = difficultyColors[recipe.difficulty] || 'text-neutral-500';

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.4, 0, 0.2, 1]
      }}
      className="group"
    >
      <Link href={`${recipeBasePath}/${recipeSlug}`} className="block">
        {/* Image Container with enhanced hover */}
        <motion.div
          className={`relative overflow-hidden bg-neutral-100 rounded-lg ${isLarge ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {recipe.featuredImage ? (
            <Image
              src={recipe.featuredImage}
              alt={recipe.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
              <ChefHat className="w-12 h-12 text-neutral-400" />
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Category Badge with animation */}
          {recipe.categories[0] && (
            <motion.span
              className="absolute top-4 left-4 bg-[#F77313] text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-sm shadow-lg shadow-orange-500/25"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(index * 0.08, 0.4) + 0.2 }}
            >
              {recipe.categories[0].name}
            </motion.span>
          )}

          {/* Quick info on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center gap-3">
                {recipe.totalTime > 0 && (
                  <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    {recipe.totalTime} min
                  </span>
                )}
              </div>
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-4 h-4 text-[#F77313]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="pt-4 space-y-2">
          {/* Meta info */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide">
            <span className={`font-medium ${difficultyColor}`}>{difficultyLabel}</span>
            {recipe.totalTime > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-neutral-300" />
                <span className="text-neutral-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {recipe.totalTime} min
                </span>
              </>
            )}
          </div>

          {/* Title with underline animation */}
          <h3 className={`font-display text-black leading-tight relative ${isLarge ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
            <span className="relative">
              {recipe.title}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F77313] group-hover:w-full transition-all duration-300 ease-out" />
            </span>
          </h3>
        </div>
      </Link>
    </motion.article>
  );
}
