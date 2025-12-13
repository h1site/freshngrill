'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Category } from '@/types/recipe';
import {
  Utensils, Cake, Soup, Salad, Fish, Beef, Drumstick,
  Cookie, Pizza, Sandwich, Wine, IceCream, Egg, Carrot, ChefHat
} from 'lucide-react';
import { getCategoryName } from '@/lib/categoryTranslations';
import type { Locale } from '@/i18n/config';

interface MagazineCategorySectionProps {
  categories: Category[];
  locale?: Locale;
}

const translations = {
  fr: {
    explore: 'Explorer',
    byCategory: 'Par Catégorie',
  },
  en: {
    explore: 'Explore',
    byCategory: 'By Category',
  },
};

// Keywords to match for each style - ORDER MATTERS: more specific matches first
const categoryKeywords: Array<{ keywords: string[]; icon: React.ElementType; color: string; bgGradient: string }> = [
  // Meat types first (most specific)
  { keywords: ['boeuf', 'beef', 'steak'], icon: Beef, color: '#ef4444', bgGradient: 'from-red-500/20 to-rose-500/20' },
  { keywords: ['porc', 'pork', 'jambon', 'bacon', 'cochon'], icon: Beef, color: '#f472b6', bgGradient: 'from-pink-400/20 to-rose-400/20' },
  { keywords: ['poulet', 'volaille', 'chicken', 'poultry', 'dinde', 'canard'], icon: Drumstick, color: '#f97316', bgGradient: 'from-orange-500/20 to-amber-500/20' },
  { keywords: ['poisson', 'fish', 'saumon', 'thon', 'truite', 'morue'], icon: Fish, color: '#3b82f6', bgGradient: 'from-blue-500/20 to-cyan-500/20' },
  { keywords: ['fruit-de-mer', 'fruits-de-mer', 'seafood', 'crevette', 'homard', 'crabe'], icon: Fish, color: '#0ea5e9', bgGradient: 'from-sky-500/20 to-cyan-500/20' },
  { keywords: ['vegetarien', 'vegan', 'veggie'], icon: Carrot, color: '#22c55e', bgGradient: 'from-green-500/20 to-emerald-500/20' },
  // Other specific categories
  { keywords: ['dessert', 'gateau', 'cake', 'sucre'], icon: Cake, color: '#ec4899', bgGradient: 'from-pink-500/20 to-rose-500/20' },
  { keywords: ['soupe', 'potage', 'soup'], icon: Soup, color: '#f59e0b', bgGradient: 'from-amber-500/20 to-orange-500/20' },
  { keywords: ['dejeuner', 'breakfast', 'brunch'], icon: Egg, color: '#eab308', bgGradient: 'from-yellow-500/20 to-amber-500/20' },
  { keywords: ['salade', 'salad'], icon: Salad, color: '#10b981', bgGradient: 'from-emerald-500/20 to-green-500/20' },
  { keywords: ['biscuit', 'cookie'], icon: Cookie, color: '#d97706', bgGradient: 'from-amber-600/20 to-yellow-500/20' },
  { keywords: ['pizza'], icon: Pizza, color: '#ef4444', bgGradient: 'from-red-500/20 to-orange-500/20' },
  { keywords: ['sandwich', 'burger', 'hamburger'], icon: Sandwich, color: '#ca8a04', bgGradient: 'from-yellow-600/20 to-amber-500/20' },
  { keywords: ['boisson', 'drink', 'cocktail', 'smoothie', 'jus'], icon: Wine, color: '#8b5cf6', bgGradient: 'from-purple-500/20 to-violet-500/20' },
  { keywords: ['glace', 'ice', 'sorbet', 'frozen'], icon: IceCream, color: '#06b6d4', bgGradient: 'from-cyan-500/20 to-blue-500/20' },
  { keywords: ['legume', 'vegetable'], icon: Carrot, color: '#22c55e', bgGradient: 'from-green-500/20 to-emerald-500/20' },
  { keywords: ['pate', 'pasta', 'spaghetti', 'lasagne', 'macaroni'], icon: Utensils, color: '#fbbf24', bgGradient: 'from-amber-400/20 to-yellow-400/20' },
  { keywords: ['riz', 'rice', 'risotto'], icon: Utensils, color: '#a3a3a3', bgGradient: 'from-neutral-400/20 to-neutral-300/20' },
  { keywords: ['pain', 'bread', 'boulangerie'], icon: Sandwich, color: '#b45309', bgGradient: 'from-amber-700/20 to-yellow-600/20' },
  { keywords: ['patisserie', 'pastry', 'tarte', 'pie'], icon: Cake, color: '#fb7185', bgGradient: 'from-rose-400/20 to-pink-400/20' },
  { keywords: ['entree', 'appetizer', 'starter', 'amuse'], icon: Utensils, color: '#8b5cf6', bgGradient: 'from-violet-500/20 to-purple-500/20' },
  { keywords: ['accompagnement', 'side', 'garniture'], icon: Salad, color: '#84cc16', bgGradient: 'from-lime-500/20 to-green-500/20' },
  { keywords: ['conserve', 'congelation', 'preserve', 'canning'], icon: ChefHat, color: '#0891b2', bgGradient: 'from-cyan-600/20 to-teal-500/20' },
  { keywords: ['fete', 'holiday', 'noel', 'christmas'], icon: Cake, color: '#dc2626', bgGradient: 'from-red-600/20 to-rose-600/20' },
  { keywords: ['snack', 'collation', 'gouter'], icon: Cookie, color: '#fbbf24', bgGradient: 'from-amber-400/20 to-yellow-400/20' },
  { keywords: ['sauce', 'marinade', 'vinaigrette'], icon: Soup, color: '#7c3aed', bgGradient: 'from-violet-600/20 to-purple-500/20' },
  { keywords: ['poutine'], icon: Utensils, color: '#92400e', bgGradient: 'from-amber-800/20 to-yellow-700/20' },
  // Generic "main dish" last (fallback for plats-principaux without specific meat type)
  { keywords: ['plat-principal', 'plats-principaux', 'main', 'principal'], icon: Utensils, color: '#F77313', bgGradient: 'from-[#F77313]/20 to-[#d45f0a]/20' },
];

const defaultStyle = { icon: ChefHat, color: '#F77313', bgGradient: 'from-[#F77313]/20 to-[#d45f0a]/20' };

function getCategoryStyle(slug: string) {
  // Normalize: lowercase, remove accents
  const normalizedSlug = slug
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '');

  // Find matching style by checking if any keyword is contained in the slug
  // Only check if slug contains keyword (not reverse) to avoid false matches
  for (const style of categoryKeywords) {
    for (const keyword of style.keywords) {
      if (normalizedSlug.includes(keyword)) {
        return { icon: style.icon, color: style.color, bgGradient: style.bgGradient };
      }
    }
  }

  return defaultStyle;
}

export function MagazineCategorySection({ categories, locale = 'fr' }: MagazineCategorySectionProps) {
  const t = translations[locale];
  const recipeBasePath = locale === 'en' ? '/en/recipe' : '/recette';
  const categoryParam = locale === 'en' ? 'category' : 'categorie';

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#F77313] text-sm font-semibold uppercase tracking-[0.2em]">
            {t.explore}
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display text-black mt-3">
            {t.byCategory}
          </h2>
          <div className="w-24 h-1 bg-[#F77313] mx-auto mt-6" />
        </motion.div>

        {/* Categories Grid - Horizontal Scroll on Mobile */}
        <div className="relative">
          {/* Mobile Scroll */}
          <div className="flex lg:hidden gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            {categories.map((category, index) => {
              const style = getCategoryStyle(category.slug);
              const Icon = style.icon;

              return (
                <motion.div
                  key={category.id}
                  className="snap-start flex-shrink-0 w-40"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`${recipeBasePath}?${categoryParam}=${category.slug}`}
                    className="group block text-center p-6 bg-neutral-50 border border-neutral-100 hover:border-[#F77313]/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${style.color}15` }}
                    >
                      <Icon className="w-8 h-8" style={{ color: style.color }} />
                    </div>
                    <h3 className="font-display text-lg text-black group-hover:text-[#F77313] transition-colors">
                      {getCategoryName(category.name, locale)}
                    </h3>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-4 xl:grid-cols-5 gap-6">
            {categories.map((category, index) => {
              const style = getCategoryStyle(category.slug);
              const Icon = style.icon;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`${recipeBasePath}?${categoryParam}=${category.slug}`}
                    className="group relative block overflow-hidden bg-white border border-neutral-100 hover:border-transparent hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Hover Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${style.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />

                    <div className="relative p-8 text-center">
                      {/* Icon */}
                      <motion.div
                        className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center transition-all duration-500"
                        style={{ backgroundColor: `${style.color}10` }}
                        whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon
                          className="w-10 h-10 transition-transform duration-500 group-hover:scale-110"
                          style={{ color: style.color }}
                        />
                      </motion.div>

                      {/* Name */}
                      <h3 className="font-display text-xl text-black group-hover:text-[#F77313] transition-colors duration-300">
                        {getCategoryName(category.name, locale)}
                      </h3>

                      {/* Arrow */}
                      <div className="mt-4 flex justify-center">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                          style={{ backgroundColor: style.color }}
                        >
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
