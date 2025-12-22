import Image from 'next/image';
import Link from 'next/link';
import { Clock, ChefHat, ArrowRight } from 'lucide-react';
import { RecipeCard } from '@/types/recipe';

interface NextRecipeProps {
  recipe: RecipeCard;
  locale?: 'fr' | 'en';
}

const translations = {
  fr: {
    title: 'Prochaine recette à essayer',
    subtitle: 'Continuez votre exploration culinaire',
    button: 'Voir la recette',
    minutes: 'min',
    difficulties: {
      facile: 'Facile',
      moyen: 'Moyen',
      difficile: 'Difficile',
    },
  },
  en: {
    title: 'Next recipe to try',
    subtitle: 'Continue your culinary exploration',
    button: 'View recipe',
    minutes: 'min',
    difficulties: {
      facile: 'Easy',
      moyen: 'Medium',
      difficile: 'Hard',
    },
  },
};

export default function NextRecipe({ recipe, locale = 'fr' }: NextRecipeProps) {
  const t = translations[locale];
  const slug = locale === 'en' && recipe.slugEn ? recipe.slugEn : recipe.slug;
  const href = locale === 'en' ? `/en/recipe/${slug}/` : `/recette/${slug}/`;
  const difficulty = recipe.difficulty as 'facile' | 'moyen' | 'difficile';

  return (
    <section className="bg-gradient-to-br from-[#F77313]/5 via-white to-[#F77313]/10 py-12 md:py-16 print:hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#F77313] rounded-full flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display text-xl md:text-2xl text-black">
              {t.title}
            </h2>
            <p className="text-neutral-500 text-sm">{t.subtitle}</p>
          </div>
        </div>

        <Link
          href={href}
          className="group block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-100"
        >
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="relative w-full md:w-80 h-48 md:h-56 flex-shrink-0 overflow-hidden">
              {recipe.featuredImage ? (
                <Image
                  src={recipe.featuredImage}
                  alt={recipe.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              ) : (
                <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center">
                  <ChefHat className="w-12 h-12 text-neutral-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-gradient-to-r" />
            </div>

            {/* Content */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
              <h3 className="font-display text-2xl md:text-3xl text-black mb-4 group-hover:text-[#F77313] transition-colors">
                {recipe.title}
              </h3>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                {recipe.totalTime && (
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {recipe.totalTime} {t.minutes}
                    </span>
                  </div>
                )}
                {difficulty && (
                  <div className="px-3 py-1 bg-neutral-100 rounded-full text-sm text-neutral-700">
                    {t.difficulties[difficulty] || difficulty}
                  </div>
                )}
                {recipe.categories?.[0] && (
                  <div className="px-3 py-1 bg-[#F77313]/10 rounded-full text-sm text-[#F77313] font-medium">
                    {recipe.categories[0].name}
                  </div>
                )}
              </div>

              <div className="inline-flex items-center gap-2 text-[#F77313] font-semibold group-hover:gap-4 transition-all">
                {t.button}
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
