import Link from 'next/link';
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
const categoryStyles: Record<string, { icon: React.ElementType; gradient: string; bgColor: string; iconColor: string }> = {
  'desserts': { icon: Cake, gradient: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50', iconColor: 'text-pink-500' },
  'dessert': { icon: Cake, gradient: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50', iconColor: 'text-pink-500' },
  'soupes': { icon: Soup, gradient: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50', iconColor: 'text-amber-500' },
  'soupe': { icon: Soup, gradient: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50', iconColor: 'text-amber-500' },
  'soup': { icon: Soup, gradient: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50', iconColor: 'text-amber-500' },
  'soups': { icon: Soup, gradient: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50', iconColor: 'text-amber-500' },
  'dejeuner': { icon: Coffee, gradient: 'from-yellow-500 to-amber-500', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-500' },
  'breakfast': { icon: Coffee, gradient: 'from-yellow-500 to-amber-500', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-500' },
  'petit-dejeuner': { icon: Egg, gradient: 'from-yellow-500 to-amber-500', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-500' },
  'salades': { icon: Salad, gradient: 'from-emerald-500 to-green-500', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  'salade': { icon: Salad, gradient: 'from-emerald-500 to-green-500', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  'salad': { icon: Salad, gradient: 'from-emerald-500 to-green-500', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  'salads': { icon: Salad, gradient: 'from-emerald-500 to-green-500', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  'poissons': { icon: Fish, gradient: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
  'poisson': { icon: Fish, gradient: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
  'fish': { icon: Fish, gradient: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
  'seafood': { icon: Fish, gradient: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
  'fruits-de-mer': { icon: Fish, gradient: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
  'viandes': { icon: Beef, gradient: 'from-red-500 to-rose-500', bgColor: 'bg-red-50', iconColor: 'text-red-500' },
  'viande': { icon: Beef, gradient: 'from-red-500 to-rose-500', bgColor: 'bg-red-50', iconColor: 'text-red-500' },
  'meat': { icon: Beef, gradient: 'from-red-500 to-rose-500', bgColor: 'bg-red-50', iconColor: 'text-red-500' },
  'boeuf': { icon: Beef, gradient: 'from-red-500 to-rose-500', bgColor: 'bg-red-50', iconColor: 'text-red-500' },
  'beef': { icon: Beef, gradient: 'from-red-500 to-rose-500', bgColor: 'bg-red-50', iconColor: 'text-red-500' },
  'poulet': { icon: Drumstick, gradient: 'from-orange-500 to-amber-500', bgColor: 'bg-orange-50', iconColor: 'text-orange-500' },
  'volaille': { icon: Drumstick, gradient: 'from-orange-500 to-amber-500', bgColor: 'bg-orange-50', iconColor: 'text-orange-500' },
  'chicken': { icon: Drumstick, gradient: 'from-orange-500 to-amber-500', bgColor: 'bg-orange-50', iconColor: 'text-orange-500' },
  'poultry': { icon: Drumstick, gradient: 'from-orange-500 to-amber-500', bgColor: 'bg-orange-50', iconColor: 'text-orange-500' },
  'biscuits': { icon: Cookie, gradient: 'from-amber-600 to-yellow-500', bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
  'cookies': { icon: Cookie, gradient: 'from-amber-600 to-yellow-500', bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
  'pizza': { icon: Pizza, gradient: 'from-red-500 to-orange-500', bgColor: 'bg-red-50', iconColor: 'text-red-500' },
  'pizzas': { icon: Pizza, gradient: 'from-red-500 to-orange-500', bgColor: 'bg-red-50', iconColor: 'text-red-500' },
  'sandwichs': { icon: Sandwich, gradient: 'from-yellow-600 to-amber-500', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' },
  'sandwich': { icon: Sandwich, gradient: 'from-yellow-600 to-amber-500', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' },
  'sandwiches': { icon: Sandwich, gradient: 'from-yellow-600 to-amber-500', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' },
  'boissons': { icon: Wine, gradient: 'from-purple-500 to-violet-500', bgColor: 'bg-purple-50', iconColor: 'text-purple-500' },
  'drinks': { icon: Wine, gradient: 'from-purple-500 to-violet-500', bgColor: 'bg-purple-50', iconColor: 'text-purple-500' },
  'cocktails': { icon: Wine, gradient: 'from-purple-500 to-violet-500', bgColor: 'bg-purple-50', iconColor: 'text-purple-500' },
  'glaces': { icon: IceCream, gradient: 'from-cyan-500 to-blue-500', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-500' },
  'ice-cream': { icon: IceCream, gradient: 'from-cyan-500 to-blue-500', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-500' },
  'legumes': { icon: Carrot, gradient: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', iconColor: 'text-green-500' },
  'vegetables': { icon: Carrot, gradient: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', iconColor: 'text-green-500' },
  'vegetarien': { icon: Carrot, gradient: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', iconColor: 'text-green-500' },
  'vegetarian': { icon: Carrot, gradient: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', iconColor: 'text-green-500' },
  'plats-principaux': { icon: Utensils, gradient: 'from-[#F77313] to-[#d45f0a]', bgColor: 'bg-orange-50', iconColor: 'text-[#F77313]' },
  'main-dishes': { icon: Utensils, gradient: 'from-[#F77313] to-[#d45f0a]', bgColor: 'bg-orange-50', iconColor: 'text-[#F77313]' },
  'entrees': { icon: Utensils, gradient: 'from-violet-500 to-purple-500', bgColor: 'bg-violet-50', iconColor: 'text-violet-500' },
  'appetizers': { icon: Utensils, gradient: 'from-violet-500 to-purple-500', bgColor: 'bg-violet-50', iconColor: 'text-violet-500' },
};

const defaultStyle = { icon: ChefHat, gradient: 'from-[#F77313] to-[#d45f0a]', bgColor: 'bg-orange-50', iconColor: 'text-[#F77313]' };

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

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => {
            const style = getCategoryStyle(category.slug);
            const Icon = style.icon;

            return (
              <div key={category.id}>
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
                      <Icon className={`w-7 h-7 md:w-8 md:h-8 ${style.iconColor} group-hover:text-white transition-colors duration-300`} />
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
