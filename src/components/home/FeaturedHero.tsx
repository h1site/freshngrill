'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import type { Locale } from '@/i18n/config';

interface FeaturedHeroProps {
  featuredRecipe?: Recipe;
  secondaryRecipes?: Recipe[];
  locale?: Locale;
}

export function FeaturedHero({ featuredRecipe, secondaryRecipes = [], locale = 'fr' }: FeaturedHeroProps) {
  const recipeBasePath = locale === 'en' ? '/en/recipe' : '/recette';
  const defaultText = locale === 'en' ? 'Discover our delicious recipes' : 'Découvrez nos recettes gourmandes';

  if (!featuredRecipe) {
    return (
      <section className="relative h-[70vh] bg-neutral-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-7xl font-display mb-4">MENU COCHON</h1>
          <p className="text-neutral-400">{defaultText}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Featured Recipe - Large */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Link href={`${recipeBasePath}/${featuredRecipe.slug}`} className="group block">
              <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-neutral-100">
                {featuredRecipe.featuredImage ? (
                  <Image
                    src={featuredRecipe.featuredImage}
                    alt={featuredRecipe.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  {/* Category Badge */}
                  {featuredRecipe.categories[0] && (
                    <span className="inline-block bg-[#F77313] text-white text-xs font-medium uppercase tracking-wider px-3 py-1.5 mb-4">
                      {featuredRecipe.categories[0].name}
                    </span>
                  )}

                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-display text-white mb-4 leading-tight">
                    {featuredRecipe.title}
                  </h1>

                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {featuredRecipe.totalTime} min
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/50" />
                    <span className="capitalize">{featuredRecipe.difficulty}</span>
                  </div>

                  {/* Arrow indicator */}
                  <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 w-12 h-12 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5 text-black" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Secondary Recipes - Stacked */}
          <div className="flex flex-col gap-6 md:gap-8">
            {secondaryRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                className="flex-1"
              >
                <Link href={`${recipeBasePath}/${recipe.slug}`} className="group block h-full">
                  <div className="relative h-full min-h-[200px] md:min-h-0 aspect-auto md:aspect-[16/9] overflow-hidden bg-neutral-100">
                    {recipe.featuredImage ? (
                      <Image
                        src={recipe.featuredImage}
                        alt={recipe.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                      {recipe.categories[0] && (
                        <span className="inline-block bg-[#F77313] text-white text-xs font-medium uppercase tracking-wider px-2.5 py-1 mb-3">
                          {recipe.categories[0].name}
                        </span>
                      )}

                      <h2 className="text-xl md:text-2xl font-display text-white mb-2 leading-tight group-hover:text-[#F77313] transition-colors">
                        {recipe.title}
                      </h2>

                      <div className="flex items-center gap-3 text-white/70 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {recipe.totalTime} min
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
