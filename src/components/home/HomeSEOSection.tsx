import Link from 'next/link';
import { ChefHat, BookOpen, Utensils, Heart } from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface HomeSEOSectionProps {
  locale?: Locale;
}

const translations = {
  fr: {
    title: 'Bienvenue sur Menucochon',
    subtitle: 'Votre destination gourmande québécoise',
    description: `Menucochon est votre référence pour découvrir les meilleures recettes québécoises.
    Que vous cherchiez un repas rapide pour la semaine ou un plat élaboré pour impressionner vos invités,
    Menucochon vous propose des centaines de recettes testées et approuvées par notre communauté.`,
    features: [
      {
        icon: ChefHat,
        title: 'Recettes authentiques',
        description: 'Des recettes québécoises traditionnelles et modernes, du pâté chinois à la poutine.',
      },
      {
        icon: BookOpen,
        title: 'Instructions détaillées',
        description: 'Chaque recette Menucochon inclut des étapes claires et des conseils de chef.',
      },
      {
        icon: Utensils,
        title: 'Pour tous les niveaux',
        description: 'Des recettes faciles aux défis culinaires, trouvez votre bonheur sur Menucochon.',
      },
      {
        icon: Heart,
        title: 'Fait avec passion',
        description: 'L\'équipe Menucochon cuisine et teste chaque recette avant de la partager.',
      },
    ],
    cta: 'Explorer toutes les recettes',
    ctaLink: '/recette',
  },
  en: {
    title: 'Welcome to Menucochon',
    subtitle: 'Your Quebec culinary destination',
    description: `Menucochon is your go-to source for discovering the best Quebec recipes.
    Whether you're looking for a quick weeknight meal or an elaborate dish to impress your guests,
    Menucochon offers hundreds of recipes tested and approved by our community.`,
    features: [
      {
        icon: ChefHat,
        title: 'Authentic recipes',
        description: 'Traditional and modern Quebec recipes, from pâté chinois to poutine.',
      },
      {
        icon: BookOpen,
        title: 'Detailed instructions',
        description: 'Every Menucochon recipe includes clear steps and chef tips.',
      },
      {
        icon: Utensils,
        title: 'For all skill levels',
        description: 'From easy recipes to culinary challenges, find your match on Menucochon.',
      },
      {
        icon: Heart,
        title: 'Made with passion',
        description: 'The Menucochon team cooks and tests every recipe before sharing.',
      },
    ],
    cta: 'Explore all recipes',
    ctaLink: '/en/recipe',
  },
};

export function HomeSEOSection({ locale = 'fr' }: HomeSEOSectionProps) {
  const t = translations[locale];

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-black mb-4">
            {t.title}
          </h2>
          <p className="text-[#F77313] font-medium uppercase tracking-wider text-sm mb-6">
            {t.subtitle}
          </p>
          <p className="text-neutral-600 text-lg leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {t.features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-neutral-100 hover:border-[#F77313]/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#F77313]/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#F77313]" />
                </div>
                <h3 className="font-display text-lg text-black mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={t.ctaLink}
            className="inline-flex items-center gap-2 bg-[#F77313] hover:bg-[#d45f0a] text-white font-medium px-8 py-4 rounded-lg transition-colors duration-300"
          >
            {t.cta}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
