'use client';

import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { useLanguageContext } from '@/contexts/LanguageContext';

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
  const { slugFr, slugEn } = useLanguageContext();

  // Detect current locale from pathname (more reliable than prop)
  const currentLocale: Locale = pathname.startsWith('/en') ? 'en' : 'fr';

  // Check if this is a recipe or blog page with a slug
  // Match /recette/slug/ (French) or /en/recipe/slug/ (English)
  const isRecipePage = pathname.match(/^\/recette\/[^/]+\/?$/) || pathname.match(/^\/en\/recipe\/[^/]+\/?$/);
  const isBlogPage = pathname.match(/^\/(en\/)?blog\/[^/]+\/?$/);

  let frPath: string;
  let enPath: string;

  if (isRecipePage && (slugFr || slugEn)) {
    // Use the context slugs for recipe pages
    frPath = `/recette/${slugFr || pathname.split('/').pop()?.replace(/\/$/, '')}/`;
    enPath = `/en/recipe/${slugEn || pathname.split('/').pop()?.replace(/\/$/, '')}/`;
  } else if (isBlogPage && (slugFr || slugEn)) {
    // Use the context slugs for blog pages
    frPath = `/blog/${slugFr || pathname.split('/').pop()?.replace(/\/$/, '')}/`;
    enPath = `/en/blog/${slugEn || pathname.split('/').pop()?.replace(/\/$/, '')}/`;
  } else {
    // Default translation for other pages
    frPath = currentLocale === 'fr' ? pathname : translatePath(pathname, 'en', 'fr');
    enPath = currentLocale === 'en' ? pathname : translatePath(pathname, 'fr', 'en');
  }

  // Force full page reload to ensure server-side locale detection works
  const handleLanguageChange = (e: React.MouseEvent<HTMLAnchorElement>, targetPath: string, targetLocale: Locale) => {
    if (currentLocale !== targetLocale) {
      e.preventDefault();
      window.location.href = targetPath;
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="w-4 h-4 text-white/70" />
      <a
        href={frPath}
        onClick={(e) => handleLanguageChange(e, frPath, 'fr')}
        className={`text-sm font-medium transition-colors ${
          currentLocale === 'fr'
            ? 'text-white'
            : 'text-white/70 hover:text-white'
        }`}
        title="Français"
      >
        FR
      </a>
      <span className="text-white/40">|</span>
      <a
        href={enPath}
        onClick={(e) => handleLanguageChange(e, enPath, 'en')}
        className={`text-sm font-medium transition-colors ${
          currentLocale === 'en'
            ? 'text-white'
            : 'text-white/70 hover:text-white'
        }`}
        title="English"
      >
        EN
      </a>
    </div>
  );
}
