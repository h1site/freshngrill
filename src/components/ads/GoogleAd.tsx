'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface Props {
  slot: string;
  format?: 'fluid' | 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  layoutKey?: string;
  className?: string;
}

export default function GoogleAd({
  slot,
  format = 'fluid',
  layoutKey = '-fb+5w+4e-db+86',
  className = '',
}: Props) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('Erreur AdSense:', err);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format={format}
        data-ad-layout-key={format === 'fluid' ? layoutKey : undefined}
        data-ad-client="ca-pub-8781698761921917"
        data-ad-slot={slot}
      />
    </div>
  );
}
