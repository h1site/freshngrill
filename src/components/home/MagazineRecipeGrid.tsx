'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, ChefHat } from 'lucide-react';
import { RecipeCard as RecipeCardType } from '@/types/recipe';
import type { Locale } from '@/i18n/config';

interface MagazineRecipeGridProps {
  recipes: RecipeCardType[];
  title?: string;
  subtitle?: string;
  locale?: Locale;
}

const translations = {
  fr: {
    title: 'Dernières Recettes',
    subtitle: 'Fraîchement ajoutées',
    allRecipes: 'Toutes les recettes',
  },
  en: {
    title: 'Latest Recipes',
    subtitle: 'Freshly Added',
    allRecipes: 'All Recipes',
  },
};

export function MagazineRecipeGrid({
  recipes,
  title,
  subtitle,
  locale = 'fr'
}: MagazineRecipeGridProps) {
  const t = translations[locale];
  const recipeBasePath = locale === 'en' ? '/en/recipe' : '/recette';
  const displayTitle = title || t.title;
  const displaySubtitle = subtitle || t.subtitle;
  if (recipes.length === 0) return null;

  // Split recipes: first one large, rest in grid
  const [featuredRecipe, ...gridRecipes] = recipes;

  return (
    <section className="py-20 md:py-32 bg-[#faf8f5]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <span className="text-[#F77313] text-sm font-semibold uppercase tracking-[0.2em]">
              {displaySubtitle}
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display text-black mt-3">
              {displayTitle}
            </h2>
            <div className="w-24 h-1 bg-[#F77313] mt-6" />
          </div>
          <Link
            href={recipeBasePath}
            className="group flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-[#F77313] transition-colors mt-6 md:mt-0 uppercase tracking-wide"
          >
            {t.allRecipes}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Bento Grid Layout - Large card left, 2x2 grid right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

          {/* Large Featured Card - Left */}
          <motion.div
            className="lg:row-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Link href={`${recipeBasePath}/${featuredRecipe.slug}`} className="group block h-full">
              <article className="relative h-full min-h-[500px] overflow-hidden bg-white">
                {/* Image */}
                <div className="absolute inset-0">
                  {featuredRecipe.featuredImage ? (
                    <Image
                      src={featuredRecipe.featuredImage}
                      alt={featuredRecipe.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                      <ChefHat className="w-20 h-20 text-neutral-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                  {featuredRecipe.categories[0] && (
                    <span className="inline-block w-fit bg-[#F77313] text-white text-xs font-semibold uppercase tracking-widest px-4 py-2 mb-4">
                      {featuredRecipe.categories[0].name}
                    </span>
                  )}

                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-display text-white leading-tight mb-4 group-hover:text-[#F77313] transition-colors duration-300">
                    {featuredRecipe.title}
                  </h3>

                  <div className="flex items-center gap-4 text-white/70 text-sm">
                    {featuredRecipe.totalTime > 0 && (
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {featuredRecipe.totalTime} min
                      </span>
                    )}
                    <span className="w-1 h-1 rounded-full bg-[#F77313]" />
                    <span className="capitalize">{featuredRecipe.difficulty}</span>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 w-14 h-14 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <ArrowRight className="w-6 h-6 text-[#F77313]" />
                  </div>
                </div>
              </article>
            </Link>
          </motion.div>

          {/* Right side - 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {gridRecipes.slice(0, 4).map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`${recipeBasePath}/${recipe.slug}`} className="group block h-full">
                  <article className="flex flex-col h-full bg-white overflow-hidden border border-neutral-100 hover:border-[#F77313]/30 hover:shadow-xl transition-all duration-300">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {recipe.featuredImage ? (
                        <Image
                          src={recipe.featuredImage}
                          alt={recipe.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
                          <ChefHat className="w-10 h-10 text-neutral-300" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 md:p-6 flex flex-col">
                      {recipe.categories[0] && (
                        <span className="text-[#F77313] text-[10px] font-semibold uppercase tracking-widest mb-2">
                          {recipe.categories[0].name}
                        </span>
                      )}

                      <h3 className="font-display text-xl md:text-2xl text-black leading-tight mb-3 group-hover:text-[#F77313] transition-colors line-clamp-2">
                        {recipe.title}
                      </h3>

                      <div className="flex items-center gap-3 text-neutral-500 text-xs uppercase tracking-wide mt-auto">
                        {recipe.totalTime > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {recipe.totalTime} min
                          </span>
                        )}
                        <span className="w-1 h-1 rounded-full bg-neutral-300" />
                        <span className="capitalize">{recipe.difficulty}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Row - Standard Cards */}
        {gridRecipes.length > 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-8">
            {gridRecipes.slice(4, 8).map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link href={`${recipeBasePath}/${recipe.slug}`} className="group block h-full">
                  <article className="flex flex-col h-full bg-white overflow-hidden border border-neutral-100 hover:border-[#F77313]/30 hover:shadow-lg transition-all duration-300">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {recipe.featuredImage ? (
                        <Image
                          src={recipe.featuredImage}
                          alt={recipe.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
                          <ChefHat className="w-12 h-12 text-neutral-300" />
                        </div>
                      )}

                      {/* Category Badge */}
                      {recipe.categories[0] && (
                        <span className="absolute top-4 left-4 bg-[#F77313] text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5">
                          {recipe.categories[0].name}
                        </span>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>

                    {/* Content - Fixed height for alignment */}
                    <div className="flex-1 p-5 flex flex-col">
                      <h3 className="font-display text-xl text-black leading-tight mb-2 group-hover:text-[#F77313] transition-colors line-clamp-2 min-h-[3.5rem]">
                        {recipe.title}
                      </h3>

                      <div className="flex items-center gap-2 text-neutral-500 text-xs uppercase tracking-wide mt-auto">
                        {recipe.totalTime > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {recipe.totalTime} min
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
