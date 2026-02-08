'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ChefHat, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import type { Locale } from '@/i18n/config';

interface LatestRecipesCarouselProps {
  recipes: Recipe[];
  locale?: Locale;
}

const translations = {
  fr: {
    title: 'Nouvelles Recettes',
    subtitle: 'Les dernières ajoutées sur Menucochon',
    viewAll: 'Voir toutes les recettes',
    min: 'min',
  },
  en: {
    title: 'Latest Recipes',
    subtitle: 'Recently added on Menucochon',
    viewAll: 'Browse all recipes',
    min: 'min',
  },
};

export function LatestRecipesCarousel({ recipes, locale = 'fr' }: LatestRecipesCarouselProps) {
  const t = translations[locale];
  const recipeBasePath = locale === 'en' ? '/en/recipe' : '/recette';
  const allRecipesPath = locale === 'en' ? '/en/recipe' : '/recette';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (recipes.length === 0) return null;

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('a')?.offsetWidth || 280;
    const scrollAmount = cardWidth * 3 + 24;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  return (
    <section className="py-16 md:py-20 bg-neutral-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#F77313]/15 text-[#F77313] px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold uppercase tracking-wider">{t.title}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display text-white">
              {t.subtitle}
            </h2>
          </div>

          {/* Navigation + View All */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={allRecipesPath}
              className="text-[#F77313] text-sm font-medium hover:text-[#ff8c3a] flex items-center gap-1 mr-4 transition-colors"
            >
              {t.viewAll}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-neutral-700 text-neutral-400 flex items-center justify-center hover:bg-neutral-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-neutral-700 text-neutral-400 flex items-center justify-center hover:bg-neutral-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`${recipeBasePath}/${recipe.slug}`}
              className="group flex-shrink-0 w-[72vw] sm:w-[42vw] md:w-[28vw] lg:w-[calc((100%-80px)/5)] snap-start"
            >
              <article className="bg-neutral-800/80 rounded-2xl overflow-hidden border border-neutral-700/50 hover:border-[#F77313]/50 transition-all duration-300 h-full">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {recipe.featuredImage ? (
                    <Image
                      src={recipe.featuredImage}
                      alt={recipe.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 72vw, (max-width: 768px) 42vw, (max-width: 1024px) 28vw, 20vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                      <ChefHat className="w-12 h-12 text-neutral-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
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
                  <h3 className="font-display text-base lg:text-lg text-white leading-tight line-clamp-2 group-hover:text-[#F77313] transition-colors mb-2">
                    {recipe.title}
                  </h3>
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

        {/* Mobile: View All link */}
        <div className="mt-6 text-center md:hidden">
          <Link
            href={allRecipesPath}
            className="inline-flex items-center gap-2 bg-[#F77313] text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-[#d45f0a] transition-colors"
          >
            {t.viewAll}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
