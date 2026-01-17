import Link from 'next/link';
import { ChevronRight, Compass, Flame, Globe, BarChart3 } from 'lucide-react';
import { Category } from '@/types/recipe';

interface Props {
  categories: Category[];
  difficulty: string;
  origineTags?: { slug: string; name: string }[];
  locale?: 'fr' | 'en';
}

const translations = {
  fr: {
    exploreMore: 'Explorer plus',
    moreRecipesIn: 'Plus de recettes',
    byDifficulty: 'Par niveau',
    byCuisine: 'Par cuisine',
    quickTip: 'Astuce rapide',
    easy: 'Facile',
    medium: 'Intermédiaire',
    hard: 'Difficile',
    allEasy: 'Toutes les recettes faciles',
    allMedium: 'Toutes les recettes intermédiaires',
    allHard: 'Toutes les recettes difficiles',
    categoryPath: '/categorie',
    recipePath: '/recette',
  },
  en: {
    exploreMore: 'Explore More',
    moreRecipesIn: 'More recipes in',
    byDifficulty: 'By level',
    byCuisine: 'By cuisine',
    quickTip: 'Quick tip',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    allEasy: 'All easy recipes',
    allMedium: 'All medium recipes',
    allHard: 'All hard recipes',
    categoryPath: '/en/category',
    recipePath: '/en/recipe',
  },
};

const difficultyMap = {
  facile: { key: 'easy', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  moyen: { key: 'medium', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
  difficile: { key: 'hard', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
};

export default function RecipeExploreFooter({
  categories,
  difficulty,
  origineTags,
  locale = 'fr',
}: Props) {
  const t = translations[locale];
  const diffInfo = difficultyMap[difficulty as keyof typeof difficultyMap] || difficultyMap.moyen;
  const difficultyLabel = t[diffInfo.key as keyof typeof t] as string;
  const allDifficultyLabel = t[`all${diffInfo.key.charAt(0).toUpperCase() + diffInfo.key.slice(1)}` as keyof typeof t] as string;

  // Take first 3 categories for display
  const displayCategories = categories.slice(0, 3);

  return (
    <section className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 md:p-8 print:hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#F77313]/10 rounded-full flex items-center justify-center">
          <Compass className="w-5 h-5 text-[#F77313]" />
        </div>
        <h2 className="font-display text-xl text-black">{t.exploreMore}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Categories */}
        {displayCategories.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4" />
              {t.moreRecipesIn}
            </h3>
            <ul className="space-y-2">
              {displayCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`${t.categoryPath}/${cat.slug}/`}
                    className="group flex items-center gap-2 text-neutral-700 hover:text-[#F77313] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#F77313]" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Difficulty */}
        <div>
          <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            {t.byDifficulty}
          </h3>
          <Link
            href={`${t.recipePath}/?${locale === 'fr' ? 'difficulte' : 'difficulty'}=${difficulty}`}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${diffInfo.color}`}
          >
            {allDifficultyLabel}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Origins/Cuisines */}
        {origineTags && origineTags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {t.byCuisine}
            </h3>
            <ul className="space-y-2">
              {origineTags.slice(0, 3).map((origin) => (
                <li key={origin.slug}>
                  <Link
                    href={`${t.recipePath}/?origine=${origin.slug}`}
                    className="group flex items-center gap-2 text-neutral-700 hover:text-[#F77313] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#F77313]" />
                    {origin.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
