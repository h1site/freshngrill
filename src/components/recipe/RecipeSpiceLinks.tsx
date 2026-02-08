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
    <section className="bg-gradient-to-br from-[#F77313] to-[#d45f0a] rounded-lg p-6 md:p-8 print:hidden">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-display text-xl text-white">{t.title}</h2>
          <p className="text-white/70 text-sm">{t.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        {spices.map((spice) => (
          <Link
            key={spice.slug}
            href={`${t.spicePath}/${spice.slug}/`}
            className="group flex items-center gap-2 px-4 py-2 bg-white rounded-full hover:bg-neutral-100 transition-colors"
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
            <span className="text-sm font-medium text-neutral-800">
              {spice.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
