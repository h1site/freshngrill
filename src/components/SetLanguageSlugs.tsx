'use client';

import { useEffect } from 'react';
import { useLanguageContext } from '@/contexts/LanguageContext';

interface SetLanguageSlugsProps {
  slugFr?: string;
  slugEn?: string;
}

/**
 * Client component that sets alternate language slugs in context.
 * Use this on recipe/blog pages to enable proper language switching.
 */
export default function SetLanguageSlugs({ slugFr, slugEn }: SetLanguageSlugsProps) {
  const { setAlternateSlugs } = useLanguageContext();

  useEffect(() => {
    setAlternateSlugs(slugFr, slugEn);

    // Clean up when unmounting
    return () => {
      setAlternateSlugs(undefined, undefined);
    };
  }, [slugFr, slugEn, setAlternateSlugs]);

  return null;
}
