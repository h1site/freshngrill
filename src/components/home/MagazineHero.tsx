import Link from 'next/link';
import Image from 'next/image';
import { Clock, ChefHat, ArrowRight, Flame } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import type { Locale } from '@/i18n/config';

interface MagazineHeroProps {
  featuredRecipe: Recipe;
  sideRecipes: Recipe[];
  locale?: Locale;
  showDiscoverCTA?: boolean;
}

const translations = {
  fr: {
    featuredRecipe: 'Recette Vedette',
    viewRecipe: 'Voir la recette',
    alsoDiscover: 'À découvrir',
    discoverAll: 'Découvrir nos recettes',
    scroll: 'Défiler',
    minutes: 'minutes',
    min: 'min',
    portions: 'portions',
  },
  en: {
    featuredRecipe: 'Featured Recipe',
    viewRecipe: 'View Recipe',
    alsoDiscover: 'Discover',
    discoverAll: 'Browse all recipes',
    scroll: 'Scroll',
    minutes: 'minutes',
    min: 'min',
    portions: 'servings',
  },
};

export function MagazineHero({ featuredRecipe, sideRecipes, locale = 'fr', showDiscoverCTA = false }: MagazineHeroProps) {
  const t = translations[locale];
  const recipeBasePath = locale === 'en' ? '/en/recipe' : '/recette';
  const allRecipesPath = locale === 'en' ? '/en/recipe' : '/recette';

  return (
    <section className="relative min-h-screen bg-neutral-950 overflow-hidden">
      {/* Background Image - Full Screen */}
      <div className="absolute inset-0">
        {featuredRecipe.featuredImage ? (
          <Image
            src={featuredRecipe.featuredImage}
            alt={featuredRecipe.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={90}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
        )}
        {/* Overlays - stronger for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50" />
      </div>

      {/* Content Container - Fixed position from top for consistent layout across languages */}
      <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-start pt-32 pb-32 md:pt-40 md:pb-40 lg:pt-28 lg:pb-24 xl:pt-40 xl:pb-40">
        <div className="w-full">
          {/* Main Content Row */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-16">

            {/* Featured Recipe - Left/Main */}
            <div className="flex-1 max-w-4xl">
              <Link href={`${recipeBasePath}/${featuredRecipe.slug}`} className="group block">
                {/* Badge */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-2 bg-[#F77313] text-white text-xs font-semibold uppercase tracking-widest px-4 py-2">
                    <Flame className="w-3.5 h-3.5" />
                    {t.featuredRecipe}
                  </span>
                  {featuredRecipe.categories[0] && (
                    <span className="text-white/70 text-sm uppercase tracking-wide">
                      {featuredRecipe.categories[0].name}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display text-white leading-[0.95] mb-6 tracking-tight max-w-3xl">
                  <span className="relative inline drop-shadow-lg">
                    {featuredRecipe.title}
                    <span className="absolute -bottom-2 left-0 h-1.5 bg-[#F77313] w-[30%]" />
                  </span>
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/80 mb-8">
                  {featuredRecipe.totalTime > 0 && (
                    <span className="flex items-center gap-2 text-sm uppercase tracking-wide bg-black/30 px-3 py-1.5 rounded-full">
                      <Clock className="w-4 h-4" />
                      {featuredRecipe.totalTime} {t.minutes}
                    </span>
                  )}
                  <span className="flex items-center gap-2 text-sm uppercase tracking-wide bg-black/30 px-3 py-1.5 rounded-full">
                    <ChefHat className="w-4 h-4" />
                    {featuredRecipe.difficulty}
                  </span>
                  {featuredRecipe.servings && (
                    <span className="text-sm uppercase tracking-wide bg-black/30 px-3 py-1.5 rounded-full">
                      {featuredRecipe.servings} {featuredRecipe.servingsUnit || t.portions}
                    </span>
                  )}
                </div>

                {/* CTA Button */}
                <div>
                  <span className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 font-medium uppercase tracking-wide text-sm group-hover:bg-[#F77313] group-hover:text-white transition-all duration-300 shadow-lg">
                    {t.viewRecipe}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </div>

            {/* Side Recipes - Right Side (Desktop) / Below (Mobile) */}
            <div className="w-full lg:max-w-md">
              {/* Section Title */}
              <div className="flex items-center gap-4 mb-4 lg:mb-6">
                <div className="w-10 h-0.5 bg-[#F77313]" />
                <h2 className="text-white text-sm lg:text-base font-semibold uppercase tracking-widest">
                  {t.alsoDiscover}
                </h2>
              </div>

              {/* Recipe Cards - Grid on mobile, stack on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-4">
                {sideRecipes.slice(0, 3).map((recipe) => (
                  <div key={recipe.id}>
                    <Link
                      href={`${recipeBasePath}/${recipe.slug}`}
                      className="group flex items-center gap-4 lg:gap-5 p-3 lg:p-4 bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 hover:border-[#F77313]/50 transition-all duration-300 rounded-xl"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0 overflow-hidden rounded-lg">
                        {recipe.featuredImage ? (
                          <Image
                            src={recipe.featuredImage}
                            alt={recipe.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 1024px) 64px, 80px"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                            <ChefHat className="w-5 h-5 lg:w-6 lg:h-6 text-neutral-600" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        {recipe.categories[0] && (
                          <span className="text-[#F77313] text-[10px] lg:text-xs font-bold uppercase tracking-wider">
                            {recipe.categories[0].name}
                          </span>
                        )}
                        <h3 className="text-white font-display text-base lg:text-lg leading-tight line-clamp-2 group-hover:text-[#F77313] transition-colors mt-0.5">
                          {recipe.title}
                        </h3>
                        <span className="text-white/60 text-xs lg:text-sm flex items-center gap-1.5 mt-1">
                          <Clock className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                          {recipe.totalTime} {t.min}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* CTA Button - Discover All Recipes */}
              {showDiscoverCTA && (
                <div className="mt-4 lg:mt-6">
                  <Link
                    href={allRecipesPath}
                    className="group flex items-center justify-center gap-2 w-full py-3 bg-[#F77313] hover:bg-[#d45f0a] text-white font-medium uppercase tracking-wide text-xs lg:text-sm transition-all duration-300 rounded-xl"
                  >
                    {t.discoverAll}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2">
        <span className="text-white/50 text-xs uppercase tracking-widest">{t.scroll}</span>
        <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center animate-bounce">
          <div className="w-1 h-2 bg-[#F77313] rounded-full mt-1.5 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
