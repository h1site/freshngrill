import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Clock } from 'lucide-react';
import { RecipeCard } from '@/types/recipe';

interface Props {
  recipes: RecipeCard[];
  locale?: 'fr' | 'en';
}

const translations = {
  fr: {
    title: 'Vous avez ces ingrédients?',
    subtitle: 'Ces recettes utilisent des ingrédients similaires',
    viewRecipe: 'Voir la recette',
    recipePath: '/recette',
    min: 'min',
  },
  en: {
    title: 'Have these ingredients?',
    subtitle: 'These recipes use similar ingredients',
    viewRecipe: 'View recipe',
    recipePath: '/en/recipe',
    min: 'min',
  },
};

export default function RecipesByIngredients({ recipes, locale = 'fr' }: Props) {
  if (!recipes || recipes.length === 0) return null;

  const t = translations[locale];

  return (
    <section className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 md:p-8 print:hidden">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-amber-600" />
        </div>
        <h2 className="font-display text-xl text-black">{t.title}</h2>
      </div>
      <p className="text-neutral-600 text-sm mb-6 ml-[52px]">{t.subtitle}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recipes.map((recipe) => {
          const slug = locale === 'en' && recipe.slugEn ? recipe.slugEn : recipe.slug;
          return (
            <Link
              key={recipe.id}
              href={`${t.recipePath}/${slug}/`}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[4/3]">
                {recipe.featuredImage ? (
                  <Image
                    src={recipe.featuredImage}
                    alt={recipe.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-neutral-400" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm text-black group-hover:text-[#F77313] transition-colors line-clamp-2">
                  {recipe.title}
                </h3>
                <div className="flex items-center gap-1 mt-2 text-xs text-neutral-500">
                  <Clock className="w-3 h-3" />
                  <span>{recipe.totalTime} {t.min}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
