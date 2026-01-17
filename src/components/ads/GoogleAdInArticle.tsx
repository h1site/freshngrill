'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface Props {
  className?: string;
}

/**
 * Composant pour les annonces In-Article
 * Format optimisé pour le contenu éditorial - 1 seul par page recommandé
 */
export default function GoogleAdInArticle({ className = '' }: Props) {
  const adRef = useRef<HTMLModElement>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    if (isAdLoaded.current) return;

    const insElement = adRef.current;
    if (insElement && insElement.getAttribute('data-adsbygoogle-status')) {
      return;
    }

    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isAdLoaded.current = true;
      }
    } catch (err) {
      if (err instanceof Error && !err.message.includes('already have ads')) {
        console.error('Erreur AdSense In-Article:', err);
      }
    }
  }, []);

  return (
    <div className={`ad-container overflow-hidden max-w-full ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-8781698761921917"
        data-ad-slot="6317870955"
      />
    </div>
  );
}
