import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

interface SpiceInfo {
  slug: string;
  name: string;
  image?: string | null;
}

interface Props {
  spices: SpiceInfo[];
  locale?: 'fr' | 'en';
}

const translations = {
  fr: {
    title: 'Épices utilisées',
    subtitle: 'En savoir plus sur ces aromates',
    learnMore: 'Découvrir',
    spicePath: '/epices',
  },
  en: {
    title: 'Spices Used',
    subtitle: 'Learn more about these aromatics',
    learnMore: 'Discover',
    spicePath: '/en/spices',
  },
};

export default function RecipeSpiceLinks({ spices, locale = 'fr' }: Props) {
  if (!spices || spices.length === 0) return null;

  const t = translations[locale];

  return (
    <section className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6 md:p-8 print:hidden">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="font-display text-xl text-black">{t.title}</h2>
          <p className="text-neutral-600 text-sm">{t.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        {spices.map((spice) => (
          <Link
            key={spice.slug}
            href={`${t.spicePath}/${spice.slug}/`}
            className="group flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 rounded-full hover:border-[#F77313] hover:bg-[#F77313]/5 transition-colors"
          >
            {spice.image && (
              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image
                  src={spice.image}
                  alt={spice.name}
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              </div>
            )}
            <span className="text-sm font-medium text-neutral-700 group-hover:text-[#F77313] transition-colors">
              {spice.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
