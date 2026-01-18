'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface Props {
  slot?: string;
  format?: 'fluid' | 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  layoutKey?: string;
  className?: string;
  fullWidthResponsive?: boolean;
}

export default function GoogleAd({
  slot = '8544579045',
  format = 'auto',
  layoutKey = '-fb+5w+4e-db+86',
  className = '',
  fullWidthResponsive = true,
}: Props) {
  const adRef = useRef<HTMLModElement>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    // Only push if the ad hasn't been loaded yet
    if (isAdLoaded.current) return;

    // Check if the ins element already has an ad
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
      // Silently ignore "already have ads" error
      if (err instanceof Error && !err.message.includes('already have ads')) {
        console.error('Erreur AdSense:', err);
      }
    }
  }, []);

  return (
    <div className={`ad-container overflow-hidden max-w-full ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', maxWidth: '100%', overflow: 'hidden' }}
        data-ad-format={format}
        data-ad-layout-key={format === 'fluid' ? layoutKey : undefined}
        data-ad-client="ca-pub-8781698761921917"
        data-ad-slot={slot}
        data-full-width-responsive={fullWidthResponsive ? 'true' : undefined}
      />
    </div>
  );
}
