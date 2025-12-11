'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface LanguageSwitcherProps {
  locale: Locale;
  className?: string;
}

// Route translations between FR and EN
const routeTranslations: Record<string, string> = {
  // FR -> EN
  'recette': 'recipe',
  'lexique': 'lexicon',
  'convertisseur': 'converter',
  'blog': 'blog',
  'frigo': 'fridge',
  'recherche': 'search',
  'a-propos': 'about',
  'contact': 'contact',
  'confidentialite': 'privacy',
  // EN -> FR (reverse)
  'recipe': 'recette',
  'lexicon': 'lexique',
  'converter': 'convertisseur',
  'fridge': 'frigo',
  'search': 'recherche',
  'about': 'a-propos',
  'privacy': 'confidentialite',
};

function translatePath(pathname: string, fromLocale: Locale, toLocale: Locale): string {
  // Remove /en/ prefix if present
  let path = pathname.replace(/^\/en/, '') || '/';

  if (fromLocale === 'fr' && toLocale === 'en') {
    // FR -> EN: translate route segments
    const segments = path.split('/');
    const translatedSegments = segments.map((segment, index) => {
      // Only translate first path segment after the initial slash
      if (index === 1 && routeTranslations[segment]) {
        return routeTranslations[segment];
      }
      return segment;
    });
    path = translatedSegments.join('/');
    return `/en${path}`;
  }

  if (fromLocale === 'en' && toLocale === 'fr') {
    // EN -> FR: translate route segments back
    const segments = path.split('/');
    const translatedSegments = segments.map((segment, index) => {
      // Only translate first path segment after the initial slash
      if (index === 1 && routeTranslations[segment]) {
        return routeTranslations[segment];
      }
      return segment;
    });
    return translatedSegments.join('/') || '/';
  }

  return path;
}

export default function LanguageSwitcher({ locale, className = '' }: LanguageSwitcherProps) {
  const pathname = usePathname();

  const getLocalePath = (targetLocale: Locale) => {
    if (targetLocale === locale) {
      return pathname; // Already on this locale
    }
    return translatePath(pathname, locale, targetLocale);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="w-4 h-4 text-neutral-400" />
      <Link
        href={getLocalePath('fr')}
        className={`text-sm font-medium transition-colors ${
          locale === 'fr'
            ? 'text-white'
            : 'text-neutral-400 hover:text-white'
        }`}
        title="Français"
      >
        FR
      </Link>
      <span className="text-neutral-600">|</span>
      <Link
        href={getLocalePath('en')}
        className={`text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'text-white'
            : 'text-neutral-400 hover:text-white'
        }`}
        title="English"
      >
        EN
      </Link>
    </div>
  );
}
