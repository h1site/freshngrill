'use client';

import Link from 'next/link';
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
 * Uses the translated slugs to navigate between FR and EN versions.
 */
export default function RecipeLanguageSwitcher({
  locale,
  slugFr,
  slugEn,
  className = '',
}: RecipeLanguageSwitcherProps) {
  // If no English slug, fall back to French slug
  const effectiveSlugEn = slugEn || slugFr;

  const frPath = `/recette/${slugFr}`;
  const enPath = `/en/recipe/${effectiveSlugEn}`;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="w-4 h-4 text-neutral-400" />
      <Link
        href={frPath}
        className={`text-sm font-medium transition-colors ${
          locale === 'fr'
            ? 'text-[#F77313]'
            : 'text-neutral-400 hover:text-white'
        }`}
        title="Français"
      >
        FR
      </Link>
      <span className="text-neutral-600">|</span>
      <Link
        href={enPath}
        className={`text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'text-[#F77313]'
            : 'text-neutral-400 hover:text-white'
        }`}
        title="English"
      >
        EN
      </Link>
    </div>
  );
}
