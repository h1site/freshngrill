import type { Locale } from '@/i18n/config';

interface Props {
  author?: string;
  locale?: Locale;
}

const translations = {
  fr: {
    testedBy: 'Recette testée et approuvée par',
    team: "l'équipe MenuCochon",
    tagline: 'Recettes québécoises authentiques depuis 2020',
  },
  en: {
    testedBy: 'Recipe tested and approved by',
    team: 'the MenuCochon team',
    tagline: 'Authentic Quebec recipes since 2020',
  },
};

export default function EditorialSignature({ author, locale = 'fr' }: Props) {
  const t = translations[locale];
  const authorName = author || t.team;

  return (
    <div className="mt-8 pt-6 border-t border-neutral-200">
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#F77313] flex-shrink-0 flex items-center justify-center">
          <span className="text-white font-display text-xl">M</span>
        </div>
        <div>
          <p className="text-sm text-neutral-500">
            {t.testedBy}
          </p>
          <p className="font-display text-lg text-black">
            {authorName}
          </p>
          <p className="text-xs text-[#F77313]">
            {t.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}
