'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface HomePageAdProps {
  position: 'after-hero' | 'after-featured' | 'after-youtube';
  className?: string;
}

export default function HomePageAd({ position, className = '' }: HomePageAdProps) {
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
        console.error('AdSense error:', err);
      }
    }
  }, []);

  return (
    <section
      className={`py-6 md:py-8 ${className}`}
      aria-label="Publicité"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', maxWidth: '100%', overflow: 'hidden' }}
            data-ad-format="auto"
            data-ad-client="ca-pub-8781698761921917"
            data-ad-slot="8544579045"
            data-full-width-responsive="true"
            data-ad-position={position}
          />
        </div>
      </div>
    </section>
  );
}
