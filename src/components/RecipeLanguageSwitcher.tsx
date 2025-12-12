'use client';

import { Globe } from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface RecipeLanguageSwitcherProps {
  locale: Locale;
  slugFr: string;
  slugEn?: string;
  className?: string;
}

/**
 * Language switcher specifically for recipe pages.
 * Uses <a> tags for full page reload to ensure proper locale context.
 */
export default function RecipeLanguageSwitcher({
  locale,
  slugFr,
  slugEn,
  className = '',
}: RecipeLanguageSwitcherProps) {
  // Build the correct paths
  const frPath = `/recette/${slugFr}/`;
  // For English, use slugEn if available, otherwise fall back to slugFr
  const enPath = `/en/recipe/${slugEn || slugFr}/`;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="w-4 h-4 text-neutral-400" />
      <a
        href={frPath}
        className={`text-sm font-medium transition-colors ${
          locale === 'fr'
            ? 'text-[#F77313]'
            : 'text-neutral-400 hover:text-white'
        }`}
        title="Voir en français"
      >
        FR
      </a>
      <span className="text-neutral-600">|</span>
      <a
        href={enPath}
        className={`text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'text-[#F77313]'
            : 'text-neutral-400 hover:text-white'
        }`}
        title="View in English"
      >
        EN
      </a>
    </div>
  );
}
