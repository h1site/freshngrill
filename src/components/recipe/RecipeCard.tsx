'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RecipeCard as RecipeCardType } from '@/types/recipe';
import { Clock, ArrowUpRight } from 'lucide-react';

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

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      className="group"
    >
      <Link href={`${recipeBasePath}/${recipeSlug}`} className="block">
        {/* Image Container */}
        <div className={`relative overflow-hidden bg-neutral-100 rounded-[5px] ${isLarge ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}>
          {recipe.featuredImage ? (
            <Image
              src={recipe.featuredImage}
              alt={recipe.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

          {/* Category Badge */}
          {recipe.categories[0] && (
            <span className="absolute top-4 left-4 bg-[#F77313] text-white text-xs font-medium uppercase tracking-wider px-3 py-1.5">
              {recipe.categories[0].name}
            </span>
          )}

          {/* Arrow indicator on hover */}
          <div className="absolute bottom-4 right-4 w-10 h-10 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <ArrowUpRight className="w-5 h-5 text-black" />
          </div>
        </div>

        {/* Content */}
        <div className="pt-4">
          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-neutral-500 uppercase tracking-wide mb-2">
            {recipe.totalTime > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {recipe.totalTime} min
              </span>
            )}
            <span className="w-1 h-1 rounded-full bg-neutral-300" />
            <span>{difficultyLabel}</span>
          </div>

          {/* Title */}
          <h3 className={`font-display text-black group-hover:text-[#F77313] transition-colors leading-tight ${isLarge ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
            {recipe.title}
          </h3>
        </div>
      </Link>
    </motion.article>
  );
}
