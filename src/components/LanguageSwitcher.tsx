'use client';

import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface LanguageSwitcherProps {
  locale: Locale;
  className?: string;
}

// Route translations between FR and EN
const routeTranslations: Record<string, string> = {
  // FR -> EN (first segment)
  'recette': 'recipe',
  'lexique': 'lexicon',
  'convertisseur': 'converter',
  'blog': 'blog',
  'frigo': 'fridge',
  'recherche': 'search',
  'a-propos': 'about',
  'contact': 'contact',
  'confidentialite': 'privacy',
  // EN -> FR (reverse, first segment)
  'recipe': 'recette',
  'lexicon': 'lexique',
  'converter': 'convertisseur',
  'fridge': 'frigo',
  'search': 'recherche',
  'about': 'a-propos',
  'privacy': 'confidentialite',
};

// Sub-route translations (for nested pages like /convertisseur/celsius-fahrenheit)
const subRouteTranslations: Record<string, string> = {
  // FR -> EN (converter sub-pages)
  'celsius-fahrenheit': 'celsius-fahrenheit',
  'metre-pied': 'meter-feet',
  'pouce-pied': 'inch-feet',
  'centimetre-pied': 'centimeter-feet',
  'minuterie': 'timer',
  // EN -> FR (converter sub-pages)
  'meter-feet': 'metre-pied',
  'inch-feet': 'pouce-pied',
  'centimeter-feet': 'centimetre-pied',
  'timer': 'minuterie',
};

function translatePath(pathname: string, fromLocale: Locale, toLocale: Locale): string {
  // Remove /en/ prefix if present
  let path = pathname.replace(/^\/en/, '') || '/';

  if (fromLocale === 'fr' && toLocale === 'en') {
    // FR -> EN: translate route segments
    const segments = path.split('/');
    const translatedSegments = segments.map((segment, index) => {
      // Translate first path segment (main route)
      if (index === 1 && routeTranslations[segment]) {
        return routeTranslations[segment];
      }
      // Translate second path segment (sub-route like converter pages)
      if (index === 2 && subRouteTranslations[segment]) {
        return subRouteTranslations[segment];
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
      // Translate first path segment (main route)
      if (index === 1 && routeTranslations[segment]) {
        return routeTranslations[segment];
      }
      // Translate second path segment (sub-route like converter pages)
      if (index === 2 && subRouteTranslations[segment]) {
        return subRouteTranslations[segment];
      }
      return segment;
    });
    return translatedSegments.join('/') || '/';
  }

  return path;
}

export default function LanguageSwitcher({ locale: localeProp, className = '' }: LanguageSwitcherProps) {
  const pathname = usePathname() || '/';

  // Detect current locale from pathname (more reliable than prop)
  const currentLocale: Locale = pathname.startsWith('/en') ? 'en' : 'fr';

  const frPath = currentLocale === 'fr' ? pathname : translatePath(pathname, 'en', 'fr');
  const enPath = currentLocale === 'en' ? pathname : translatePath(pathname, 'fr', 'en');

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="w-4 h-4 text-neutral-400" />
      <a
        href={frPath}
        className={`text-sm font-medium transition-colors ${
          currentLocale === 'fr'
            ? 'text-white'
            : 'text-neutral-400 hover:text-white'
        }`}
        title="Français"
      >
        FR
      </a>
      <span className="text-neutral-600">|</span>
      <a
        href={enPath}
        className={`text-sm font-medium transition-colors ${
          currentLocale === 'en'
            ? 'text-white'
            : 'text-neutral-400 hover:text-white'
        }`}
        title="English"
      >
        EN
      </a>
    </div>
  );
}
