import type { NextConfig } from 'next';

// Slugs des articles de blog (anciennes URLs WordPress à la racine)
const blogSlugs = [
  'recette-citrouille',
  'recette-halloween',
  'convertisseur-mesures-liquide',
  'recette-du-quebec',
  'aliments-rances',
  'ble-dinde-les-methodes',
  'balance-de-cuisine',
  'master-chef-junior-quebec',
  'saint-jean-baptiste',
  'ninja-slushi',
  'recette-dairy-queen',
  'appgratuit',
  'gouters-maison',
  'pizza-au-quebec',
  'fete-des-peres',
  'trois-fois-par-jours-dessert-tome3',
  'coup-de-grace',
  '10-recettes-de-salades',
  'four-a-pizza',
  'le-fit-cook-livre',
  '5-ingredients-15-minutes',
  'salut-bonjour-dans-votre-assiette',
  'haut-de-cuisse-de-poulet',
  'cabane-a-sucre',
  'festivals-gastronomiques',
  'produits-canadiens',
  'rennai',
  'cabane-a-sucre-constantin',
  'comment-preparer-un-roux',
  'idees-de-repas-entre-amis',
  'meilleurs-cours-de-cuisine-au-quebec',
  'grands-chefs-cuisiniers-du-quebec',
  'idees-de-brunch',
  'sorbet-maison',
  'canadiens-de-montreal',
  'guide-apprentit-cuisinier',
  'ricardo-cuisine',
  'pain-perdu',
  'tim-horton',
  'dairy-queen',
  'guacamole-recette-facile',
  'mcdonnald',
  'top-activites',
  'espresso-martini-maison',
  'recette-de-nachos',
  'coupes-de-boeuf',
  'cuire-le-poulet',
  'recette-croque-monsieur',
  '5-recettes-omelette',
  'activites-famille-monteregie',
  'recette-de-fish-and-chip',
  'biscuits-maison',
  'recette-polenta',
  'air-fryer',
  'big-mac',
  'ramen-authentique',
  'queue-de-castor',
  'cuisine-vegane',
  'soupe-minestrone-aux-legumes',
  'steak-frites-au-quebec',
  'steak-a-la-perfection',
  'repas-saint-valentin',
  'potage-a-la-carotte',
  'gateau-carottes-moelleux',
  'asperges-grillees',
  '10-recettes-tacos',
  'recette-de-crepe-rapide',
  'poke-bowls',
  'chocolats-rose-elisabeth',
  'la-maison-des-dimsums',
  'mckibbins-irish-pub',
  'nouvel-an',
  'recette-de-noel',
  'recettes-a-la-citrouille',
  '10-recettes-a-la-mijoteuse',
  'tequilla',
  'jambon-au-four',
  '10-recettes-de-pates',
  'patates-pommes-de-terre',
  'muffins-a-la-rhubarbe',
  'les-recettes-estivales',
  'cuisine-faciles-pour-debutants',
  'top-restaurants-montreal',
  'exploration-du-monde-a-travers-la-cuisine',
  'film-plastique-a-la-feuille-daluminium',
];

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
    // Redirections des articles de blog (anciennes URLs à la racine vers /blog/)
    const blogRedirects = blogSlugs.map(slug => ({
      source: `/${slug}`,
      destination: `/blog/${slug}`,
      permanent: true,
    }));

    return [
      // Redirections des articles de blog
      ...blogRedirects,
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
