'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Générer un session ID unique
function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

export default function PageTracker() {
  const pathname = usePathname();
  const startTime = useRef<number>(Date.now());
  const currentViewId = useRef<number | null>(null);

  useEffect(() => {
    // Ne pas tracker les pages admin
    if (pathname.startsWith('/admin')) return;

    const sessionId = getSessionId();
    startTime.current = Date.now();

    // Enregistrer la visite
    const trackPageView = async () => {
      try {
        const response = await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_path: pathname,
            page_title: document.title,
            referrer: document.referrer || null,
            session_id: sessionId,
            locale: pathname.startsWith('/en') ? 'en' : 'fr',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          currentViewId.current = data.id;
        }
      } catch (error) {
        console.error('Failed to track page view:', error);
      }
    };

    trackPageView();

    // Mettre à jour le temps sur page quand l'utilisateur quitte
    const handleBeforeUnload = () => {
      if (currentViewId.current) {
        const timeOnPage = Math.round((Date.now() - startTime.current) / 1000);

        // Utiliser sendBeacon pour envoyer les données même si la page se ferme
        navigator.sendBeacon('/api/analytics/track', JSON.stringify({
          update_id: currentViewId.current,
          time_on_page: timeOnPage,
          exited: true,
        }));
      }
    };

    // Mettre à jour quand on navigue vers une autre page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && currentViewId.current) {
        const timeOnPage = Math.round((Date.now() - startTime.current) / 1000);

        navigator.sendBeacon('/api/analytics/track', JSON.stringify({
          update_id: currentViewId.current,
          time_on_page: timeOnPage,
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Cleanup: enregistrer le temps passé et la prochaine page
      if (currentViewId.current) {
        const timeOnPage = Math.round((Date.now() - startTime.current) / 1000);

        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            update_id: currentViewId.current,
            time_on_page: timeOnPage,
            next_page: window.location.pathname,
          }),
          keepalive: true,
        }).catch(() => {});
      }

      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname]);

  return null;
}
