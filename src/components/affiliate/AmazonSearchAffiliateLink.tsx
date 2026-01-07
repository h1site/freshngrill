'use client';

import React, { useCallback, type ReactNode, type MouseEvent } from 'react';
import {
  buildAmazonSearchUrl,
  trackAffiliateClick,
  type AffiliateClickPayload,
  type BuildAmazonSearchUrlParams,
} from '@/lib/amazon-affiliate';

export interface AmazonSearchAffiliateLinkProps {
  /** Mots-clés de recherche Amazon */
  query: string;
  /** Contenu du lien */
  children: ReactNode;
  /** Classes CSS optionnelles */
  className?: string;
  /** Tag affilié personnalisé (utilise env par défaut) */
  tag?: string;
  /** Domaine Amazon personnalisé (utilise env par défaut) */
  domain?: string;
  /** Paramètres Amazon supplémentaires (ex: { i: 'electronics' }) */
  extraParams?: Record<string, string>;
  /** Callback après tracking (optionnel) */
  onTracked?: (data: AffiliateClickPayload) => void;
  /** Désactiver le tracking (pour tests) */
  disableTracking?: boolean;
  /** Attributs HTML supplémentaires */
  title?: string;
  'aria-label'?: string;
}

/**
 * Composant de lien affilié Amazon
 *
 * Caractéristiques:
 * - Lien <a> direct vers Amazon (pas de redirection JS)
 * - target="_blank" pour ouvrir dans nouvel onglet
 * - rel="nofollow noopener sponsored" (bonnes pratiques SEO/Amazon)
 * - Tracking non-bloquant via sendBeacon/fetch keepalive
 *
 * @example
 * <AmazonSearchAffiliateLink query="casque bluetooth">
 *   Voir les casques sur Amazon
 * </AmazonSearchAffiliateLink>
 *
 * @example
 * <AmazonSearchAffiliateLink
 *   query="imprimante 3D"
 *   extraParams={{ i: 'industrial' }}
 *   className="text-blue-600 underline"
 * >
 *   Comparer les prix
 * </AmazonSearchAffiliateLink>
 */
export function AmazonSearchAffiliateLink({
  query,
  children,
  className,
  tag,
  domain,
  extraParams,
  onTracked,
  disableTracking = false,
  title,
  'aria-label': ariaLabel,
}: AmazonSearchAffiliateLinkProps) {
  // Construire l'URL Amazon
  const amazonUrl = buildAmazonSearchUrl({
    query,
    tag,
    domain,
    extraParams,
  });

  // Handler de clic pour tracking non-bloquant
  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      // NE PAS empêcher la navigation par défaut
      // Le tracking est non-bloquant

      if (disableTracking) {
        return;
      }

      // Préparer le payload de tracking
      const payload: AffiliateClickPayload = {
        ts: new Date().toISOString(),
        query: amazonUrl.query,
        href: amazonUrl.url,
        pagePath: typeof window !== 'undefined' ? window.location.pathname : '',
        domain: amazonUrl.domain,
        tag: amazonUrl.tag,
      };

      // Envoyer le tracking de manière non-bloquante
      trackAffiliateClick(payload);

      // Appeler le callback si fourni
      if (onTracked) {
        onTracked(payload);
      }
    },
    [amazonUrl, disableTracking, onTracked]
  );

  return (
    <a
      href={amazonUrl.url}
      target="_blank"
      rel="nofollow noopener sponsored"
      className={className}
      onClick={handleClick}
      title={title}
      aria-label={ariaLabel}
      data-affiliate="amazon"
      data-query={query}
    >
      {children}
    </a>
  );
}

/**
 * Composant bouton affilié Amazon (variante stylisée)
 */
export function AmazonSearchAffiliateButton({
  query,
  children,
  className,
  ...props
}: AmazonSearchAffiliateLinkProps) {
  const defaultClassName = `
    inline-flex items-center gap-2 px-4 py-2
    bg-[#FF9900] hover:bg-[#FF9900]/90
    text-black font-medium rounded-md
    transition-colors duration-200
    ${className || ''}
  `.trim();

  return (
    <AmazonSearchAffiliateLink query={query} className={defaultClassName} {...props}>
      {children}
      <AmazonLogo className="w-4 h-4" />
    </AmazonSearchAffiliateLink>
  );
}

/**
 * Logo Amazon simplifié (SVG inline)
 */
function AmazonLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.017 1.5c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11-4.925-11-11-11zm0 20c-4.963 0-9-4.037-9-9s4.037-9 9-9 9 4.037 9 9-4.037 9-9 9z" />
      <path d="M15.5 8.5c-.276 0-.5.224-.5.5v3c0 1.103-.897 2-2 2s-2-.897-2-2V9c0-.276-.224-.5-.5-.5s-.5.224-.5.5v3c0 1.654 1.346 3 3 3s3-1.346 3-3V9c0-.276-.224-.5-.5-.5z" />
      <path d="M7.5 15.5c.276 0 .5-.224.5-.5v-3c0-1.103.897-2 2-2 .276 0 .5-.224.5-.5s-.224-.5-.5-.5c-1.654 0-3 1.346-3 3v3c0 .276.224.5.5.5z" />
    </svg>
  );
}

export default AmazonSearchAffiliateLink;
