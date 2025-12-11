import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Pour le mode export statique
    unoptimized: true,
  },
  trailingSlash: true,
  // Mode export statique - activer une fois les recettes importées
  // output: 'export',

  // Redirections pour conserver le SEO (URLs WordPress)
  async redirects() {
    return [
      // Redirection /recettes/ vers /recette/ (ancien pluriel vers singulier comme WP)
      {
        source: '/recettes',
        destination: '/recette',
        permanent: true,
      },
      {
        source: '/recettes/:slug*',
        destination: '/recette/:slug*',
        permanent: true,
      },
      // Redirection convertisseur-de-mesures (ancien WordPress) vers /convertisseur/
      {
        source: '/convertisseur-de-mesures',
        destination: '/convertisseur',
        permanent: true,
      },
      {
        source: '/convertisseur-de-mesures/:path*',
        destination: '/convertisseur/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
