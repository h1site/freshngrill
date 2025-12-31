import Link from 'next/link';
import Image from 'next/image';
import { Clock, ChefHat, Star } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import type { Locale } from '@/i18n/config';

interface FeaturedRecipesSectionProps {
  recipes: Recipe[];
  locale?: Locale;
}

const translations = {
  fr: {
    title: 'Recettes Vedettes',
    subtitle: 'Les incontournables de Menucochon',
    viewRecipe: 'Voir la recette',
    min: 'min',
  },
  en: {
    title: 'Featured Recipes',
    subtitle: 'Menucochon must-haves',
    viewRecipe: 'View recipe',
    min: 'min',
  },
};

export function FeaturedRecipesSection({ recipes, locale = 'fr' }: FeaturedRecipesSectionProps) {
  const t = translations[locale];
  const recipeBasePath = locale === 'en' ? '/en/recipe' : '/recette';

  if (recipes.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-neutral-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F77313]/10 text-[#F77313] px-4 py-2 rounded-full mb-4">
            <Star className="w-4 h-4" fill="currentColor" />
            <span className="text-sm font-semibold uppercase tracking-wider">Menucochon</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-white mb-3">
            {t.title}
          </h2>
          <p className="text-neutral-400 text-lg">{t.subtitle}</p>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`${recipeBasePath}/${recipe.slug}`}
              className="group block"
            >
              <article className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-[#F77313]/50 transition-all duration-300 h-full">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {recipe.featuredImage ? (
                    <Image
                      src={recipe.featuredImage}
                      alt={recipe.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                      <ChefHat className="w-12 h-12 text-neutral-700" />
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Category badge */}
                  {recipe.categories[0] && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#F77313] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                        {recipe.categories[0].name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-display text-lg text-white leading-tight line-clamp-2 group-hover:text-[#F77313] transition-colors mb-2">
                    {recipe.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-neutral-500 text-xs">
                    {recipe.totalTime > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {recipe.totalTime} {t.min}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <ChefHat className="w-3.5 h-3.5" />
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
