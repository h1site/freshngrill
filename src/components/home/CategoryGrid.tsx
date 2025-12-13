'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Category } from '@/types/recipe';
import {
  Utensils,
  Cake,
  Soup,
  Coffee,
  Salad,
  Fish,
  Beef,
  Drumstick,
  Cookie,
  Pizza,
  Sandwich,
  Wine,
  IceCream,
  Egg,
  Carrot,
  ChefHat
} from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { getCategoryName } from '@/lib/categoryTranslations';

interface CategoryGridProps {
  categories: Category[];
  locale?: Locale;
}

// Mapping des catégories vers leurs icônes et couleurs
const categoryStyles: Record<string, { icon: React.ElementType; gradient: string; bgColor: string }> = {
  'desserts': { icon: Cake, gradient: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50' },
  'dessert': { icon: Cake, gradient: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50' },
  'soupes': { icon: Soup, gradient: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50' },
  'soupe': { icon: Soup, gradient: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50' },
  'soup': { icon: Soup, gradient: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50' },
  'soups': { icon: Soup, gradient: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50' },
  'dejeuner': { icon: Coffee, gradient: 'from-yellow-500 to-amber-500', bgColor: 'bg-yellow-50' },
  'breakfast': { icon: Coffee, gradient: 'from-yellow-500 to-amber-500', bgColor: 'bg-yellow-50' },
  'petit-dejeuner': { icon: Egg, gradient: 'from-yellow-500 to-amber-500', bgColor: 'bg-yellow-50' },
  'salades': { icon: Salad, gradient: 'from-emerald-500 to-green-500', bgColor: 'bg-emerald-50' },
  'salade': { icon: Salad, gradient: 'from-emerald-500 to-green-500', bgColor: 'bg-emerald-50' },
  'salad': { icon: Salad, gradient: 'from-emerald-500 to-green-500', bgColor: 'bg-emerald-50' },
  'salads': { icon: Salad, gradient: 'from-emerald-500 to-green-500', bgColor: 'bg-emerald-50' },
  'poissons': { icon: Fish, gradient: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
  'poisson': { icon: Fish, gradient: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
  'fish': { icon: Fish, gradient: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
  'seafood': { icon: Fish, gradient: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
  'fruits-de-mer': { icon: Fish, gradient: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
  'viandes': { icon: Beef, gradient: 'from-red-500 to-rose-500', bgColor: 'bg-red-50' },
  'viande': { icon: Beef, gradient: 'from-red-500 to-rose-500', bgColor: 'bg-red-50' },
  'meat': { icon: Beef, gradient: 'from-red-500 to-rose-500', bgColor: 'bg-red-50' },
  'boeuf': { icon: Beef, gradient: 'from-red-500 to-rose-500', bgColor: 'bg-red-50' },
  'beef': { icon: Beef, gradient: 'from-red-500 to-rose-500', bgColor: 'bg-red-50' },
  'poulet': { icon: Drumstick, gradient: 'from-orange-500 to-amber-500', bgColor: 'bg-orange-50' },
  'volaille': { icon: Drumstick, gradient: 'from-orange-500 to-amber-500', bgColor: 'bg-orange-50' },
  'chicken': { icon: Drumstick, gradient: 'from-orange-500 to-amber-500', bgColor: 'bg-orange-50' },
  'poultry': { icon: Drumstick, gradient: 'from-orange-500 to-amber-500', bgColor: 'bg-orange-50' },
  'biscuits': { icon: Cookie, gradient: 'from-amber-600 to-yellow-500', bgColor: 'bg-amber-50' },
  'cookies': { icon: Cookie, gradient: 'from-amber-600 to-yellow-500', bgColor: 'bg-amber-50' },
  'pizza': { icon: Pizza, gradient: 'from-red-500 to-orange-500', bgColor: 'bg-red-50' },
  'pizzas': { icon: Pizza, gradient: 'from-red-500 to-orange-500', bgColor: 'bg-red-50' },
  'sandwichs': { icon: Sandwich, gradient: 'from-yellow-600 to-amber-500', bgColor: 'bg-yellow-50' },
  'sandwich': { icon: Sandwich, gradient: 'from-yellow-600 to-amber-500', bgColor: 'bg-yellow-50' },
  'sandwiches': { icon: Sandwich, gradient: 'from-yellow-600 to-amber-500', bgColor: 'bg-yellow-50' },
  'boissons': { icon: Wine, gradient: 'from-purple-500 to-violet-500', bgColor: 'bg-purple-50' },
  'drinks': { icon: Wine, gradient: 'from-purple-500 to-violet-500', bgColor: 'bg-purple-50' },
  'cocktails': { icon: Wine, gradient: 'from-purple-500 to-violet-500', bgColor: 'bg-purple-50' },
  'glaces': { icon: IceCream, gradient: 'from-cyan-500 to-blue-500', bgColor: 'bg-cyan-50' },
  'ice-cream': { icon: IceCream, gradient: 'from-cyan-500 to-blue-500', bgColor: 'bg-cyan-50' },
  'legumes': { icon: Carrot, gradient: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50' },
  'vegetables': { icon: Carrot, gradient: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50' },
  'vegetarien': { icon: Carrot, gradient: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50' },
  'vegetarian': { icon: Carrot, gradient: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50' },
  'plats-principaux': { icon: Utensils, gradient: 'from-[#F77313] to-[#d45f0a]', bgColor: 'bg-orange-50' },
  'main-dishes': { icon: Utensils, gradient: 'from-[#F77313] to-[#d45f0a]', bgColor: 'bg-orange-50' },
  'entrees': { icon: Utensils, gradient: 'from-violet-500 to-purple-500', bgColor: 'bg-violet-50' },
  'appetizers': { icon: Utensils, gradient: 'from-violet-500 to-purple-500', bgColor: 'bg-violet-50' },
};

const defaultStyle = { icon: ChefHat, gradient: 'from-[#F77313] to-[#d45f0a]', bgColor: 'bg-orange-50' };

function getCategoryStyle(slug: string) {
  const normalizedSlug = slug.toLowerCase().replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a');
  return categoryStyles[normalizedSlug] || defaultStyle;
}

export function CategoryGrid({ categories, locale = 'fr' }: CategoryGridProps) {
  const recipeBasePath = locale === 'en' ? '/en/recipe' : '/recette';
  const categoryParam = locale === 'en' ? 'category' : 'categorie';
  const exploreText = locale === 'en' ? 'Explore' : 'Explorer';
  const byCategory = locale === 'en' ? 'By Category' : 'Par Catégorie';

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
            {exploreText}
          </span>
          <h2 className="text-4xl md:text-5xl font-display text-black mt-2">
            {byCategory}
          </h2>
          <div className="w-16 h-1 bg-[#F77313] mx-auto mt-6" />
        </div>

        {/* Category Grid - Nouveau design */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const style = getCategoryStyle(category.slug);
            const Icon = style.icon;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={`${recipeBasePath}?${categoryParam}=${category.slug}`}
                  className="group block relative overflow-hidden rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  {/* Content */}
                  <div className="relative p-6 md:p-8">
                    {/* Icon Container */}
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${style.bgColor} group-hover:bg-white/20 flex items-center justify-center mb-4 transition-colors duration-300`}>
                      <Icon className={`w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br ${style.gradient} bg-clip-text text-transparent group-hover:text-white transition-colors duration-300`}
                        style={{
                          color: 'transparent',
                          background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text'
                        }}
                      />
                      <Icon className={`w-7 h-7 md:w-8 md:h-8 absolute opacity-0 group-hover:opacity-100 text-white transition-opacity duration-300`} />
                    </div>

                    {/* Category Name */}
                    <h3 className="font-display text-lg md:text-xl text-black group-hover:text-white transition-colors duration-300">
                      {getCategoryName(category.name, locale)}
                    </h3>

                    {/* Arrow indicator */}
                    <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <svg className="w-4 h-4 text-neutral-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
