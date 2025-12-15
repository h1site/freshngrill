// Configuration du site
export const siteConfig = {
  name: 'Menucochon',
  description: 'Découvrez notre collection de recettes gourmandes et faciles à réaliser. Des idées de repas pour tous les jours.',
  url: 'https://menucochon.com',
  locale: 'fr_CA',
  author: 'Menucochon',
};

/**
 * Génère l'URL canonique pour une page
 */
export function getCanonicalUrl(path: string = ''): string {
  // Nettoyer le path
  let cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Ajouter trailing slash si pas déjà présent (pour matcher trailingSlash: true dans next.config)
  if (!cleanPath.endsWith('/') && !cleanPath.includes('?')) {
    cleanPath = `${cleanPath}/`;
  }

  return `${siteConfig.url}${cleanPath}`;
}
