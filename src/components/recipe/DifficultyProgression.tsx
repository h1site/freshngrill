import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, TrendingDown, ChevronRight, Clock } from 'lucide-react';
import { RecipeCard } from '@/types/recipe';

interface Props {
  easierRecipe?: RecipeCard | null;
  harderRecipe?: RecipeCard | null;
  currentDifficulty: string;
  locale?: 'fr' | 'en';
}

const translations = {
  fr: {
    title: 'Progression',
    tryEasier: 'Version plus simple',
    tryHarder: 'Prêt pour un défi?',
    currentEasy: 'Vous êtes au niveau débutant',
    currentHard: 'Vous êtes au niveau expert',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    min: 'min',
    recipePath: '/recette',
  },
  en: {
    title: 'Skill Progression',
    tryEasier: 'Simpler version',
    tryHarder: 'Ready for a challenge?',
    currentEasy: 'You\'re at beginner level',
    currentHard: 'You\'re at expert level',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    min: 'min',
    recipePath: '/en/recipe',
  },
};

const difficultyColors = {
  facile: 'bg-green-100 text-green-700',
  moyen: 'bg-yellow-100 text-yellow-700',
  difficile: 'bg-red-100 text-red-700',
};

export default function DifficultyProgression({
  easierRecipe,
  harderRecipe,
  currentDifficulty,
  locale = 'fr',
}: Props) {
  const t = translations[locale];

  // Don't render if no progression options available
  if (!easierRecipe && !harderRecipe) return null;

  const getDifficultyLabel = (diff: string) => {
    const map: Record<string, keyof typeof t> = {
      facile: 'easy',
      moyen: 'medium',
      difficile: 'hard',
    };
    return t[map[diff] || 'medium'] as string;
  };

  return (
    <section className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 md:p-8 print:hidden">
      <h2 className="font-display text-xl text-black mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-[#F77313]" />
        {t.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Easier recipe */}
        {easierRecipe ? (
          <Link
            href={`${t.recipePath}/${locale === 'en' && easierRecipe.slugEn ? easierRecipe.slugEn : easierRecipe.slug}/`}
            className="group flex gap-4 p-4 bg-white border border-green-200 rounded-lg hover:border-green-400 hover:shadow-md transition-all"
          >
            {easierRecipe.featuredImage && (
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={easierRecipe.featuredImage}
                  alt={easierRecipe.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-600 uppercase tracking-wider">
                  {t.tryEasier}
                </span>
              </div>
              <h3 className="font-medium text-black group-hover:text-[#F77313] transition-colors line-clamp-2">
                {easierRecipe.title}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                <span className={`px-2 py-0.5 rounded ${difficultyColors[easierRecipe.difficulty as keyof typeof difficultyColors] || difficultyColors.moyen}`}>
                  {getDifficultyLabel(easierRecipe.difficulty)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {easierRecipe.totalTime} {t.min}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#F77313] self-center flex-shrink-0" />
          </Link>
        ) : currentDifficulty === 'facile' ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-700 text-sm">{t.currentEasy}</p>
          </div>
        ) : null}

        {/* Harder recipe */}
        {harderRecipe ? (
          <Link
            href={`${t.recipePath}/${locale === 'en' && harderRecipe.slugEn ? harderRecipe.slugEn : harderRecipe.slug}/`}
            className="group flex gap-4 p-4 bg-white border border-red-200 rounded-lg hover:border-red-400 hover:shadow-md transition-all"
          >
            {harderRecipe.featuredImage && (
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={harderRecipe.featuredImage}
                  alt={harderRecipe.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-600 uppercase tracking-wider">
                  {t.tryHarder}
                </span>
              </div>
              <h3 className="font-medium text-black group-hover:text-[#F77313] transition-colors line-clamp-2">
                {harderRecipe.title}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                <span className={`px-2 py-0.5 rounded ${difficultyColors[harderRecipe.difficulty as keyof typeof difficultyColors] || difficultyColors.moyen}`}>
                  {getDifficultyLabel(harderRecipe.difficulty)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {harderRecipe.totalTime} {t.min}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#F77313] self-center flex-shrink-0" />
          </Link>
        ) : currentDifficulty === 'difficile' ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-700 text-sm">{t.currentHard}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
