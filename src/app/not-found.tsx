'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Track 404 error
    const trackError = async () => {
      try {
        await fetch('/api/track-404', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: window.location.pathname,
            referrer: document.referrer || null,
            userAgent: navigator.userAgent,
          }),
        });
      } catch (e) {
        // Silently fail tracking
      }
    };
    trackError();

    // Countdown and redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-display text-white/10 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl md:text-8xl font-display text-[#F77313]">Oups!</span>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-display text-white mb-4">
          Page introuvable
        </h2>
        <p className="text-neutral-400 text-lg mb-8">
          La page que vous cherchez n&apos;existe pas ou a ete deplacee.
        </p>

        {/* Countdown */}
        <div className="bg-white/5 rounded-lg p-4 mb-8 inline-block">
          <p className="text-neutral-500 text-sm">
            Redirection automatique dans{' '}
            <span className="text-[#F77313] font-bold text-lg">{countdown}</span>{' '}
            secondes
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#F77313] text-white px-6 py-3 font-medium uppercase tracking-wide hover:bg-[#d45f0a] transition-colors"
          >
            <Home className="w-5 h-5" />
            Accueil
          </Link>
          <Link
            href="/recette"
            className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 font-medium uppercase tracking-wide hover:bg-white/20 transition-colors"
          >
            <Search className="w-5 h-5" />
            Voir les recettes
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-6 py-3 font-medium uppercase tracking-wide hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
        </div>
      </div>
    </main>
  );
}
