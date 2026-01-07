/**
 * Amazon Affiliate Link Builder
 * Génère des URLs de recherche Amazon avec tag affilié
 */

// Whitelist des domaines Amazon autorisés
const AMAZON_DOMAINS_WHITELIST = [
  'www.amazon.ca',
  'www.amazon.com',
  'www.amazon.co.uk',
  'www.amazon.fr',
  'www.amazon.de',
  'www.amazon.es',
  'www.amazon.it',
  'www.amazon.co.jp',
  'www.amazon.com.au',
  'www.amazon.com.mx',
  'www.amazon.com.br',
] as const;

export type AmazonDomain = (typeof AMAZON_DOMAINS_WHITELIST)[number];

// Domaine par défaut (Canada)
const DEFAULT_AMAZON_DOMAIN: AmazonDomain = 'www.amazon.ca';

// Tag affilié par défaut depuis env
const DEFAULT_AFFILIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOC_TAG || '';

export interface BuildAmazonSearchUrlParams {
  /** Mots-clés de recherche */
  query: string;
  /** Tag affilié Amazon (ex: "monid-20") */
  tag?: string;
  /** Domaine Amazon (ex: "www.amazon.ca") */
  domain?: string;
  /** Paramètres supplémentaires (ex: { i: 'electronics', rh: 'n:667823011' }) */
  extraParams?: Record<string, string>;
}

export interface AmazonSearchUrl {
  url: string;
  domain: AmazonDomain;
  tag: string;
  query: string;
}

/**
 * Vérifie si un domaine est dans la whitelist Amazon
 */
export function isValidAmazonDomain(domain: string): domain is AmazonDomain {
  return AMAZON_DOMAINS_WHITELIST.includes(domain as AmazonDomain);
}

/**
 * Normalise et valide un domaine Amazon
 * Retourne le domaine par défaut si invalide
 */
export function normalizeAmazonDomain(domain?: string): AmazonDomain {
  if (!domain) {
    return (process.env.NEXT_PUBLIC_AMAZON_DOMAIN as AmazonDomain) || DEFAULT_AMAZON_DOMAIN;
  }

  // Nettoyer le domaine (enlever protocole, trailing slash)
  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .toLowerCase();

  if (isValidAmazonDomain(cleanDomain)) {
    return cleanDomain;
  }

  // Si le domaine contient "amazon" mais n'est pas dans la whitelist, utiliser le défaut
  console.warn(`[Amazon Affiliate] Domaine non autorisé: "${domain}". Utilisation du domaine par défaut.`);
  return (process.env.NEXT_PUBLIC_AMAZON_DOMAIN as AmazonDomain) || DEFAULT_AMAZON_DOMAIN;
}

/**
 * Construit une URL de recherche Amazon avec tag affilié
 *
 * @example
 * buildAmazonSearchUrl({ query: 'casque bluetooth' })
 * // => { url: 'https://www.amazon.ca/gp/search/?keywords=casque%20bluetooth&tag=monid-20', ... }
 *
 * @example
 * buildAmazonSearchUrl({
 *   query: 'imprimante 3D',
 *   tag: 'custom-21',
 *   domain: 'www.amazon.com',
 *   extraParams: { i: 'electronics' }
 * })
 */
export function buildAmazonSearchUrl({
  query,
  tag,
  domain,
  extraParams,
}: BuildAmazonSearchUrlParams): AmazonSearchUrl {
  // Valider et normaliser le domaine
  const normalizedDomain = normalizeAmazonDomain(domain);

  // Utiliser le tag fourni ou celui de l'environnement
  const affiliateTag = tag || DEFAULT_AFFILIATE_TAG;

  if (!affiliateTag) {
    console.warn('[Amazon Affiliate] Aucun tag affilié configuré. Les liens ne généreront pas de commission.');
  }

  // Encoder la requête de recherche
  const encodedQuery = encodeURIComponent(query.trim());

  // Construire les paramètres URL
  const params = new URLSearchParams();
  params.set('keywords', query.trim()); // URLSearchParams encode automatiquement

  if (affiliateTag) {
    params.set('tag', affiliateTag);
  }

  // Ajouter les paramètres supplémentaires
  if (extraParams) {
    Object.entries(extraParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
  }

  // Construire l'URL finale
  const url = `https://${normalizedDomain}/gp/search/?${params.toString()}`;

  return {
    url,
    domain: normalizedDomain,
    tag: affiliateTag,
    query: query.trim(),
  };
}

/**
 * Construit une URL simple (string) pour utilisation directe
 */
export function getAmazonSearchUrl(
  query: string,
  options?: Omit<BuildAmazonSearchUrlParams, 'query'>
): string {
  return buildAmazonSearchUrl({ query, ...options }).url;
}

/**
 * Payload pour le tracking des clics affiliés
 */
export interface AffiliateClickPayload {
  /** Timestamp ISO */
  ts: string;
  /** Mots-clés de recherche */
  query: string;
  /** URL complète du lien */
  href: string;
  /** Chemin de la page source */
  pagePath: string;
  /** Domaine Amazon utilisé */
  domain: string;
  /** Tag affilié */
  tag: string;
  /** Données supplémentaires optionnelles */
  extra?: Record<string, unknown>;
}

/**
 * Envoie un tracking de clic affilié de manière non-bloquante
 * Utilise sendBeacon en priorité, sinon fetch avec keepalive
 */
export function trackAffiliateClick(payload: AffiliateClickPayload): boolean {
  const endpoint = '/api/affiliate-click';
  const data = JSON.stringify(payload);

  // Essayer sendBeacon en premier (meilleur pour les clics sortants)
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([data], { type: 'application/json' });
    const sent = navigator.sendBeacon(endpoint, blob);
    if (sent) {
      return true;
    }
  }

  // Fallback sur fetch avec keepalive
  if (typeof fetch !== 'undefined') {
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
      keepalive: true, // Permet au request de survivre à la navigation
    }).catch(() => {
      // Ignorer les erreurs silencieusement (non-bloquant)
    });
    return true;
  }

  return false;
}

/**
 * Liste des domaines Amazon autorisés (pour export)
 */
export const ALLOWED_AMAZON_DOMAINS = AMAZON_DOMAINS_WHITELIST;
