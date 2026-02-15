// Configuration du site
export const siteConfig = {
  name: "Fresh N' Grill",
  description: 'Discover our collection of BBQ recipes, grilling tips, and outdoor cooking ideas. Fire up the grill!',
  url: 'https://freshngrill.com',
  locale: 'en_US',
  author: "Fresh N' Grill",
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
