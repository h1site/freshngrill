'use client';

import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';

interface Props {
  locale?: Locale;
}

export default function CookieConsent({ locale = 'fr' }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isEN = locale === 'en';

  const t = isEN ? {
    message: 'We use cookies to improve your experience on our site.',
    accept: 'Accept',
    decline: 'Decline',
    learnMore: 'Learn more',
    privacyLink: '/en/privacy',
  } : {
    message: 'Nous utilisons des cookies pour améliorer votre expérience sur notre site.',
    accept: 'Accepter',
    decline: 'Refuser',
    learnMore: 'En savoir plus',
    privacyLink: '/confidentialite',
  };

  useEffect(() => {
    setIsMounted(true);
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a small delay
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);

    // Enable Google Analytics if user accepts
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);

    // Disable Google Analytics if user declines
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }
  };

  if (!isMounted || !isVisible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:right-auto z-[60] max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="bg-white border-2 border-neutral-200 rounded-xl shadow-2xl p-4 md:p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-10 h-10 bg-[#F77313]/10 rounded-full flex items-center justify-center">
            <Cookie className="w-5 h-5 text-[#F77313]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-neutral-900 text-sm mb-1">
              Cookies
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {t.message}
            </p>
          </div>
          <button
            onClick={handleDecline}
            className="flex-shrink-0 p-1 hover:bg-neutral-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-neutral-400" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleAccept}
            className="flex-1 bg-[#F77313] hover:bg-[#e56610] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {t.accept}
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {t.decline}
          </button>
        </div>

        {/* Privacy Link */}
        <div className="mt-3 text-center">
          <Link
            href={t.privacyLink}
            className="text-xs text-neutral-500 hover:text-[#F77313] transition-colors underline"
          >
            {t.learnMore}
          </Link>
        </div>
      </div>
    </div>
  );
}
